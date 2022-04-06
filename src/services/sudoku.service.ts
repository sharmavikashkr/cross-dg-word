import axios from "axios";
import { SudokuPuzzleType } from "../interfaces/sudokuPuzzleType";

export const getPuzzleData = async (difficulty: string): Promise<SudokuPuzzleType> => {
  try {
    const response = await axios.get("https://sugoku.herokuapp.com/board?difficulty=" + difficulty);
    return response.data;
  } catch (err: any) {
    throw new Error(err.response.data);
  }
};
