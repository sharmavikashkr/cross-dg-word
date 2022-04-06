import { CrosswordsPuzzleType } from "../../interfaces/crosswordsPuzzleType";

export const LOAD_CROSSWORDS_PUZZLE = "LOAD_CROSSWORDS_PUZZLE";
export const SET_CROSSWORDS_PUZZLE = "SET_CROSSWORDS_PUZZLE";
export const SET_CROSSWORDS_ERROR = "SET_CROSSWORDS_ERROR";

export interface LoadCrosswordsPuzzleAction {
  type: typeof LOAD_CROSSWORDS_PUZZLE;
}

export interface SetCrosswordsPuzzleAction {
  type: typeof SET_CROSSWORDS_PUZZLE;
  date: string;
  puzzle: CrosswordsPuzzleType;
}

export interface SetCrosswordsErrorAction {
  type: typeof SET_CROSSWORDS_ERROR;
  error: string;
}

export type CrosswordsActionTypes = LoadCrosswordsPuzzleAction | SetCrosswordsPuzzleAction | SetCrosswordsErrorAction;
