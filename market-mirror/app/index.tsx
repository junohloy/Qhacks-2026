import { View, Text, StyleSheet, Pressable, TextInput, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { useState } from 'react';
import { router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import React from 'react';

export default function LandingScreen() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [emailError, setEmailError] = useState('');

  const validateEmail = (text: string) => {
    setEmail(text);
    if (text && !text.includes('@')) {
      setEmailError('Email must contain @ symbol');
    } else {
      setEmailError('');
    }
  };

  const handleAuth = async () => {
    // Validate email
    if (!email.includes('@')) {
      setEmailError('Please enter a valid email with @ symbol');
      return;
    }
    
    if (!email || !password) {
      alert('Please fill in all fields');
      return;
    }

    if (!isLogin && !name) {
      alert('Please enter your name');
      return;
    }

    // Save user data to AsyncStorage
    try {
      await AsyncStorage.setItem('userEmail', email);
      if (!isLogin) {
        await AsyncStorage.setItem('userName', name);
      }
    } catch (error) {
      console.error('Error saving user data:', error);
    }

    // Navigate to the main app
    router.replace('/(tabs)');
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.logoSection}>
          <Text style={styles.logoEmoji}>🪞</Text>
          <Text style={styles.logoText}>Market Mirror</Text>
          <View style={styles.dividerGold} />
          <Text style={styles.tagline}>
            Understand yourself.{'\n'}Make better decisions.
          </Text>
        </View>

        <View style={styles.formSection}>
          <View style={styles.toggleContainer}>
            <Pressable
              style={[styles.toggleButton, isLogin && styles.toggleButtonActive]}
              onPress={() => setIsLogin(true)}
            >
              <Text style={[styles.toggleText, isLogin && styles.toggleTextActive]}>
                Log In
              </Text>
            </Pressable>
            <Pressable
              style={[styles.toggleButton, !isLogin && styles.toggleButtonActive]}
              onPress={() => setIsLogin(false)}
            >
              <Text style={[styles.toggleText, !isLogin && styles.toggleTextActive]}>
                Sign Up
              </Text>
            </Pressable>
          </View>

          {!isLogin && (
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Name</Text>
              <TextInput
                style={styles.input}
                value={name}
                onChangeText={setName}
                placeholder="Your name"
                placeholderTextColor="#666"
                autoCapitalize="words"
              />
            </View>
          )}

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Email</Text>
            <TextInput
              style={[styles.input, emailError ? styles.inputError : null]}
              value={email}
              onChangeText={validateEmail}
              placeholder="your@email.com"
              placeholderTextColor="#666"
              keyboardType="email-address"
              autoCapitalize="none"
            />
            {emailError ? (
              <View style={styles.errorContainer}>
                <Text style={styles.errorIcon}>⚠️</Text>
                <Text style={styles.errorText}>{emailError}</Text>
              </View>
            ) : null}
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Password</Text>
            <TextInput
              style={styles.input}
              value={password}
              onChangeText={setPassword}
              placeholder="••••••••"
              placeholderTextColor="#666"
              secureTextEntry
            />
          </View>

          <Pressable style={styles.primaryButton} onPress={handleAuth}>
            <Text style={styles.primaryButtonText}>
              {isLogin ? 'Log In' : 'Create Account'}
            </Text>
          </Pressable>

          {isLogin && (
            <Pressable style={styles.forgotPassword}>
              <Text style={styles.forgotPasswordText}>Forgot password?</Text>
            </Pressable>
          )}
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Join thousands making mindful purchase decisions
          </Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  scrollContent: {
    flexGrow: 1,
    padding: 24,
    justifyContent: 'center',
  },
  logoSection: {
    alignItems: 'center',
    marginBottom: 48,
  },
  logoEmoji: {
    fontSize: 80,
    marginBottom: 16,
  },
  logoText: {
    fontSize: 42,
    fontWeight: '800',
    color: '#FFD700',
    marginBottom: 16,
    fontFamily: 'System',
  },
  dividerGold: {
    width: 80,
    height: 3,
    backgroundColor: '#FFD700',
    marginBottom: 16,
  },
  tagline: {
    fontSize: 18,
    color: '#888',
    textAlign: 'center',
    lineHeight: 28,
    fontFamily: 'System',
  },
  formSection: {
    marginBottom: 32,
  },
  toggleContainer: {
    flexDirection: 'row',
    backgroundColor: '#111',
    borderRadius: 12,
    padding: 4,
    marginBottom: 32,
  },
  toggleButton: {
    flex: 1,
    paddingVertical: 14,
    alignItems: 'center',
    borderRadius: 10,
  },
  toggleButtonActive: {
    backgroundColor: '#FFD700',
  },
  toggleText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#888',
    fontFamily: 'System',
  },
  toggleTextActive: {
    color: '#000',
  },
  inputGroup: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFD700',
    marginBottom: 8,
    fontFamily: 'System',
  },
  input: {
    backgroundColor: '#111',
    borderWidth: 2,
    borderColor: '#333',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: '#fff',
    fontFamily: 'System',
  },
  inputError: {
    borderColor: '#ff4444',
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    paddingHorizontal: 4,
  },
  errorIcon: {
    fontSize: 14,
    marginRight: 6,
  },
  errorText: {
    fontSize: 13,
    color: '#ff4444',
    fontFamily: 'System',
  },
  primaryButton: {
    backgroundColor: '#FFD700',
    paddingVertical: 18,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 12,
    shadowColor: '#FFD700',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 12,
    elevation: 8,
  },
  primaryButtonText: {
    color: '#000',
    fontSize: 18,
    fontWeight: '800',
    fontFamily: 'System',
  },
  forgotPassword: {
    paddingVertical: 16,
    alignItems: 'center',
  },
  forgotPasswordText: {
    color: '#888',
    fontSize: 14,
    fontFamily: 'System',
  },
  footer: {
    alignItems: 'center',
  },
  footerText: {
    fontSize: 13,
    color: '#666',
    textAlign: 'center',
    fontFamily: 'System',
  },
});