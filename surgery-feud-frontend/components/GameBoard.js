// GameBoard.js
import React from 'react';
import { View, StyleSheet } from 'react-native';
import AnswerTile from './AnswerTile';

export default function GameBoard({ answers, onRevealAnswer }) {
    // Create an array of 8 items to represent the grid
    const gridItems = Array(8).fill(null);

    // Fill the grid with the answers
    for (let i = 0; i < answers.length && i < 8; i++) {
        gridItems[i] = answers[i];
    }

    // Split the gridItems into two columns
    const leftColumn = gridItems.slice(0, 4);
    const rightColumn = gridItems.slice(4, 8);

    return (
        <View style={styles.board}>
            <View style={styles.column}>
                {leftColumn.map((answer, index) => (
                    <AnswerTile
                        key={`left-answer-${index}`}
                        index={index} // Indices 0 to 3
                        answer={answer}
                        revealed={answer ? answer.revealed : false}
                        onReveal={() => onRevealAnswer(index)}
                    />
                ))}
            </View>
            <View style={styles.column}>
                {rightColumn.map((answer, index) => (
                    <AnswerTile
                        key={`right-answer-${index + 4}`}
                        index={index + 4} // Indices 4 to 7
                        answer={answer}
                        revealed={answer ? answer.revealed : false}
                        onReveal={() => onRevealAnswer(index + 4)}
                    />
                ))}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    board: {
        flexDirection: 'row',
        width: '100%',
        justifyContent: 'space-between',
        marginTop: 10,
    },
    column: {
        flex: 1,
    },
});
