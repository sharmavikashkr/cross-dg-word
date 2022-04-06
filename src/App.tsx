/* eslint-disable react-hooks/exhaustive-deps */
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { Games } from "./games/Games";
import "./App.css";
import { useEffect, useState } from "react";
import { Grid } from "@mui/material";
import MicNoneIcon from "@mui/icons-material/MicNone";
import { useNavigate } from "react-router-dom";

export default function App() {
  let socket: WebSocket;
  const mic: any = {};
  const [transcript, setTranscript] = useState("");

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
      const key = await fetch("https://dgwordgames-api.azurewebsites.net/getKey").then((r) => r.text());
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
  }, []);

  return (
    <Router>
      <Routes>
        <Route path="/games" element={<Games transcript={transcript} />} />
        <Route path="/" element={<Home transcript={transcript} />} />
      </Routes>
    </Router>
  );
}

export interface HomeProps {
  transcript: string;
}

export const Home: React.FunctionComponent<HomeProps> = ({ transcript }) => {
  const navigate = useNavigate();

  useEffect(() => {
    if (transcript.includes("LET'S PLAY")) {
      navigate("/games");
    }
  }, [transcript]);

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
      <Grid container justifyContent={"center"}>
        <h1>say</h1>
      </Grid>
      <Grid container justifyContent={"center"}>
        <h2>"LET'S PLAY"</h2>
      </Grid>
      <Grid container justifyContent={"center"}>
        <h4>to start playing..</h4>
      </Grid>
    </div>
  );
};
