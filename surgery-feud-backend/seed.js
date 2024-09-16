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
                question: 'Common Reasons for Surgery',
                answers: [
                    { answer: 'Appendicitis', points: 30, revealed: false },
                    { answer: 'Gallstones', points: 25, revealed: false },
                    { answer: 'Hernia', points: 20, revealed: false },
                    { answer: 'Gallbladder Removal', points: 15, revealed: false },
                    { answer: 'Others', points: 10, revealed: false },
                ]
            },
            // Add more questions if desired
        ]
    },
    {
        title: 'Surgery Feud Game 2',
        questions: [
            {
                question: 'Types of Anesthesia',
                answers: [
                    { answer: 'General', points: 40, revealed: false },
                    { answer: 'Local', points: 30, revealed: false },
                    { answer: 'Regional', points: 20, revealed: false },
                    { answer: 'Sedation', points: 10, revealed: false },
                ]
            },
            // Add more questions if desired
        ]
    },
    {
        title: 'Surgery Feud Game 3',
        questions: [
            {
                question: 'Post-Surgery Instructions',
                answers: [
                    { answer: 'Rest', points: 35, revealed: false },
                    { answer: 'Medications', points: 25, revealed: false },
                    { answer: 'Follow-up Visit', points: 20, revealed: false },
                    { answer: 'Dietary Restrictions', points: 15, revealed: false },
                    { answer: 'Wound Care', points: 5, revealed: false },
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
