/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";
import { wordList } from "./constants/data";
import Typography from "@mui/material/Typography";
import { Container, Grid, Box } from "@mui/material";

interface GuessType {
  guessWord: string;
  guessStatus: string;
}

export interface WordleProps {
  transcript: string;
}

export const Wordle: React.FunctionComponent<WordleProps> = ({ transcript }) => {
  const [word, setWord] = useState("");
  const [guessList, setGuessList] = useState<GuessType[]>([]);

  useEffect(() => {
    const randomWord = wordList[Math.floor(Math.random() * wordList.length)];
    setWord(randomWord.toUpperCase());
    setGuessList([]);
  }, []);

  useEffect(() => {
    function fillWord(transcript: string) {
      let commanArr = transcript.split(" ");
      if (commanArr.length > 1) {
        return;
      }
      const alreadyGuessed = guessList.filter((word) => word.guessWord === transcript);
      if (alreadyGuessed.length > 0) {
        return;
      }
      console.log("command array", commanArr);
      const guessWord = commanArr[0].replace(",", "").replace(".", "").replace("?", "");
      console.log("guessWord", guessWord);
      if (word.length !== guessWord.length) {
        return;
      }
      let guessStatus = "";
      for (let i = 0; i < guessWord.length; i++) {
        guessStatus += getLetterStatus(guessWord[i], i);
      }
      const newGuessList = guessList;
      newGuessList.push({
        guessWord: guessWord,
        guessStatus: guessStatus,
      });
      setGuessList((prevGuessList) => [...prevGuessList, ...newGuessList]);
    }

    function getLetterStatus(letter: string, index: number): string {
      if (word[index] === letter) {
        return "g";
      }
      const expectedIndex = word.indexOf(letter);
      if (expectedIndex === -1) {
        return "b";
      } else if (index !== expectedIndex) {
        return "y";
      }
      return "g";
    }

    if (transcript.trim() === "") {
      return;
    }
    console.log("wordle transcript", transcript);
    fillWord(transcript);
  }, [transcript]);

  return (
    <Container key={"wordle-game-container"}>
      <br />
      <Grid container spacing={2}>
        <Grid container justifyContent="center">
          <h1>WORDLE</h1>
        </Grid>
        <Grid container justifyContent="center">
          {word}
        </Grid>
        <Grid container justifyContent="center">
          {JSON.stringify(guessList)}
        </Grid>
        <Grid container justifyContent="center">
          {transcript}
        </Grid>
        <br />
        <Grid container justifyContent="center">
          <Grid item xs={0} sm={2} md={3} lg={4} xl={4}></Grid>
          <Grid item xs={12} sm={8} md={6} lg={4} xl={4}>
            <Grid item xs={1}></Grid>
            {[0, 1, 2, 3, 4, 5].map((row, rowIndex) => (
              <div key={rowIndex}>
                <Grid container justifyContent="center">
                  {[0, 1, 2, 3, 4].map((column, letterIndex) => (
                    <Grid key={rowIndex + "-" + letterIndex} item xs={2}>
                      <Box
                        sx={{
                          width: 50,
                          height: 50,
                          backgroundColor:
                            guessList[rowIndex]?.guessStatus[letterIndex] === "g"
                              ? "green"
                              : guessList[rowIndex]?.guessStatus[letterIndex] === "y"
                              ? "yellow"
                              : guessList[rowIndex]?.guessStatus[letterIndex] === "b"
                              ? "gray"
                              : "white",
                          border: "2px solid grey",
                          "&:hover": {
                            backgroundColor: "grey",
                            opacity: [0.9, 0.8, 0.7],
                          },
                        }}
                      >
                        <Grid container justifyContent="center">
                          <Typography variant="h4" component="div">
                            {guessList[rowIndex]?.guessWord[letterIndex]}
                          </Typography>
                        </Grid>
                      </Box>
                    </Grid>
                  ))}
                </Grid>
                <br />
              </div>
            ))}
            <Grid item xs={1}></Grid>
          </Grid>
          <Grid item xs={0} sm={2} md={3} lg={4} xl={4}></Grid>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Wordle;
