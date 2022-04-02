import { GuessType } from "../../interfaces/guessType";

export const LOAD_WORDLE_WORD = "LOAD_WORDLE_WORD";
export const SET_WORDLE_WORD = "SET_WORDLE_WORD";
export const ADD_WORDLE_GUESS = "ADD_WORDLE_GUESS";

export interface LoadWordleWordAction {
  type: typeof LOAD_WORDLE_WORD;
}

export interface SetWordleWordAction {
  type: typeof SET_WORDLE_WORD;
  word: string;
}

export interface AddWordleGuessAction {
  type: typeof ADD_WORDLE_GUESS;
  guess: GuessType;
}

export type WordleActionTypes = LoadWordleWordAction | SetWordleWordAction | AddWordleGuessAction;
