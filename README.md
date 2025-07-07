# Food Nutrition Analyzer

AI-powered food detection and nutrition analysis from images. Upload a photo of your food and get instant nutrition breakdowns including calories, proteins, fats, and carbohydrates.

## Features

- **AI Food Detection**: Automatic food identification using Florence-2 vision model
- **Nutrition Analysis**: Comprehensive nutrition breakdown with customizable portions
- **Visual Detection**: Bounding box overlays showing detected food items
- **PDF Reports**: Download detailed nutrition reports
- **Modern Web Interface**: Responsive React frontend with drag-and-drop uploads
- **REST API**: FastAPI backend with automatic documentation

## Quick Start

### Prerequisites
- Docker and Docker Compose

### Development Mode (Recommended)
```bash
git clone <repository-url>
cd dlschool-food-detection-project
npm run dev
```

Access the app at:
- **Frontend**: http://localhost:5173 (with hot reload)
- **Backend API**: http://localhost:8000/docs

### Production Mode
```bash
npm run prod
```

Access the app at:
- **Application**: http://localhost:3000

### Useful Commands
```bash
npm run dev      # Start development environment
npm run prod     # Start production environment  
npm run stop     # Stop all containers
npm run logs     # View container logs
```

## Architecture

- **Backend**: FastAPI + Florence-2 model + Nutrition database
- **Frontend**: React + TypeScript + TailwindCSS
- **Deployment**: Docker Compose with development/production profiles

## Project Structure
```
├── backend/           # FastAPI backend
│   ├── app/          # Application code
│   └── Dockerfile    # Backend container
├── frontend/         # React frontend
│   ├── src/          # Source code
│   └── Dockerfile    # Frontend container
├── models/           # AI model files
├── notebooks/        # Training notebooks
└── docker-compose.yml # Unified deployment
```

## API Usage

The backend provides a REST API documented at `/docs` when running. Key endpoints:

- `POST /predict-nutrition` - Upload image and get nutrition analysis
- `GET /health` - Health check endpoint

## Development

The project uses Docker Compose profiles for development and production environments:

- **Development**: Hot reload enabled for both frontend and backend
- **Production**: Optimized builds served by nginx

Both environments are defined in the single `docker-compose.yml` file using profiles.

## Troubleshooting

### Port conflicts
```bash
npm run stop  # Stop all containers first
```

### Model loading issues
```bash
# Check if models directory exists
ls -la models/

# View backend logs
npm run logs
```

### Docker issues
```bash
# Rebuild containers
npm run dev  # This rebuilds automatically
```

## License

MIT
