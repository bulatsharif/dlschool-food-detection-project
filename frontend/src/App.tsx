import React, { useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Utensils, AlertCircle, CheckCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

import { ImageUpload } from './components/ImageUpload';
import { NutritionTable } from './components/NutritionTable';
import { ImageWithOverlays } from './components/ImageWithOverlays';
import { ReportGenerator } from './components/ReportGenerator';

import { useFoodDetection } from './hooks/useFoodDetection';
import { useNutritionCalculator } from './hooks/useNutritionCalculator';

import type { NutritionResponse } from './types/nutrition';

// Create a client for React Query
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

const AppContent: React.FC = () => {
  const [uploadedImageUrl, setUploadedImageUrl] = useState<string | null>(null);
  const [detectionResult, setDetectionResult] = useState<NutritionResponse | null>(null);

  const foodDetectionMutation = useFoodDetection();
  const nutritionCalculator = useNutritionCalculator();

  const handleImageUpload = async (file: File) => {
    // Create preview URL
    const imageUrl = URL.createObjectURL(file);
    setUploadedImageUrl(imageUrl);
    
    // Reset previous results
    setDetectionResult(null);
    nutritionCalculator.reset();

    // Start food detection
    try {
      const result = await foodDetectionMutation.mutateAsync(file);
      setDetectionResult(result);
      
      // Set the food data in the nutrition calculator with 100g per food type
      nutritionCalculator.setFoodData(
        result.detected_foods,
        result.detailed_nutrition,
        result.bounding_boxes
      );
    } catch (error) {
      console.error('Food detection failed:', error);
    }
  };

  const handleReset = () => {
    if (uploadedImageUrl) {
      URL.revokeObjectURL(uploadedImageUrl);
    }
    setUploadedImageUrl(null);
    setDetectionResult(null);
    nutritionCalculator.reset();
    foodDetectionMutation.reset();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-primary-100 rounded-lg">
                <Utensils className="w-6 h-6 text-primary-600" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Food Nutrition Analyzer
                </h1>
                <p className="text-sm text-gray-600">
                  Upload food images to get instant nutrition analysis
                </p>
              </div>
            </div>
            
            {(detectionResult || foodDetectionMutation.isError) && (
              <button
                onClick={handleReset}
                className="btn-secondary"
              >
                Analyze New Image
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          {/* Upload Section */}
          <div className="card">
            <ImageUpload
              onImageUpload={handleImageUpload}
              isLoading={foodDetectionMutation.isPending}
              disabled={foodDetectionMutation.isPending}
            />
          </div>

          {/* Error State */}
          <AnimatePresence>
            {foodDetectionMutation.isError && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="card border-red-200 bg-red-50"
              >
                <div className="flex items-center space-x-3">
                  <AlertCircle className="w-6 h-6 text-red-600" />
                  <div>
                    <h3 className="font-semibold text-red-900">Detection Failed</h3>
                    <p className="text-red-700 text-sm">
                      {foodDetectionMutation.error?.message || 
                       'Unable to analyze the image. Please try again with a different image.'}
                    </p>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Success State */}
          <AnimatePresence>
            {detectionResult && nutritionCalculator.foods.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="card border-green-200 bg-green-50"
              >
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                  <div>
                    <h3 className="font-semibold text-green-900">
                      Detection Complete!
                    </h3>
                    <p className="text-green-700 text-sm">
                      Found {nutritionCalculator.foods.length} food item(s). 
                      You can adjust the gram amounts below to get accurate nutrition calculations.
                    </p>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Results Grid */}
          {detectionResult && nutritionCalculator.foods.length > 0 && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Left Column - Visual Results */}
              <div className="space-y-6">
                {uploadedImageUrl && (
                  <ImageWithOverlays
                    imageUrl={uploadedImageUrl}
                    foods={nutritionCalculator.foods}
                  />
                )}
              </div>

              {/* Right Column - Nutrition Data */}
              <div className="space-y-6">
                <NutritionTable
                  foods={nutritionCalculator.foods}
                  totalNutrition={nutritionCalculator.totalNutrition}
                  onUpdateGrams={nutritionCalculator.updateGrams}
                  onRemoveFood={nutritionCalculator.removeFood}
                />
              </div>
            </div>
          )}

          {/* Report Generation */}
          {nutritionCalculator.foods.length > 0 && (
            <ReportGenerator
              foods={nutritionCalculator.foods}
              totalNutrition={nutritionCalculator.totalNutrition}
              imageUrl={uploadedImageUrl || undefined}
            />
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center text-gray-600">
            <p className="text-sm">
              Powered by AI food detection and comprehensive nutrition database
            </p>
            <p className="text-xs mt-2">
              Nutrition values are estimates based on 100g portions. 
              Adjust gram amounts for accurate calculations.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <AppContent />
    </QueryClientProvider>
  );
};

export default App;
