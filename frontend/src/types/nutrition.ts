export interface NutritionInfo {
  protein_g: number;
  fat_g: number;
  carbohydrates_g: number;
  energy_kcal: number;
}

export interface NutritionResponse {
  detected_foods: string[];
  bounding_boxes: number[][];
  nutrition: NutritionInfo;
  detailed_nutrition: {
    protein_g: Record<string, number>;
    fat_g: Record<string, number>;
    carbohydrates_g: Record<string, number>;
  };
}

export interface FoodItem {
  name: string;
  grams: number;
  nutrition: NutritionInfo;
  boundingBox?: number[];
}

export interface CalculationResult {
  totalNutrition: NutritionInfo;
  foods: FoodItem[];
}

export interface ErrorResponse {
  error: string;
  detail: string;
} 