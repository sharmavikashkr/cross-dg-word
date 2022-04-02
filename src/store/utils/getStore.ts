import { applyMiddleware, combineReducers, compose, createStore } from "redux";
import createSagaMiddleware from "redux-saga";
import logger from "redux-logger";

import { initSagas } from "./initSagas";
import { crosswordsReducer, CrosswordsState, defaultCrosswordsState, defaultWordleState, wordleReducer, WordleState } from "../reducers";

export interface RootState {
  wordleState: WordleState;
  crosswordsState: CrosswordsState;
}
export const rootReducer = combineReducers<RootState>({
  wordleState: wordleReducer,
  crosswordsState: crosswordsReducer,
});

const defaultState: RootState = {
  wordleState: defaultWordleState,
  crosswordsState: defaultCrosswordsState,
};

export const getStore = () => {
  const sagaMiddleware = createSagaMiddleware();
  const enhancer = compose(applyMiddleware(...[sagaMiddleware, logger]));

  const store = createStore(rootReducer, defaultState, enhancer);
  initSagas(sagaMiddleware);
  return store;
};
