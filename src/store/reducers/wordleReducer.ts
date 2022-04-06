import { WordleGuessType } from "../../interfaces/wordleGuessType";
import { WordleActionTypes, SET_WORDLE_WORD, ADD_WORDLE_GUESS, SET_WORDLE_ERROR } from "../actions";

export interface WordleState {
  word: string;
  guessList: WordleGuessType[];
  error: string;
}

export const defaultWordleState = { word: "", guessList: [], error: "" };

export const wordleReducer = (state: WordleState = defaultWordleState, action: WordleActionTypes): WordleState => {
  switch (action.type) {
    case SET_WORDLE_WORD:
      return { ...state, word: action.word };
    case ADD_WORDLE_GUESS:
      return { ...state, guessList: [...state.guessList, action.guess] };
    case SET_WORDLE_ERROR:
      return { ...state, error: action.error };
    default:
      return state;
  }
};
