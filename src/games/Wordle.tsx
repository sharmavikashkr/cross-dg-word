/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect } from "react";
import Typography from "@mui/material/Typography";
import { Container, Grid, Box, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../store/utils";
import { addWordleGuess } from "../store";

export interface WordleProps {
  transcript: string;
}

export const Wordle: React.FunctionComponent<WordleProps> = ({ transcript }) => {
  const dispatch = useDispatch();

  const word = useSelector((state: RootState) => state.wordleState.word);
  const guessList = useSelector((state: RootState) => state.wordleState.guessList);

  const [open, setOpen] = React.useState(false);
  const [won, setWon] = React.useState(false);

  const handleClose = () => {
    setOpen(false);
  };

  useEffect(() => {
    if (guessList.length >= 6 || (guessList.length > 0 && guessList[guessList.length - 1].guessStatus === "ggggg")) {
      if (guessList[guessList.length - 1].guessStatus === "ggggg") {
        setWon(true);
      }
      setOpen(true);
    }
  }, [guessList]);

  useEffect(() => {
    function fillWord(transcript: string) {
      let commanArr = transcript.split(" ");
      if(guessList.length >= 6) {
        return;
      }
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
      dispatch(
        addWordleGuess({
          guessWord: guessWord,
          guessStatus: guessStatus,
        })
      );
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
  }, [transcript, word]);

  return (
    <Container key={"wordle-game-container"}>
      <br />
      <Grid container spacing={0}>
        <Grid container spacing={0} justifyContent="center">
          <h1>WORDLE</h1>
        </Grid>
        {/* <Grid container justifyContent="center">
          {word}
        </Grid> */}
        {/* <Grid container justifyContent="center">
          {JSON.stringify(guessList)}
        </Grid> */}
        {/* <Grid container spacing={0} justifyContent="center">
          {transcript}
        </Grid> */}
        <br />
        <Grid container spacing={0} justifyContent="center">
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
                          color:
                            guessList[rowIndex]?.guessStatus[letterIndex] === "g"
                              ? "white"
                              : guessList[rowIndex]?.guessStatus[letterIndex] === "y"
                              ? "white"
                              : guessList[rowIndex]?.guessStatus[letterIndex] === "b"
                              ? "white"
                              : "black",
                          backgroundColor:
                            guessList[rowIndex]?.guessStatus[letterIndex] === "g"
                              ? "#6AAA64"
                              : guessList[rowIndex]?.guessStatus[letterIndex] === "y"
                              ? "#C9B458"
                              : guessList[rowIndex]?.guessStatus[letterIndex] === "b"
                              ? "#787C7E"
                              : "white",
                          border: "2px solid #D3d6DA",
                          "&:hover": {
                            backgroundColor: "#D3d6DA",
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
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>
          <h3>{won ? "Congratulations!!" : "Oops!!"}</h3>
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            <Grid container justifyContent={"center"}>
              The wordle is: <b>{word}</b>
            </Grid>
            <hr />
            <Grid container justifyContent={"center"}>
              <b>{"GUESS CONTRIBUTION"}</b>
            </Grid>
            <Grid>
              <Grid container>Wordle [{guessList.length}/6]</Grid>
              <br />
              {guessList.map((guess, row) => (
                <div>
                  <Grid key={row} container justifyContent="center">
                    {[0, 1, 2, 3, 4].map((row, col) => (
                      <Grid key={row + "-" + col} item xs={2}>
                        <Box
                          sx={{
                            width: 20,
                            height: 20,
                            backgroundColor:
                              guess.guessStatus[col] === "g" ? "#6AAA64" : guess.guessStatus[col] === "y" ? "#C9B458" : "#787C7E",
                          }}
                        ></Box>
                      </Grid>
                    ))}
                  </Grid>
                  <br />
                </div>
              ))}
            </Grid>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Close</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Wordle;
