"""
Script to extract Sudoku puzzles from CSV files and convert them to JSON format.

Extracts 10 puzzles of each difficulty level (Easy, Medium, Hard, Advanced)
and saves them as board1.json through board40.json in the data/boards folder.

Run this script from the project root:
    py scripts/extract_boards_from_csv.py
"""

import csv
import json
import random
from pathlib import Path

# Paths
PROJECT_ROOT = Path(__file__).parent.parent
INPUT_DIR = PROJECT_ROOT / "kaggle_sudokus"
OUTPUT_DIR = PROJECT_ROOT / "data" / "boards"
NUM_FILES = 20
PUZZLES_PER_DIFFICULTY = 10

DIFFICULTIES = ["Easy", "Medium", "Hard", "Advanced"]


def string_to_grid(puzzle_string):
    """Convert 81-character string to 9x9 grid."""
    grid = []
    for i in range(9):
        row = []
        for j in range(9):
            char = puzzle_string[i * 9 + j]
            row.append(int(char) if char.isdigit() else 0)
        grid.append(row)
    return grid


def convert_difficulty(difficulty):
    """Convert difficulty to lowercase."""
    return difficulty.lower()


def collect_puzzles():
    """Collect puzzles from all CSV files, grouped by difficulty."""
    puzzles_by_difficulty = {
        "Easy": [],
        "Medium": [],
        "Hard": [],
        "Advanced": []
    }
    
    print("Collecting puzzles from CSV files...")
    
    for file_num in range(1, NUM_FILES + 1):
        file_path = INPUT_DIR / f"sudoku_{file_num}.csv"
        if not file_path.exists():
            print(f"Warning: {file_path.name} not found, skipping...")
            continue
        
        print(f"Reading {file_path.name}...")
        with open(file_path, 'r', encoding='utf-8') as infile:
            reader = csv.reader(infile)
            header = next(reader)
            
            # Find column indices
            try:
                puzzle_idx = header.index("puzzle")
                solution_idx = header.index("solution")
                difficulty_idx = header.index("Difficulty")
            except ValueError as e:
                print(f"  Error: Required column not found in {file_path.name}: {e}")
                continue
            
            # Read puzzles
            count = 0
            for row in reader:
                if len(row) > max(puzzle_idx, solution_idx, difficulty_idx):
                    difficulty = row[difficulty_idx]
                    if difficulty in puzzles_by_difficulty:
                        puzzle_str = row[puzzle_idx]
                        solution_str = row[solution_idx]
                        
                        puzzles_by_difficulty[difficulty].append({
                            "puzzle": puzzle_str,
                            "solution": solution_str,
                            "difficulty": difficulty
                        })
                        count += 1
            
            print(f"  Collected {count:,} puzzles")
    
    # Print summary
    print("\nCollected puzzles by difficulty:")
    for diff in DIFFICULTIES:
        print(f"  {diff}: {len(puzzles_by_difficulty[diff]):,}")
    
    return puzzles_by_difficulty


def extract_and_save_boards(puzzles_by_difficulty):
    """Extract puzzles and save them as JSON files."""
    print(f"\nExtracting {PUZZLES_PER_DIFFICULTY} puzzles per difficulty...")
    
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
    
    board_num = 1
    
    for difficulty in DIFFICULTIES:
        available = puzzles_by_difficulty[difficulty]
        
        if len(available) < PUZZLES_PER_DIFFICULTY:
            print(f"Warning: Only {len(available)} {difficulty} puzzles available, using all of them")
            selected = available
        else:
            # Randomly select puzzles
            selected = random.sample(available, PUZZLES_PER_DIFFICULTY)
        
        print(f"  {difficulty}: Selected {len(selected)} puzzles")
        
        for puzzle_data in selected:
            # Convert to JSON format
            puzzle_grid = string_to_grid(puzzle_data["puzzle"])
            solution_grid = string_to_grid(puzzle_data["solution"])
            difficulty_lower = convert_difficulty(puzzle_data["difficulty"])
            
            board_data = {
                "puzzle": puzzle_grid,
                "solution": solution_grid,
                "difficulty": difficulty_lower
            }
            
            # Save to file
            output_file = OUTPUT_DIR / f"board{board_num}.json"
            with open(output_file, 'w', encoding='utf-8') as outfile:
                json.dump(board_data, outfile, indent=2)
            
            board_num += 1
    
    print(f"\nSuccessfully created {board_num - 1} board files")
    print(f"Output directory: {OUTPUT_DIR}")


def main():
    """Main function."""
    if not INPUT_DIR.exists():
        print(f"Error: {INPUT_DIR} not found!")
        exit(1)
    
    # Collect puzzles from all CSV files
    puzzles_by_difficulty = collect_puzzles()
    
    # Extract and save boards
    extract_and_save_boards(puzzles_by_difficulty)


if __name__ == "__main__":
    main()
