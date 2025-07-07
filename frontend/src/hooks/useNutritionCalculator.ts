import { useState, useCallback } from 'react';
import type { FoodItem, NutritionInfo, CalculationResult, NutritionResponse } from '../types/nutrition';
import { calculateTotalNutrition, updateFoodGrams, transformDetailedNutrition } from '../utils/nutritionCalculator';

export const useNutritionCalculator = () => {
  const [foods, setFoods] = useState<FoodItem[]>([]);
  const [totalNutrition, setTotalNutrition] = useState<NutritionInfo>({
    protein_g: 0,
    fat_g: 0,
    carbohydrates_g: 0,
    energy_kcal: 0,
  });

  const setFoodData = useCallback((
    detectedFoods: string[], 
    detailedNutrition: NutritionResponse['detailed_nutrition'], 
    boundingBoxes?: number[][]
  ) => {
    // Transform the API response structure to get food items with 100g each
    const { foodItems, actualTotalNutrition } = transformDetailedNutrition(detectedFoods, detailedNutrition);
    
    // Add bounding boxes to food items
    const foodsWithBounds = foodItems.map((food, index) => {
      // Find the first occurrence of this food in the detected foods list to get its bounding box
      const firstIndex = detectedFoods.indexOf(food.name);
      return {
        ...food,
        boundingBox: firstIndex >= 0 ? boundingBoxes?.[firstIndex] : undefined,
      };
    });

    setFoods(foodsWithBounds);
    
    // Use the calculated total nutrition based on 100g portions
    setTotalNutrition(actualTotalNutrition);
  }, []);

  const updateGrams = useCallback((foodIndex: number, newGrams: number) => {
    const result = updateFoodGrams(foods, foodIndex, newGrams);
    setFoods(result.foods);
    setTotalNutrition(result.totalNutrition);
  }, [foods]);

  const removeFood = useCallback((foodIndex: number) => {
    const newFoods = foods.filter((_, index) => index !== foodIndex);
    setFoods(newFoods);
    setTotalNutrition(calculateTotalNutrition(newFoods));
  }, [foods]);

  const reset = useCallback(() => {
    setFoods([]);
    setTotalNutrition({
      protein_g: 0,
      fat_g: 0,
      carbohydrates_g: 0,
      energy_kcal: 0,
    });
  }, []);

  return {
    foods,
    totalNutrition,
    setFoodData,
    updateGrams,
    removeFood,
    reset,
  };
}; 