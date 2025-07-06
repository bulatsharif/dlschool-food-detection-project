import logging
from typing import Dict, List, Tuple, Any, Union
from PIL import Image
import os 
import torch
from transformers import AutoProcessor, AutoModelForCausalLM

from .nutrition_data import FOOD_CATEGORIES, NUTRITION_DATA

logger = logging.getLogger(__name__)

# -----------------------------------------------------------------------------
# Florence-2 tries to import `flash_attn` even when we explicitly ask the
# Transformers loader to fall back to the standard / eager attention path.
# `flash_attn` only provides pre-built wheels for CUDA-enabled environments and
# therefore fails to build inside the CPU-only Docker image.  To make the import
# succeed we create a **minimal stub** when the real package is absent.  The
# model never executes any function from *flash_attn* once we force
# `attn_implementation="eager"`, so a stub that raises on accidental use is
# sufficient and keeps the container lightweight.
# -----------------------------------------------------------------------------

from unittest.mock import patch
from transformers.dynamic_module_utils import get_imports

def fixed_get_imports(filename: Union[str, os.PathLike]) -> list[str]:
    if not str(filename).endswith("modeling_florence2.py"):
        return get_imports(filename)
    imports = get_imports(filename)
    # Only remove flash_attn if it's actually in the imports list
    if "flash_attn" in imports:
        imports.remove("flash_attn")
    return imports


# try:
#     import flash_attn  # type: ignore  # noqa: F401
# except ModuleNotFoundError:  # pragma: no cover – executed in CPU-only build
#     import types, sys

#     def _unavailable(*args, **kwargs):  # pylint: disable=unused-argument
#         raise RuntimeError(
#             "flash_attn is not available in this CPU-only deployment. "
#             "The stub was triggered because some code attempted to access it."
#         )

#     flash_attn_stub = types.ModuleType("flash_attn")
#     flash_attn_stub.__getattr__ = lambda _name: _unavailable  # type: ignore

#     # Florence-2 sometimes does `from flash_attn import ops` so we stub that too.
#     flash_attn_ops_stub = types.ModuleType("flash_attn.ops")
#     flash_attn_ops_stub.__getattr__ = lambda _name: _unavailable  # type: ignore

#     flash_attn_stub.ops = flash_attn_ops_stub  # type: ignore

#     sys.modules["flash_attn"] = flash_attn_stub
#     sys.modules["flash_attn.ops"] = flash_attn_ops_stub

