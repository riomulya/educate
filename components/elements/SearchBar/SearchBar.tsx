import React from 'react';
import { View, TextInput, StyleSheet, TouchableOpacity, Text } from 'react-native';
import { colors } from '@/theme/colors';

interface SearchBarProps {
    value: string;
    onChangeText: (text: string) => void;
    placeholder?: string;
    onClear?: () => void;
    showClearButton?: boolean;
}

export default function SearchBar({
    value,
    onChangeText,
    placeholder = 'Cari...',
    onClear,
    showClearButton = true,
}: SearchBarProps) {
    const handleClear = () => {
        onChangeText('');
        onClear?.();
    };

    return (
        <View style={styles.container}>
            <Text style={styles.searchIcon}>🔍</Text>
            <TextInput
                style={styles.input}
                placeholder={placeholder}
                value={value}
                onChangeText={onChangeText}
                placeholderTextColor={colors.gray}
            />
            {showClearButton && value.length > 0 && (
                <TouchableOpacity style={styles.clearButton} onPress={handleClear}>
                    <Text style={styles.clearIcon}>✕</Text>
                </TouchableOpacity>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.white,
        borderRadius: 12,
        paddingHorizontal: 16,
        marginHorizontal: 16,
        marginVertical: 8,
        shadowColor: colors.black,
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    searchIcon: {
        fontSize: 18,
        marginRight: 12,
    },
    input: {
        flex: 1,
        fontSize: 16,
        color: colors.blackGray,
        paddingVertical: 12,
    },
    clearButton: {
        padding: 4,
        marginLeft: 8,
    },
    clearIcon: {
        fontSize: 16,
        color: colors.gray,
    },
}); 