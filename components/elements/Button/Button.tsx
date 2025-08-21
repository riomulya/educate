import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { MotiView } from 'moti';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '@/theme/colors';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'small' | 'medium' | 'large';
  loading?: boolean;
  disabled?: boolean;
  leftIcon?: keyof typeof Ionicons.glyphMap;
  rightIcon?: keyof typeof Ionicons.glyphMap;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export default function Button({
  title,
  onPress,
  variant = 'primary',
  size = 'medium',
  loading = false,
  disabled = false,
  leftIcon,
  rightIcon,
  style,
  textStyle,
}: ButtonProps) {
  const isDisabled = disabled || loading;

  const getButtonStyle = () => {
    const baseStyle = [styles.button, styles[size]];

    switch (variant) {
      case 'primary':
        return [...baseStyle, styles.primary];
      case 'secondary':
        return [...baseStyle, styles.secondary];
      case 'outline':
        return [...baseStyle, styles.outline];
      case 'ghost':
        return [...baseStyle, styles.ghost];
      default:
        return [...baseStyle, styles.primary];
    }
  };

  const getTextStyle = () => {
    const baseStyle = [styles.text, styles[`${size}Text` as keyof typeof styles]];

    switch (variant) {
      case 'primary':
        return [...baseStyle, styles.primaryText];
      case 'secondary':
        return [...baseStyle, styles.secondaryText];
      case 'outline':
        return [...baseStyle, styles.outlineText];
      case 'ghost':
        return [...baseStyle, styles.ghostText];
      default:
        return [...baseStyle, styles.primaryText];
    }
  };

  const getIconColor = () => {
    switch (variant) {
      case 'primary':
        return colors.white;
      case 'secondary':
        return colors.white;
      case 'outline':
        return colors.purple;
      case 'ghost':
        return colors.purple;
      default:
        return colors.white;
    }
  };

  const getIconSize = () => {
    switch (size) {
      case 'small':
        return 16;
      case 'medium':
        return 18;
      case 'large':
        return 20;
      default:
        return 18;
    }
  };

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={isDisabled}
      activeOpacity={0.8}
      style={[style]}
    >
      <MotiView
        style={[
          getButtonStyle(),
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
        whileHover={{
          scale: 1.02,
        }}
        whileTap={{
          scale: 0.98,
        }}
      >
        {loading && (
          <MotiView
            style={styles.loadingContainer}
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
            <ActivityIndicator
              size="small"
              color={getIconColor()}
              style={styles.loadingIndicator}
            />
          </MotiView>
        )}

        {!loading && leftIcon && (
          <MotiView
            style={styles.leftIcon}
            from={{
              opacity: 0,
              translateX: -10,
            }}
            animate={{
              opacity: 1,
              translateX: 0,
            }}
            transition={{
              type: 'timing',
              duration: 200,
              delay: 100,
            }}
          >
            <Ionicons
              name={leftIcon}
              size={getIconSize()}
              color={getIconColor()}
            />
          </MotiView>
        )}

        <MotiView
          from={{
            opacity: 0,
            scale: 0.9,
          }}
          animate={{
            opacity: 1,
            scale: 1,
          }}
          transition={{
            type: 'timing',
            duration: 200,
          }}
        >
          <Text style={[getTextStyle(), textStyle, isDisabled && styles.disabledText]}>
            {title}
          </Text>
        </MotiView>

        {!loading && rightIcon && (
          <MotiView
            style={styles.rightIcon}
            from={{
              opacity: 0,
              translateX: 10,
            }}
            animate={{
              opacity: 1,
              translateX: 0,
            }}
            transition={{
              type: 'timing',
              duration: 200,
              delay: 100,
            }}
          >
            <Ionicons
              name={rightIcon}
              size={getIconSize()}
              color={getIconColor()}
            />
          </MotiView>
        )}
      </MotiView>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
    shadowColor: colors.black,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },

  // Sizes
  small: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    minHeight: 40,
  },
  medium: {
    paddingHorizontal: 24,
    paddingVertical: 14,
    minHeight: 48,
  },
  large: {
    paddingHorizontal: 32,
    paddingVertical: 18,
    minHeight: 56,
  },

  // Variants
  primary: {
    backgroundColor: colors.purple,
  },
  secondary: {
    backgroundColor: colors.pink,
  },
  outline: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: colors.purple,
  },
  ghost: {
    backgroundColor: 'transparent',
  },

  // Text styles
  text: {
    fontWeight: '600',
    textAlign: 'center',
  },
  smallText: {
    fontSize: 14,
  },
  mediumText: {
    fontSize: 16,
  },
  largeText: {
    fontSize: 18,
  },

  // Text variants
  primaryText: {
    color: colors.white,
  },
  secondaryText: {
    color: colors.white,
  },
  outlineText: {
    color: colors.purple,
  },
  ghostText: {
    color: colors.purple,
  },

  // States
  disabled: {
    shadowOpacity: 0,
    elevation: 0,
  },
  disabledText: {
    opacity: 0.6,
  },

  // Icons
  leftIcon: {
    marginRight: 8,
  },
  rightIcon: {
    marginLeft: 8,
  },
  loadingContainer: {
    marginRight: 8,
  },
  loadingIndicator: {
    width: 18,
    height: 18,
  },
});
