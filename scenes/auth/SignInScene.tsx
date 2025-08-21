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
import { signIn, signInWithOAuth, clearError } from '@/slices/authSlice';
import { RootState, AppDispatch } from '@/utils/store';
import { SignInCredentials } from '@/types/auth';

export default function SignInScene() {
  const dispatch = useDispatch<AppDispatch>();
  const { loading, error } = useSelector((state: RootState) => state.auth);

  const [formData, setFormData] = useState<SignInCredentials>({
    email: '',
    password: '',
  });

  const [formErrors, setFormErrors] = useState<Partial<SignInCredentials>>({});

  const validateForm = (): boolean => {
    const errors: Partial<SignInCredentials> = {};

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

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSignIn = async () => {
    if (!validateForm()) return;

    dispatch(clearError());

    try {
      await dispatch(signIn(formData)).unwrap();
      router.replace('/education');
    } catch (error) {
      // Error handled by Redux
    }
  };

  const handleOAuthSignIn = async (provider: 'google' | 'facebook' | 'apple') => {
    dispatch(clearError());

    try {
      await dispatch(signInWithOAuth(provider)).unwrap();
      // OAuth redirect will be handled automatically
    } catch (error) {
      Alert.alert('Error', `Gagal masuk dengan ${provider}`);
    }
  };

  const handleInputChange = (field: keyof SignInCredentials, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (formErrors[field]) {
      setFormErrors(prev => ({ ...prev, [field]: undefined }));
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
                  rotate: '180deg',
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
                <Ionicons name="school" size={60} color={colors.purple} />
              </MotiView>
            </View>
            <Text style={styles.title}>Selamat Datang Kembali!</Text>
            <Text style={styles.subtitle}>Masuk ke akun Anda untuk melanjutkan pembelajaran</Text>
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

            {/* Forgot Password */}
            <TouchableOpacity
              style={styles.forgotPassword}
              onPress={() => router.push('/auth/forgot-password')}>
              <Text style={styles.forgotPasswordText}>Lupa Password?</Text>
            </TouchableOpacity>

            {/* Error Message */}
            {error && (
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
                <Text style={styles.errorText}>{error}</Text>
              </MotiView>
            )}

            {/* Sign In Button */}
            <Button
              title="Masuk"
              onPress={handleSignIn}
              loading={loading}
              leftIcon="log-in-outline"
              size="large"
              style={styles.signInButton}
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
              delay: 800,
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
              delay: 1000,
            }}>
            <SocialButton
              provider="google"
              onPress={() => handleOAuthSignIn('google')}
              loading={loading}
            />
          </MotiView>

          {/* Sign Up Link */}
          <MotiView
            style={styles.signUpContainer}
            from={{
              opacity: 0,
            }}
            animate={{
              opacity: 1,
            }}
            transition={{
              type: 'timing',
              duration: 500,
              delay: 1200,
            }}>
            <Text style={styles.signUpText}>
              Belum punya akun?{' '}
              <TouchableOpacity onPress={() => router.push('/auth/sign-up')}>
                <Text style={styles.signUpLink}>Daftar di sini</Text>
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
    paddingTop: 40,
    paddingBottom: 40,
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logoContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
    shadowColor: colors.purple,
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 8,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.blackGray,
    textAlign: 'center',
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 16,
    color: colors.gray,
    textAlign: 'center',
    lineHeight: 24,
    maxWidth: 300,
  },
  form: {
    marginBottom: 32,
  },
  forgotPassword: {
    alignSelf: 'flex-end',
    marginBottom: 24,
  },
  forgotPasswordText: {
    color: colors.purple,
    fontSize: 14,
    fontWeight: '600',
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFEBEE',
    padding: 12,
    borderRadius: 8,
    marginBottom: 20,
  },
  errorText: {
    color: '#F44336',
    fontSize: 14,
    marginLeft: 8,
    flex: 1,
  },
  signInButton: {
    marginTop: 8,
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 32,
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
    marginBottom: 32,
  },
  signUpContainer: {
    alignItems: 'center',
  },
  signUpText: {
    color: colors.gray,
    fontSize: 16,
    textAlign: 'center',
  },
  signUpLink: {
    color: colors.purple,
    fontWeight: '600',
    textDecorationLine: 'underline',
  },
});
