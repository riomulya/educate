import React from 'react';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { colors } from '@/theme/colors';

interface LoadingProps {
    text?: string;
    size?: 'small' | 'large';
    color?: string;
    style?: any;
}

export default function Loading({
    text = 'Memuat...',
    size = 'large',
    color = colors.purple,
    style
}: LoadingProps) {
    return (
        <View style={[styles.container, style]}>
            <ActivityIndicator size={size} color={color} />
            {text && <Text style={[styles.text, { color }]}>{text}</Text>}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    text: {
        fontSize: 16,
        marginTop: 16,
        textAlign: 'center',
    },
}); 