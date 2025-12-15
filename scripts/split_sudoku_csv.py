"""
Script to split sudoku.csv into 20 equal-sized CSV files.

Run this script from the project root:
    py scripts/split_sudoku_csv.py
"""

import csv
import os
from pathlib import Path

# Paths
PROJECT_ROOT = Path(__file__).parent.parent
INPUT_FILE = PROJECT_ROOT / "kaggle_sudokus" / "sudoku.csv"
OUTPUT_DIR = PROJECT_ROOT / "kaggle_sudokus"
NUM_FILES = 20


def count_lines(filepath):
    """Count total number of lines in the CSV file (including header)."""
    print("Counting lines in CSV file...")
    with open(filepath, 'r', encoding='utf-8') as f:
        count = sum(1 for _ in f)
    return count


def split_csv(input_file, output_dir, num_files):
    """Split CSV file into num_files equal parts."""
    print(f"Splitting {input_file} into {num_files} files...")
    
    # Count total lines
    total_lines = count_lines(input_file)
    print(f"Total lines: {total_lines:,}")
    
    # Calculate lines per file (excluding header)
    # We'll write the header to each file
    lines_per_file = (total_lines - 1) // num_files
    remainder = (total_lines - 1) % num_files
    
    print(f"Lines per file: ~{lines_per_file:,}")
    
    # Open input file
    with open(input_file, 'r', encoding='utf-8') as infile:
        reader = csv.reader(infile)
        
        # Read and store header
        header = next(reader)
        
        # Process each output file
        current_line = 0
        for file_num in range(1, num_files + 1):
            output_file = output_dir / f"sudoku_{file_num}.csv"
            print(f"Creating {output_file.name}...")
            
            # Calculate how many lines this file should have
            # Distribute remainder across first few files
            lines_for_this_file = lines_per_file + (1 if file_num <= remainder else 0)
            
            with open(output_file, 'w', encoding='utf-8', newline='') as outfile:
                writer = csv.writer(outfile)
                # Write header
                writer.writerow(header)
                
                # Write data lines
                lines_written = 0
                while lines_written < lines_for_this_file:
                    try:
                        row = next(reader)
                        writer.writerow(row)
                        lines_written += 1
                        current_line += 1
                    except StopIteration:
                        break
            
            print(f"  Wrote {lines_written:,} lines to {output_file.name}")
    
    print(f"\nSuccessfully split CSV into {num_files} files")
    print(f"Output directory: {output_dir}")


if __name__ == "__main__":
    if not INPUT_FILE.exists():
        print(f"Error: {INPUT_FILE} not found!")
        print("Make sure you've downloaded the dataset first.")
        exit(1)
    
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
    split_csv(INPUT_FILE, OUTPUT_DIR, NUM_FILES)
