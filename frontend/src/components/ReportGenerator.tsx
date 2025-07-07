import React, { useState } from 'react';
import { Download, FileText, Loader2 } from 'lucide-react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { motion } from 'framer-motion';
import type { FoodItem, NutritionInfo } from '../types/nutrition';
import { formatNutritionValue, calculateNutritionForGrams } from '../utils/nutritionCalculator';

interface ReportGeneratorProps {
  foods: FoodItem[];
  totalNutrition: NutritionInfo;
  imageUrl?: string;
  disabled?: boolean;
}

export const ReportGenerator: React.FC<ReportGeneratorProps> = ({
  foods,
  totalNutrition,
  imageUrl,
  disabled = false,
}) => {
  const [isGenerating, setIsGenerating] = useState(false);

  const generatePDF = async () => {
    if (foods.length === 0) return;

    setIsGenerating(true);
    try {
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      let currentY = 20;

      // Header
      pdf.setFontSize(24);
      pdf.setFont('helvetica', 'bold');
      pdf.text('Food Nutrition Report', pageWidth / 2, currentY, { align: 'center' });
      
      currentY += 15;
      pdf.setFontSize(12);
      pdf.setFont('helvetica', 'normal');
      pdf.text(`Generated on: ${new Date().toLocaleDateString()}`, pageWidth / 2, currentY, { align: 'center' });
      
      currentY += 20;

      // Total Nutrition Summary
      pdf.setFontSize(16);
      pdf.setFont('helvetica', 'bold');
      pdf.text('Total Nutrition Summary', 20, currentY);
      currentY += 10;

      pdf.setFontSize(12);
      pdf.setFont('helvetica', 'normal');
      
      const summaryData = [
        `Total Calories: ${formatNutritionValue(totalNutrition.energy_kcal, ' kcal')}`,
        `Protein: ${formatNutritionValue(totalNutrition.protein_g, 'g')}`,
        `Fat: ${formatNutritionValue(totalNutrition.fat_g, 'g')}`,
        `Carbohydrates: ${formatNutritionValue(totalNutrition.carbohydrates_g, 'g')}`,
      ];

      summaryData.forEach((item) => {
        pdf.text(item, 30, currentY);
        currentY += 8;
      });

      currentY += 10;

      // Individual Foods Table
      pdf.setFontSize(16);
      pdf.setFont('helvetica', 'bold');
      pdf.text('Individual Food Items', 20, currentY);
      currentY += 15;

      // Table headers
      pdf.setFontSize(10);
      pdf.setFont('helvetica', 'bold');
      const headers = ['Food', 'Grams', 'Calories', 'Protein (g)', 'Fat (g)', 'Carbs (g)'];
      const colWidths = [60, 25, 25, 25, 25, 25];
      let currentX = 20;

      headers.forEach((header, index) => {
        pdf.text(header, currentX, currentY);
        currentX += colWidths[index];
      });

      currentY += 5;
      pdf.line(20, currentY, pageWidth - 20, currentY); // Horizontal line
      currentY += 8;

      // Table data
      pdf.setFont('helvetica', 'normal');
      foods.forEach((food) => {
        if (currentY > pageHeight - 30) {
          pdf.addPage();
          currentY = 20;
        }

        const actualNutrition = calculateNutritionForGrams(food.nutrition, food.grams);
        const rowData = [
          food.name.charAt(0).toUpperCase() + food.name.slice(1),
          food.grams.toString(),
          actualNutrition.energy_kcal.toFixed(1),
          actualNutrition.protein_g.toFixed(1),
          actualNutrition.fat_g.toFixed(1),
          actualNutrition.carbohydrates_g.toFixed(1),
        ];

        currentX = 20;
        rowData.forEach((data, index) => {
          pdf.text(data, currentX, currentY);
          currentX += colWidths[index];
        });
        currentY += 8;
      });

      // Add image if available
      if (imageUrl) {
        try {
          currentY += 20;
          if (currentY > pageHeight - 100) {
            pdf.addPage();
            currentY = 20;
          }

          pdf.setFontSize(16);
          pdf.setFont('helvetica', 'bold');
          pdf.text('Food Image', 20, currentY);
          currentY += 15;

          // Convert image to canvas and add to PDF
          const img = new Image();
          img.crossOrigin = 'anonymous';
          await new Promise((resolve, reject) => {
            img.onload = () => {
              const canvas = document.createElement('canvas');
              const ctx = canvas.getContext('2d');
              
              // Calculate scaled dimensions
              const maxWidth = 150;
              const maxHeight = 100;
              let { width, height } = img;
              
              if (width > maxWidth) {
                height = (height * maxWidth) / width;
                width = maxWidth;
              }
              
              if (height > maxHeight) {
                width = (width * maxHeight) / height;
                height = maxHeight;
              }

              canvas.width = width;
              canvas.height = height;
              ctx?.drawImage(img, 0, 0, width, height);
              
              const imgData = canvas.toDataURL('image/jpeg', 0.8);
              pdf.addImage(imgData, 'JPEG', 20, currentY, width, height);
              resolve(true);
            };
            img.onerror = reject;
          });
          img.src = imageUrl;
        } catch (error) {
          console.warn('Could not add image to PDF:', error);
        }
      }

      // Footer
      const pageCount = (pdf as any).internal.pages.length - 1; // Subtract 1 because pages array includes a null first element
      for (let i = 1; i <= pageCount; i++) {
        pdf.setPage(i);
        pdf.setFontSize(8);
        pdf.setFont('helvetica', 'normal');
        pdf.text(
          `Page ${i} of ${pageCount} - Generated by Food Nutrition Analyzer`,
          pageWidth / 2,
          pageHeight - 10,
          { align: 'center' }
        );
      }

      // Save the PDF
      const fileName = `nutrition-report-${new Date().toISOString().split('T')[0]}.pdf`;
      pdf.save(fileName);
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Failed to generate PDF report. Please try again.');
    } finally {
      setIsGenerating(false);
    }
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
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-primary-100 rounded-lg">
            <FileText className="w-5 h-5 text-primary-600" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">Download Report</h3>
            <p className="text-sm text-gray-600">
              Get a PDF summary of your nutrition analysis
            </p>
          </div>
        </div>

        <button
          onClick={generatePDF}
          disabled={disabled || isGenerating || foods.length === 0}
          className={`
            inline-flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-colors
            ${
              disabled || isGenerating || foods.length === 0
                ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                : 'bg-primary-500 hover:bg-primary-600 text-white'
            }
          `}
        >
          {isGenerating ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Generating...</span>
            </>
          ) : (
            <>
              <Download className="w-4 h-4" />
              <span>Download PDF</span>
            </>
          )}
        </button>
      </div>

      {foods.length > 0 && (
        <div className="mt-4 p-3 bg-gray-50 rounded-lg">
          <p className="text-sm text-gray-600">
            Report will include:
          </p>
          <ul className="text-sm text-gray-600 mt-1 space-y-1">
            <li>• Total nutrition summary</li>
            <li>• Individual food item details</li>
            <li>• Nutrition breakdown by food</li>
            {imageUrl && <li>• Original food image</li>}
          </ul>
        </div>
      )}
    </motion.div>
  );
}; 