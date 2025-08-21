import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Quiz } from '@/types';
import { colors } from '@/theme/colors';

interface QuizCardProps {
    quiz: Quiz;
    onPress: (quiz: Quiz) => void;
}

export default function QuizCard({ quiz, onPress }: QuizCardProps) {
    const getDifficultyColor = (difficulty: string) => {
        switch (difficulty) {
            case 'easy':
                return '#4CAF50';
            case 'medium':
                return '#FF9800';
            case 'hard':
                return '#F44336';
            default:
                return colors.gray;
        }
    };

    const getDifficultyText = (difficulty: string) => {
        switch (difficulty) {
            case 'easy':
                return 'Mudah';
            case 'medium':
                return 'Sedang';
            case 'hard':
                return 'Sulit';
            default:
                return difficulty;
        }
    };

    const getAttemptsText = () => {
        if (quiz.attempts === 0) {
            return 'Belum dicoba';
        }
        return `${quiz.attempts}/${quiz.maxAttempts} percobaan`;
    };

    const getAttemptsColor = () => {
        if (quiz.attempts === 0) {
            return colors.gray;
        }
        if (quiz.attempts >= quiz.maxAttempts) {
            return '#F44336';
        }
        return colors.purple;
    };

    return (
        <TouchableOpacity
            style={styles.container}
            onPress={() => onPress(quiz)}
            activeOpacity={0.8}
            disabled={quiz.attempts >= quiz.maxAttempts}
        >
            <View style={styles.header}>
                <View style={styles.iconContainer}>
                    <Text style={styles.icon}>🧠</Text>
                </View>
                <View style={[styles.difficultyBadge, { backgroundColor: getDifficultyColor(quiz.difficulty) }]}>
                    <Text style={styles.difficultyText}>{getDifficultyText(quiz.difficulty)}</Text>
                </View>
            </View>

            <Text style={styles.title}>{quiz.title}</Text>
            <Text style={styles.description} numberOfLines={2}>
                {quiz.description}
            </Text>

            <View style={styles.statsContainer}>
                <View style={styles.statItem}>
                    <Text style={styles.statIcon}>❓</Text>
                    <Text style={styles.statText}>{quiz.questions.length} soal</Text>
                </View>
                <View style={styles.statItem}>
                    <Text style={styles.statIcon}>⏱️</Text>
                    <Text style={styles.statText}>{quiz.timeLimit} menit</Text>
                </View>
                <View style={styles.statItem}>
                    <Text style={styles.statIcon}>🎯</Text>
                    <Text style={styles.statText}>Min. {quiz.passingScore}%</Text>
                </View>
            </View>

            <View style={styles.footer}>
                <Text style={[styles.attemptsText, { color: getAttemptsColor() }]}>
                    {getAttemptsText()}
                </Text>
                {quiz.attempts >= quiz.maxAttempts ? (
                    <View style={styles.maxAttemptsBadge}>
                        <Text style={styles.maxAttemptsText}>Batas tercapai</Text>
                    </View>
                ) : (
                    <View style={styles.startButton}>
                        <Text style={styles.startButtonText}>
                            {quiz.attempts === 0 ? 'Mulai Quiz' : 'Coba Lagi'}
                        </Text>
                    </View>
                )}
            </View>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: colors.white,
        borderRadius: 12,
        padding: 16,
        marginVertical: 6,
        marginHorizontal: 16,
        shadowColor: colors.black,
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    iconContainer: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: colors.lightGrayPurple,
        justifyContent: 'center',
        alignItems: 'center',
    },
    icon: {
        fontSize: 20,
    },
    difficultyBadge: {
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
    },
    difficultyText: {
        color: colors.white,
        fontSize: 12,
        fontWeight: '600',
    },
    title: {
        fontSize: 16,
        fontWeight: 'bold',
        color: colors.blackGray,
        marginBottom: 8,
    },
    description: {
        fontSize: 14,
        color: colors.gray,
        lineHeight: 20,
        marginBottom: 16,
    },
    statsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 16,
        paddingVertical: 12,
        borderTopWidth: 1,
        borderBottomWidth: 1,
        borderColor: colors.lightGrayPurple,
    },
    statItem: {
        alignItems: 'center',
        flex: 1,
    },
    statIcon: {
        fontSize: 16,
        marginBottom: 4,
    },
    statText: {
        fontSize: 12,
        color: colors.gray,
        textAlign: 'center',
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    attemptsText: {
        fontSize: 12,
        fontWeight: '500',
    },
    startButton: {
        backgroundColor: colors.purple,
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
    },
    startButtonText: {
        color: colors.white,
        fontSize: 12,
        fontWeight: '600',
    },
    maxAttemptsBadge: {
        backgroundColor: colors.gray,
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
    },
    maxAttemptsText: {
        color: colors.white,
        fontSize: 12,
        fontWeight: '600',
    },
}); 