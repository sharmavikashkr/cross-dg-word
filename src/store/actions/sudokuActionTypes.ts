import { SudokuPuzzleType } from "../../interfaces/sudokuPuzzleType";

export const LOAD_SUDOKU_PUZZLE = "LOAD_SUDOKU_PUZZLE";
export const SET_SUDOKU_PUZZLE = "SET_SUDOKU_PUZZLE";
export const SET_SUDOKU_ERROR = "SET_SUDOKU_ERROR";

export interface LoadSudokuPuzzleAction {
  type: typeof LOAD_SUDOKU_PUZZLE;
}

export interface SetSudokuPuzzleAction {
  type: typeof SET_SUDOKU_PUZZLE;
  difficulty: string;
  puzzle: SudokuPuzzleType;
}

export interface SetSudokuErrorAction {
  type: typeof SET_SUDOKU_ERROR;
  error: string;
}

export type SudokuActionTypes = LoadSudokuPuzzleAction | SetSudokuPuzzleAction | SetSudokuErrorAction;
