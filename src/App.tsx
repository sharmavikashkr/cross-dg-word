import CrossWords from "./games/CrossWords";
import Wordle from "./games/Wordle";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import { ReactNode, SyntheticEvent, useEffect, useState } from "react";
import { Box } from "@mui/material";

interface TabPanelProps {
  children?: ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index } = props;

  return (
    <div role="tabpanel" hidden={value !== index}>
      {value === index && children}
    </div>
  );
}

export default function App() {
  const [value, setValue] = useState(0);
  let socket: WebSocket;
  const mic: any = {};
  const [transcript, setTranscript] = useState("");

  const crosswordsGame = <CrossWords transcript={transcript} />;
  const wordleGame = <Wordle transcript={transcript} />;

  const handleChange = (event: SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  useEffect(() => {
    async function fetchData() {
      mic.stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      if (!MediaRecorder.isTypeSupported("audio/webm")) {
        alert("Browser not supported");
      }
      mic.mediaRecorder = new MediaRecorder(mic.stream, { mimeType: "audio/webm" });
      return mic.mediaRecorder;
    }

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
      }
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
  }, []);

  return (
    <div>
      <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
        <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
          <Tab label="CrossWords" />
          <Tab label="Wordle" />
        </Tabs>
      </Box>
      <TabPanel value={value} index={0}>
        {crosswordsGame}
      </TabPanel>
      <TabPanel value={value} index={1}>
        {wordleGame}
      </TabPanel>
    </div>
  );
}
