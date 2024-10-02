import React, { useState, useEffect } from 'react';
import { Pressable, View, Text, StyleSheet, Animated, Easing, Dimensions } from 'react-native';
import { Audio } from 'expo-av';
import revealSound from '../assets/reveal_answer.wav';

const { width } = Dimensions.get('window'); // Get screen width

export default function AnswerTile({ index, answer, revealed, onReveal }) {
    const [flipAnimation] = useState(new Animated.Value(0));

    const isFlippable = answer !== null;

    useEffect(() => {
        if (isFlippable) {
            Animated.timing(flipAnimation, {
                toValue: revealed ? 180 : 0,
                duration: 500,
                useNativeDriver: true,
                easing: Easing.inOut(Easing.ease),
            }).start();
        }
    }, [revealed]);

    const playSound = async () => {
        const { sound } = await Audio.Sound.createAsync(revealSound);
        await sound.playAsync();
        sound.setOnPlaybackStatusUpdate((status) => {
            if (status.didJustFinish) {
                sound.unloadAsync();
            }
        });
    };

    const flipTile = async () => {
        if (isFlippable && !revealed) {
            if (onReveal) onReveal();
            await playSound();
        }
    };

    const frontAnimatedStyle = {
        transform: [
            {
                rotateX: flipAnimation.interpolate({
                    inputRange: [0, 180],
                    outputRange: ['0deg', '180deg'],
                }),
            },
        ],
    };

    const backAnimatedStyle = {
        transform: [
            {
                rotateX: flipAnimation.interpolate({
                    inputRange: [0, 180],
                    outputRange: ['180deg', '360deg'],
                }),
            },
        ],
    };

    const dynamicFontSize = width < 360 ? width * 0.04 : 26;  // Smaller screens get a smaller font

    return (
        <Pressable onPress={flipTile} style={styles.container}>
            {isFlippable ? (
                <View style={styles.flipContainer}>
                    <Animated.View
                        style={[
                            styles.tile,
                            styles.hiddenContainer,
                            frontAnimatedStyle,
                            { backfaceVisibility: 'hidden' },
                        ]}
                    >
                        <Text style={styles.numberText}>{index + 1}</Text>
                    </Animated.View>

                    <Animated.View
                        style={[
                            styles.tile,
                            styles.revealedContainer,
                            backAnimatedStyle,
                            { backfaceVisibility: 'hidden', position: 'absolute', top: 0 },
                        ]}
                    >
                        <View style={styles.answerContainer}>
                            <Text
                                style={[styles.answerText, { fontSize: dynamicFontSize }]}  // Use dynamic font size
                                adjustsFontSizeToFit
                                numberOfLines={2}
                                minimumFontScale={0.6}
                                ellipsizeMode="tail"
                            >
                                {answer.answer.toUpperCase()}
                            </Text>
                        </View>
                        <View style={styles.pointsContainer}>
                            <Text 
                                style={[styles.pointsText, { fontSize: dynamicFontSize }]}  // Use dynamic font size
                                adjustsFontSizeToFit 
                                minimumFontScale={0.6}
                                numberOfLines={1}
                            >
                                {answer.points}
                            </Text>
                        </View>
                    </Animated.View>
                </View>
            ) : (
                <View style={[styles.tile, styles.emptyTile]} />
            )}
        </Pressable>
    );
}

const dynamicFontSize = width < 360 ? width * 0.03 : 26;  // Smaller screens get a smaller font

const styles = StyleSheet.create({
    container: {
        flex: 1,
        margin: 5,
        aspectRatio: 5,
    },
    flipContainer: {
        flex: 1,
    },
    tile: {
        flex: 1,
        width: '100%',
        borderRadius: 10,
        backfaceVisibility: 'hidden',
    },
    hiddenContainer: {
        backgroundColor: '#005BB5',
        alignItems: 'center',
        justifyContent: 'center',
    },
    revealedContainer: {
        backgroundColor: '#004A8F',
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#FFD700',
        justifyContent: 'space-between',
        position: 'absolute',
        top: 0,
        width: '100%',
        height: '100%',
    },
    answerContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 5, // Reduced padding to give more space
    },
    answerText: {
        color: '#FFFFFF',
        textAlign: 'center',
        fontWeight: 'bold',
        flexShrink: 1,
        fontSize: dynamicFontSize,
        adjustsFontSizeToFit: true,
        numberOfLines: 2,  // Ensure 2 lines max to prevent overflow
        minimumFontScale: 0.5,
    },
    pointsContainer: {
        backgroundColor: '#1B1F3B',
        borderRadius: 5,
        borderWidth: 1,
        borderColor: '#FFD700',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100%',
        width: 60,
        paddingHorizontal: 5, 
    },
    pointsText: {
        color: '#FFFFFF',
        fontSize: dynamicFontSize,  
        fontWeight: 'bold',
        textAlign: 'center',
        adjustsFontSizeToFit: true,
        minimumFontScale: 0.5,
    },
    numberText: {
        color: '#FFFFFF',
        fontWeight: 'bold',
        fontSize: 26,  
    },
    emptyTile: {
        backgroundColor: '#005BB5',
        borderRadius: 10,
    },
});
