import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Alert, Pressable, Dimensions, ScrollView } from 'react-native';
import axios from 'axios';
import socket from './socket';
import { Audio } from 'expo-av';

import GameBoard from './components/GameBoard';
import GameSelector from './components/GameSelector';
import RevealButton from './components/RevealButton';
import RedXOverlay from './components/RedXOverlay';

const { width, height } = Dimensions.get('window'); // Get screen width and height

export default function App() {
    const [games, setGames] = useState([]);
    const [currentGame, setCurrentGame] = useState(null);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [scores, setScores] = useState({ player1: 0, player2: 0 });
    const [gameEnded, setGameEnded] = useState(false);
    const [sound, setSound] = useState();
    const [selectedPlayer, setSelectedPlayer] = useState(null);
    const [showRedX, setShowRedX] = useState(false);
    const [gameWinner, setGameWinner] = useState(''); // Added state for game winner

    useEffect(() => {
        // Fetch games from backend
        axios.get('https://surgery-feud-backend-790d5e52ce40.herokuapp.com/api/games')
            .then(response => setGames(response.data))
            .catch(error => console.log(error));

        // Listen to socket events
        socket.on('scoreUpdate', (data) => {
            setScores(data);
        });

        return () => {
            socket.off('scoreUpdate');
        };
    }, []);

    const selectGame = (game) => {
        const updatedQuestions = game.questions.map(q => {
            const updatedAnswers = q.answers.map(ans => ({ ...ans, revealed: false }));
            return { ...q, answers: updatedAnswers };
        });

        setCurrentGame({ ...game, questions: updatedQuestions });
        setCurrentQuestionIndex(0);
        setScores({ player1: 0, player2: 0 });
        setGameEnded(false);
        setSelectedPlayer(null);
        setShowRedX(false); // Reset Red X overlay if it's showing
        setGameWinner(''); // Reset game winner
    };

    const onRevealAnswer = (index) => {
        const question = currentGame.questions[currentQuestionIndex];
        const answer = question.answers[index];

        if (!answer.revealed) {
            const updatedAnswers = question.answers.map((ans, idx) => {
                if (idx === index) {
                    return { ...ans, revealed: true };
                }
                return ans;
            });

            const updatedQuestions = currentGame.questions.map((q, idx) => {
                if (idx === currentQuestionIndex) {
                    return { ...q, answers: updatedAnswers };
                }
                return q;
            });

            setCurrentGame({ ...currentGame, questions: updatedQuestions });

            if (selectedPlayer) {
                setScores(prevScores => {
                    const updatedScores = { ...prevScores };
                    updatedScores[selectedPlayer] += answer.points;
                    socket.emit('score', updatedScores);
                    return updatedScores;
                });
                setSelectedPlayer(null);
            }
        }
    };

    const onSelectPlayer = (player) => {
        setSelectedPlayer(player);
    };

    const onPressWrongAnswer = async () => {
        try {
            // Load and play the red X sound
            const { sound: redXSound } = await Audio.Sound.createAsync(
                require('./assets/red_x_sound.wav')
            );
            await redXSound.playAsync();

            // Show the red X overlay
            setShowRedX(true);
            setTimeout(() => {
                setShowRedX(false);
                redXSound.unloadAsync(); // Unload the sound after it plays
            }, 1000);
            
            setSelectedPlayer(null);
        } catch (error) {
            console.error("Error playing red X sound:", error);
        }
    };

    const onRevealAll = () => {
        const question = currentGame.questions[currentQuestionIndex];

        const updatedAnswers = question.answers.map(ans => {
            if (!ans.revealed) {
                return { ...ans, revealed: true };
            }
            return ans;
        });

        const updatedQuestions = currentGame.questions.map((q, idx) => {
            if (idx === currentQuestionIndex) {
                return { ...q, answers: updatedAnswers };
            }
            return q;
        });

        setCurrentGame({ ...currentGame, questions: updatedQuestions });
    };

    const onEndGame = () => {
        let winner;
        if (scores.player1 > scores.player2) {
            winner = 'Rebel MDs Win!';
        } else if (scores.player2 > scores.player1) {
            winner = 'Time Out Champions Win!';
        } else {
            winner = 'It\'s a tie!';
        }
        setGameEnded(true);
        setGameWinner(winner);
        playVictorySound();
        Alert.alert('Game Over', winner);
    };

    const playVictorySound = async () => {
        const { sound } = await Audio.Sound.createAsync(
            require('./assets/end_game.wav')
        );
        setSound(sound);
        await sound.playAsync();
    };

    useEffect(() => {
        return sound
            ? () => {
                sound.unloadAsync();
            }
            : undefined;
    }, [sound]);

    if (!currentGame) {
        return (
            <View style={styles.container}>
                <View style={styles.titleContainer}>
                    <Text style={styles.titleText}>Select a Game</Text>
                </View>
                <GameSelector games={games} onSelectGame={selectGame} />
            </View>
        );
    }

    if (gameEnded) {
        return (
            <View style={styles.container}>
                <View style={styles.titleContainer}>
                    <Text style={styles.titleText}>Game Over!</Text>
                </View>
                <Text style={styles.score}>Rebel MDs: {scores.player1}</Text>
                <Text style={styles.score}>Time Out Champions: {scores.player2}</Text>
                <View style={styles.titleContainer}>
                    <Text style={styles.titleText}>{gameWinner}</Text>
                </View>
                <GameSelector games={games} onSelectGame={selectGame} />
            </View>
        );
    }

    const currentQuestion = currentGame.questions[currentQuestionIndex];

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <View style={styles.titleContainer}>
                <Text style={styles.titleText}>Surgery Feud</Text>
            </View>

            <View style={styles.mainContent}>
                <View style={styles.playerScoreLeft}>
                    <View style={styles.playerScoreContainer}>
                        <Text style={styles.playerScoreText}>{scores.player1}</Text>
                    </View>
                </View>

                <View style={styles.gameBoard}>
                <Text
                    style={styles.questionText}
                    adjustsFontSizeToFit
                    numberOfLines={2}
                    minimumFontScale={0.6}
                >
                    {currentQuestion.question}
                </Text>
                    <GameBoard answers={currentQuestion.answers} onRevealAnswer={onRevealAnswer} />
                </View>

                <View style={styles.playerScoreRight}>
                    <View style={styles.playerScoreContainer}>
                        <Text style={styles.playerScoreText}>{scores.player2}</Text>
                    </View>
                </View>
            </View>

            <View style={styles.bottomArea}>
                <View style={styles.bottomRow}>
                    <Pressable
                        style={({ pressed }) => [
                            styles.playerButton,
                            selectedPlayer === 'player1' && styles.playerButtonSelected,
                            pressed && styles.playerButtonPressed,
                        ]}
                        onPress={() => onSelectPlayer('player1')}
                    >
                        <Text style={styles.playerText}>Rebel MDs</Text>
                    </Pressable>
                    <Pressable style={styles.xButton} onPress={onPressWrongAnswer}>
                        <Text style={styles.xButtonText}>X</Text>
                    </Pressable>
                    <Pressable
                        style={({ pressed }) => [
                            styles.playerButton,
                            selectedPlayer === 'player2' && styles.playerButtonSelected,
                            pressed && styles.playerButtonPressed,
                        ]}
                        onPress={() => onSelectPlayer('player2')}
                    >
                        <Text style={styles.playerText}>Time Out Champions</Text>
                    </Pressable>
                </View>
                <RevealButton onRevealAll={onRevealAll} />
                <Pressable
                    style={({ pressed }) => [
                        styles.endGameButton,
                        { opacity: pressed ? 0.8 : 1 },
                    ]}
                    onPress={onEndGame}
                >
                    <Text style={styles.endGameButtonText}>End Game</Text>
                </Pressable>
            </View>

            <GameSelector games={games} onSelectGame={selectGame} />
            <RedXOverlay visible={showRedX} onDismiss={() => setShowRedX(false)} />
        </ScrollView>
    );
}

