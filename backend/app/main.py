from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from PIL import Image
import io
import logging
from typing import Dict, List
import uvicorn

from .food_detector import FoodDetector
from .models import NutritionResponse

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(
    title="Food Nutrition Detection API",
    description="API for detecting food items and calculating nutrition information from images",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize food detector
# Check for local Florence-2 model first
import os
LOCAL_MODEL_PATH = "./models/florence2"

# Debug: Show what's in the current directory
logger.info(f"Current working directory: {os.getcwd()}")
logger.info(f"Contents of current directory: {os.listdir('.')}")
if os.path.exists('./models'):
    logger.info(f"Contents of ./models: {os.listdir('./models')}")
else:
    logger.info("./models directory does not exist")

if os.path.exists(LOCAL_MODEL_PATH) and os.path.isdir(LOCAL_MODEL_PATH):
    logger.info(f"✅ Found local Florence-2 model at {LOCAL_MODEL_PATH}")
    logger.info(f"Model files: {os.listdir(LOCAL_MODEL_PATH)}")
    detector = FoodDetector(local_model_path=LOCAL_MODEL_PATH)
else:
    logger.info(f"❌ No local Florence-2 model found at {LOCAL_MODEL_PATH}")
    logger.info("Using Florence-2 model from Hugging Face Hub")
    detector = FoodDetector()

@app.on_event("startup")
async def startup_event():
    """Initialize the model on startup"""
    logger.info("Starting up the Food Nutrition Detection API...")
    detector.load_model()
    logger.info("Model loaded successfully!")

@app.get("/")
async def root():
    """Health check endpoint"""
    return {"status": "healthy", "message": "Food Nutrition Detection API is running"}

@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {"status": "healthy"}

@app.post("/predict-nutrition", response_model=NutritionResponse)
async def predict_nutrition(file: UploadFile = File(...)):
    """
    Predict nutrition information from a food image
    
    Args:
        file: Image file to analyze
        
    Returns:
        JSON response with detected foods and nutrition information
    """
    try:
        if not file.content_type.startswith('image/'):
            raise HTTPException(status_code=400, detail="File must be an image")
        
        image_bytes = await file.read()
        image = Image.open(io.BytesIO(image_bytes)).convert("RGB")
        
        logger.info(f"Processing image: {file.filename}")
        
        detection_results = detector.detect_foods(image)
        
        nutrition_info = detector.get_nutrition(detection_results['labels'])
        
        total_energy = (
            nutrition_info['total']['protein_g'] * 4 +  # 4 calories per gram of protein
            nutrition_info['total']['fat_g'] * 9 +      # 9 calories per gram of fat
            nutrition_info['total']['carbohydrates_g'] * 4  # 4 calories per gram of carbs
        )
        
        # Prepare response
        response = NutritionResponse(
            detected_foods=detection_results['labels'],
            bounding_boxes=detection_results['bboxes'],
            nutrition={
                "protein_g": nutrition_info['total']['protein_g'],
                "fat_g": nutrition_info['total']['fat_g'],
                "carbohydrates_g": nutrition_info['total']['carbohydrates_g'],
                "energy_kcal": total_energy
            },
            detailed_nutrition=nutrition_info['detailed']
        )
        
        logger.info(f"Successfully processed image. Found {len(detection_results['labels'])} food items.")
        
        return response
        
    except Exception as e:
        logger.error(f"Error processing image: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error processing image: {str(e)}")

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000) 