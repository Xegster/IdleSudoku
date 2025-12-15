"""
Script to reformat board JSON files so each array row is on one line.

Run this script from the project root:
    py scripts/reformat_boards.py
"""

import json
from pathlib import Path

# Paths
PROJECT_ROOT = Path(__file__).parent.parent
BOARDS_DIR = PROJECT_ROOT / "data" / "boards"


def reformat_board_file(file_path):
    """Reformat a board JSON file to have each array row on one line."""
    with open(file_path, 'r', encoding='utf-8') as infile:
        data = json.load(infile)
    
    # Write back with custom formatting
    with open(file_path, 'w', encoding='utf-8') as outfile:
        outfile.write('{\n')
        outfile.write('  "puzzle": [\n')
        
        # Write puzzle rows
        for i, row in enumerate(data['puzzle']):
            row_str = json.dumps(row)
            if i < len(data['puzzle']) - 1:
                outfile.write(f'    {row_str},\n')
            else:
                outfile.write(f'    {row_str}\n')
        
        outfile.write('  ],\n')
        outfile.write('  "solution": [\n')
        
        # Write solution rows
        for i, row in enumerate(data['solution']):
            row_str = json.dumps(row)
            if i < len(data['solution']) - 1:
                outfile.write(f'    {row_str},\n')
            else:
                outfile.write(f'    {row_str}\n')
        
        outfile.write('  ],\n')
        outfile.write(f'  "difficulty": {json.dumps(data["difficulty"])}\n')
        outfile.write('}')


def main():
    """Reformat all board JSON files."""
    if not BOARDS_DIR.exists():
        print(f"Error: {BOARDS_DIR} not found!")
        exit(1)
    
    print(f"Reformatting board JSON files in {BOARDS_DIR}...")
    
    board_files = sorted(BOARDS_DIR.glob("board*.json"))
    print(f"Found {len(board_files)} board files\n")
    
    for board_file in board_files:
        print(f"Reformatting {board_file.name}...")
        reformat_board_file(board_file)
    
    print(f"\nSuccessfully reformatted {len(board_files)} board files")


if __name__ == "__main__":
    main()
