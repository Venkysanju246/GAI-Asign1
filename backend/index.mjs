import express from 'express';
import fetch from 'node-fetch';
import { config } from 'dotenv'; // Import the config function from dotenv
const app = express();
app.use(express.json());

config(); // Load environment variables from .env

const API_KEY = process.env.API_KEY;

app.post('/send-msg', (req, res) => {
    // Your fetch request code
    const query = req.body.query;

    fetch(`https://api.openai.com/v1/completions`, {
        method: "POST",
        headers: {
            Authorization: `Bearer ${API_KEY}`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            model: "text-davinci-003",
            prompt: `Act like Artificial Inteligence and Analyse this query ${query} and send back the appropriate response`,
            max_tokens: 100,
        }),
    })
    .then((response) => response.json())
    .then((data) => {
        console.log(data);
        if (data.choices && data.choices.length > 0) {
            const allQuestions = data.choices[0].text.split("\n");
            const filteredQuestions = allQuestions.filter((question) => question.trim() !== "");
            res.send({ questions: filteredQuestions });
        } else {
            console.log("No valid choices found in the response.");
            res.status(500).send('An error occurred');
        }
    })
    .catch((err) => {
        console.log(err.message);
        res.status(500).send('An error occurred');
    });
});

app.listen(4000, () => {
    console.log('listening on port 4000');
});
