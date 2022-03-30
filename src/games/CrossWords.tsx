/* eslint-disable react-hooks/exhaustive-deps */
import React, { useCallback, useEffect, useRef, useState } from "react";
import { CrosswordGrid, CrosswordProvider, CrosswordProviderImperative, DirectionClues, CluesInput } from "@jaredreisinger/react-crossword";
import axios from "axios";
import { Button, ButtonGroup, Container, Grid } from "@mui/material";
import wordsToNumbers from "words-to-numbers";
import useWindowDimensions from "./UseWindowDimentions";

export interface CrossWordsProps {
  transcript: string;
}

export const CrossWords: React.FunctionComponent<CrossWordsProps> = ({ transcript }) => {
  const { width } = useWindowDimensions();
  const [shuffle, setShuffle] = useState(0);
  const [year, setYear] = useState("2009");
  const [month, setMonth] = useState("03");
  const [day, setDay] = useState("18");
  const [puzzle, setPuzzle] = useState<CluesInput>({
    across: {
      1: {
        clue: "one plus one",
        answer: "TWO",
        row: 0,
        col: 0,
      },
    },
    down: {
      2: {
        clue: "three minus two",
        answer: "ONE",
        row: 0,
        col: 2,
      },
    },
  });

  useEffect(() => {
    setYear((Math.floor(Math.random() * 42) + 1976).toString());
    setMonth(("0" + (Math.floor(Math.random() * 12) + 1)).slice(-2));
    setDay(("0" + (Math.floor(Math.random() * 31) + 1)).slice(-2));
  }, [shuffle]);

  useEffect(() => {
    const crosswords_url = "https://raw.githubusercontent.com/doshea/nyt_crosswords/master/" + year + "/" + month + "/" + day + ".json";
    axios
      .get(crosswords_url)
      .then((response) => {
        console.log("formatting puzzle");
        formatPuzzle(response.data);
      })
      .catch((ex: any) => {
        console.error(ex);
        setShuffle(shuffle + 1);
      });
  }, [year]);

  function formatPuzzle(puzzleData: any) {
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
    setPuzzle(newPuzzle);
    crosswordProvider.current?.reset();
  }

  useEffect(() => {
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
    } else if (transcript.includes("NEW GAME")) {
      crosswordProvider.current?.reset();
      setShuffle(shuffle + 1);
    } else if (transcript.includes("VALIDATE")) {
      const isCorrect = crosswordProvider.current?.isCrosswordCorrect();
      console.log("isCorrect", isCorrect);
    }
  }, [transcript]);

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

  // all the same functionality, but for the decomposed CrosswordProvider
  const crosswordProvider = useRef<CrosswordProviderImperative>(null);

  const resetProvider = useCallback((event) => {
    crosswordProvider.current?.reset();
  }, []);

  return (
    <Container key={shuffle}>
      <br />
      <Grid container spacing={2} justifyContent="center">
        <Grid item xs={12}>
          <ButtonGroup variant="contained" aria-label="outlined primary button group">
            <Button variant="contained" color="warning" onClick={resetProvider}>
              Reset
            </Button>
            <Button variant="contained" color="error" onClick={() => setShuffle(shuffle + 1)}>
              New Game
            </Button>
          </ButtonGroup>
        </Grid>
        <Grid item xs={12}>
          {transcript}
        </Grid>
        <Grid item xs={12}>
          {puzzle && width >= 1000 && (
            <CrosswordProvider key={shuffle} ref={crosswordProvider} data={puzzle}>
              <Grid container spacing={2} justifyContent="center">
                <Grid item xs={3}>
                  <DirectionClues direction="across" />
                </Grid>
                <Grid item xs={6}>
                  <CrosswordGrid key={shuffle} />
                </Grid>
                <Grid item xs={3}>
                  <DirectionClues direction="down" />
                </Grid>
              </Grid>
            </CrosswordProvider>
          )}
          {puzzle && width < 1000 && (
            <CrosswordProvider key={shuffle} ref={crosswordProvider} data={puzzle}>
              <Grid container spacing={2} justifyContent="center">
                <Grid item xs={12}>
                  <CrosswordGrid key={shuffle} />
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

export default CrossWords;
