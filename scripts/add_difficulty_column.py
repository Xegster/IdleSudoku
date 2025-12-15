"""
Script to add "Difficulty" column to all split Sudoku CSV files.

Difficulty is based on empty cell count:
- 50+ empty cells: Advanced
- 35-50 empty cells: Hard
- 25-35 empty cells: Medium
- <25 empty cells: Easy

Run this script from the project root:
    py scripts/add_difficulty_column.py
"""

import csv
from pathlib import Path

# Paths
PROJECT_ROOT = Path(__file__).parent.parent
INPUT_DIR = PROJECT_ROOT / "kaggle_sudokus"
NUM_FILES = 20


def get_difficulty(empty_cell_count):
    """Determine difficulty based on empty cell count."""
    try:
        count = int(empty_cell_count)
        if count >= 50:
            return "Advanced"
        elif count >= 35:
            return "Hard"
        elif count >= 25:
            return "Medium"
        else:
            return "Easy"
    except (ValueError, TypeError):
        return "Unknown"


def process_file(file_path):
    """Add difficulty column to a CSV file."""
    print(f"Processing {file_path.name}...")
    
    # Read all rows and process them
    rows = []
    with open(file_path, 'r', encoding='utf-8') as infile:
        reader = csv.reader(infile)
        header = next(reader)
        
        # Find the index of "empty cell count" column
        try:
            empty_count_idx = header.index("empty cell count")
        except ValueError:
            print(f"  Error: 'empty cell count' column not found in {file_path.name}")
            return
        
        # Add new column to header
        new_header = header + ['Difficulty']
        rows.append(new_header)
        
        # Process each row
        rows_processed = 0
        for row in reader:
            if len(row) > empty_count_idx:
                empty_count = row[empty_count_idx]
                difficulty = get_difficulty(empty_count)
                new_row = row + [difficulty]
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
    print(f"Adding 'Difficulty' column to {NUM_FILES} CSV files...")
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
