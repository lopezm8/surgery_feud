// server.js
const express = require('express');
const http = require('http');
const cors = require('cors');
const mongoose = require('mongoose');
const socketIo = require('socket.io');
require('dotenv').config(); // Load environment variables from .env file

// Initialize Express
const app = express();

// Enable CORS
app.use(cors({
    origin: '*', // Allow all origins during development
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
}));

app.use(express.json());

// Connect to MongoDB using the connection string from the .env file
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => console.log('MongoDB Connected'))
  .catch(err => console.log(err));

// Define Schemas
const GameSchema = new mongoose.Schema({
    title: String,
    questions: [
        {
            question: String,
            answers: [
                { answer: String, points: Number, revealed: Boolean }
            ]
        }
    ]
});

const Game = mongoose.model('Game', GameSchema);

// API Routes
app.get('/api/games', async (req, res) => {
    try {
        const games = await Game.find();
        res.json(games);
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
});

app.post('/api/games', async (req, res) => {
    try {
        const newGame = new Game(req.body);
        await newGame.save();
        res.json(newGame);
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
});

// Create HTTP server and setup Socket.io
const server = http.createServer(app);
const io = socketIo(server, {
    cors: {
        origin: '*', // Allow all origins during development
        methods: ['GET', 'POST'],
        credentials: true
    },
    transports: ['websocket', 'polling'] // Allow both transports
});

// Socket.io Connection
io.on('connection', (socket) => {
    console.log('New client connected');

    // Handle scoring
    socket.on('score', (data) => {
        io.emit('scoreUpdate', data);
    });

    // Handle game end
    socket.on('endGame', (data) => {
        io.emit('gameEnd', data);
    });

    socket.on('disconnect', () => {
        console.log('Client disconnected');
    });
});

// Start Server
const PORT = process.env.PORT || 5001;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
