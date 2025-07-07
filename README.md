# Food Nutrition Analyzer

A complete web service for food nutrition prediction from images, developed as part of the Deep Learning School project. Upload an image of your food and get instant AI-powered nutrition analysis including calories, proteins, fats, and carbohydrates.

## 🌟 Features

- **AI Food Detection**: Automatic identification of food items in images using Florence-2 vision model
- **Nutrition Analysis**: Comprehensive nutrition breakdown with customizable portions
- **Visual Detection**: Bounding box overlays showing detected food items
- **Real-time Calculations**: Adjust gram amounts and see nutrition values update instantly
- **PDF Reports**: Download detailed nutrition reports for meal planning
- **Modern Web Interface**: Responsive React frontend with drag-and-drop uploads
- **REST API**: FastAPI backend with comprehensive documentation

## 🏗️ Architecture

The project consists of two main components:

### Backend (`backend/`)
- **FastAPI** web service with automatic OpenAPI documentation
- **Florence-2** vision model for food detection and localization
- **Comprehensive nutrition database** with 400+ food items
- **Docker** containerization for easy deployment

### Frontend (`frontend/`)
- **React + TypeScript** with modern development tools
- **TailwindCSS** for responsive styling
- **Real-time nutrition calculations** with editable portions
- **PDF report generation** with jsPDF
- **Interactive image overlays** with Konva.js

## ⚡ Common Issues & Quick Fixes

### 🔧 "npm error Missing script: dev"
**Problem**: Running `npm run dev` in root directory
**Solution**: Use the new root-level scripts:
```bash
npm run dev          # ✅ Start development server
npm run setup        # Install frontend dependencies  
npm run docker:dev   # Docker development mode
```

### 🐳 "Cannot connect to the Docker daemon"
**Problem**: Docker Desktop is not running
**Solution**: 
```bash
./check-docker.sh    # Check Docker status
# If Docker isn't running:
# • macOS: Open Docker Desktop from Applications
# • Linux: sudo systemctl start docker
# • Windows: Start Docker Desktop from Start menu
```

### 🎨 TailwindCSS utility class errors
**Problem**: `Cannot apply unknown utility class 'bg-gray-50'`
**Solution**: This is a TailwindCSS 4.x compatibility issue - use TailwindCSS 3.x:
```bash
# Already fixed in package.json with TailwindCSS 3.4.17
npm run docker:dev  # Will use the stable version
```

### 📱 Port already in use
**Solution**: Kill processes on busy ports:
```bash
sudo lsof -ti:3000 | xargs kill -9  # Production port
sudo lsof -ti:5173 | xargs kill -9  # Dev frontend port  
sudo lsof -ti:8000 | xargs kill -9  # Backend port
```

---

## 🚀 Quick Start

### 🐳 **Option 1: Docker (Recommended)**

**Prerequisites**: Docker and Docker Compose

```bash
# Clone the repository
git clone <repository-url>
cd dlschool-food-detection-project

# Start in production mode
./docker-start.sh

# OR start in development mode with hot reloading
./docker-start.sh dev

# Stop all containers
./docker-start.sh down
```

**Access Points:**
- **Production**: http://localhost:3000 (Complete app with nginx)
- **Development**: http://localhost:5173 (Hot reload) + http://localhost:8000 (API)

### 💻 **Option 2: Local Development**

**Prerequisites**: Python 3.8+, Node.js 18+, npm

```bash
# Use the provided script
./run-dev.sh

# OR manual setup
cd backend && python -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt && uvicorn app.main:app --reload

# In another terminal
cd frontend && npm install && npm run dev
```

**Access Points:**
- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:8000
- **API Documentation**: http://localhost:8000/docs

## 📖 Manual Setup

### Backend Setup
```bash
cd backend
python -m venv .venv
source .venv/bin/activate  # On Windows: .venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload
```

### Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

## 🐳 Docker Deployment

### Single Command Deployment
```bash
# Production mode (nginx + optimized builds)
./docker-start.sh

# Development mode (hot reload + development servers)
./docker-start.sh dev

# Stop all containers
./docker-start.sh down
```

### Manual Docker Commands
```bash
# Production mode
docker-compose up --build

# Development mode  
docker-compose -f docker-compose.dev.yml up --build

# Background mode
docker-compose up -d --build
```

### Docker Architecture
- **Production**: Frontend served by nginx with API proxying
- **Development**: Separate containers with hot reloading
- **Networking**: Internal Docker network for service communication
- **Volumes**: Source code mounted for development, models mounted read-only

## 📁 Project Structure

