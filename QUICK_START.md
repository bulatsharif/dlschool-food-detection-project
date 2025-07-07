# 🚀 Quick Start Guide

## Prerequisites
- **Docker Desktop** must be installed and running
- **Node.js 18+** (only needed if running without Docker)

## Option 1: Docker Setup (Recommended)

### 1. Start Docker Desktop
```bash
# On macOS, start Docker Desktop application
# Or check if Docker is running:
docker --version
```

If you get "Cannot connect to the Docker daemon" error:
- **macOS**: Open Docker Desktop from Applications folder
- **Linux**: Run `sudo systemctl start docker`
- **Windows**: Start Docker Desktop from Start menu

### 2. Run the Application
```bash
# Development mode (with hot reloading)
./docker-start.sh dev
# OR using npm script
npm run docker:dev

# Production mode
./docker-start.sh
# OR using npm script  
npm run docker:prod
```

### 3. Access the Application
- **Development**: http://localhost:5173 (frontend) + http://localhost:8000 (backend)
- **Production**: http://localhost:3000 (complete app)

## Option 2: Local Development

### 1. Install Dependencies
```bash
# Install frontend dependencies
npm run setup
# OR manually
cd frontend && npm install
```

### 2. Start Backend
```bash
# Terminal 1 - Backend
cd backend
pip install -r requirements.txt
python -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

### 3. Start Frontend
```bash
# Terminal 2 - Frontend (from root directory)
npm run dev
# OR from frontend directory
cd frontend && npm run dev
```

## Troubleshooting

### "npm error Missing script: dev"
**Solution**: Use the root-level scripts:
```bash
npm run dev          # ✅ This will work now
npm run build        # Build the frontend
npm run setup        # Install dependencies
```

### "Cannot connect to the Docker daemon"
**Solution**: Start Docker Desktop:
- macOS: Open Docker Desktop app
- Check status: `docker ps`
- If still issues: Restart Docker Desktop

### Frontend not loading
1. Check if backend is running: http://localhost:8000/docs
2. Check Docker containers: `docker ps`
3. Check logs: `docker-compose logs`

### Port already in use
```bash
# Kill processes on ports
sudo lsof -ti:3000 | xargs kill -9  # Production port
sudo lsof -ti:5173 | xargs kill -9  # Dev frontend port
sudo lsof -ti:8000 | xargs kill -9  # Backend port
```

## Quick Commands Reference
```bash
npm run dev         # Start development server
npm run build       # Build for production
npm run docker:dev  # Docker development mode
npm run docker:prod # Docker production mode
npm run setup       # Install all dependencies
```

## 🚀 3-Step Setup

### 1. Download Florence-2 Model
```bash
# Run the download script
python download_florence2.py
```

### 2. Start the Application
```bash
cd backend
python -m uvicorn app.main:app --reload
```

### 3. Verify Local Model Usage
Look for this log message:
```
✅ Found local Florence-2 model at ./models/florence2
```

## ✅ That's it!

Your application will now:
- Load ~2-3x faster
- Work offline
- Use the local Florence-2 model automatically

## 🔍 What Changed?

I've modified your project to:

1. **Auto-detect local models**: App checks `./models/florence2/` on startup
2. **Fallback gracefully**: If local model not found, downloads from Hugging Face
3. **Improved logging**: Clear messages about which model source is used

## 📁 File Changes Made

- ✅ `download_florence2.py` - Download script
- ✅ `backend/app/food_detector.py` - Updated to support local models
- ✅ `backend/app/main.py` - Auto-detection logic
- ✅ `backend/requirements.txt` - Added huggingface_hub
- ✅ `backend/Dockerfile` - Optional local model support

## 🆘 Need Help?

See `FLORENCE2_LOCAL_SETUP.md` for detailed troubleshooting and advanced options. 