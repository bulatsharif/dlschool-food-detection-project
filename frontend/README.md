# Food Nutrition Analyzer - Frontend

A modern React + TypeScript frontend for the food nutrition detection service. Upload food images to get instant nutrition analysis with AI-powered food detection and comprehensive nutrition calculations.

## Features

- 🖼️ **Drag & Drop Image Upload** - Easy image upload with preview
- 🔍 **AI Food Detection** - Automatic food item identification with bounding boxes
- 📊 **Real-time Nutrition Calculation** - Adjustable gram amounts with live updates
- 📈 **Visual Analytics** - Macronutrient distribution charts and summary cards
- 📄 **PDF Report Generation** - Download comprehensive nutrition reports
- 📱 **Responsive Design** - Works on desktop, tablet, and mobile devices
- ⚡ **Fast & Modern** - Built with Vite for lightning-fast development

## Tech Stack

- **React 18** - Modern React with hooks and functional components
- **TypeScript** - Type-safe JavaScript with excellent developer experience
- **Vite** - Fast build tool and development server
- **TailwindCSS** - Utility-first CSS framework for rapid styling
- **React Query** - Data fetching and caching library
- **React Hook Form** - Performant forms with easy validation
- **React Dropzone** - Drag and drop file uploads
- **Konva.js** - 2D canvas library for image overlays
- **jsPDF** - Client-side PDF generation
- **Framer Motion** - Smooth animations and transitions
- **Lucide React** - Beautiful SVG icons

## Prerequisites

- Node.js 18+ 
- npm or yarn
- Running backend service (FastAPI) on `http://localhost:8000`

## Installation

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Start Development Server**
   ```bash
   npm run dev
   ```

3. **Open in Browser**
   Navigate to `http://localhost:5173`

## Project Structure

```
frontend/
├── src/
│   ├── components/          # React components
│   │   ├── ImageUpload.tsx     # Image upload with drag & drop
│   │   ├── NutritionTable.tsx  # Nutrition data table with editing
│   │   ├── ImageWithOverlays.tsx # Image display with bounding boxes
│   │   └── ReportGenerator.tsx  # PDF report generation
│   ├── hooks/               # Custom React hooks
│   │   ├── useFoodDetection.ts    # Food detection API hook
│   │   └── useNutritionCalculator.ts # Nutrition calculation state
│   ├── services/            # API services
│   │   └── api.ts              # Backend API communication
│   ├── types/               # TypeScript type definitions
│   │   └── nutrition.ts        # Nutrition data types
│   ├── utils/               # Utility functions
│   │   └── nutritionCalculator.ts # Nutrition math utilities
│   ├── App.tsx              # Main application component
│   ├── main.tsx             # React app entry point
│   └── index.css            # Global styles and Tailwind imports
├── public/                  # Static assets
├── package.json             # Dependencies and scripts
├── tailwind.config.js       # TailwindCSS configuration
├── postcss.config.js        # PostCSS configuration
└── vite.config.ts           # Vite configuration
```

## Usage

### 1. Upload Food Image
- Drag and drop an image of food onto the upload area
- Or click to select an image file
- Supported formats: JPEG, PNG, GIF, WebP

### 2. View Detection Results
- AI will detect food items and show bounding boxes
- View the list of detected foods with default 100g portions
- See total nutrition summary (calories, protein, fat, carbs)

### 3. Adjust Portions
- Edit the gram amounts for each detected food item
- Nutrition values update automatically in real-time
- Remove unwanted food items with the trash icon

### 4. Visual Analysis
- View the original image with food detection overlays
- See color-coded bounding boxes around detected foods
- Check the macronutrient distribution chart

### 5. Download Report
- Generate a comprehensive PDF report
- Includes nutrition summary, food details, and original image
- Perfect for meal planning or dietary tracking

## API Integration

The frontend communicates with the FastAPI backend service:

- **Endpoint**: `POST /predict-nutrition`
- **Expected Response**:
  ```json
  {
    "detected_foods": ["apple", "banana"],
    "bounding_boxes": [[0.1, 0.1, 0.3, 0.4], [0.5, 0.2, 0.8, 0.6]],
    "nutrition": {
      "protein_g": 1.4,
      "fat_g": 0.5,
      "carbohydrates_g": 36.6,
      "energy_kcal": 156.0
    },
    "detailed_nutrition": {
      "apple": {"protein_g": 0.3, "fat_g": 0.2, "carbohydrates_g": 13.8, "energy_kcal": 52.0},
      "banana": {"protein_g": 1.1, "fat_g": 0.3, "carbohydrates_g": 22.8, "energy_kcal": 89.0}
    }
  }
  ```

## Configuration

### Backend URL
Update the API base URL in `src/services/api.ts`:
```typescript
const API_BASE_URL = 'http://localhost:8000'; // Change this to your backend URL
```

### Styling
Customize colors and themes in `tailwind.config.js`:
```javascript
theme: {
  extend: {
    colors: {
      primary: {
        50: '#f0f9ff',
        500: '#3b82f6',
        600: '#2563eb',
        700: '#1d4ed8',
      }
    }
  },
}
```

## Development Scripts

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Lint code
npm run lint
```

## Features in Detail

### Image Upload Component
- Drag and drop interface with visual feedback
- File type validation
- Image preview with metadata
- Loading states during processing

### Nutrition Calculator
- Real-time nutrition calculations based on gram adjustments
- Support for custom portion sizes
- Add/remove food items
- Persistent state management

### Visual Food Detection
- Interactive bounding boxes over detected foods
- Color-coded labels for easy identification
- Responsive canvas rendering
- Legend for detected items

### PDF Report Generation
- Comprehensive nutrition summary
- Individual food breakdown table
- Original image inclusion
- Professional formatting
- Automatic download

## Troubleshooting

### Common Issues

1. **Backend Connection Failed**
   - Ensure the FastAPI backend is running on `http://localhost:8000`
   - Check CORS settings in the backend
   - Verify the API endpoint in `src/services/api.ts`

2. **Image Upload Not Working**
   - Check file size limits (ensure images are under 10MB)
   - Verify supported file formats
   - Check browser console for error messages

3. **PDF Generation Fails**
   - Ensure all required nutrition data is available
   - Check browser permissions for downloads
   - Try with smaller images

### Development Tips

- Use React DevTools for component debugging
- Check Network tab for API request/response details
- Monitor console for error messages
- Use the React Query DevTools for API state inspection

## Performance Optimization

- Images are automatically compressed before upload
- Nutrition calculations are memoized to prevent unnecessary recalculations
- Components use React.memo where appropriate
- API responses are cached with React Query

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is part of the DLSchool Food Detection Project.
