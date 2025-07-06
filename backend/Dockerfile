FROM python:3.11-slim

WORKDIR /app

RUN apt-get update && apt-get install -y \
    git \
    wget \
    curl \
    libgl1-mesa-glx \
    libglib2.0-0 \
    libsm6 \
    libxext6 \
    libxrender-dev \
    libgomp1 \
    && rm -rf /var/lib/apt/lists/*

COPY requirements.txt .

# Install packaging and setuptools first
RUN pip3 install --no-cache-dir packaging setuptools wheel

# Install Python dependencies
RUN pip3 install --no-cache-dir -r requirements.txt

# flash-attn requires a CUDA toolkit and cannot be built in this slim CPU
# container. The application now ships its own stub fallback so the extra
# installation step is no longer necessary (and was the cause of the build
# failure).

# Copy application code
COPY ./app /app/app

# Models will be mounted as volume from docker-compose.yml

RUN useradd -m -u 1000 appuser && chown -R appuser:appuser /app
USER appuser

EXPOSE 8000

HEALTHCHECK --interval=30s --timeout=30s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:8000/health || exit 1

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"] 