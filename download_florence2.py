#!/usr/bin/env python3
"""
Script to manually download Florence-2 model for local use
"""

import os
from huggingface_hub import snapshot_download
from transformers import AutoProcessor, AutoModelForCausalLM

def download_florence2_model(local_dir="./models/florence2"):
    """
    Download Florence-2 model and processor to local directory
    
    Args:
        local_dir: Local directory to save the model
    """
    model_id = "microsoft/Florence-2-base"
    
    print(f"Downloading Florence-2 model to {local_dir}...")
    
    # Create directory if it doesn't exist
    os.makedirs(local_dir, exist_ok=True)
    
    try:
        # Download model files
        print("Downloading model files...")
        snapshot_download(
            repo_id=model_id,
            local_dir=local_dir,
            local_dir_use_symlinks=False,  # Copy files instead of symlinks
        )
        
        print(f"✅ Florence-2 model successfully downloaded to {local_dir}")
        print(f"Model size: ~{get_folder_size(local_dir):.1f} MB")
        
        # Test loading the model
        print("Testing model loading...")
        model = AutoModelForCausalLM.from_pretrained(
            local_dir, 
            trust_remote_code=True,
            local_files_only=True  # Only use local files
        )
        processor = AutoProcessor.from_pretrained(
            local_dir, 
            trust_remote_code=True,
            local_files_only=True
        )
        print("✅ Model loads successfully!")
        
        return local_dir
        
    except Exception as e:
        print(f"❌ Error downloading model: {e}")
        return None

def get_folder_size(folder_path):
    """Get folder size in MB"""
    total_size = 0
    for dirpath, dirnames, filenames in os.walk(folder_path):
        for filename in filenames:
            filepath = os.path.join(dirpath, filename)
            total_size += os.path.getsize(filepath)
    return total_size / (1024 * 1024)  # Convert to MB

if __name__ == "__main__":
    # You can change this path
    local_model_path = "./models/florence2"
    
    print("Florence-2 Model Downloader")
    print("=" * 40)
    
    result = download_florence2_model(local_model_path)
    
    if result:
        print(f"""
🎉 Success! Your Florence-2 model is ready.

To use it in your code, replace:
    model_id = "microsoft/Florence-2-base"
    
With:
    model_id = "{result}"
    
And add local_files_only=True to from_pretrained calls.
        """)
    else:
        print("❌ Download failed. Please check your internet connection and try again.") 