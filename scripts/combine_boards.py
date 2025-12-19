import json
import os
from pathlib import Path

# Get absolute path to script directory, then go to project root
script_dir = Path(__file__).parent.resolve()
project_root = script_dir.parent
boards_dir = project_root / 'data' / 'boards'

print(f'Working directory: {os.getcwd()}')
print(f'Boards directory: {boards_dir}')
print(f'Boards directory exists: {boards_dir.exists()}')

board_files = sorted(boards_dir.glob('board*.json'), key=lambda x: int(x.stem.replace('board', '')))
print(f'Found {len(board_files)} board files')

all_boards = []
for idx, board_file in enumerate(board_files, start=1):
    with open(board_file, 'r', encoding='utf-8') as f:
        board_data = json.load(f)
    all_boards.append({
        "Id": idx,
        "puzzle": board_data["puzzle"],
        "solution": board_data["solution"],
        "difficulty": board_data["difficulty"]
    })

output_file = boards_dir / 'boards.json'
print(f'Writing to: {output_file}')

with open(output_file, 'w', encoding='utf-8') as f:
    json.dump(all_boards, f, indent=2)

print(f'File written. Exists: {output_file.exists()}, Size: {output_file.stat().st_size if output_file.exists() else 0} bytes')
print(f'Created {output_file} with {len(all_boards)} boards')
