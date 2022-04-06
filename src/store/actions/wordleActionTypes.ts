import { WordleGuessType } from "../../interfaces/wordleGuessType";

export const LOAD_WORDLE_WORD = "LOAD_WORDLE_WORD";
export const SET_WORDLE_WORD = "SET_WORDLE_WORD";
export const ADD_WORDLE_GUESS = "ADD_WORDLE_GUESS";
export const SET_WORDLE_ERROR = "ADD_WORDLE_ERROR";

export interface LoadWordleWordAction {
  type: typeof LOAD_WORDLE_WORD;
}

export interface SetWordleWordAction {
  type: typeof SET_WORDLE_WORD;
  word: string;
}

export interface AddWordleGuessAction {
  type: typeof ADD_WORDLE_GUESS;
  guess: WordleGuessType;
}

export interface SetWordleErrorAction {
  type: typeof SET_WORDLE_ERROR;
  error: string;
}

export type WordleActionTypes = LoadWordleWordAction | SetWordleWordAction | AddWordleGuessAction | SetWordleErrorAction;
