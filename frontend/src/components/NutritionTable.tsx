import React from 'react';
import { Trash2, Edit3 } from 'lucide-react';
import { motion } from 'framer-motion';
import type { FoodItem, NutritionInfo } from '../types/nutrition';
import { formatNutritionValue, calculateNutritionForGrams } from '../utils/nutritionCalculator';

interface NutritionTableProps {
  foods: FoodItem[];
  totalNutrition: NutritionInfo;
  onUpdateGrams: (foodIndex: number, grams: number) => void;
  onRemoveFood: (foodIndex: number) => void;
}

export const NutritionTable: React.FC<NutritionTableProps> = ({
  foods,
  totalNutrition,
  onUpdateGrams,
  onRemoveFood,
}) => {
  const handleGramsChange = (foodIndex: number, value: string) => {
    const grams = Math.max(0, Number(value) || 0);
    onUpdateGrams(foodIndex, grams);
  };

  if (foods.length === 0) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="card"
    >
      <h2 className="text-xl font-bold text-gray-900 mb-6">Nutrition Analysis</h2>

      {/* Total Nutrition Summary */}
      <div className="bg-primary-50 rounded-lg p-4 mb-6">
        <h3 className="text-lg font-semibold text-primary-700 mb-3">Total Nutrition</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-primary-600">
              {formatNutritionValue(totalNutrition.energy_kcal, '')}
            </div>
            <div className="text-sm text-primary-600">Calories</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">
              {formatNutritionValue(totalNutrition.protein_g, 'g')}
            </div>
            <div className="text-sm text-green-600">Protein</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-orange-600">
              {formatNutritionValue(totalNutrition.fat_g, 'g')}
            </div>
            <div className="text-sm text-orange-600">Fat</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">
              {formatNutritionValue(totalNutrition.carbohydrates_g, 'g')}
            </div>
            <div className="text-sm text-blue-600">Carbs</div>
          </div>
        </div>
      </div>

      {/* Individual Foods Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="text-left py-3 px-2 font-semibold text-gray-900">Food</th>
              <th className="text-center py-3 px-2 font-semibold text-gray-900">Grams</th>
              <th className="text-center py-3 px-2 font-semibold text-gray-900">Calories</th>
              <th className="text-center py-3 px-2 font-semibold text-gray-900">Protein (g)</th>
              <th className="text-center py-3 px-2 font-semibold text-gray-900">Fat (g)</th>
              <th className="text-center py-3 px-2 font-semibold text-gray-900">Carbs (g)</th>
              <th className="text-center py-3 px-2 font-semibold text-gray-900">Actions</th>
            </tr>
          </thead>
          <tbody>
            {foods.map((food, index) => {
              const actualNutrition = calculateNutritionForGrams(food.nutrition, food.grams);
              
              return (
                <motion.tr
                  key={`${food.name}-${index}`}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="border-b border-gray-100 hover:bg-gray-50"
                >
                  <td className="py-3 px-2">
                    <div className="font-medium text-gray-900 capitalize">
                      {food.name}
                    </div>
                  </td>
                  <td className="py-3 px-2 text-center">
                    <div className="relative inline-block">
                      <input
                        type="number"
                        value={food.grams}
                        onChange={(e) => handleGramsChange(index, e.target.value)}
                        className="w-20 px-2 py-1 text-center border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        min="0"
                        step="1"
                      />
                      <Edit3 className="absolute -right-6 top-1/2 transform -translate-y-1/2 w-3 h-3 text-gray-400" />
                    </div>
                  </td>
                  <td className="py-3 px-2 text-center font-medium">
                    {formatNutritionValue(actualNutrition.energy_kcal, '')}
                  </td>
                  <td className="py-3 px-2 text-center text-green-600 font-medium">
                    {formatNutritionValue(actualNutrition.protein_g, '')}
                  </td>
                  <td className="py-3 px-2 text-center text-orange-600 font-medium">
                    {formatNutritionValue(actualNutrition.fat_g, '')}
                  </td>
                  <td className="py-3 px-2 text-center text-blue-600 font-medium">
                    {formatNutritionValue(actualNutrition.carbohydrates_g, '')}
                  </td>
                  <td className="py-3 px-2 text-center">
                    <button
                      onClick={() => onRemoveFood(index)}
                      className="p-1 text-red-500 hover:text-red-700 hover:bg-red-50 rounded transition-colors"
                      title="Remove food item"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </motion.tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Nutrition Distribution Chart */}
      <div className="mt-6 p-4 bg-gray-50 rounded-lg">
        <h4 className="font-semibold text-gray-900 mb-3">Macronutrient Distribution</h4>
        <div className="space-y-2">
          {['protein_g', 'fat_g', 'carbohydrates_g'].map((macro) => {
            const value = totalNutrition[macro as keyof NutritionInfo];
            const total = totalNutrition.protein_g + totalNutrition.fat_g + totalNutrition.carbohydrates_g;
            const percentage = total > 0 ? (value / total) * 100 : 0;
            const colors = {
              protein_g: 'bg-green-500',
              fat_g: 'bg-orange-500',
              carbohydrates_g: 'bg-blue-500',
            };
            const labels = {
              protein_g: 'Protein',
              fat_g: 'Fat',
              carbohydrates_g: 'Carbohydrates',
            };

            return (
              <div key={macro} className="flex items-center space-x-3">
                <div className="w-20 text-sm font-medium text-gray-700">
                  {labels[macro as keyof typeof labels]}
                </div>
                <div className="flex-1 bg-gray-200 rounded-full h-3 overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${percentage}%` }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className={`h-full ${colors[macro as keyof typeof colors]}`}
                  />
                </div>
                <div className="w-12 text-sm font-medium text-gray-600">
                  {percentage.toFixed(0)}%
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
}; 