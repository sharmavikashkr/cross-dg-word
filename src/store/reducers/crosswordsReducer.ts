import { CluesInput } from "@jaredreisinger/react-crossword";
import { CrosswordsActionTypes, SET_CROSSWORDS_ERROR, SET_CROSSWORDS_PUZZLE } from "../actions";

export interface CrosswordsState {
  date: string;
  puzzle: CluesInput;
  error: string;
}

export const defaultCrosswordsState = {
  date: "",
  puzzle: {
    across: {
      1: {
        clue: "one plus one",
        answer: "TWO",
        row: 0,
        col: 0,
      },
    },
    down: {
      2: {
        clue: "three minus two",
        answer: "ONE",
        row: 0,
        col: 2,
      },
    },
  },
  error: "",
};

export const crosswordsReducer = (state: CrosswordsState = defaultCrosswordsState, action: CrosswordsActionTypes): CrosswordsState => {
  switch (action.type) {
    case SET_CROSSWORDS_PUZZLE:
      return { ...state, date: action.date, puzzle: action.puzzle };
    case SET_CROSSWORDS_ERROR:
      return { ...state, error: action.error };
    default:
      return state;
  }
};
