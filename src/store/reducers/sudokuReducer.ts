import { SudokuPuzzleType } from "../../interfaces/sudokuPuzzleType";
import { SudokuActionTypes, SET_SUDOKU_PUZZLE, SET_SUDOKU_ERROR } from "../actions";

export interface SudokuState {
  difficulty: string;
  puzzle: SudokuPuzzleType;
  error: string;
}

export const defaultSudokuState = {
  difficulty: "easy",
  puzzle: {
    board: [
      [0, 0, 0, 0, 0, 0, 0, 3, 2],
      [1, 2, 3, 4, 5, 0, 0, 0, 8],
      [0, 7, 0, 2, 0, 0, 1, 4, 0],
      [0, 1, 5, 0, 4, 6, 0, 8, 9],
      [0, 0, 6, 8, 0, 0, 0, 0, 0],
      [0, 0, 8, 0, 2, 0, 3, 0, 4],
      [0, 3, 0, 0, 0, 2, 0, 9, 6],
      [0, 6, 0, 0, 8, 3, 0, 1, 7],
      [0, 8, 7, 0, 0, 0, 5, 0, 0],
    ],
  },
  error: ""
};

export const sudokuReducer = (state: SudokuState = defaultSudokuState, action: SudokuActionTypes): SudokuState => {
  switch (action.type) {
    case SET_SUDOKU_PUZZLE:
      return { ...state, difficulty: action.difficulty, puzzle: action.puzzle };
    case SET_SUDOKU_ERROR:
      return { ...state, error: action.error };
    default:
      return state;
  }
};
