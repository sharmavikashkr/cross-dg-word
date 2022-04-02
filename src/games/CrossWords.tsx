/* eslint-disable react-hooks/exhaustive-deps */
import React, { useCallback, useEffect, useMemo, useRef } from "react";
import { CrosswordGrid, CrosswordProvider, CrosswordProviderImperative, DirectionClues } from "@jaredreisinger/react-crossword";
import { Button, ButtonGroup, Container, Grid } from "@mui/material";
import wordsToNumbers from "words-to-numbers";
import useWindowDimensions from "../UseWindowDimentions";
import { RootState } from "../store/utils";
import { useSelector } from "react-redux";

export interface CrosswordsProps {
  transcript: string;
}

export const Crosswords: React.FunctionComponent<CrosswordsProps> = ({ transcript }) => {
  const { width } = useWindowDimensions();

  const date = useSelector((state: RootState) => state.crosswordsState.date);
  const puzzle = useSelector((state: RootState) => state.crosswordsState.puzzle);
  const error = useSelector((state: RootState) => state.crosswordsState.error);

  useEffect(() => {
    crosswordProvider.current?.reset();
  }, [puzzle]);

  useMemo(() => {
    function fillWord(transcript: string, direction: string) {
      let commanArr = transcript.split(direction);
      if (commanArr.length < 2) {
        return;
      }
      console.log("command array", commanArr);

      let boxnum = wordsToNumbers(commanArr[0]);
      if (typeof boxnum === "string") {
        boxnum = parseInt(boxnum);
      }
      if (typeof boxnum !== "number") {
        return;
      }
      console.log("box number", boxnum);

      const guess = commanArr[1].replaceAll(" ", "").replace(",", "").replace(".", "");
      console.log("guess", guess);
      if (direction === "ACROSS") {
        console.log("hint", puzzle.across);
        const answer = puzzle.across[boxnum].answer;
        console.log("answer", answer);
        if (answer.length !== guess.length) {
          return;
        }
        const posR = puzzle.across[boxnum].row;
        const posC = puzzle.across[boxnum].col;
        for (let i = 0; i < guess.length; i++) {
          const c = guess.charAt(i);
          crosswordProvider.current?.setGuess(posR, posC + i, c);
        }
      } else if (direction === "DOWN") {
        const answer = puzzle.down[boxnum].answer;
        console.log("answer", answer);
        if (answer.length !== guess.length) {
          return;
        }
        const posR = puzzle.down[boxnum].row;
        const posC = puzzle.down[boxnum].col;
        for (let i = 0; i < guess.length; i++) {
          const c = guess.charAt(i);
          crosswordProvider.current?.setGuess(posR + i, posC, c);
        }
      }
    }

    if (transcript.trim() === "") {
      return;
    }
    console.log("crosswords transcript", transcript);
    if (transcript.includes("ACROSS")) {
      fillWord(transcript, "ACROSS");
    } else if (transcript.includes("DOWN")) {
      fillWord(transcript, "DOWN");
    } else if (transcript.includes("RESET")) {
      crosswordProvider.current?.reset();
    } else if (transcript.includes("VALIDATE")) {
      const isCorrect = crosswordProvider.current?.isCrosswordCorrect();
      console.log("isCorrect", isCorrect);
    }
  }, [transcript]);

  const crosswordProvider = useRef<CrosswordProviderImperative>(null);

  const resetProvider = useCallback((event) => {
    crosswordProvider.current?.reset();
  }, []);

  return (
    <Container key={"crosswords-game-container"}>
      <br />
      <Grid container spacing={2} justifyContent="center">
        <Grid item xs={12}>
          {error}
        </Grid>
        <Grid item xs={12}>
          <ButtonGroup variant="contained" aria-label="outlined primary button group">
            <Button variant="contained" color="warning" onClick={resetProvider}>
              Reset
            </Button>
          </ButtonGroup>
        </Grid>
        <Grid item xs={12}>
          {date}
        </Grid>
        <Grid item xs={12}>
          {transcript}
        </Grid>
        <Grid item xs={12}>
          {puzzle && width >= 1000 && (
            <CrosswordProvider ref={crosswordProvider} data={puzzle}>
              <Grid container spacing={2} justifyContent="center">
                <Grid item xs={3}>
                  <DirectionClues direction="across" />
                </Grid>
                <Grid item xs={6}>
                  <CrosswordGrid />
                </Grid>
                <Grid item xs={3}>
                  <DirectionClues direction="down" />
                </Grid>
              </Grid>
            </CrosswordProvider>
          )}
          {puzzle && width < 1000 && (
            <CrosswordProvider ref={crosswordProvider} data={puzzle}>
              <Grid container spacing={2} justifyContent="center">
                <Grid item xs={12}>
                  <CrosswordGrid />
                </Grid>
                <Grid item xs={6}>
                  <DirectionClues direction="across" />
                </Grid>
                <Grid item xs={6}>
                  <DirectionClues direction="down" />
                </Grid>
              </Grid>
            </CrosswordProvider>
          )}
        </Grid>
      </Grid>
    </Container>
  );
};

export default Crosswords;
