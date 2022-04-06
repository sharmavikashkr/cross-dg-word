import { SudokuPuzzleType } from "../../interfaces/sudokuPuzzleType";
import { SudokuActionTypes, LOAD_SUDOKU_PUZZLE, SET_SUDOKU_PUZZLE, SET_SUDOKU_ERROR } from "./sudokuActionTypes";

export function loadSudokuPuzzle(): SudokuActionTypes {
  return {
    type: LOAD_SUDOKU_PUZZLE,
  };
}

export function setSudokuPuzzle(difficulty: string, puzzle: SudokuPuzzleType): SudokuActionTypes {
  return {
    type: SET_SUDOKU_PUZZLE,
    difficulty: difficulty,
    puzzle: puzzle,
  };
}

export function setSudokuError(error: string): SudokuActionTypes {
  return {
    type: SET_SUDOKU_ERROR,
    error: error,
  };
}
