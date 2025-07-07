import { useMutation } from '@tanstack/react-query';
import { foodDetectionAPI } from '../services/api';
import type { NutritionResponse } from '../types/nutrition';

export const useFoodDetection = () => {
  return useMutation({
    mutationFn: (imageFile: File) => foodDetectionAPI.detectFood(imageFile),
    onError: (error) => {
      console.error('Food detection failed:', error);
    },
  });
}; 