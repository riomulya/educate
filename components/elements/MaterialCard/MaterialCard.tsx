import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Material } from '@/types';
import { colors } from '@/theme/colors';

interface MaterialCardProps {
    material: Material;
    onPress: (material: Material) => void;
}

export default function MaterialCard({ material, onPress }: MaterialCardProps) {
    const getTypeIcon = (type: string) => {
        switch (type) {
            case 'video':
                return '🎥';
            case 'article':
                return '📖';
            case 'interactive':
                return '🎮';
            default:
                return '📄';
        }
    };

    const getTypeText = (type: string) => {
        switch (type) {
            case 'video':
                return 'Video';
            case 'article':
                return 'Artikel';
            case 'interactive':
                return 'Interaktif';
            default:
                return 'Materi';
        }
    };

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

    return (
        <TouchableOpacity
            style={[styles.container, material.isCompleted && styles.completedContainer]}
            onPress={() => onPress(material)}
            activeOpacity={0.8}
        >
            <View style={styles.header}>
                <View style={styles.typeContainer}>
                    <Text style={styles.typeIcon}>{getTypeIcon(material.type)}</Text>
                    <Text style={styles.typeText}>{getTypeText(material.type)}</Text>
                </View>
                {material.isCompleted && (
                    <View style={styles.completedBadge}>
                        <Text style={styles.completedIcon}>✓</Text>
                    </View>
                )}
            </View>

            <Text style={styles.title}>{material.title}</Text>
            <Text style={styles.description} numberOfLines={2}>
                {material.description}
            </Text>

            <View style={styles.footer}>
                <View style={styles.metaItem}>
                    <Text style={styles.metaIcon}>⏱️</Text>
                    <Text style={styles.metaText}>{material.duration} menit</Text>
                </View>
                <View style={[styles.difficultyBadge, { backgroundColor: getDifficultyColor(material.difficulty) }]}>
                    <Text style={styles.difficultyText}>{getDifficultyText(material.difficulty)}</Text>
                </View>
            </View>

            {material.isCompleted && (
                <View style={styles.progressOverlay}>
                    <View style={styles.progressBar} />
                </View>
            )}
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
        position: 'relative',
    },
    completedContainer: {
        borderColor: '#4CAF50',
        borderWidth: 1,
        backgroundColor: '#F8FFF8',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    typeContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    typeIcon: {
        fontSize: 16,
        marginRight: 8,
    },
    typeText: {
        fontSize: 12,
        color: colors.gray,
        fontWeight: '500',
    },
    completedBadge: {
        width: 24,
        height: 24,
        borderRadius: 12,
        backgroundColor: '#4CAF50',
        justifyContent: 'center',
        alignItems: 'center',
    },
    completedIcon: {
        color: colors.white,
        fontSize: 14,
        fontWeight: 'bold',
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
    footer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    metaItem: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    metaIcon: {
        fontSize: 14,
        marginRight: 6,
    },
    metaText: {
        fontSize: 12,
        color: colors.gray,
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
    progressOverlay: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: 3,
        backgroundColor: colors.lightGrayPurple,
        borderBottomLeftRadius: 12,
        borderBottomRightRadius: 12,
    },
    progressBar: {
        height: '100%',
        backgroundColor: '#4CAF50',
        borderBottomLeftRadius: 12,
        borderBottomRightRadius: 12,
        width: '100%',
    },
}); 