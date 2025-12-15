"""
Script to add "empty cell count" column to all split Sudoku CSV files.

This counts the number of '0' characters in the puzzle string for each row.

Run this script from the project root:
    py scripts/add_empty_cell_count.py
"""

import csv
from pathlib import Path

# Paths
PROJECT_ROOT = Path(__file__).parent.parent
INPUT_DIR = PROJECT_ROOT / "kaggle_sudokus"
NUM_FILES = 20


def count_zeros(puzzle_string):
    """Count the number of '0' characters in the puzzle string."""
    count = 0
    for char in puzzle_string:
        if char == '0':
            count += 1
    return count


def process_file(file_path):
    """Add empty cell count column to a CSV file."""
    print(f"Processing {file_path.name}...")
    
    # Read all rows and process them
    rows = []
    with open(file_path, 'r', encoding='utf-8') as infile:
        reader = csv.reader(infile)
        header = next(reader)
        
        # Add new column to header
        new_header = header + ['empty cell count']
        rows.append(new_header)
        
        # Process each row
        rows_processed = 0
        for row in reader:
            if len(row) >= 2:  # Make sure we have puzzle and solution columns
                puzzle = row[0]
                empty_count = count_zeros(puzzle)
                new_row = row + [str(empty_count)]
                rows.append(new_row)
                rows_processed += 1
    
    # Write back to the same file
    with open(file_path, 'w', encoding='utf-8', newline='') as outfile:
        writer = csv.writer(outfile)
        writer.writerows(rows)
    
    print(f"  Processed {rows_processed:,} rows")
    print(f"  Completed {file_path.name}")


def main():
    """Process all 20 CSV files."""
    print(f"Adding 'empty cell count' column to {NUM_FILES} CSV files...")
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
