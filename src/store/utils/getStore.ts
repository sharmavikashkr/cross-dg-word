import { applyMiddleware, combineReducers, compose, createStore } from "redux";
import createSagaMiddleware from "redux-saga";
import logger from "redux-logger";

import { initSagas } from "./initSagas";
import { crosswordsReducer, CrosswordsState, defaultCrosswordsState, defaultSudokuState, defaultWordleState, sudokuReducer, SudokuState, wordleReducer, WordleState } from "../reducers";

export interface RootState {
  wordleState: WordleState;
  crosswordsState: CrosswordsState;
  sudokuState: SudokuState;
}
export const rootReducer = combineReducers<RootState>({
  wordleState: wordleReducer,
  crosswordsState: crosswordsReducer,
  sudokuState: sudokuReducer,
});

const defaultState: RootState = {
  wordleState: defaultWordleState,
  crosswordsState: defaultCrosswordsState,
  sudokuState: defaultSudokuState,
};

export const getStore = () => {
  const sagaMiddleware = createSagaMiddleware();
  const enhancer = compose(applyMiddleware(...[sagaMiddleware, logger]));

  const store = createStore(rootReducer, defaultState, enhancer);
  initSagas(sagaMiddleware);
  return store;
};
