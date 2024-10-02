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
                <Text
                    style={styles.playerText}
                    adjustsFontSizeToFit
                    minimumFontScale={0.6}
                    numberOfLines={2}
                    ellipsizeMode="tail"
                >
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
                <Text
                    style={styles.playerText}
                    adjustsFontSizeToFit
                    minimumFontScale={0.6}
                    numberOfLines={2}
                    ellipsizeMode="tail"
                >
                    Time Out Champions
                </Text>
            </Pressable>
        </View>
    );
}

const dynamicFontSize = width < 360 ? width * 0.035 : 24;

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        width: '80%',
        justifyContent: 'space-between',
    },
    playerBox: {
        width: '40%',
        paddingVertical: 8,  
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
        fontSize: 26, // Desired font size if possible
        adjustsFontSizeToFit: true,
        minimumFontScale: 0.6, // Adjust if font needs to be smaller
        numberOfLines: 2, // Allow text to wrap
        ellipsizeMode: 'tail',
    },     
});
