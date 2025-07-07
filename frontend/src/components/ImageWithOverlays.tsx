import React, { useRef, useEffect } from 'react';
import { Stage, Layer, Image as KonvaImage, Rect, Text } from 'react-konva';
import { motion } from 'framer-motion';
import type { FoodItem } from '../types/nutrition';

interface ImageWithOverlaysProps {
  imageUrl: string;
  foods: FoodItem[];
  className?: string;
}

export const ImageWithOverlays: React.FC<ImageWithOverlaysProps> = ({
  imageUrl,
  foods,
  className = '',
}) => {
  const imageRef = useRef<HTMLImageElement | null>(null);
  const [image, setImage] = React.useState<HTMLImageElement | null>(null);
  const [dimensions, setDimensions] = React.useState({ width: 0, height: 0 });

  useEffect(() => {
    const img = new window.Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      setImage(img);
      // Calculate display dimensions while maintaining aspect ratio
      const maxWidth = 600;
      const maxHeight = 400;
      
      let { width, height } = img;
      
      if (width > maxWidth) {
        height = (height * maxWidth) / width;
        width = maxWidth;
      }
      
      if (height > maxHeight) {
        width = (width * maxHeight) / height;
        height = maxHeight;
      }
      
      setDimensions({ width, height });
    };
    img.src = imageUrl;
    
    return () => {
      img.onload = null;
    };
  }, [imageUrl]);

  const getScaledBoundingBox = (bbox: number[]) => {
    if (!image || !bbox || bbox.length !== 4) return { x: 0, y: 0, width: 0, height: 0 };
    
    // bbox format: [x_min, y_min, x_max, y_max] normalized between 0-1
    const [x_min, y_min, x_max, y_max] = bbox;
    
    return {
      x: x_min * dimensions.width,
      y: y_min * dimensions.height,
      width: (x_max - x_min) * dimensions.width,
      height: (y_max - y_min) * dimensions.height,
    };
  };

  const getColorForIndex = (index: number) => {
    const colors = [
      '#3B82F6', // blue
      '#10B981', // green
      '#F59E0B', // yellow
      '#EF4444', // red
      '#8B5CF6', // purple
      '#F97316', // orange
      '#06B6D4', // cyan
      '#84CC16', // lime
    ];
    return colors[index % colors.length];
  };

  if (!image || !dimensions.width || !dimensions.height) {
    return (
      <div className={`bg-gray-100 rounded-lg flex items-center justify-center ${className}`}>
        <div className="text-gray-500">Loading image...</div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      className={`bg-white rounded-lg shadow-md overflow-hidden ${className}`}
    >
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Detected Foods ({foods.filter(f => f.boundingBox).length})
        </h3>
        
        <div className="flex justify-center">
          <Stage width={dimensions.width} height={dimensions.height}>
            <Layer>
              {/* Base image */}
              <KonvaImage
                image={image}
                width={dimensions.width}
                height={dimensions.height}
              />
              
              {/* Food detection overlays */}
              {foods.map((food, index) => {
                if (!food.boundingBox) return null;
                
                const bbox = getScaledBoundingBox(food.boundingBox);
                const color = getColorForIndex(index);
                
                return (
                  <React.Fragment key={`${food.name}-${index}`}>
                    {/* Bounding box rectangle */}
                    <Rect
                      x={bbox.x}
                      y={bbox.y}
                      width={bbox.width}
                      height={bbox.height}
                      stroke={color}
                      strokeWidth={2}
                      fill={`${color}20`} // 20% opacity
                      cornerRadius={4}
                    />
                    
                    {/* Food label background */}
                    <Rect
                      x={bbox.x}
                      y={Math.max(0, bbox.y - 25)}
                      width={Math.min(200, food.name.length * 8 + 16)}
                      height={20}
                      fill={color}
                      cornerRadius={3}
                    />
                    
                    {/* Food label text */}
                    <Text
                      x={bbox.x + 8}
                      y={Math.max(0, bbox.y - 22)}
                      text={food.name.charAt(0).toUpperCase() + food.name.slice(1)}
                      fontSize={12}
                      fontFamily="Inter, sans-serif"
                      fill="white"
                      fontStyle="bold"
                    />
                    
                    {/* Grams label */}
                    <Text
                      x={bbox.x + 8}
                      y={bbox.y + bbox.height - 18}
                      text={`${food.grams}g`}
                      fontSize={11}
                      fontFamily="Inter, sans-serif"
                      fill={color}
                      fontStyle="bold"
                    />
                  </React.Fragment>
                );
              })}
            </Layer>
          </Stage>
        </div>
        
        {/* Legend */}
        {foods.some(f => f.boundingBox) && (
          <div className="mt-4 p-3 bg-gray-50 rounded-lg">
            <h4 className="text-sm font-medium text-gray-700 mb-2">Legend:</h4>
            <div className="flex flex-wrap gap-2">
              {foods.filter(f => f.boundingBox).map((food, index) => (
                <div key={`legend-${food.name}-${index}`} className="flex items-center space-x-2">
                  <div
                    className="w-3 h-3 rounded"
                    style={{ backgroundColor: getColorForIndex(index) }}
                  />
                  <span className="text-sm text-gray-600 capitalize">
                    {food.name} ({food.grams}g)
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
}; 