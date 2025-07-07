import axios from 'axios';
import type { NutritionResponse } from '../types/nutrition';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 
  (typeof window !== 'undefined' && window.location.origin.includes('localhost:5173') 
    ? 'http://localhost:8000' 
    : '/api');

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'multipart/form-data',
  },
});

export const foodDetectionAPI = {
  async detectFood(imageFile: File): Promise<NutritionResponse> {
    const formData = new FormData();
    formData.append('file', imageFile);

    const response = await api.post<NutritionResponse>('/predict-nutrition', formData);
    return response.data;
  },

  async healthCheck(): Promise<{ status: string }> {
    const response = await api.get('/health');
    return response.data;
  },
};

export default api; 