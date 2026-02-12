//for open api key

// // backend/sketchnest.js

// require('dotenv').config({ path: '.env' }); // point to main .env
// const express = require('express');
// const router = express.Router();
// const axios = require('axios');

// const apiKey = process.env.OPENAI_API_KEY;

// // Log if API key is loaded
// console.log("OpenAI Key:", apiKey ? "Loaded ✅" : "Missing ❌");

// // POST /api/sketchbot/chat
// router.post('/chat', async (req, res) => {
//     const { message } = req.body;

//     if (!message || message.trim() === '') {
//         return res.status(400).json({ error: "No message provided" });
//     }

//     if (!apiKey) {
//         return res.status(500).json({ error: "OpenAI API key not configured" });
//     }

//     try {
//         const response = await axios.post(
//     'https://api.openai.com/v1/chat/completions',
//     {
//         model: "gpt-3.5-turbo", // use this instead
//         messages: [
//             { role: "system", content: "You are SketchBot, an expert in sketching..." },
//             { role: "user", content: message }
//         ],
//         max_tokens: 500
//     },
//     {
//         headers: {
//             'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
//             'Content-Type': 'application/json'
//         }
//     }
// );


//         const answer = response.data.choices[0]?.message?.content || "⚠️ Sorry, I couldn't generate a response.";
//         res.json({ answer });

//     } catch (error) {
//         console.error("SketchBot API error:", error.response?.data || error.message);
//         res.status(500).json({ error: 'Failed to fetch AI response' });
//     }
// });

// module.exports = router;





//for hugging api


// require('dotenv').config({ path: '.env' });
// const express = require('express');
// const router = express.Router();
// const axios = require('axios');

// console.log("🔑 Hugging Face Key:", process.env.HUGGINGFACE_API_KEY ? "Loaded ✅" : "Missing ❌");

// // Hugging Face model endpoint
// const HF_MODEL_URL = "https://api-inference.huggingface.co/models/mistralai/Mistral-7B-Instruct-v0.2";

// // Debug all requests to this router
// router.use((req, res, next) => {
//   console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`);
//   next();
// });

// // Chat endpoint
// router.post('/chat', async (req, res) => {
//   const { message } = req.body;

//   // Log incoming message
//   console.log("\n🟢 Incoming Chat Request:");
//   console.log("User message:", message);

//   if (!message) {
//     console.log("⚠️ No message provided");
//     return res.status(400).json({ error: "No message provided" });
//   }

//   try {
//     console.log("📤 Sending request to Hugging Face API...");

//     const response = await axios.post(
//       HF_MODEL_URL,
//       { inputs: message },
//       {
//         headers: {
//           Authorization: `Bearer ${process.env.HUGGINGFACE_API_KEY}`,
//           'Content-Type': 'application/json',
//         },
//       }
//     );

//     console.log("📥 Hugging Face API Response Received:");
//     console.dir(response.data, { depth: null });

//     const answer = response.data[0]?.generated_text || "No response received from model.";
//     console.log("💬 SketchBot Reply:", answer);

//     res.json({ answer });
//   } catch (error) {
//     console.error("❌ SketchBot API Error:");
//     console.error(error.response?.data || error.message);
//     res.status(500).json({ error: "Failed to fetch AI response" });
//   }
// });

// module.exports = router;


//RapidApi

const express = require("express");
const router = express.Router();
const axios = require("axios");

require("dotenv").config();

router.post("/chat", async (req, res) => {
    const userMessage = req.body.message || "Hello";

    try {
        const response = await axios({
            method: "POST",
            url: "https://chatgpt-42.p.rapidapi.com/conversationgpt4-2",
            headers: {
                "content-type": "application/json",
                "X-RapidAPI-Key": process.env.RAPIDAPI_KEY,
                "X-RapidAPI-Host": process.env.RAPIDAPI_HOST,
            },
            data: {
                model: "gpt-3.5-turbo",
                messages: [
                    { role: "system", content: "You are SketchNest AI Assistant." },
                    { role: "user", content: userMessage }
                ],
                max_tokens: 200
            }
        });

        // Send API response back to frontend
        const botReply = response.data.choices[0].message.content;
        res.json({ reply: botReply });

    } catch (error) {
        console.error("RapidAPI ChatBot Error:", error.response?.data || error.message);
        res.status(500).json({ error: "Chatbot failed" });
    }
});

module.exports = router;


// Helper to append messages
function appendMessage(sender, text) {
    const msgRow = document.createElement('div');
    msgRow.className = `message-row ${sender}`;

    const avatar = document.createElement('img');
    avatar.className = 'avatar';
    avatar.src = sender === 'user'
        ? 'https://cdn-icons-png.flaticon.com/512/4333/4333609.png'
        : 'image/bott.png';

    const msgDiv = document.createElement('div');
    msgDiv.className = sender === 'user' ? 'user-msg' : 'bot-msg';
    msgDiv.textContent = text;

    msgRow.appendChild(avatar);
    msgRow.appendChild(msgDiv);

    const messages = document.getElementById('messages');
    messages.appendChild(msgRow);
    messages.scrollTop = messages.scrollHeight;
}

// Send message to backend SketchBot API
async function sendMessage() {
    const input = document.getElementById('user-input');
    const message = input.value.trim();
    if (!message) return;

    appendMessage('user', message);
    input.value = '';

    try {
        const res = await fetch("/api/sketchbot/chat", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ message })
        });

        const data = await res.json();
        appendMessage('bot', data.reply || "Sorry, I couldn't respond.");
    } catch (err) {
        console.error("Error calling SketchBot:", err);
        appendMessage('bot', "Error: Could not get reply.");
    }
}



function sendMessage() {
    const input = document.getElementById('user-input');
    const message = input.value.trim();

    if (!message) return; // Do nothing if input is empty

    // Add user message to chat
    appendMessage('user', message);

    // Clear input box
    input.value = '';

    // Send to backend API (your SketchBot)
    sendToSketchBot(message).then(reply => {
        appendMessage('bot', reply);
    });
}

// Append message to chat container
function appendMessage(sender, text) {
    const msgRow = document.createElement('div');
    msgRow.className = `message-row ${sender}`;

    const avatar = document.createElement('img');
    avatar.className = 'avatar';
    avatar.src = sender === 'user' ? 'https://cdn-icons-png.flaticon.com/512/4333/4333609.png' : 'image/bott.png';

    const msgDiv = document.createElement('div');
    msgDiv.className = sender === 'user' ? 'user-msg' : 'bot-msg';
    msgDiv.textContent = text;

    msgRow.appendChild(avatar);
    msgRow.appendChild(msgDiv);

    const messages = document.getElementById('messages');
    messages.appendChild(msgRow);
    messages.scrollTop = messages.scrollHeight; // Scroll to bottom
}
