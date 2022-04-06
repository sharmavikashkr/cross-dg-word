import { call, put, take } from "@redux-saga/core/effects";
import { SudokuPuzzleType } from "../../interfaces/sudokuPuzzleType";
import { getPuzzleData } from "../../services/sudoku.service";
import { LOAD_SUDOKU_PUZZLE, setSudokuError, setSudokuPuzzle } from "../actions";

export function* loadSudokuPuzzle() {
  yield take(LOAD_SUDOKU_PUZZLE);
  try {
    const difficulty = "medium";
    const newPuzzle: SudokuPuzzleType = yield call(getPuzzleData, difficulty);
    console.log("newPuzzle", newPuzzle);
    yield put(setSudokuPuzzle(difficulty, newPuzzle));
  } catch (ex) {
    yield put(setSudokuError("Something went wrong, please reload."));
  }
}
