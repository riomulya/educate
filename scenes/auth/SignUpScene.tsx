import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { MotiView } from 'moti';
import { router } from 'expo-router';
import { useDispatch, useSelector } from 'react-redux';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '@/theme/colors';
import Input from '@/components/elements/Input';
import Button from '@/components/elements/Button';
import SocialButton from '@/components/elements/SocialButton';
import { signUp, clearError } from '@/slices/authSlice';
import { RootState, AppDispatch } from '@/utils/store';
import { SignUpCredentials } from '@/types/auth';
import { useEmailAuth } from '@/hooks/useEmailAuth';

export default function SignUpScene() {
  const dispatch = useDispatch<AppDispatch>();
  const { loading: reduxLoading, error: reduxError } = useSelector((state: RootState) => state.auth);
  const { signUp: emailSignUp, loading: authLoading, error: authError } = useEmailAuth();

  const [formData, setFormData] = useState<SignUpCredentials>({
    email: '',
    password: '',
    fullName: '',
  });

  const [confirmPassword, setConfirmPassword] = useState('');
  const [formErrors, setFormErrors] = useState<
    Partial<SignUpCredentials & { confirmPassword: string }>
  >({});

  const validateForm = (): boolean => {
    const errors: Partial<SignUpCredentials & { confirmPassword: string }> = {};

    if (!formData.fullName.trim()) {
      errors.fullName = 'Nama lengkap harus diisi';
    } else if (formData.fullName.trim().length < 2) {
      errors.fullName = 'Nama lengkap minimal 2 karakter';
    }

    if (!formData.email.trim()) {
      errors.email = 'Email harus diisi';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'Format email tidak valid';
    }

    if (!formData.password) {
      errors.password = 'Password harus diisi';
    } else if (formData.password.length < 6) {
      errors.password = 'Password minimal 6 karakter';
    }

    if (!confirmPassword) {
      errors.confirmPassword = 'Konfirmasi password harus diisi';
    } else if (confirmPassword !== formData.password) {
      errors.confirmPassword = 'Password tidak cocok';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSignUp = async () => {
    if (!validateForm()) return;

    dispatch(clearError());

    try {
      // Use our custom hook instead of Redux action
      await emailSignUp(formData);
      // Alert and navigation are handled in the hook
    } catch (error) {
      // Error handled in the hook
    }
  };

  const handleEmailOnlySignUp = async () => {
    // Just use the regular sign up button - no separate oauth for now
    Alert.alert('Email Sign Up', 'Gunakan form pendaftaran di atas untuk mendaftar dengan email dan password.');
  };

  const handleInputChange = (field: keyof SignUpCredentials, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (formErrors[field]) {
      setFormErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const handleConfirmPasswordChange = (value: string) => {
    setConfirmPassword(value);
    if (formErrors.confirmPassword) {
      setFormErrors(prev => ({ ...prev, confirmPassword: undefined }));
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled">
          {/* Header */}
          <MotiView
            style={styles.header}
            from={{
              opacity: 0,
              translateY: -50,
            }}
            animate={{
              opacity: 1,
              translateY: 0,
            }}
            transition={{
              type: 'timing',
              duration: 800,
              delay: 200,
            }}>
            <View style={styles.logoContainer}>
              <MotiView
                from={{
                  scale: 0,
                  rotate: '-180deg',
                }}
                animate={{
                  scale: 1,
                  rotate: '0deg',
                }}
                transition={{
                  type: 'spring',
                  damping: 15,
                  stiffness: 150,
                  delay: 400,
                }}>
                <Ionicons name="person-add" size={40} color={colors.purple} />
              </MotiView>
            </View>
            <Text style={styles.title}>Bergabung dengan Kami!</Text>
            <Text style={styles.subtitle}>
              Buat akun baru untuk memulai perjalanan pembelajaran Anda
            </Text>
          </MotiView>

          {/* Form */}
          <MotiView
            style={styles.form}
            from={{
              opacity: 0,
              translateY: 50,
            }}
            animate={{
              opacity: 1,
              translateY: 0,
            }}
            transition={{
              type: 'timing',
              duration: 600,
              delay: 600,
            }}>
            <Input
              label="Nama Lengkap"
              value={formData.fullName}
              onChangeText={value => handleInputChange('fullName', value)}
              leftIcon="person-outline"
              autoCapitalize="words"
              error={formErrors.fullName}
            />

            <Input
              label="Email"
              value={formData.email}
              onChangeText={value => handleInputChange('email', value)}
              leftIcon="mail-outline"
              keyboardType="email-address"
              autoCapitalize="none"
              error={formErrors.email}
            />

            <Input
              label="Password"
              value={formData.password}
              onChangeText={value => handleInputChange('password', value)}
              leftIcon="lock-closed-outline"
              isPassword
              error={formErrors.password}
            />

            <Input
              label="Konfirmasi Password"
              value={confirmPassword}
              onChangeText={handleConfirmPasswordChange}
              leftIcon="lock-closed-outline"
              isPassword
              error={formErrors.confirmPassword}
            />

            {/* Error Message */}
            {(reduxError || authError) && (
              <MotiView
                style={styles.errorContainer}
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
                  duration: 300,
                }}>
                <Ionicons name="alert-circle" size={20} color="#F44336" />
                <Text style={styles.errorText}>{reduxError || authError}</Text>
              </MotiView>
            )}

            {/* Terms */}
            <MotiView
              style={styles.termsContainer}
              from={{
                opacity: 0,
              }}
              animate={{
                opacity: 1,
              }}
              transition={{
                type: 'timing',
                duration: 500,
                delay: 800,
              }}>
              <Text style={styles.termsText}>
                Dengan mendaftar, Anda menyetujui{' '}
                <Text style={styles.termsLink}>Syarat & Ketentuan</Text> dan{' '}
                <Text style={styles.termsLink}>Kebijakan Privasi</Text> kami.
              </Text>
            </MotiView>

            {/* Sign Up Button */}
            <Button
              title="Daftar"
              onPress={handleSignUp}
              loading={reduxLoading || authLoading}
              leftIcon="person-add-outline"
              size="large"
              style={styles.signUpButton}
            />
          </MotiView>

          {/* Divider */}
          <MotiView
            style={styles.dividerContainer}
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
              duration: 500,
              delay: 1000,
            }}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>atau</Text>
            <View style={styles.dividerLine} />
          </MotiView>

          {/* Social Login */}
          <MotiView
            style={styles.socialContainer}
            from={{
              opacity: 0,
              translateY: 30,
            }}
            animate={{
              opacity: 1,
              translateY: 0,
            }}
            transition={{
              type: 'timing',
              duration: 600,
              delay: 1200,
            }}>
            <SocialButton
              provider="google"
              onPress={handleEmailOnlySignUp}
              loading={false}
            />
          </MotiView>

          {/* Sign In Link */}
          <MotiView
            style={styles.signInContainer}
            from={{
              opacity: 0,
            }}
            animate={{
              opacity: 1,
            }}
            transition={{
              type: 'timing',
              duration: 500,
              delay: 1400,
            }}>
            <Text style={styles.signInText}>
              Sudah punya akun?{' '}
              <TouchableOpacity onPress={() => router.push('/auth/sign-in')}>
                <Text style={styles.signInLink}>Masuk di sini</Text>
              </TouchableOpacity>
            </Text>
          </MotiView>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.lightGrayPurple,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 20,
    justifyContent: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: 24,
  },
  logoContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    shadowColor: colors.purple,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.blackGray,
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: colors.gray,
    textAlign: 'center',
    lineHeight: 20,
    maxWidth: 300,
  },
  form: {
    marginBottom: 20,
  },
  termsContainer: {
    marginBottom: 16,
  },
  termsText: {
    fontSize: 14,
    color: colors.gray,
    textAlign: 'center',
    lineHeight: 20,
  },
  termsLink: {
    color: colors.purple,
    fontWeight: '600',
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFEBEE',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  errorText: {
    color: '#F44336',
    fontSize: 14,
    marginLeft: 8,
    flex: 1,
  },
  signUpButton: {
    marginTop: 8,
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 16,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: colors.lightGrayPurple,
  },
  dividerText: {
    marginHorizontal: 16,
    color: colors.gray,
    fontSize: 14,
    fontWeight: '500',
  },
  socialContainer: {
    marginBottom: 16,
  },
  signInContainer: {
    alignItems: 'center',
  },
  signInText: {
    color: colors.gray,
    fontSize: 16,
    textAlign: 'center',
  },
  signInLink: {
    color: colors.purple,
    fontWeight: '600',
    textDecorationLine: 'underline',
  },
});
