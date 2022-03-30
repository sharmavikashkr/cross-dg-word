/* eslint-disable react-hooks/exhaustive-deps */
import { Box, Container, Grid } from "@mui/material";
import React, { useState, useEffect, useRef } from "react";
import { wordList } from "./constants/data";
import Typography from "@mui/material/Typography";

interface GuessType {
  guessWord: string;
  guessStatus: string;
}

const Wordle = () => {
  let socket: WebSocket;
  const mic: any = {};
  const [transcript, setTranscript] = useState("");
  const [word, setWord] = useState("");
  const [guessList, setGuessList] = useState<GuessType[]>([]);
  const [shuffle, setShuffle] = useState(0);

  const wordRef = useRef(word);
  const guessListRef = useRef(guessList);

  useEffect(() => {
    wordRef.current = word;
  }, [word]);

  useEffect(() => {
    guessListRef.current = guessList;
  }, [guessList]);

  useEffect(() => {
    const randomWord = wordList[Math.floor(Math.random() * wordList.length)];
    setWord(randomWord.toUpperCase());
  }, [shuffle]);

  useEffect(() => {
    async function fetchData() {
      mic.stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      if (!MediaRecorder.isTypeSupported("audio/webm")) {
        alert("Browser not supported");
      }
      mic.mediaRecorder = new MediaRecorder(mic.stream, { mimeType: "audio/webm" });
      return mic.mediaRecorder;
    }
    console.log("listening..");
    fetchData();
    beginTranscription();
    return () => {
      if (socket) {
        console.log("Closing open socket");
        socket.close();
      }
    };
  }, [word]);

  async function beginTranscription() {
    const key = await fetch("https://crosswords-dg.azurewebsites.net/api/deepgramkeyapi").then((r) => r.text());
    if (socket) {
      socket.close();
    }
    socket = new WebSocket("wss://api.deepgram.com/v1/listen?punctuate=true&diarize=true&interim_results=true", ["token", key]);
    socket.onopen = () => {
      mic.mediaRecorder.addEventListener("dataavailable", (event: any) => {
        if (event.data.size > 0 && socket.readyState === 1) socket.send(event.data);
      });
      mic.mediaRecorder.start(250);
    };
    socket.onmessage = (message) => transcriptionResults(JSON.parse(message.data));
  }

  function transcriptionResults(data: any) {
    const { is_final, channel } = data;
    let { transcript } = channel.alternatives[0];
    if (!transcript) return;

    if (is_final) {
      transcript = transcript.toUpperCase();
      console.log("transcript", transcript);
      setTranscript(transcript);
      if (transcript.includes("NEW WORD")) {
        setShuffle(shuffle + 1);
      } else {
        fillWord(transcript);
      }
    }

    function fillWord(transcript: string) {
      let commanArr = transcript.split(" ");
      if (commanArr.length > 1) {
        return;
      }
      const alreadyGuessed = guessListRef.current.filter((word) => word.guessWord === transcript);
      if(alreadyGuessed.length > 0) {
        return;
      }
      console.log("command array", commanArr);
      const guessWord = commanArr[0].replace(",", "").replace(".", "").replace("?", "");
      console.log("guessWord", guessWord);
      if (wordRef.current.length !== guessWord.length) {
        return;
      }
      let guessStatus = "";
      for (let i = 0; i < guessWord.length; i++) {
        guessStatus += getLetterStatus(guessWord[i], i);
      }
      const newGuessList = guessListRef.current;
      newGuessList.push({
        guessWord: guessWord,
        guessStatus: guessStatus,
      });
      setGuessList(newGuessList);
    }
  }

  function getLetterStatus(letter: string, index: number): string {
    if (wordRef.current[index] === letter) {
      return "g";
    }
    const expectedIndex = wordRef.current.indexOf(letter);
    if (expectedIndex === -1) {
      return "b";
    } else if (index !== expectedIndex) {
      return "y";
    }
    return "g";
  }

  return (
    <Container key={shuffle}>
      <br />
      <Grid container spacing={2} justifyContent="center">
        <Grid container xs={12} justifyContent="center">
          <h1>WORDLE</h1>
        </Grid>
        <Grid container xs={12} justifyContent="center">
          {word}
        </Grid>
        <Grid container xs={12} justifyContent="center">
          {transcript}
        </Grid>
        <Grid container xs={12} justifyContent="center">
          {JSON.stringify(guessList)}
        </Grid>
        <Grid key={shuffle} container xs={12} justifyContent="center">
          <Grid item xs={0} sm={2} md={3} lg={4} xl={4}></Grid>
          <Grid item xs={12} sm={8} md={6} lg={4} xl={4}>
            {[0, 1, 2, 3, 4, 5].map((row, rowIndex) => (
              <div>
                <Grid key={rowIndex} container justifyContent="center">
                  {[0, 1, 2, 3, 4].map((column, letterIndex) => (
                    <Grid key={guessList[rowIndex]?.guessWord[letterIndex]} item xs={2}>
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
                          <Typography variant="h4" component="div" gutterBottom>
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
          </Grid>
          <Grid item xs={0} sm={2} md={3} lg={4} xl={4}></Grid>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Wordle;
