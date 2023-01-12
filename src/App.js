/*global chrome*/
import React, { useEffect, useState } from "react";
import "./App.css";
import { Box, Button, Container, Grid, Paper, TextField } from "@mui/material";
import AutorenewIcon from "@mui/icons-material/Autorenew";
import { Configuration, OpenAIApi } from "openai";

function App() {
  const [isLoading, setIsLoading] = useState(false);
  const [prompt, setPrompt] = useState("");
  const [response, setResponse] = useState("");

  const configuration = new Configuration({
    apiKey: "YOUR-API-KEY",
  });

  const openai = new OpenAIApi(configuration);

  useEffect(() => {
    CurrentTab();
  }, []);

  async function CurrentTab() {
    const currentTab = await chrome.tabs.query({ active: true, currentWindow: true });
    setPrompt(currentTab[0].url);
  }

  async function afterSubmit() {
    setIsLoading(true);

    try {
      const completion = await openai.createCompletion({
        model: "text-davinci-003",
        prompt: "Summarize this article in 3 bullet points: " + prompt,
        max_tokens: 200,
      });
      setResponse(completion.data.choices[0].text);
      setIsLoading(false);
    } catch (e) {
      alert("Error: ", e);
      setIsLoading(false);
    }
  }

  return (
    <Container>
      <Box sx={{ width: "100%", mt: 4 }}>
        <Grid container>
          <Grid item xs={12}>
            <TextField
              fullWidth
              autoFocus
              label="Your text"
              variant="outlined"
              rows={3}
              margin="normal"
              value={prompt}
              onChange={(e) => {
                setPrompt(e.target.value);
              }}
            />
            <Button
              fullWidth
              disableElevation
              variant="contained"
              onClick={() => afterSubmit()}
              disabled={isLoading}
              startIcon={
                isLoading && (
                  <AutorenewIcon
                    sx={{
                      animation: "spin 2s linear infinite",
                      "@keyframes spin": {
                        "0%": {
                          transform: "rotate(360deg)",
                        },
                        "100%": {
                          transform: "rotate(0deg)",
                        },
                      },
                    }}
                  />
                )
              }
            >
              Submit
            </Button>
          </Grid>
          <Grid item xs={12} sx={{ mt: 3 }}>
            <Paper sx={{ p: 3 }}>{response}</Paper>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
}

export default App;
