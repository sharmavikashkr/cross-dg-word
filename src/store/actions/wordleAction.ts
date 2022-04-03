import { WordleGuessType } from "../../interfaces/wordleGuessType";
import {
  WordleActionTypes,
  LOAD_WORDLE_WORD,
  SET_WORDLE_WORD,
  ADD_WORDLE_GUESS,
} from "./wordleActionTypes";

export function loadWordleWord(): WordleActionTypes {
  return {
    type: LOAD_WORDLE_WORD,
  };
}

export function setWordleWord(word: string): WordleActionTypes {
  return {
    type: SET_WORDLE_WORD,
    word: word,
  };
}

export function addWordleGuess(guess: WordleGuessType): WordleActionTypes {
  return {
    type: ADD_WORDLE_GUESS,
    guess: guess,
  };
}
