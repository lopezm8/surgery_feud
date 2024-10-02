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
                                style={styles.answerText}
                                adjustsFontSizeToFit
                                numberOfLines={2}
                                minimumFontScale={0.5} // Allow font size to scale down to 50%
                            >
                                {answer.answer.toUpperCase()}
                            </Text>
                        </View>
                        <View style={styles.pointsContainer}>
                            <Text style={styles.pointsText} adjustsFontSizeToFit minimumFontScale={0.5}>
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
        paddingLeft: 10,
        paddingRight: 10,
    },
    answerText: {
        color: '#FFFFFF',
        fontSize: width * 0.04, // Dynamically scale font size
        fontWeight: 'bold',
        textAlign: 'center',
        flexShrink: 1,
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
    },
    pointsText: {
        color: '#FFFFFF',
        fontSize: width * 0.03, // Dynamically scale font size
        fontWeight: 'bold',
        textAlign: 'center',
    },
    numberText: {
        color: '#FFFFFF',
        fontSize: width * 0.05, // Dynamically scale font size
        fontWeight: 'bold',
    },
    emptyTile: {
        backgroundColor: '#005BB5',
        borderRadius: 10,
    },
});
