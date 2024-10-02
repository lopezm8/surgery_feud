// seed.js
const mongoose = require('mongoose');
require('dotenv').config(); // Load environment variables from .env file

mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

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

const seedGames = [
    {
        title: 'Surgery Feud Game 1',
        questions: [
            {
                question: 'What are the three minimum requirements for the Time Out?',
                answers: [
                    { answer: 'Patient Name', points: 45, revealed: false },
                    { answer: 'Procedure', points: 35, revealed: false },
                    { answer: 'Side/Site', points: 20, revealed: false },
                ]
            },
            // Add more questions if desired
        ]
    },
    {
        title: 'Surgery Feud Game 2',
        questions: [
            {
                question: 'Who are the participants of the Time Out?',
                answers: [
                    { answer: 'Surgeon', points: 35, revealed: false },
                    { answer: 'Anesthesia', points: 25, revealed: false },
                    { answer: 'Nurse', points: 20, revealed: false },
                    { answer: 'Surgical Tech', points: 20, revealed: false },
                ]
            },
            // Add more questions if desired
        ]
    },
    {
        title: 'Surgery Feud Game 3',
        questions: [
            {
                question: 'What was the initial overall Time Out compliance in January 2024?',
                answers: [
                    { answer: '23%', points: 100, revealed: false },
                ]
            },
            // Add more questions if desired
        ]
    },
    {
        title: 'Surgery Feud Game 4',
        questions: [
            {
                question: 'How much does it cost the organization for wrong site surgery?',
                answers: [
                    { answer: '$136,000', points: 100, revealed: false },
                ]
            },
            // Add more questions if desired
        ]
    },
    {
        title: 'Surgery Feud Game 5',
        questions: [
            {
                question: 'Name one intervention the O.R. Team implemented in Quarter 2.',
                answers: [
                    { answer: 'Standardized the Time Out process', points: 35, revealed: false },
                    { answer: 'Educated staff on Time Out elements', points: 25, revealed: false },
                    { answer: 'Placed magnets with T.O. elements on whiteboards', points: 20, revealed: false },
                    { answer: 'Turned off music during T.O.', points: 15, revealed: false },
                    { answer: 'Defined roles for the OR team', points: 5, revealed: false },
                ]
            },
            // Add more questions if desired
        ]
    },
];

const seedDB = async () => {
    await Game.deleteMany({});
    await Game.insertMany(seedGames);
    console.log('Database Seeded');
};

seedDB().then(() => {
    mongoose.connection.close();
});
