import { CluesInput } from "@jaredreisinger/react-crossword";
import { call, put, take } from "@redux-saga/core/effects";
import { getPuzzleData } from "../../services/crosswords.service";
import { LOAD_CROSSWORDS_PUZZLE, setCrosswordsError, setCrosswordsPuzzle } from "../actions";

export function* loadCrosswordsPuzzle() {
  yield take(LOAD_CROSSWORDS_PUZZLE);
  try {
    const year = (Math.floor(Math.random() * 42) + 1976).toString();
    const month = ("0" + (Math.floor(Math.random() * 12) + 1)).slice(-2);
    const day = ("0" + (Math.floor(Math.random() * 31) + 1)).slice(-2);
    const date = year + "/" + month + "/" + day;
    console.log("date", date);
    const crosswords_url = "https://raw.githubusercontent.com/doshea/nyt_crosswords/master/" + date + ".json";
    const newPuzzle: CluesInput = yield call(getPuzzleData, crosswords_url);
    console.log("newPuzzle", newPuzzle);
    yield put(setCrosswordsPuzzle(date, newPuzzle));
  } catch (ex) {
    yield put(setCrosswordsError("Something went wrong"));
  }
}
