/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect } from "react";
import { Box, Grid, Typography } from "@mui/material";
import wordsToNumbers from "words-to-numbers";
import { RootState } from "../store/utils";
import { useDispatch, useSelector } from "react-redux";
import { setSudokuError, setSudokuPuzzle } from "../store";

export interface SudokuProps {
  transcript: string;
}

export const Sudoku: React.FunctionComponent<SudokuProps> = ({ transcript }) => {
  const dispatch = useDispatch();

  const difficulty = useSelector((state: RootState) => state.sudokuState.difficulty);
  const puzzle = useSelector((state: RootState) => state.sudokuState.puzzle);
  const error = useSelector((state: RootState) => state.sudokuState.error);

  useEffect(() => {
    function fillCell(transcript: string) {
      let commanArr = transcript.split(" ");
      if (commanArr.length < 4 || commanArr[1] !== "CROSS") {
        dispatch(setSudokuError("Incorrect input; Command Hint: 'five cross two seven'"));
        return;
      }
      console.log("command array", commanArr);

      const guessWord = commanArr[3].replaceAll(" ", "").replace(",", "").replace(".", "");

      let row = wordsToNumbers(commanArr[0]);
      let column = wordsToNumbers(commanArr[2]);
      let guess = wordsToNumbers(guessWord);
      if (typeof row === "string") {
        row = parseInt(row);
      }
      if (typeof column === "string") {
        column = parseInt(column);
      }
      if (typeof guess === "string") {
        guess = parseInt(guess);
      }
      if (
        typeof row !== "number" ||
        isNaN(row) ||
        typeof column !== "number" ||
        isNaN(column) ||
        typeof guess !== "number" ||
        isNaN(guess)
      ) {
        dispatch(setSudokuError("Incorrect numbers in command"));
        return;
      }
      console.log("row", row, "column", column, "guess", guess);

      if (row < 1 || row > 9 || column < 1 || column > 9 || guess < 1 || guess > 9) {
        dispatch(setSudokuError("Command numbers not in valid range [1,9]"));
        return;
      }
      if (puzzle.board[row - 1][column - 1] !== 0) {
        dispatch(setSudokuError("Cell is not empty"));
        return;
      }

      dispatch(setSudokuError(""));

      puzzle.board[row - 1][column - 1] = guess;
      dispatch(setSudokuPuzzle(difficulty, { ...puzzle }));
    }

    if (transcript.trim() === "") {
      return;
    }
    console.log("sudoku transcript", transcript);
    fillCell(transcript);
  }, [transcript]);

  return (
    <div key={"sudoku-game-container"} style={{ margin: "20px" }}>
      <Grid container spacing={0} justifyContent="center">
        <Grid container spacing={0} justifyContent="center">
          <h1>SUDOKU</h1>
        </Grid>
        <Grid container spacing={0} justifyContent="center">
          <h4>{difficulty}</h4>
        </Grid>
        <Grid container spacing={0} justifyContent="center">
          <Box sx={{ color: "error.main" }}>{error}</Box>
        </Grid>
        <br />
        <br />
        <Grid container spacing={0} justifyContent="center">
          <Grid item xs={0} sm={2}></Grid>
          <Grid item xs={12} sm={8}>
            {Array.from({ length: 9 }).map((row, rowIndex) => (
              <div key={rowIndex}>
                <Grid container justifyContent="center">
                  {Array.from({ length: 9 }).map((column, colIndex) => (
                    <Grid key={rowIndex + "-" + colIndex} item>
                      <Box
                        sx={{
                          width: 40,
                          height: 40,
                          border: "1px solid #D3d6DA",
                          "&:hover": {
                            backgroundColor: "#D3d6DA",
                            opacity: [0.9, 0.8, 0.7],
                          },
                        }}
                      >
                        <Grid container justifyContent="center">
                          <Typography variant="h4" component="div">
                            {puzzle.board[rowIndex][colIndex] !== 0 ? puzzle.board[rowIndex][colIndex] : ""}
                          </Typography>
                        </Grid>
                      </Box>
                    </Grid>
                  ))}
                </Grid>
              </div>
            ))}
          </Grid>
          <Grid item xs={0} sm={2}></Grid>
        </Grid>
      </Grid>
    </div>
  );
};

export default Sudoku;
