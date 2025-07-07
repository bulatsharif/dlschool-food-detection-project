#!/bin/bash

echo "🐳 Docker Status Checker"
echo "========================"

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo "❌ Docker is not installed"
    echo "📥 Please install Docker Desktop from: https://docker.com/get-started"
    exit 1
fi

# Check if Docker daemon is running
if ! docker info &> /dev/null; then
    echo "❌ Docker daemon is not running"
    echo ""
    echo "🔧 To fix this:"
    if [[ "$OSTYPE" == "darwin"* ]]; then
        echo "   • Open Docker Desktop from Applications folder"
        echo "   • Wait for Docker to start (whale icon in menu bar)"
    elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
        echo "   • Run: sudo systemctl start docker"
        echo "   • Or: sudo service docker start"
    else
        echo "   • Start Docker Desktop application"
    fi
    echo ""
    echo "🔍 Then run this script again to verify"
    exit 1
fi

# Docker is running
echo "✅ Docker is installed and running!"
docker --version
echo ""
echo "🚀 You can now run:"
echo "   • npm run docker:dev  (development mode)"
echo "   • npm run docker:prod (production mode)"
echo "   • ./docker-start.sh dev" 