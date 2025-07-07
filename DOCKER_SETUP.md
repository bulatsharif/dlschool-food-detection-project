# 🐳 Docker Setup Guide

Complete Docker setup for the Food Nutrition Analyzer project with both backend and frontend services.

## 🚀 Quick Start

### Prerequisites
- Docker Desktop (or Docker Engine + Docker Compose)
- At least 4GB of available RAM
- 10GB of free disk space

### One-Command Setup

```bash
# Start everything in production mode
./docker-start.sh

# Start everything in development mode (with hot reloading)
./docker-start.sh dev

# Stop all containers
./docker-start.sh down
```

## 📋 What Gets Built

### Production Mode (`./docker-start.sh`)
- **Frontend**: React app built and served by nginx on port 3000
- **Backend**: FastAPI service on port 8000
- **Features**: Optimized builds, nginx proxy, production performance

### Development Mode (`./docker-start.sh dev`)
- **Frontend**: Vite dev server with hot reload on port 5173
- **Backend**: FastAPI with hot reload on port 8000
- **Features**: Live code changes, development tools, faster iteration

## 🌐 Access Points

### Production Mode
- **Main Application**: http://localhost:3000
- **Backend API**: http://localhost:8000
- **API Documentation**: http://localhost:8000/docs

### Development Mode
- **Frontend (Hot Reload)**: http://localhost:5173
- **Backend API**: http://localhost:8000
- **API Documentation**: http://localhost:8000/docs

## 🏗️ Architecture

```
┌─────────────────┐    ┌─────────────────┐
│    Frontend     │    │    Backend      │
│   (React/TS)    │────│   (FastAPI)     │
│                 │    │                 │
│ Production:     │    │ Features:       │
│ • nginx:80      │    │ • Python 3.11  │
│ • Optimized     │    │ • Florence-2    │
│                 │    │ • Nutrition DB  │
│ Development:    │    │ • Hot Reload    │
│ • Vite:5173     │    │ • Auto Docs     │
│ • Hot Reload    │    │                 │
└─────────────────┘    └─────────────────┘
         │                       │
         └───────────────────────┘
                  │
        Docker Network: food-detection-network
```

## 📁 Docker Files Overview

### Root Directory Files
- `docker-compose.yml` - Production configuration
- `docker-compose.dev.yml` - Development configuration
- `docker-start.sh` - Convenience startup script

### Backend Docker Files
- `backend/Dockerfile` - Backend container definition
- `backend/.dockerignore` - Excluded files for backend

### Frontend Docker Files
- `frontend/Dockerfile` - Multi-stage build (Node.js → nginx)
- `frontend/nginx.conf` - nginx configuration with API proxying
- `frontend/.dockerignore` - Excluded files for frontend

## 🔧 Configuration Details

### Environment Variables
- **Frontend**: API URL automatically configured based on mode
- **Backend**: Python path, development flags
- **Development**: Hot reload settings, file watching

### Volume Mounts
- **Development**: Source code mounted for live editing
- **Models**: AI models mounted read-only
- **Node Modules**: Optimized caching for faster rebuilds

### Networking
- **Internal**: Services communicate via Docker network
- **External**: Only necessary ports exposed to host
- **API Proxying**: Frontend nginx proxies `/api/*` to backend

## 🐛 Troubleshooting

### Common Issues

1. **Port Already in Use**
   ```bash
   # Check what's using the port
   lsof -i :3000
   lsof -i :8000
   
   # Stop conflicting services
   ./docker-start.sh down
   ```

2. **Model Loading Issues**
   ```bash
   # Ensure models directory exists and is accessible
   ls -la models/
   
   # Check backend logs
   docker logs food-detection-backend
   ```

3. **Frontend Build Failures**
   ```bash
   # Check frontend logs
   docker logs food-detection-frontend
   
   # Rebuild without cache
   docker-compose build --no-cache
   ```

4. **API Connection Issues**
   ```bash
   # Verify backend is healthy
   curl http://localhost:8000/health
   
   # Check network connectivity
   docker network ls
   docker network inspect dlschool-food-detection-project_food-detection-network
   ```

### Debugging Commands

```bash
# View all containers
docker ps -a

# View logs
docker logs food-detection-frontend
docker logs food-detection-backend

# Execute commands in containers
docker exec -it food-detection-frontend sh
docker exec -it food-detection-backend bash

# Rebuild specific service
docker-compose build backend
docker-compose build frontend

# Clean up everything
docker-compose down --volumes --rmi all
docker system prune -a
```

## 🚀 Performance Tips

### Production Optimizations
- Multi-stage builds reduce image sizes
- nginx serves static files efficiently
- Gzip compression enabled
- Proper caching headers

### Development Optimizations
- Volume mounts for instant code changes
- Node modules cached in separate volume
- File watching optimized for performance

## 🔄 Development Workflow

### Making Changes

1. **Backend Changes**
   ```bash
   # Edit files in backend/app/
   # Changes automatically reload in development mode
   ```

2. **Frontend Changes**
   ```bash
   # Edit files in frontend/src/
   # Hot reload updates browser automatically
   ```

3. **Adding Dependencies**
   ```bash
   # Backend
   # Add to backend/requirements.txt, then:
   docker-compose build backend
   
   # Frontend
   # Add to frontend/package.json, then:
   docker-compose build frontend
   ```

### Testing Changes

```bash
# Test production build
./docker-start.sh
# → Visit http://localhost:3000

# Test development mode
./docker-start.sh dev
# → Visit http://localhost:5173 (frontend) and http://localhost:8000 (backend)
```

## 📊 Resource Usage

### Expected Resource Consumption
- **RAM**: 3-4GB (includes AI model loading)
- **CPU**: 2-4 cores recommended
- **Disk**: 5-8GB for images and dependencies
- **Network**: Internal Docker networking only

### Scaling Considerations
- Backend CPU-intensive (AI inference)
- Frontend lightweight (static serving in production)
- Model loading requires significant RAM
- Consider GPU support for faster inference

## 🔐 Security Notes

### Production Deployment
- nginx configured with security headers
- Backend runs as non-root user
- No sensitive data in environment variables
- CORS properly configured for API access

### Development Safety
- Containers isolated from host system
- No production secrets in development
- Local network access only
- Source code mounted read-only where appropriate

## 📝 Maintenance

### Regular Tasks
```bash
# Update images
docker-compose pull

# Clean up unused resources
docker system prune

# Update dependencies
# Edit package.json/requirements.txt, then rebuild
```

### Backup Important Data
- AI models in `models/` directory
- Source code (already in version control)
- Any custom nutrition data additions

---

## 🎉 Success Indicators

When everything is working correctly:

✅ **Production Mode**:
- Navigate to http://localhost:3000
- Upload a food image
- See detection results with bounding boxes
- Generate and download PDF report

✅ **Development Mode**:
- Frontend hot reload at http://localhost:5173
- Backend API docs at http://localhost:8000/docs
- Code changes reflect immediately

Happy coding! 🍕🚀 