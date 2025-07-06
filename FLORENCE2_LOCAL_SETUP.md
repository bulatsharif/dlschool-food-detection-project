# Florence-2 Local Setup Guide

This guide explains how to manually download Florence-2 and use it locally in your food detection project.

## Why Use Local Models?

- **Faster startup times**: No need to download models on each restart
- **Offline capability**: Works without internet connection
- **Version control**: Ensure consistent model versions
- **Corporate environments**: Avoid external downloads in restricted networks

## Model Information

- **Model**: Microsoft Florence-2-base
- **Size**: ~1.3 GB
- **Capabilities**: Object detection, image captioning, visual question answering

## Setup Instructions

### Step 1: Download the Model

Run the download script to get Florence-2 locally:

```bash
# Make sure you're in the project root
cd /path/to/dlschool-food-detection-project

# Install dependencies if not already installed
pip install transformers huggingface_hub torch

# Run the download script
python download_florence2.py
```

The script will:
- Download Florence-2 to `./models/florence2/`
- Test that the model loads correctly
- Show the total download size

### Step 2: Verify Download

After downloading, your directory structure should look like:

```
dlschool-food-detection-project/
├── models/
│   ├── florence2/           # Downloaded Florence-2 model
│   │   ├── config.json
│   │   ├── generation_config.json
│   │   ├── modeling_florence2.py
│   │   ├── preprocessor_config.json
│   │   ├── pytorch_model.bin
│   │   ├── tokenizer.json
│   │   ├── tokenizer_config.json
│   │   └── vocab.json
│   └── yolov11m.pt         # Your existing YOLO model
├── backend/
└── ...
```

### Step 3: Use Local Model

The application will automatically detect and use the local model:

1. **Automatic Detection**: The app checks for `./models/florence2/` on startup
2. **Fallback**: If not found, it downloads from Hugging Face Hub
3. **Logging**: Check logs to confirm which model source is being used

```bash
# Start the backend
cd backend
python -m uvicorn app.main:app --reload

# Look for these log messages:
# ✅ "Found local Florence-2 model at ./models/florence2"
# ❌ "Using Florence-2 model from Hugging Face Hub"
```

## Alternative Download Methods

### Method 1: Manual Hugging Face Download

```python
from huggingface_hub import snapshot_download

# Download to custom location
snapshot_download(
    repo_id="microsoft/Florence-2-base",
    local_dir="./my_custom_path/florence2",
    local_dir_use_symlinks=False
)
```

### Method 2: Git LFS (Advanced)

```bash
# Install git-lfs if not already installed
git lfs install

# Clone the repository
git clone https://huggingface.co/microsoft/Florence-2-base ./models/florence2
```

### Method 3: Command Line Tool

```bash
# Using huggingface-hub CLI
huggingface-cli download microsoft/Florence-2-base --local-dir ./models/florence2
```

## Docker Usage

If using Docker, make sure to:

1. **Copy model files** into the container:
```dockerfile
# Add to Dockerfile
COPY models/florence2 /app/models/florence2
```

2. **Or mount as volume**:
```yaml
# In docker-compose.yml
volumes:
  - ./models/florence2:/app/models/florence2:ro
```

## Troubleshooting

### Model Not Found
```
Error: [Errno 2] No such file or directory: './models/florence2/config.json'
```
**Solution**: Re-run the download script or check the path

### Permission Issues
```
Error: Permission denied
```
**Solution**: 
```bash
chmod -R 755 ./models/florence2
```

### Memory Issues
```
RuntimeError: CUDA out of memory
```
**Solution**: The model uses ~4GB RAM. Ensure sufficient memory or use CPU-only mode.

### Import Errors
```
ModuleNotFoundError: No module named 'flash_attn'
```
**Solution**: This is expected and handled automatically. The app includes a workaround for flash_attn.

## Configuration Options

You can customize the local model path by modifying `backend/app/main.py`:

```python
# Change this line to use a different path
LOCAL_MODEL_PATH = "./models/florence2"  # Your custom path here
```

## Performance Comparison

| Method | First Load Time | Subsequent Loads | Disk Space |
|--------|----------------|------------------|------------|
| Remote (Hub) | ~30-60 seconds | ~30-60 seconds | ~1GB cache |
| Local | ~10-15 seconds | ~10-15 seconds | ~1.3GB |

## Model Updates

To update to a newer version:

1. **Backup** current model (optional):
```bash
mv ./models/florence2 ./models/florence2_backup
```

2. **Re-download**:
```bash
python download_florence2.py
```

3. **Test** the new version thoroughly before deploying

## Security Considerations

- **Trust**: Only download from official Microsoft/Hugging Face repositories
- **Verification**: The download script tests model loading automatically
- **Isolation**: Store models in a dedicated directory with appropriate permissions

## Integration with CI/CD

For automated deployments:

```bash
# In your deployment script
if [ ! -d "./models/florence2" ]; then
    echo "Downloading Florence-2 model..."
    python download_florence2.py
fi
```

## Storage Requirements

- **Total Size**: ~1.3 GB
- **Free Space**: Ensure at least 2GB free space for safe operation
- **SSD Recommended**: For faster model loading

## Need Help?

1. **Check logs**: Look for detailed error messages in the application logs
2. **Verify download**: Ensure all files are present in `./models/florence2/`
3. **Test locally**: Run the download script's built-in test
4. **Internet connection**: Initial download requires stable internet

---

*This guide covers Florence-2 local setup. For YOLO model setup, refer to the existing documentation.* 