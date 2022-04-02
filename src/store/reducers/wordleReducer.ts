import { GuessType } from "../../interfaces/guessType";
import { WordleActionTypes, SET_WORDLE_WORD, ADD_WORDLE_GUESS } from "../actions";

export interface WordleState {
  word: string;
  guessList: GuessType[];
}

export const defaultWordleState = { word: "", guessList: [] };

export const wordleReducer = (state: WordleState = defaultWordleState, action: WordleActionTypes): WordleState => {
  switch (action.type) {
    case SET_WORDLE_WORD:
      return { ...state, word: action.word };
    case ADD_WORDLE_GUESS:
      return { ...state, guessList: [...state.guessList, action.guess] };
    default:
      return state;
  }
};
