/* eslint-disable react-hooks/exhaustive-deps */
import Wordle from "./Wordle";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import { ReactNode, SyntheticEvent, useEffect, useState } from "react";
import { Box, Grid } from "@mui/material";
import { useDispatch } from "react-redux";
import { loadCrosswordsPuzzle, loadSudokuPuzzle, loadWordleWord } from "../store";
import Crosswords from "./Crosswords";
import MicNoneIcon from "@mui/icons-material/MicNone";
import Sudoku from "./Sudoku";

interface TabPanelProps {
  children?: ReactNode;
  index: number;
  value: number;
}

export interface GamesProps {
  transcript: string;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index } = props;

  return (
    <div role="tabpanel" hidden={value !== index}>
      {value === index && children}
    </div>
  );
}

export const Games: React.FunctionComponent<GamesProps> = ({ transcript }) => {
  const dispatch = useDispatch();

  const [value, setValue] = useState(0);

  const handleChange = (event: SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  useEffect(() => {
    dispatch(loadCrosswordsPuzzle());
    dispatch(loadWordleWord());
    dispatch(loadSudokuPuzzle());
  });

  return (
    <div>
      <header>
        <br />
        <Grid container justifyContent={"center"}>
          <MicNoneIcon color="primary" />
          <b>{transcript}</b>
        </Grid>
        <hr />
      </header>
      <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
        <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
          <Tab label="Crosswords" />
          <Tab label="Wordle" />
          <Tab label="Sudoku" />
        </Tabs>
      </Box>
      <TabPanel value={value} index={0}>
        <Crosswords transcript={transcript} />
      </TabPanel>
      <TabPanel value={value} index={1}>
        <Wordle transcript={transcript} />
      </TabPanel>
      <TabPanel value={value} index={2}>
        <Sudoku transcript={transcript} />
      </TabPanel>
    </div>
  );
};
