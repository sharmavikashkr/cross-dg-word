import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  CrosswordGrid,
  CrosswordProvider,
  CrosswordProviderImperative,
  DirectionClues,
  AnswerTuple,
  CluesInput,
} from "@jaredreisinger/react-crossword";
import axios from "axios";
import { Button, ButtonGroup, Container, Grid } from "@mui/material";
import wordsToNumbers from "words-to-numbers";

// const { Deepgram } = require("@deepgram/sdk");
// const deepgram = new Deepgram("4652d717e1291dbd815919a855ab1d27d16e87c3");

function App() {
  const mic: any = {};
  const [transcript, setTranscript] = useState("");
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
    async function fetchData() {
      mic.stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      if (!MediaRecorder.isTypeSupported("audio/webm")) {
        alert("Browser not supported");
      }
      mic.mediaRecorder = new MediaRecorder(mic.stream, { mimeType: "audio/webm" });
      beginTranscription();
      return mic.mediaRecorder;
    }
    console.log('listening..');
    fetchData();
  }, [puzzle]);

  useEffect(() => {
    const crosswords_url = "https://raw.githubusercontent.com/doshea/nyt_crosswords/master/" + year + "/" + month + "/" + day + ".json";
    axios
      .get(crosswords_url)
      .then((response) => {
        formatPuzzle(response.data);
      })
      .catch((ex: any) => {
        console.error(ex);
        setShuffle(shuffle + 1);
      });
  }, [year, month, day]);

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
  }

  async function beginTranscription() {
    const { key } = await fetch("http://localhost:8000/deepgram-token").then((r) => r.json());
    const socket = new WebSocket("wss://api.deepgram.com/v1/listen?punctuate=true&diarize=true&interim_results=true", ["token", key]);
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
    const { transcript, words } = channel.alternatives[0];
    if (!transcript) return;

    if (is_final) {
      console.log(words, transcript);
      setTranscript(transcript);
      let type = "";
      if (transcript.includes("across")) {
        type = "across";
      } else if (transcript.includes("down")) {
        type = "down";
      } else {
        return;
      }
      let commanArr = transcript.split(type);
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
      if (type === "across") {
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
      } else if (type === "down") {
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

    // Pull out speaker and word
    // phrases.pending = words.map((w: any) => {
    //   const { punctuated_word: word, speaker } = w;
    //   return { word, speaker };
    // });

    // // If this is the final version of the phrase, push it into final phrases array
    // if (is_final) {
    //   phrases.final.push(...phrases.pending);
    //   phrases.pending = [];
    // }
    // setPhrases(phrases);
  }

  // We don't really *do* anything with callbacks from the Crossword component,
  // but we can at least show that they are happening.  You would want to do
  // something more interesting than simply collecting them as messages.
  const messagesRef = useRef<HTMLPreElement>(null);
  const [messages, setMessages] = useState<string[]>([]);

  const addMessage = useCallback((message: string) => {
    setMessages((m) => m.concat(`${message}\n`));
  }, []);

  useEffect(() => {
    if (!messagesRef.current) {
      return;
    }
    const { scrollHeight } = messagesRef.current;
    messagesRef.current.scrollTo(0, scrollHeight);
  }, [messages]);

  // onCorrect is called with the direction, number, and the correct answer.
  const onCorrect = useCallback(
    (direction, number, answer) => {
      addMessage(`onCorrect: "${direction}", "${number}", "${answer}"`);
    },
    [addMessage]
  );

  // onLoadedCorrect is called with an array of the already-correct answers,
  // each element itself is an array with the same values as in onCorrect: the
  // direction, number, and the correct answer.
  const onLoadedCorrect = useCallback(
    (answers: AnswerTuple[]) => {
      addMessage(
        `onLoadedCorrect:\n${answers.map(([direction, number, answer]) => `    - "${direction}", "${number}", "${answer}"`).join("\n")}`
      );
    },
    [addMessage]
  );

  // onCrosswordCorrect is called with a truthy/falsy value.
  const onCrosswordCorrect = useCallback(
    (isCorrect: boolean) => {
      addMessage(`onCrosswordCorrect: ${JSON.stringify(isCorrect)}`);
    },
    [addMessage]
  );

  // onCellChange is called with the row, column, and character.
  const onCellChange = useCallback(
    (row: number, col: number, char: string) => {
      addMessage(`onCellChange: "${row}", "${col}", "${char}"`);
    },
    [addMessage]
  );

  // all the same functionality, but for the decomposed CrosswordProvider
  const crosswordProvider = useRef<CrosswordProviderImperative>(null);

  const focusProvider = useCallback((event) => {
    crosswordProvider.current?.focus();
  }, []);

  const fillOneCellProvider = useCallback((event) => {
    crosswordProvider.current?.setGuess(0, 2, "O");
  }, []);

  const fillAllAnswersProvider = useCallback((event) => {
    crosswordProvider.current?.fillAllAnswers();
  }, []);

  const resetProvider = useCallback((event) => {
    crosswordProvider.current?.reset();
  }, []);

  useEffect(() => {
    setYear((Math.floor(Math.random() * 42) + 1976).toString());
    setMonth(("0" + (Math.floor(Math.random() * 12) + 1)).slice(-2));
    setDay(("0" + (Math.floor(Math.random() * 31) + 1)).slice(-2));
  }, [shuffle]);

  // We don't really *do* anything with callbacks from the Crossword component,
  // but we can at least show that they are happening.  You would want to do
  // something more interesting than simply collecting them as messages.
  const messagesProviderRef = useRef<HTMLPreElement>(null);
  const [messagesProvider, setMessagesProvider] = useState<string[]>([]);

  const clearMessagesProvider = useCallback((event) => {
    setMessagesProvider([]);
  }, []);

  const addMessageProvider = useCallback((message: string) => {
    setMessagesProvider((m) => m.concat(`${message}\n`));
  }, []);

  useEffect(() => {
    if (!messagesProviderRef.current) {
      return;
    }
    const { scrollHeight } = messagesProviderRef.current;
    messagesProviderRef.current.scrollTo(0, scrollHeight);
  }, [messagesProvider]);

  // onCorrect is called with the direction, number, and the correct answer.
  const onCorrectProvider = useCallback(
    (direction, number, answer) => {
      addMessageProvider(`onCorrect: "${direction}", "${number}", "${answer}"`);
    },
    [addMessageProvider]
  );

  // onLoadedCorrect is called with an array of the already-correct answers,
  // each element itself is an array with the same values as in onCorrect: the
  // direction, number, and the correct answer.
  const onLoadedCorrectProvider = useCallback(
    (answers: AnswerTuple[]) => {
      addMessageProvider(
        `onLoadedCorrect:\n${answers.map(([direction, number, answer]) => `    - "${direction}", "${number}", "${answer}"`).join("\n")}`
      );
    },
    [addMessageProvider]
  );

  // onCrosswordCorrect is called with a truthy/falsy value.
  const onCrosswordCorrectProvider = useCallback(
    (isCorrect: boolean) => {
      addMessageProvider(`onCrosswordCorrect: ${JSON.stringify(isCorrect)}`);
    },
    [addMessageProvider]
  );

  // onCellChange is called with the row, column, and character.
  const onCellChangeProvider = useCallback(
    (row: number, col: number, char: string) => {
      addMessageProvider(`onCellChange: "${row}", "${col}", "${char}"`);
    },
    [addMessageProvider]
  );

  return (
    <Container>
      <br />
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <ButtonGroup variant="contained" aria-label="outlined primary button group">
            <Button variant="contained" color="primary" onClick={focusProvider}>
              Focus
            </Button>
            <Button variant="contained" color="secondary" onClick={fillOneCellProvider}>
              Fill the first letter of 2-down
            </Button>
            <Button variant="contained" color="success" onClick={fillAllAnswersProvider}>
              Fill all answers
            </Button>
            <Button variant="contained" color="warning" onClick={resetProvider}>
              Reset
            </Button>
            <Button variant="contained" color="error" onClick={() => setShuffle(shuffle + 1)}>
              Shuffle
            </Button>
          </ButtonGroup>
        </Grid>
        <br />
        {transcript}
        {/* <br />
        {JSON.stringify(puzzle)} */}
        <br />
        <Grid item xs={12}>
          {puzzle && (
            <CrosswordProvider
              ref={crosswordProvider}
              data={puzzle}
              onCorrect={onCorrectProvider}
              onLoadedCorrect={onLoadedCorrectProvider}
              onCrosswordCorrect={onCrosswordCorrectProvider}
              onCellChange={onCellChangeProvider}
            >
              <Grid container spacing={2}>
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
        </Grid>
      </Grid>
    </Container>
  );
}

export default App;
