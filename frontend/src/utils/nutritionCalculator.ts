import type { NutritionInfo, FoodItem, CalculationResult, NutritionResponse } from '../types/nutrition';

// Standard calories per gram for macronutrients
const CALORIES_PER_GRAM = {
  protein: 4,
  fat: 9,
  carbohydrates: 4,
};

/**
 * Transform API response into food items with 100g per unique food type
 * The API's detailed_nutrition values are used directly as per-100g nutrition data
 */
export const transformDetailedNutrition = (
  detectedFoods: string[],
  detailedNutrition: NutritionResponse['detailed_nutrition']
): { foodItems: FoodItem[], actualTotalNutrition: NutritionInfo } => {
  
  // Get unique food names only
  const uniqueFoods = Array.from(new Set(detectedFoods));
  
  const foodItems: FoodItem[] = uniqueFoods.map(foodName => {
    // Use API's detailed nutrition values directly as per-100g nutrition
    const protein_g = detailedNutrition.protein_g[foodName] || 0;
    const fat_g = detailedNutrition.fat_g[foodName] || 0;
    const carbohydrates_g = detailedNutrition.carbohydrates_g[foodName] || 0;
    
    // Calculate energy from macros
    const energy_kcal = (
      protein_g * CALORIES_PER_GRAM.protein +
      fat_g * CALORIES_PER_GRAM.fat +
      carbohydrates_g * CALORIES_PER_GRAM.carbohydrates
    );

    return {
      name: foodName,
      grams: 100, // Each food type starts at exactly 100g
      nutrition: {
        protein_g,
        fat_g,
        carbohydrates_g,
        energy_kcal,
      },
      boundingBox: undefined, // Will be set separately if needed
    };
  });

  // Calculate total nutrition based on the 100g portions
  const actualTotalNutrition = calculateTotalNutrition(foodItems);

  return { foodItems, actualTotalNutrition };
};

export const formatNutritionValue = (value: number, unit: string): string => {
  return `${value.toFixed(1)}${unit}`;
};

export const calculateNutritionForGrams = (
  baseNutrition: NutritionInfo,
  grams: number
): NutritionInfo => {
  const scale = grams / 100; // Assuming base nutrition is per 100g
  return {
    protein_g: baseNutrition.protein_g * scale,
    fat_g: baseNutrition.fat_g * scale,
    carbohydrates_g: baseNutrition.carbohydrates_g * scale,
    energy_kcal: baseNutrition.energy_kcal * scale,
  };
};

export const calculateTotalNutrition = (foods: FoodItem[]): NutritionInfo => {
  return foods.reduce(
    (total, food) => {
      const scaledNutrition = calculateNutritionForGrams(food.nutrition, food.grams);
      return {
        protein_g: total.protein_g + scaledNutrition.protein_g,
        fat_g: total.fat_g + scaledNutrition.fat_g,
        carbohydrates_g: total.carbohydrates_g + scaledNutrition.carbohydrates_g,
        energy_kcal: total.energy_kcal + scaledNutrition.energy_kcal,
      };
    },
    { protein_g: 0, fat_g: 0, carbohydrates_g: 0, energy_kcal: 0 }
  );
};

export const updateFoodGrams = (
  foods: FoodItem[],
  foodIndex: number,
  newGrams: number
): CalculationResult => {
  const updatedFoods = foods.map((food, index) =>
    index === foodIndex ? { ...food, grams: newGrams } : food
  );

  return {
    foods: updatedFoods,
    totalNutrition: calculateTotalNutrition(updatedFoods),
  };
}; 