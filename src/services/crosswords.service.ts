import { CluesInput } from "@jaredreisinger/react-crossword";
import axios from "axios";

export const getPuzzleData = async (crosswordsUrl: string): Promise<CluesInput> => {
  try {
    const response = await axios.get(crosswordsUrl);
    return formatPuzzleData(response.data);
  } catch (err: any) {
    throw new Error(err.response.data);
  }
};

function formatPuzzleData(puzzleData: any): CluesInput {
  const rowSize = parseInt(puzzleData?.size?.rows);
  const colSize = parseInt(puzzleData?.size?.cols);
  const newPuzzle: CluesInput = { across: {}, down: {} };
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
    };
  });
  return newPuzzle;
}