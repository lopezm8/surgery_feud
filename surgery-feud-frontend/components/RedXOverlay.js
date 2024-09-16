// RedXOverlay.js
import React from 'react';
import { View, Text, StyleSheet, Modal } from 'react-native';

export default function RedXOverlay({ visible, onDismiss }) {
    return (
        <Modal
            transparent={true}
            animationType="fade"
            visible={visible}
            onRequestClose={onDismiss}
        >
            <View style={styles.overlay}>
                <View style={styles.xBox}>
                    <Text style={styles.xText}>X</Text>
                </View>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(255,255,255,0.8)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    xBox: {
        width: 100,
        height: 100,
        backgroundColor: '#FFFFFF',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: '#FF0000',
        borderRadius: 10,
    },
    xText: {
        fontSize: 72,
        color: '#FF0000',
        fontWeight: 'bold',
    },
});