class FoodDetector:
    """Food detection and nutrition calculation using Florence-2 model"""
    
    def __init__(self, local_model_path=None):
        self.model = None
        self.processor = None
        self.local_model_path = local_model_path
        self.model_id = local_model_path if local_model_path else "microsoft/Florence-2-base"
        
    def load_model(self):
        """Load the Florence-2 model and processor"""
        try:
            # Determine if we're using local files
            use_local_files = self.local_model_path is not None
            
            if use_local_files:
                logger.info(f"Loading Florence-2 model from local path: {self.model_id}")
            else:
                logger.info("Loading Florence-2 model from Hugging Face Hub...")
            
            with patch("transformers.dynamic_module_utils.get_imports", fixed_get_imports): #workaround for unnecessary flash_attn requirement
                self.model = AutoModelForCausalLM.from_pretrained(
                    self.model_id, 
                    attn_implementation="sdpa", 
                    trust_remote_code=True,
                    local_files_only=use_local_files  # Only use local files if specified
                )
            
            self.processor = AutoProcessor.from_pretrained(
                self.model_id,
                trust_remote_code=True,
                local_files_only=use_local_files  # Only use local files if specified
            )
            
            logger.info("Florence-2 model loaded successfully!")
            
        except Exception as e:
            if use_local_files:
                logger.error(f"Error loading local model from {self.model_id}: {str(e)}")
                logger.error("Make sure the model files are downloaded correctly.")
            else:
                logger.error(f"Error loading model from Hub: {str(e)}")
            raise
            
    def inference(self, task_prompt: str, text_input: str = None, image_input: Image = None) -> Dict[str, Any]:
        """
        Run inference with Florence-2 model
        
        Args:
            task_prompt: Task prompt for the model
            text_input: Optional text input
            image_input: Input image
            
        Returns:
            Parsed model output
        """
        if text_input is None:
            prompt = task_prompt
        else:
            prompt = task_prompt + text_input
            
        inputs = self.processor(
            text=prompt,
            images=image_input,
            return_tensors="pt"
        ).to('cpu')
        
        generated_ids = self.model.generate(
            input_ids=inputs['input_ids'],
            pixel_values=inputs['pixel_values'],
            max_new_tokens=1024,
            early_stopping=False,
        )
        
        generated_text = self.processor.batch_decode(
            generated_ids,
            skip_special_tokens=False
        )[0]
        
        parsed_answer = self.processor.post_process_generation(
            generated_text,
            task=task_prompt,
            image_size=(image_input.width, image_input.height)
        )
        
        return parsed_answer
        
    def convert_to_od_format(self, data: Dict[str, Any]) -> Dict[str, List]:
        """
        Convert model output to object detection format
        
        Args:
            data: Raw model output
            
        Returns:
            Formatted bounding boxes and labels
        """
        bboxes = data.get('bboxes', [])
        labels = data.get('bboxes_labels', [])
        
        od_results = {
            'bboxes': bboxes,
            'labels': labels,
        }
        
        return od_results
        
    def detect_foods(self, image: Image) -> Dict[str, List]:
        """
        Detect food items in an image
        
        Args:
            image: Input image
            
        Returns:
            Dictionary with bounding boxes and labels
        """
        # Generate detailed caption
        more_detailed_caption = '<MORE_DETAILED_CAPTION>'
        results_more_detailed_caption = self.inference(
            more_detailed_caption,
            image_input=image
        )
        description_of_the_image = results_more_detailed_caption[more_detailed_caption]
        
        # Find foods mentioned in the description
        foods_to_prompt = []
        for food_category in FOOD_CATEGORIES.values():
            for food in food_category:
                if food in description_of_the_image:
                    foods_to_prompt.append(food)
                    
        # Perform object detection for each food
        task_prompt = "<OPEN_VOCABULARY_DETECTION>"
        bboxes = {
            'bboxes': [],
            'labels': [],
        }
        
        for food in foods_to_prompt:
            results = self.inference(
                task_prompt,
                image_input=image,
                text_input=f'{food}'
            )
            converted_results = self.convert_to_od_format(results[task_prompt])
            bboxes['bboxes'].extend(converted_results['bboxes'])
            bboxes['labels'].extend(converted_results['labels'])
            
        return bboxes
        
    def get_nutrition(self, labels: List[str]) -> Dict[str, Dict[str, Any]]:
        """
        Calculate nutrition information for detected foods
        
        Args:
            labels: List of detected food labels
            
        Returns:
            Dictionary with total and detailed nutrition information
        """
        # Count occurrences of each food
        foods_count = {}
        for label in labels:
            if label in foods_count:
                foods_count[label] += 1
            else:
                foods_count[label] = 1
                
        # Calculate total nutrition
        nutrition_total = {
            'protein_g': 0,
            'fat_g': 0,
            'carbohydrates_g': 0
        }
        
        # Calculate detailed nutrition per food
        nutrition_detailed = {
            'protein_g': {},
            'fat_g': {},
            'carbohydrates_g': {}
        }
        
        for food in foods_count:
            # Skip if food is not in our nutrition database
            if food not in NUTRITION_DATA:
                logger.warning(f"Food '{food}' not found in nutrition database")
                continue
                
            count = foods_count[food]
            food_nutrition = NUTRITION_DATA[food]
            
            # Add to total nutrition
            nutrition_total['protein_g'] += food_nutrition['protein_g'] * count
            nutrition_total['fat_g'] += food_nutrition['fat_g'] * count
            nutrition_total['carbohydrates_g'] += food_nutrition['carbohydrates_g'] * count
            
            # Add to detailed nutrition
            nutrition_detailed['protein_g'][food] = food_nutrition['protein_g'] * count
            nutrition_detailed['fat_g'][food] = food_nutrition['fat_g'] * count
            nutrition_detailed['carbohydrates_g'][food] = food_nutrition['carbohydrates_g'] * count
            
        return {
            'total': nutrition_total,
            'detailed': nutrition_detailed
        } 