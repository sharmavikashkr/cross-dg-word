/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect } from "react";
import { Badge, Box, Grid, List, ListItem, ListItemText } from "@mui/material";
import wordsToNumbers from "words-to-numbers";
import useWindowDimensions from "../UseWindowDimentions";
import { RootState } from "../store/utils";
import { useDispatch, useSelector } from "react-redux";
import { setCrosswordsPuzzle } from "../store";

export interface CrosswordsProps {
  transcript: string;
}

export const Crosswords: React.FunctionComponent<CrosswordsProps> = ({ transcript }) => {
  const { width } = useWindowDimensions();
  const dispatch = useDispatch();

  const date = useSelector((state: RootState) => state.crosswordsState.date);
  const puzzle = useSelector((state: RootState) => state.crosswordsState.puzzle);
  const error = useSelector((state: RootState) => state.crosswordsState.error);

  useEffect(() => {
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
      if (typeof boxnum !== "number" || isNaN(boxnum)) {
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
        puzzle.across[boxnum].guess = guess;
        const posR = puzzle.across[boxnum].row;
        const posC = puzzle.across[boxnum].col;
        for (let i = 0; i < guess.length; i++) {
          const c = guess.charAt(i);
          puzzle.guess[posR * puzzle.rows + posC + i] = c;
        }
      } else if (direction === "DOWN") {
        const answer = puzzle.down[boxnum].answer;
        console.log("answer", answer);
        if (answer.length !== guess.length) {
          return;
        }
        puzzle.down[boxnum].guess = guess;
        const posR = puzzle.down[boxnum].row;
        const posC = puzzle.down[boxnum].col;
        for (let i = 0; i < guess.length; i++) {
          const c = guess.charAt(i);
          puzzle.guess[(posR + i) * puzzle.rows + posC] = c;
        }
      }
      dispatch(setCrosswordsPuzzle(date, { ...puzzle }));
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
      // crosswordProvider.current?.reset();
    } else if (transcript.includes("VALIDATE")) {
      // const isCorrect = crosswordProvider.current?.isCrosswordCorrect();
      // console.log("isCorrect", isCorrect);
    }
  }, [transcript, puzzle]);

  return (
    <div key={"crosswords-game-container"} style={{ margin: "20px" }}>
      <Grid container spacing={0} justifyContent="center">
        <Grid container spacing={0} justifyContent="center">
          <h1>CROSSWORDS</h1>
        </Grid>
        <Grid container spacing={0} justifyContent="center">
          <h4>{puzzle.title}</h4>
        </Grid>
        <Grid container spacing={0} justifyContent="center">
          {error}
        </Grid>
        {/* <Grid container spacing={0} justifyContent="center">
          {transcript}
        </Grid> */}
        <br />
        <Grid container justifyContent="center">
          {puzzle && width >= 1300 && (
            <Grid container justifyContent="center">
              <Grid item xs={3}>
                <List dense={true}>
                  <ListItem>
                    <b>{"ACROSS"}</b>
                  </ListItem>
                  {Object.keys(puzzle.across).map((val, index) => (
                    <ListItem sx={{ width: "100%", bgcolor: "background.paper" }}>
                      <ListItemText primary={val + ". " + puzzle.across[val].clue} />
                    </ListItem>
                  ))}
                </List>
              </Grid>
              <Grid item xs={6}>
                {Array.from({ length: puzzle.rows }).map((row, rowIndex) => (
                  <div key={rowIndex}>
                    <Grid container justifyContent="center">
                      {Array.from({ length: puzzle.columns }).map((column, colIndex) => (
                        <Grid key={rowIndex + "-" + colIndex} item>
                          <Box
                            sx={{
                              width: 40,
                              height: 40,
                              backgroundColor: puzzle.grid[rowIndex * puzzle.rows + colIndex] === "." ? "black" : "white",
                              border: "0.5px solid grey",
                              "&:hover": {
                                backgroundColor: puzzle.grid[rowIndex * puzzle.rows + colIndex] === "." ? "black" : "gray",
                                opacity: [0.9, 0.8, 0.7],
                              },
                            }}
                          >
                            <Grid item xs={12} justifyContent="center">
                              <Badge
                                sx={{ margin: 1, fontSize: 1, color: "gray" }}
                                anchorOrigin={{
                                  vertical: "top",
                                  horizontal: "left",
                                }}
                                badgeContent={
                                  puzzle.gridnums[rowIndex * puzzle.rows + colIndex] !== 0
                                    ? puzzle.gridnums[rowIndex * puzzle.rows + colIndex]
                                    : ""
                                }
                                color="default"
                              ></Badge>
                              <Grid container spacing={0} justifyContent="center">
                                <b>{puzzle.guess[rowIndex * puzzle.rows + colIndex]}</b>
                              </Grid>
                            </Grid>
                          </Box>
                        </Grid>
                      ))}
                    </Grid>
                  </div>
                ))}
              </Grid>
              <Grid item xs={3}>
                <List dense={true}>
                  <ListItem>
                    <b>{"DOWN"}</b>
                  </ListItem>
                  {Object.keys(puzzle.down).map((val, index) => (
                    <ListItem>
                      <ListItemText primary={val + ". " + puzzle.down[val].clue} />
                    </ListItem>
                  ))}
                </List>
              </Grid>
            </Grid>
          )}
          {puzzle && width < 1300 && (
            <Grid container>
              <Grid item xs={12}>
                {Array.from({ length: puzzle.rows }).map((row, rowIndex) => (
                  <div key={rowIndex}>
                    <Grid container justifyContent="center">
                      {Array.from({ length: puzzle.columns }).map((column, colIndex) => (
                        <Grid key={rowIndex + "-" + colIndex} item>
                          <Box
                            sx={{
                              width: width < 700 ? 22 : 35,
                              height: width < 700 ? 35 : 35,
                              backgroundColor: puzzle.grid[rowIndex * puzzle.rows + colIndex] === "." ? "black" : "white",
                              border: "0.5px solid grey",
                              "&:hover": {
                                backgroundColor: puzzle.grid[rowIndex * puzzle.rows + colIndex] === "." ? "black" : "gray",
                                opacity: [0.9, 0.8, 0.7],
                              },
                            }}
                          >
                            <Grid item xs={12} justifyContent="center">
                              <Badge
                                sx={{ margin: 1, color: "gray" }}
                                anchorOrigin={{
                                  vertical: "top",
                                  horizontal: "left",
                                }}
                                badgeContent={
                                  puzzle.gridnums[rowIndex * puzzle.rows + colIndex] !== 0
                                    ? puzzle.gridnums[rowIndex * puzzle.rows + colIndex]
                                    : ""
                                }
                                color="default"
                              ></Badge>
                              <Grid
                                sx={{ fontSize: 14 }}
                                container
                                spacing={0}
                                direction="column"
                                alignItems="center"
                                justifyContent="center"
                              >
                                <b>{puzzle.guess[rowIndex * puzzle.rows + colIndex]}</b>
                              </Grid>
                            </Grid>
                          </Box>
                        </Grid>
                      ))}
                    </Grid>
                  </div>
                ))}
              </Grid>
              <Grid item xs={6}>
                <List dense={true}>
                  <ListItem>
                    <b>{"ACROSS"}</b>
                  </ListItem>
                  {Object.keys(puzzle.across).map((val, index) => (
                    <ListItem>
                      <ListItemText primary={val + ". " + puzzle.across[val].clue} />
                    </ListItem>
                  ))}
                </List>
              </Grid>
              <Grid item xs={6}>
                <List dense={true}>
                  <ListItem>
                    <b>{"DOWN"}</b>
                  </ListItem>
                  {Object.keys(puzzle.down).map((val, index) => (
                    <ListItem>
                      <ListItemText primary={val + ". " + puzzle.down[val].clue} />
                    </ListItem>
                  ))}
                </List>
              </Grid>
            </Grid>
          )}
        </Grid>
      </Grid>
    </div>
  );
};

export default Crosswords;
