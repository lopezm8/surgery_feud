// RevealButton.js
import React from 'react';
import { Pressable, Text, StyleSheet } from 'react-native';

export default function RevealButton({ onRevealAll }) {
    return (
        <Pressable
            style={({ pressed }) => [
                styles.button,
                { backgroundColor: pressed ? '#66B3FF' : '#FFFFFF' },
            ]}
            onPress={onRevealAll}
        >
            <Text style={styles.buttonText}>Reveal Answers</Text>
        </Pressable>
    );
}

const styles = StyleSheet.create({
    button: {
        padding: 15,
        alignItems: 'center',
        borderRadius: 10,
        borderWidth: 2,
        borderColor: '#003F7D',
        width: '80%',
        marginVertical: 10,
    },
    buttonText: {
        color: '#000000',
        fontSize: 18,
        fontWeight: 'bold',
    },
});
