import { put, take } from "@redux-saga/core/effects";
import { LOAD_WORDLE_WORD, setWordleWord } from "../actions";
import { wordList } from "../constants/wordleWords";

export function* loadWordleWord() {
  yield take(LOAD_WORDLE_WORD);
  const randomWord = wordList[Math.floor(Math.random() * wordList.length)];
  yield put(setWordleWord(randomWord.toUpperCase()));
}
