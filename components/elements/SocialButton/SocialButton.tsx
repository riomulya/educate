import React from 'react';
import {
    TouchableOpacity,
    Text,
    StyleSheet,
    View,
} from 'react-native';
import { MotiView } from 'moti';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '@/theme/colors';
import { AuthProvider } from '@/types/auth';

interface SocialButtonProps {
    provider: AuthProvider;
    onPress: () => void;
    loading?: boolean;
    disabled?: boolean;
}

export default function SocialButton({
    provider,
    onPress,
    loading = false,
    disabled = false,
}: SocialButtonProps) {
    const isDisabled = disabled || loading;

    const getProviderConfig = () => {
        switch (provider) {
            case 'google':
                return {
                    title: 'Masuk dengan Google',
                    icon: 'logo-google' as keyof typeof Ionicons.glyphMap,
                    backgroundColor: '#4285F4',
                    textColor: colors.white,
                };
            case 'facebook':
                return {
                    title: 'Masuk dengan Facebook',
                    icon: 'logo-facebook' as keyof typeof Ionicons.glyphMap,
                    backgroundColor: '#1877F2',
                    textColor: colors.white,
                };
            case 'apple':
                return {
                    title: 'Masuk dengan Apple',
                    icon: 'logo-apple' as keyof typeof Ionicons.glyphMap,
                    backgroundColor: colors.black,
                    textColor: colors.white,
                };
            default:
                return {
                    title: 'Masuk dengan OAuth',
                    icon: 'log-in-outline' as keyof typeof Ionicons.glyphMap,
                    backgroundColor: colors.gray,
                    textColor: colors.white,
                };
        }
    };

    const config = getProviderConfig();

    return (
        <TouchableOpacity
            onPress={onPress}
            disabled={isDisabled}
            activeOpacity={0.8}
            style={styles.container}
        >
            <MotiView
                style={[
                    styles.button,
                    { backgroundColor: config.backgroundColor },
                    isDisabled && styles.disabled,
                ]}
                animate={{
                    opacity: isDisabled ? 0.6 : 1,
                    scale: isDisabled ? 0.98 : 1,
                }}
                transition={{
                    type: 'timing',
                    duration: 150,
                }}
                whileTap={{
                    scale: 0.98,
                }}
            >
                <MotiView
                    style={styles.iconContainer}
                    from={{
                        opacity: 0,
                        scale: 0.8,
                    }}
                    animate={{
                        opacity: 1,
                        scale: 1,
                    }}
                    transition={{
                        type: 'timing',
                        duration: 300,
                        delay: 100,
                    }}
                >
                    {loading ? (
                        <MotiView
                            from={{
                                rotate: '0deg',
                            }}
                            animate={{
                                rotate: '360deg',
                            }}
                            transition={{
                                type: 'timing',
                                duration: 1000,
                                loop: true,
                            }}
                        >
                            <View style={styles.loadingSpinner} />
                        </MotiView>
                    ) : (
                        <Ionicons
                            name={config.icon}
                            size={20}
                            color={config.textColor}
                        />
                    )}
                </MotiView>

                <MotiView
                    style={styles.textContainer}
                    from={{
                        opacity: 0,
                        translateX: 20,
                    }}
                    animate={{
                        opacity: 1,
                        translateX: 0,
                    }}
                    transition={{
                        type: 'timing',
                        duration: 300,
                        delay: 200,
                    }}
                >
                    <Text style={[styles.text, { color: config.textColor }]}>
                        {config.title}
                    </Text>
                </MotiView>
            </MotiView>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    container: {
        marginVertical: 8,
    },
    button: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 24,
        paddingVertical: 16,
        borderRadius: 12,
        minHeight: 56,
        shadowColor: colors.black,
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.15,
        shadowRadius: 8,
        elevation: 4,
    },
    iconContainer: {
        marginRight: 12,
        width: 24,
        height: 24,
        alignItems: 'center',
        justifyContent: 'center',
    },
    textContainer: {
        flex: 1,
        alignItems: 'center',
    },
    text: {
        fontSize: 16,
        fontWeight: '600',
        textAlign: 'center',
    },
    disabled: {
        shadowOpacity: 0,
        elevation: 0,
    },
    loadingSpinner: {
        width: 20,
        height: 20,
        borderRadius: 10,
        borderWidth: 2,
        borderColor: 'rgba(255, 255, 255, 0.3)',
        borderTopColor: colors.white,
    },
}); 