const dynamicFontSize = width < 360 ? width * 0.04 : 26;

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        backgroundColor: '#1B1F3B',
        alignItems: 'center',
        justifyContent: 'center',
    },
    titleContainer: {
        marginTop: 20,
        borderWidth: 5,
        borderColor: '#FFD700',
        borderRadius: 10,
        paddingHorizontal: 20,
        paddingVertical: 5,
        backgroundColor: '#1B1F3B',
    },
    titleText: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#FFFFFF',
        textAlign: 'center',
    },
    mainContent: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        paddingVertical: 10,
    },
    playerScoreLeft: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        height: '100%',
        marginRight: 10, // Add margin between score and board
    },
    playerScoreRight: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        height: '100%',
        marginLeft: 10, // Add margin between score and board
    },
    playerScoreContainer: {
        width: 80,
        height: 80,
        borderRadius: 10,
        backgroundColor: '#003F7D',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 3,
        borderColor: '#FFD700',
        marginHorizontal: 20,  // Increased margin to avoid overlap with the board
    },
    playerScoreText: {
        color: '#FFFFFF',
        fontWeight: 'bold',
        textAlign: 'center',
        adjustsFontSizeToFit: true,
        minimumFontScale: 0.5,
        numberOfLines: 1,  
        fontSize: dynamicFontSize,
    },
    gameBoard: {
        width: '80%',
        backgroundColor: '#1B1F3B',
        borderRadius: 20,
        marginVertical: 20,
        borderWidth: 5,
        borderColor: '#FFD700',
        alignItems: 'center',
        paddingVertical: 10,
    },
    questionText: {
        color: '#FFFFFF',
        textAlign: 'center',
        flexWrap: 'wrap',
        adjustsFontSizeToFit: true, 
        minimumFontScale: 0.5,  // Smaller scaling for smaller screens
        numberOfLines: 2,  
        paddingHorizontal: 15,  // Adjusted padding to prevent overflow
        fontSize: dynamicFontSize, 
    },
    bottomArea: {
        width: '100%',
        alignItems: 'center',
        marginTop: 10,
    },
    bottomRow: {
        flexDirection: 'row',
        width: '90%',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    playerButton: {
        width: '30%',
        padding: 10,
        backgroundColor: '#005BB5',
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#FFD700',
        justifyContent: 'center',
        alignItems: 'center',
    },
    playerButtonSelected: {
        backgroundColor: '#003F7D',
        borderColor: '#FFD700',
        borderWidth: 2,
    },
    playerButtonPressed: {
        opacity: 0.8,
    },
    playerText: {
        color: '#FFFFFF', 
        fontSize: width > 360 ? 26 : width * 0.04,  
        fontWeight: 'bold',  
        textAlign: 'center',  
    },
    xButton: {
        width: '20%',
        backgroundColor: '#FFFFFF',
        padding: 10,
        alignItems: 'center',
        borderRadius: 5,
        borderColor: '#FF0000',
        borderWidth: 2,
    },
    xButtonText: {
        color: '#FF0000',
        fontSize: 24,
        fontWeight: 'bold',
    },
    endGameButton: {
        backgroundColor: '#FFFFFF',
        padding: 10,
        alignItems: 'center',
        borderRadius: 10,
        borderColor: '#003F7D',
        borderWidth: 2,
        width: '60%',
        marginTop: 5,
    },
    endGameButtonText: {
        color: '#000000',
        fontSize: 18,
        fontWeight: 'bold',
    },
    score: {
        fontSize: 26,
        marginVertical: 5,
        color: '#FFFFFF',
    },
    winnerText: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#FFFFFF',
        marginVertical: 20,
    },
});
