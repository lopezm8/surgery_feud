// GameSelector.js
import React from 'react';
import { View, Pressable, Text, StyleSheet } from 'react-native';

export default function GameSelector({ games, onSelectGame }) {
    return (
        <View style={styles.container}>
            {games.map((game, index) => (
                <Pressable
                    key={game._id}
                    style={({ pressed }) => [
                        styles.gameButton,
                        { backgroundColor: pressed ? '#388E3C' : '#4CAF50' },
                    ]}
                    onPress={() => onSelectGame(game)}
                >
                    <Text style={styles.gameButtonText}>{index + 1}</Text>
                </Pressable>
            ))}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginVertical: 10,
    },
    gameButton: {
        backgroundColor: '#4CAF50',
        marginHorizontal: 5,
        padding: 15,
        alignItems: 'center',
        borderRadius: 5,
    },
    gameButtonText: {
        color: '#fff',
        fontSize: 18,
    },
});
