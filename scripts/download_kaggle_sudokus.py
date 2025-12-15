"""
Script to download the Kaggle Sudoku dataset using kagglehub.

Before running this script:
1. Install kagglehub: pip install kagglehub
2. Set up Kaggle API credentials:
   - Go to https://www.kaggle.com/settings
   - Click "Create New API Token" to get your token
   - Set the KAGGLE_API_TOKEN environment variable:
     - Windows PowerShell: $env:KAGGLE_API_TOKEN="your_token_here"
     - Windows CMD: set KAGGLE_API_TOKEN=your_token_here
     - Linux/Mac: export KAGGLE_API_TOKEN=your_token_here
   - Make sure you've accepted the dataset terms on Kaggle

Run this script from the project root:
    python scripts/download_kaggle_sudokus.py
"""

import os
import sys
import shutil
from pathlib import Path

try:
    import kagglehub
except ImportError:
    print("Error: kagglehub is not installed.")
    print("Please install it with: pip install kagglehub")
    sys.exit(1)

# Dataset handle from Kaggle URL: https://www.kaggle.com/datasets/rohanrao/sudoku/data
DATASET_HANDLE = "rohanrao/sudoku"

# Target directory (relative to project root)
PROJECT_ROOT = Path(__file__).parent.parent
TARGET_DIR = PROJECT_ROOT / "kaggle_sudokus"


def download_dataset():
    """Download the Kaggle Sudoku dataset to the target directory."""
    # Check for API token
    api_token = os.environ.get("KAGGLE_API_TOKEN")
    if not api_token:
        print("Error: KAGGLE_API_TOKEN environment variable is not set.")
        print("\nPlease set it using one of these methods:")
        print("  Windows PowerShell: $env:KAGGLE_API_TOKEN=\"your_token_here\"")
        print("  Windows CMD: set KAGGLE_API_TOKEN=your_token_here")
        print("  Linux/Mac: export KAGGLE_API_TOKEN=your_token_here")
        print("\nGet your token from: https://www.kaggle.com/settings")
        sys.exit(1)
    
    print(f"Downloading dataset: {DATASET_HANDLE}")
    print(f"Target directory: {TARGET_DIR}")
    
    # Ensure target directory exists
    TARGET_DIR.mkdir(parents=True, exist_ok=True)
    
    try:
        # Download the dataset
        # kagglehub downloads to a cache directory, then we'll copy to our target
        print("Downloading dataset from Kaggle...")
        dataset_path = kagglehub.dataset_download(DATASET_HANDLE)
        
        print(f"Dataset downloaded to cache: {dataset_path}")
        print(f"Copying files to {TARGET_DIR}...")
        
        # Copy all files from the downloaded dataset to our target directory
        if os.path.exists(dataset_path):
            # Get all files in the dataset directory
            for root, dirs, files in os.walk(dataset_path):
                # Calculate relative path
                rel_path = os.path.relpath(root, dataset_path)
                target_path = TARGET_DIR / rel_path if rel_path != '.' else TARGET_DIR
                target_path.mkdir(parents=True, exist_ok=True)
                
                # Copy files
                for file in files:
                    src_file = os.path.join(root, file)
                    dst_file = target_path / file
                    print(f"Copying: {file}")
                    shutil.copy2(src_file, dst_file)
        
        print(f"\n✓ Dataset successfully downloaded to: {TARGET_DIR}")
        print(f"Total size: {get_directory_size(TARGET_DIR) / (1024**3):.2f} GB")
        
    except Exception as e:
        print(f"Error downloading dataset: {e}")
        print("\nMake sure you have:")
        print("1. Installed kagglehub: pip install kagglehub")
        print("2. Set KAGGLE_API_TOKEN environment variable")
        print("3. Accepted the dataset terms on Kaggle")
        print("\nGet your token from: https://www.kaggle.com/settings")
        sys.exit(1)


def get_directory_size(directory):
    """Calculate total size of directory in bytes."""
    total = 0
    for dirpath, dirnames, filenames in os.walk(directory):
        for filename in filenames:
            filepath = os.path.join(dirpath, filename)
            if os.path.exists(filepath):
                total += os.path.getsize(filepath)
    return total


if __name__ == "__main__":
    download_dataset()

