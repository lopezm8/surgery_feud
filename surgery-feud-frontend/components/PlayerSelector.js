// PlayerSelector.js
import React from 'react';
import { View, Pressable, Text, StyleSheet } from 'react-native';

export default function PlayerSelector({ onSelectPlayer }) {
    return (
        <View style={styles.container}>
            <Pressable
                style={({ pressed }) => [
                    styles.playerBox,
                    { opacity: pressed ? 0.8 : 1, alignSelf: 'flex-start' },
                ]}
                onPress={() => onSelectPlayer('player1')}
            >
                <Text style={styles.playerText}>Player 1</Text>
            </Pressable>
            <Pressable
                style={({ pressed }) => [
                    styles.playerBox,
                    { opacity: pressed ? 0.8 : 1, alignSelf: 'flex-end' },
                ]}
                onPress={() => onSelectPlayer('player2')}
            >
                <Text style={styles.playerText}>Player 2</Text>
            </Pressable>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        width: '80%',
        justifyContent: 'space-between',
    },
    playerBox: {
        width: '40%',
        padding: 10,
        backgroundColor: '#005BB5',
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#FFD700',
        justifyContent: 'center',
        alignItems: 'center',
    },
    playerText: {
        color: '#FFFFFF',
        fontSize: 18,
        fontWeight: 'bold',
    },
});
