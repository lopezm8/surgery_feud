// RevealButton.js
import React from 'react';
import { Pressable, Text, StyleSheet } from 'react-native';
import { Audio } from 'expo-av';
import revealSound from '../assets/reveal_answer.wav';

export default function RevealButton({ onRevealAll }) {

    const playSound = async () => {
        try {
            const { sound } = await Audio.Sound.createAsync(revealSound);
            await sound.playAsync();
            sound.setOnPlaybackStatusUpdate((status) => {
                if (status.didJustFinish) {
                    sound.unloadAsync();
                }
            });
        } catch (error) {
            console.error('Error playing sound:', error);
        }
    };

    const handlePress = async () => {
        await playSound();  // Play the sound when the button is pressed
        if (onRevealAll) onRevealAll();  // Call the onRevealAll function
    };

    return (
        <Pressable
            style={({ pressed }) => [
                styles.button,
                { backgroundColor: pressed ? '#66B3FF' : '#FFFFFF' },
            ]}
            onPress={handlePress}
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
