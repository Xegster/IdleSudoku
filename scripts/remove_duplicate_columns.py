"""
Script to remove duplicate "empty cell count" columns from all split Sudoku CSV files.

Run this script from the project root:
    py scripts/remove_duplicate_columns.py
"""

import csv
from pathlib import Path

# Paths
PROJECT_ROOT = Path(__file__).parent.parent
INPUT_DIR = PROJECT_ROOT / "kaggle_sudokus"
NUM_FILES = 20
COLUMN_NAME = "empty cell count"


def remove_duplicate_columns(header, rows):
    """Remove duplicate columns from header and corresponding data rows."""
    # Find indices of the target column
    target_indices = [i for i, col in enumerate(header) if col == COLUMN_NAME]
    
    if len(target_indices) <= 1:
        # No duplicates, return as is
        return header, rows
    
    # Keep only the first occurrence, remove the rest
    indices_to_remove = set(target_indices[1:])  # All except the first
    
    # Create new header without duplicates
    new_header = [col for i, col in enumerate(header) if i not in indices_to_remove]
    
    # Create new rows without duplicate columns
    new_rows = []
    for row in rows:
        new_row = [val for i, val in enumerate(row) if i not in indices_to_remove]
        new_rows.append(new_row)
    
    return new_header, new_rows


def process_file(file_path):
    """Remove duplicate columns from a CSV file."""
    print(f"Processing {file_path.name}...")
    
    # Read all rows
    rows = []
    with open(file_path, 'r', encoding='utf-8') as infile:
        reader = csv.reader(infile)
        header = next(reader)
        rows.append(header)
        
        # Count duplicates in header
        duplicate_count = header.count(COLUMN_NAME) - 1
        if duplicate_count > 0:
            print(f"  Found {duplicate_count + 1} '{COLUMN_NAME}' columns, removing {duplicate_count} duplicate(s)...")
        else:
            print(f"  No duplicates found, skipping...")
            return
        
        # Read all data rows
        for row in reader:
            rows.append(row)
    
    # Remove duplicates
    new_header, new_rows = remove_duplicate_columns(rows[0], rows[1:])
    
    # Write back to the same file
    with open(file_path, 'w', encoding='utf-8', newline='') as outfile:
        writer = csv.writer(outfile)
        writer.writerow(new_header)
        writer.writerows(new_rows)
    
    print(f"  Completed {file_path.name}")


def main():
    """Process all 20 CSV files."""
    print(f"Removing duplicate '{COLUMN_NAME}' columns from {NUM_FILES} CSV files...")
    print(f"Directory: {INPUT_DIR}\n")
    
    for file_num in range(1, NUM_FILES + 1):
        file_path = INPUT_DIR / f"sudoku_{file_num}.csv"
        if file_path.exists():
            process_file(file_path)
        else:
            print(f"Warning: {file_path.name} not found, skipping...")
    
    print(f"\nSuccessfully processed all files")
    print(f"Output directory: {INPUT_DIR}")


if __name__ == "__main__":
    if not INPUT_DIR.exists():
        print(f"Error: {INPUT_DIR} not found!")
        exit(1)
    
    main()
