import React, { useState, useRef } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    TextInputProps,
} from 'react-native';
import { MotiView } from 'moti';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '@/theme/colors';

interface InputProps extends TextInputProps {
    label: string;
    error?: string;
    leftIcon?: keyof typeof Ionicons.glyphMap;
    rightIcon?: keyof typeof Ionicons.glyphMap;
    onRightIconPress?: () => void;
    isPassword?: boolean;
}

export default function Input({
    label,
    error,
    leftIcon,
    rightIcon,
    onRightIconPress,
    isPassword = false,
    value,
    onChangeText,
    ...props
}: InputProps) {
    const [isFocused, setIsFocused] = useState(false);
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);
    const inputRef = useRef<TextInput>(null);

    const hasValue = value && value.length > 0;
    const shouldMoveLabel = isFocused || hasValue;

    const handleFocus = () => {
        setIsFocused(true);
        inputRef.current?.focus();
    };

    const handleBlur = () => {
        setIsFocused(false);
    };

    const togglePasswordVisibility = () => {
        setIsPasswordVisible(!isPasswordVisible);
    };

    const getBorderColor = () => {
        if (error) return '#F44336';
        if (isFocused) return colors.purple;
        return colors.lightGrayPurple;
    };

    const getLabelColor = () => {
        if (error) return '#F44336';
        if (isFocused) return colors.purple;
        return colors.gray;
    };

    return (
        <View style={styles.container}>
            <MotiView
                style={[
                    styles.inputContainer,
                    { borderColor: getBorderColor() }
                ]}
                animate={{
                    borderWidth: isFocused ? 2 : 1,
                    shadowOpacity: isFocused ? 0.15 : 0.05,
                }}
                transition={{
                    type: 'timing',
                    duration: 200,
                }}
            >
                {leftIcon && (
                    <MotiView
                        style={styles.leftIconContainer}
                        animate={{
                            opacity: isFocused ? 1 : 0.6,
                        }}
                    >
                        <Ionicons
                            name={leftIcon}
                            size={20}
                            color={isFocused ? colors.purple : colors.gray}
                        />
                    </MotiView>
                )}

                <View style={styles.inputWrapper}>
                    <MotiView
                        style={[
                            styles.labelContainer,
                            { left: leftIcon ? 40 : 16 }
                        ]}
                        animate={{
                            translateY: shouldMoveLabel ? -28 : 0,
                            scale: shouldMoveLabel ? 0.85 : 1,
                        }}
                        transition={{
                            type: 'timing',
                            duration: 200,
                        }}
                    >
                        <Text style={[styles.label, { color: getLabelColor() }]}>
                            {label}
                        </Text>
                    </MotiView>

                    <TextInput
                        ref={inputRef}
                        style={[
                            styles.input,
                            { marginLeft: leftIcon ? 40 : 0 },
                            { marginRight: (rightIcon || isPassword) ? 40 : 0 }
                        ]}
                        value={value}
                        onChangeText={onChangeText}
                        onFocus={handleFocus}
                        onBlur={handleBlur}
                        secureTextEntry={isPassword && !isPasswordVisible}
                        placeholderTextColor="transparent"
                        {...props}
                    />
                </View>

                {isPassword && (
                    <TouchableOpacity
                        style={styles.rightIconContainer}
                        onPress={togglePasswordVisibility}
                    >
                        <MotiView
                            animate={{
                                rotate: isPasswordVisible ? '0deg' : '180deg',
                            }}
                            transition={{
                                type: 'timing',
                                duration: 300,
                            }}
                        >
                            <Ionicons
                                name={isPasswordVisible ? 'eye-outline' : 'eye-off-outline'}
                                size={20}
                                color={isFocused ? colors.purple : colors.gray}
                            />
                        </MotiView>
                    </TouchableOpacity>
                )}

                {rightIcon && !isPassword && (
                    <TouchableOpacity
                        style={styles.rightIconContainer}
                        onPress={onRightIconPress}
                    >
                        <MotiView
                            animate={{
                                opacity: isFocused ? 1 : 0.6,
                                scale: onRightIconPress && isFocused ? 1.1 : 1,
                            }}
                        >
                            <Ionicons
                                name={rightIcon}
                                size={20}
                                color={isFocused ? colors.purple : colors.gray}
                            />
                        </MotiView>
                    </TouchableOpacity>
                )}
            </MotiView>

            {error && (
                <MotiView
                    style={styles.errorContainer}
                    from={{
                        opacity: 0,
                        translateY: -10,
                    }}
                    animate={{
                        opacity: 1,
                        translateY: 0,
                    }}
                    transition={{
                        type: 'timing',
                        duration: 300,
                    }}
                >
                    <Ionicons name="alert-circle-outline" size={16} color="#F44336" />
                    <Text style={styles.errorText}>{error}</Text>
                </MotiView>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        marginBottom: 20,
    },
    inputContainer: {
        backgroundColor: colors.white,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: colors.lightGrayPurple,
        shadowColor: colors.black,
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 3,
        position: 'relative',
        minHeight: 56,
    },
    leftIconContainer: {
        position: 'absolute',
        left: 16,
        top: 18,
        zIndex: 1,
    },
    inputWrapper: {
        flex: 1,
        justifyContent: 'center',
    },
    labelContainer: {
        position: 'absolute',
        top: 18,
        backgroundColor: colors.white,
        paddingHorizontal: 4,
        zIndex: 2,
    },
    label: {
        fontSize: 16,
        fontWeight: '500',
    },
    input: {
        fontSize: 16,
        color: colors.blackGray,
        paddingHorizontal: 16,
        paddingVertical: 18,
        minHeight: 56,
    },
    rightIconContainer: {
        position: 'absolute',
        right: 16,
        top: 18,
        zIndex: 1,
    },
    errorContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 8,
        marginLeft: 4,
    },
    errorText: {
        color: '#F44336',
        fontSize: 14,
        marginLeft: 6,
        fontWeight: '500',
    },
}); 