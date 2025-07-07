#!/bin/bash

echo "🍕 Food Nutrition Analyzer - Docker Setup"
echo "=========================================="

# Check if docker and docker-compose are available
if ! command -v docker &> /dev/null; then
    echo "❌ Docker is not installed. Please install Docker first."
    exit 1
fi

if ! command -v docker-compose &> /dev/null; then
    echo "❌ Docker Compose is not installed. Please install Docker Compose first."
    exit 1
fi

echo "✅ Docker and Docker Compose found!"

# Check if user wants production or development mode
if [ "$1" == "dev" ]; then
    echo "🚀 Starting in DEVELOPMENT mode with hot reloading..."
    echo "   Frontend: http://localhost:5173 (Hot Reload)"
    echo "   Backend:  http://localhost:8000"
    echo ""
    docker-compose -f docker-compose.dev.yml up --build
elif [ "$1" == "down" ]; then
    echo "🛑 Stopping all containers..."
    docker-compose down
    docker-compose -f docker-compose.dev.yml down
    echo "✅ All containers stopped!"
else
    echo "🚀 Starting in PRODUCTION mode..."
    echo "   Application: http://localhost:3000"
    echo "   Backend API: http://localhost:8000"
    echo ""
    docker-compose up --build
fi 