```
dlschool-food-detection-project/
├── backend/                 # FastAPI backend service
│   ├── app/
│   │   ├── main.py         # FastAPI application
│   │   ├── food_detector.py # Florence-2 integration
│   │   ├── nutrition_data.py # Nutrition database
│   │   └── models.py       # Pydantic models
│   ├── requirements.txt    # Python dependencies
│   ├── Dockerfile         # Docker configuration
│   └── docker-compose.yml # Docker Compose setup
├── frontend/               # React TypeScript frontend
│   ├── src/
│   │   ├── components/    # React components
│   │   ├── hooks/         # Custom hooks
│   │   ├── services/      # API integration
│   │   ├── types/         # TypeScript types
│   │   └── utils/         # Utility functions
│   ├── package.json       # Node.js dependencies
│   └── README.md          # Frontend documentation
├── models/                # AI model files
│   └── yolov11m.pt       # YOLO model weights
├── notebooks/             # Jupyter notebooks
│   ├── train-food-detector.ipynb
│   ├── inference_florence.ipynb
│   └── create_kaggle_dataset.ipynb
├── run-dev.sh            # Development setup script
└── README.md             # This file
```

## 🔧 API Usage

### Food Detection Endpoint
```http
POST /predict-nutrition
Content-Type: multipart/form-data

{
  "file": "food_image.jpg"
}
```

### Response Format
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
    "apple": {
      "protein_g": 0.3,
      "fat_g": 0.2,
      "carbohydrates_g": 13.8,
      "energy_kcal": 52.0
    },
    "banana": {
      "protein_g": 1.1,
      "fat_g": 0.3,
      "carbohydrates_g": 22.8,
      "energy_kcal": 89.0
    }
  }
}
```

## 🧪 Model Information

### Florence-2 Vision Model
- **Purpose**: Food detection and localization in images
- **Capabilities**: Object detection with bounding boxes and labels
- **Input**: RGB images in common formats (JPEG, PNG, etc.)
- **Output**: Detected food items with spatial coordinates

### Nutrition Database
- **Coverage**: 400+ food items across multiple categories
- **Data**: Protein, fat, carbohydrates, and calories per 100g
- **Categories**: Fruits, vegetables, proteins, grains, beverages, and more
- **Source**: Standardized nutrition data from reliable sources

## 🎯 Usage Examples

### 1. Web Interface
1. Open http://localhost:5173
2. Drag and drop a food image
3. View detected foods with bounding boxes
4. Adjust gram amounts for accurate nutrition
5. Download PDF report

### 2. API Integration
```python
import requests

# Upload image for analysis
with open('food_image.jpg', 'rb') as f:
    response = requests.post(
        'http://localhost:8000/predict-nutrition',
        files={'file': f}
    )

result = response.json()
print(f"Detected foods: {result['detected_foods']}")
print(f"Total calories: {result['nutrition']['energy_kcal']}")
```

### 3. Nutrition Calculation
```javascript
// Adjust portions in frontend
const updatedNutrition = calculateNutritionForGrams(
  foodNutrition,  // per 100g
  150             // actual grams
);
```

## 🛠️ Development

### Adding New Food Items
1. Update `backend/app/nutrition_data.py`
2. Add nutrition data per 100g serving
3. Categorize the food item appropriately

### Extending the Frontend
1. Navigate to `frontend/src/components/`
2. Create new React components
3. Update types in `src/types/nutrition.ts`
4. Add to main App.tsx

### Model Updates
1. Replace model files in `models/` directory
2. Update loading logic in `food_detector.py`
3. Test with sample images

## 🧪 Testing

### Backend Tests
```bash
cd backend
pytest tests/
```

### Frontend Tests
```bash
cd frontend
npm test
```

### Integration Testing
```bash
# Start both services
./run-dev.sh

# Test API endpoints
curl -X POST http://localhost:8000/predict-nutrition \
  -F "file=@test_image.jpg"
```

## 📊 Performance

- **Detection Speed**: ~2-5 seconds per image
- **Model Size**: ~1.5GB (Florence-2)
- **Memory Usage**: ~4GB RAM (with model loaded)
- **Supported Formats**: JPEG, PNG, GIF, WebP
- **Max Image Size**: 10MB

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Submit a pull request

## 📄 License

This project is developed as part of the Deep Learning School curriculum.

## 🆘 Troubleshooting

### Common Issues

1. **Model Loading Errors**
   - Ensure sufficient RAM (4GB+)
   - Check model file integrity
   - Verify Python dependencies

2. **Frontend Build Failures**
   - Update Node.js to version 18+
   - Clear npm cache: `npm cache clean --force`
   - Delete `node_modules` and reinstall

3. **API Connection Issues**
   - Verify backend is running on port 8000
   - Check CORS settings in FastAPI
   - Ensure firewall allows connections

4. **Docker Issues**
   - Increase Docker memory allocation
   - Check Docker Compose logs
   - Verify port availability

### Support

For issues and questions:
1. Check the troubleshooting section
2. Review API documentation at `/docs`
3. Submit an issue with reproduction steps
