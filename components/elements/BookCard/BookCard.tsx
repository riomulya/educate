import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Book } from '@/types';
import { colors } from '@/theme/colors';

interface BookCardProps {
    book: Book;
    onPress: (book: Book) => void;
}

export default function BookCard({ book, onPress }: BookCardProps) {
    const renderStars = (rating: number) => {
        const stars = [];
        const fullStars = Math.floor(rating);
        const hasHalfStar = rating % 1 !== 0;

        for (let i = 0; i < fullStars; i++) {
            stars.push(<Text key={i} style={styles.star}>⭐</Text>);
        }

        if (hasHalfStar) {
            stars.push(<Text key="half" style={styles.star}>⭐</Text>);
        }

        return stars;
    };

    const formatDownloadCount = (count: number) => {
        if (count >= 1000) {
            return `${(count / 1000).toFixed(1)}k`;
        }
        return count.toString();
    };

    return (
        <TouchableOpacity
            style={styles.container}
            onPress={() => onPress(book)}
            activeOpacity={0.8}
        >
            <View style={styles.coverContainer}>
                <View style={styles.coverPlaceholder}>
                    <Text style={styles.coverIcon}>📚</Text>
                </View>
                {book.isDownloaded && (
                    <View style={styles.downloadedBadge}>
                        <Text style={styles.downloadedIcon}>⬇️</Text>
                    </View>
                )}
            </View>

            <View style={styles.content}>
                <Text style={styles.title} numberOfLines={2}>
                    {book.title}
                </Text>
                <Text style={styles.author} numberOfLines={1}>
                    oleh {book.author}
                </Text>
                <Text style={styles.description} numberOfLines={2}>
                    {book.description}
                </Text>

                <View style={styles.ratingContainer}>
                    <View style={styles.starsContainer}>
                        {renderStars(book.rating)}
                    </View>
                    <Text style={styles.ratingText}>
                        {book.rating.toFixed(1)}
                    </Text>
                </View>

                <View style={styles.footer}>
                    <View style={styles.metaItem}>
                        <Text style={styles.metaIcon}>📄</Text>
                        <Text style={styles.metaText}>{book.pages} halaman</Text>
                    </View>
                    <View style={styles.metaItem}>
                        <Text style={styles.metaIcon}>⬇️</Text>
                        <Text style={styles.metaText}>
                            {formatDownloadCount(book.downloadCount)} unduhan
                        </Text>
                    </View>
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
        marginVertical: 6,
        marginHorizontal: 16,
        flexDirection: 'row',
        shadowColor: colors.black,
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    coverContainer: {
        position: 'relative',
        marginRight: 16,
    },
    coverPlaceholder: {
        width: 80,
        height: 100,
        borderRadius: 8,
        backgroundColor: colors.lightGrayPurple,
        justifyContent: 'center',
        alignItems: 'center',
    },
    coverIcon: {
        fontSize: 32,
    },
    downloadedBadge: {
        position: 'absolute',
        top: -5,
        right: -5,
        width: 20,
        height: 20,
        borderRadius: 10,
        backgroundColor: '#4CAF50',
        justifyContent: 'center',
        alignItems: 'center',
    },
    downloadedIcon: {
        fontSize: 10,
    },
    content: {
        flex: 1,
        justifyContent: 'space-between',
    },
    title: {
        fontSize: 16,
        fontWeight: 'bold',
        color: colors.blackGray,
        marginBottom: 4,
    },
    author: {
        fontSize: 12,
        color: colors.gray,
        fontStyle: 'italic',
        marginBottom: 8,
    },
    description: {
        fontSize: 14,
        color: colors.gray,
        lineHeight: 18,
        marginBottom: 8,
    },
    ratingContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },
    starsContainer: {
        flexDirection: 'row',
        marginRight: 8,
    },
    star: {
        fontSize: 12,
    },
    ratingText: {
        fontSize: 14,
        color: colors.gray,
        fontWeight: '600',
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    metaItem: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    metaIcon: {
        fontSize: 12,
        marginRight: 4,
    },
    metaText: {
        fontSize: 11,
        color: colors.gray,
    },
}); 