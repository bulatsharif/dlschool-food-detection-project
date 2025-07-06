# Food Detection Backend API

A FastAPI backend service for detecting food items in images and calculating their nutritional information using Microsoft's Florence-2 model.

## Features

- **Food Detection**: Detects various food items in images using computer vision
- **Nutrition Calculation**: Calculates protein, fat, carbohydrates, and calories
- **RESTful API**: Clean REST API with OpenAPI documentation
- **Docker Support**: Containerized for easy deployment
- **Health Checks**: Built-in health monitoring

## API Endpoints

### POST /predict-nutrition
Upload an image to get food detection and nutrition analysis.

**Request:**
- Method: POST
- Content-Type: multipart/form-data
- Body: Image file (JPEG, PNG, etc.)

**Response:**
```json
{
  "detected_foods": ["burger", "fries", "salad"],
  "bounding_boxes": [[100, 100, 200, 200], ...],
  "nutrition": {
    "protein_g": 25.5,
    "fat_g": 15.2,
    "carbohydrates_g": 35.8,
    "energy_kcal": 380.4
  },
  "detailed_nutrition": {
    "protein_g": {"burger": 18.0, "fries": 3.0, "salad": 4.5},
    "fat_g": {"burger": 12.0, "fries": 2.5, "salad": 0.7},
    "carbohydrates_g": {"burger": 25.0, "fries": 8.0, "salad": 2.8}
  }
}
```

### GET /health
Health check endpoint for monitoring service status.

### GET /
Basic status endpoint.

## Quick Start

### Using Docker (Recommended)

1. **Build and run with Docker Compose:**
```bash
docker-compose up --build
```

2. **Access the API:**
- API: http://localhost:8000
- Interactive docs: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc

### Using Python Directly

1. **Install dependencies:**
```bash
pip install -r requirements.txt
```

2. **Run the server:**
```bash
uvicorn app.main:app --host 0.0.0.0 --port 8000
```

## Development

### Project Structure
```
backend/
├── app/
│   ├── __init__.py
│   ├── main.py              # FastAPI application
│   ├── models.py            # Pydantic models
│   ├── food_detector.py     # Food detection logic
│   └── nutrition_data.py    # Food categories and nutrition data
├── requirements.txt         # Python dependencies
├── Dockerfile              # Docker configuration
├── docker-compose.yml      # Docker Compose setup
└── README.md              # This file
```

### Adding New Foods

To add new food items:

1. Add the food name to the appropriate category in `FOOD_CATEGORIES` in `nutrition_data.py`
2. Add nutrition data for the food in `NUTRITION_DATA` in `nutrition_data.py`
3. Restart the service

### Environment Variables

- `ENVIRONMENT`: Set to `production` for production deployment
- `PYTHONPATH`: Python path for module imports

## Model Information

This service uses Microsoft's Florence-2 model for food detection:
- **Model**: microsoft/Florence-2-base
- **Capabilities**: Object detection, image captioning
- **Hardware**: CPU-optimized (GPU support available)

## Performance Considerations

- **First Request**: May take longer due to model loading
- **Memory**: Requires ~4GB RAM for model
- **Processing**: 2-10 seconds per image depending on complexity

## API Testing

### Using curl
```bash
curl -X POST "http://localhost:8000/predict-nutrition" \
  -H "accept: application/json" \
  -H "Content-Type: multipart/form-data" \
  -F "file=@your_food_image.jpg"
```

### Using Python requests
```python
import requests

url = "http://localhost:8000/predict-nutrition"
files = {"file": ("food.jpg", open("food.jpg", "rb"), "image/jpeg")}
response = requests.post(url, files=files)
print(response.json())
```

## Troubleshooting

1. **Model Loading Issues**: Ensure sufficient RAM (4GB+) and network connectivity
2. **Port Conflicts**: Change port in docker-compose.yml if 8000 is occupied
3. **GPU Support**: Uncomment GPU settings in docker-compose.yml for NVIDIA GPUs

## License

This project is provided as-is for educational and development purposes. 