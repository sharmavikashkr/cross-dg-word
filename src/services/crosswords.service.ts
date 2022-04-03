import axios from "axios";
import { CrosswordsPuzzleType } from "../interfaces/crosswordsPuzzleType";

export const getPuzzleData = async (date: string): Promise<CrosswordsPuzzleType> => {
  try {
    const response = await axios.get("https://raw.githubusercontent.com/doshea/nyt_crosswords/master/" + date + ".json");
    return formatPuzzleData(response.data);
  } catch (err: any) {
    throw new Error(err.response.data);
  }
};

function formatPuzzleData(puzzleData: any): CrosswordsPuzzleType {
  const rowSize = parseInt(puzzleData?.size?.rows);
  const colSize = parseInt(puzzleData?.size?.cols);
  const newPuzzle: CrosswordsPuzzleType = {
    title: puzzleData?.title,
    rows: rowSize,
    columns: colSize,
    grid: puzzleData?.grid,
    gridnums: puzzleData?.gridnums,
    guess: Array.from({ length: rowSize * colSize }),
    across: {},
    down: {},
  };
  puzzleData?.clues?.across?.forEach((hint: string, index: number) => {
    const boxnum = parseInt(hint.substring(0, hint.indexOf(".")));
    const clue = hint.substring(hint.indexOf(".") + 2);
    const position = puzzleData?.gridnums?.indexOf(boxnum);
    const row = Math.floor(position / rowSize);
    const col = position % colSize;
    newPuzzle.across[boxnum] = {
      clue: clue,
      answer: puzzleData?.answers?.across[index],
      row: row,
      col: col,
      guess: "",
    };
  });
  puzzleData?.clues?.down?.forEach((hint: string, index: number) => {
    const boxnum = parseInt(hint.substring(0, hint.indexOf(".")));
    const clue = hint.substring(hint.indexOf(".") + 2);
    const position = puzzleData?.gridnums?.indexOf(boxnum);
    const row = Math.floor(position / rowSize);
    const col = position % colSize;
    newPuzzle.down[boxnum] = {
      clue: clue,
      answer: puzzleData?.answers?.down[index],
      row: row,
      col: col,
      guess: "",
    };
  });
  return newPuzzle;
}
