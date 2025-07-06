from pydantic import BaseModel
from typing import List, Dict, Any, Optional

class NutritionInfo(BaseModel):
    """Model for nutrition information"""
    protein_g: float
    fat_g: float
    carbohydrates_g: float
    energy_kcal: float

class NutritionResponse(BaseModel):
    """Model for the API response"""
    detected_foods: List[str]
    bounding_boxes: List[List[float]]
    nutrition: NutritionInfo
    detailed_nutrition: Dict[str, Dict[str, float]]

class ErrorResponse(BaseModel):
    """Model for error responses"""
    error: str
    detail: str 