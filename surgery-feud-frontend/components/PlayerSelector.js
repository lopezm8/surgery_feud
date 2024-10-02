import React from 'react';
import { View, Pressable, Text, StyleSheet, Dimensions } from 'react-native';

const { width } = Dimensions.get('window'); // Get screen width


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
                <Text style={styles.playerText} adjustsFontSizeToFit minimumFontScale={0.5}>
                    Rebel MDs
                </Text>
            </Pressable>
            <Pressable
                style={({ pressed }) => [
                    styles.playerBox,
                    { opacity: pressed ? 0.8 : 1, alignSelf: 'flex-end' },
                ]}
                onPress={() => onSelectPlayer('player2')}
            >
                <Text style={styles.playerText} adjustsFontSizeToFit minimumFontScale={0.5}>
                    Time Out Champions
                </Text>
            </Pressable>
        </View>
    );
}

const dynamicFontSize = width < 360 ? width * 0.04 : 24;

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
        fontWeight: 'bold',
        textAlign: 'center',
        paddingHorizontal: 12, // Increase padding to prevent overflow
        adjustsFontSizeToFit: true,
        minimumFontScale: 0.5,
        numberOfLines: 1, // Prevent text from wrapping into multiple lines
        fontSize: dynamicFontSize, // Dynamic size based on screen width
    },
});
