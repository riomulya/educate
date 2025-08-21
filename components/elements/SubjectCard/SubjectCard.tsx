import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Subject } from '@/types';
import { colors } from '@/theme/colors';

interface SubjectCardProps {
    subject: Subject;
    onPress: (subject: Subject) => void;
}

export default function SubjectCard({ subject, onPress }: SubjectCardProps) {
    const getLevelColor = (level: string) => {
        switch (level) {
            case 'beginner':
                return '#4CAF50';
            case 'intermediate':
                return '#FF9800';
            case 'advanced':
                return '#F44336';
            default:
                return colors.gray;
        }
    };

    const getLevelText = (level: string) => {
        switch (level) {
            case 'beginner':
                return 'Pemula';
            case 'intermediate':
                return 'Menengah';
            case 'advanced':
                return 'Lanjutan';
            default:
                return level;
        }
    };

    return (
        <TouchableOpacity
            style={[styles.container, { borderLeftColor: subject.color }]}
            onPress={() => onPress(subject)}
            activeOpacity={0.8}
        >
            <View style={styles.header}>
                <View style={styles.iconContainer}>
                    <Text style={styles.icon}>{subject.icon}</Text>
                </View>
                <View style={[styles.levelBadge, { backgroundColor: getLevelColor(subject.level) }]}>
                    <Text style={styles.levelText}>{getLevelText(subject.level)}</Text>
                </View>
            </View>

            <Text style={styles.title}>{subject.title}</Text>
            <Text style={styles.description} numberOfLines={2}>
                {subject.description}
            </Text>

            <View style={styles.footer}>
                <View style={styles.statItem}>
                    <Text style={styles.statNumber}>{subject.totalMaterials}</Text>
                    <Text style={styles.statLabel}>Materi</Text>
                </View>
                <View style={styles.statItem}>
                    <Text style={styles.statNumber}>{subject.totalQuizzes}</Text>
                    <Text style={styles.statLabel}>Quiz</Text>
                </View>
            </View>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: colors.white,
        borderRadius: 12,
        padding: 16,
        marginVertical: 8,
        marginHorizontal: 16,
        borderLeftWidth: 4,
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
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: colors.lightGrayPurple,
        justifyContent: 'center',
        alignItems: 'center',
    },
    icon: {
        fontSize: 24,
    },
    levelBadge: {
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
    },
    levelText: {
        color: colors.white,
        fontSize: 12,
        fontWeight: '600',
    },
    title: {
        fontSize: 18,
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
    footer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        paddingTop: 16,
        borderTopWidth: 1,
        borderTopColor: colors.lightGrayPurple,
    },
    statItem: {
        alignItems: 'center',
    },
    statNumber: {
        fontSize: 20,
        fontWeight: 'bold',
        color: colors.purple,
        marginBottom: 4,
    },
    statLabel: {
        fontSize: 12,
        color: colors.gray,
    },
}); 