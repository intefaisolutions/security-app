import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
  TextInput,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Ionicons';
import { DemoAuth } from '../../constants/theme';

const LoginScreen = ({ route, navigation }: any) => {
  const role = route?.params?.role || 'resident';
  const isGuard = role === 'guard';

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);

  const handleLogin = () => {
    const creds = isGuard ? DemoAuth.guard : DemoAuth.resident;
    if (username === creds.username && password === creds.password) {
      navigation.navigate('Otp', { role, username });
      return;
    }
    Alert.alert(
      'Invalid Login',
      isGuard
        ? 'Please check Employee ID and Password'
        : 'Please check Mobile Number and Password',
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView 
        style={{ flex: 1 }} 
        behavior={Platform.OS === 'ios' ? 'padding' : 'padding'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
      >
        <ScrollView 
          contentContainerStyle={styles.scrollContainer} 
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Back Button */}
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Icon name="arrow-back" size={24} color="#0F172A" />
          </TouchableOpacity>

          {/* Logo */}
          <View style={styles.logo}>
            <Icon
              name={isGuard ? "shield-outline" : "home-outline"}
              size={36}
              color="#fff" 
            />
          </View>

          <Text style={styles.title}>
            {isGuard ? "Guard Login" : "Welcome back"}
          </Text>

          <Text style={styles.subtitle}>
            {isGuard
              ? "Sign in with your Employee ID"
              : "Sign in to manage your visitors"}
          </Text>

          {/* Input: Username */}
          <Text style={styles.label}>
            {isGuard ? "Employee ID" : "Mobile number"}
          </Text>
          <View style={styles.inputContainer}>
            <Icon 
              name={isGuard ? "id-card-outline" : "call-outline"} 
              size={20} 
              color="#64748B" 
              style={styles.inputIcon} 
            />
            <TextInput
              style={styles.input}
              placeholder={isGuard ? "Enter Employee ID" : "+91 98765 43210"}
              value={username}
              onChangeText={setUsername}
              keyboardType={isGuard ? "default" : "phone-pad"}
              placeholderTextColor="#94A3B8"
            />
          </View>

          {/* Input: Password */}
          <Text style={styles.label}>Password</Text>
          <View style={styles.inputContainer}>
            <Icon 
              name="lock-closed-outline" 
              size={20} 
              color="#64748B" 
              style={styles.inputIcon} 
            />
            <TextInput
              style={styles.input}
              placeholder="••••••••"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              placeholderTextColor="#94A3B8"
            />
          </View>

          {/* Remember & Forgot */}
          <View style={styles.row}>
            <TouchableOpacity
              style={styles.rememberContainer}
              onPress={() => setRememberMe(!rememberMe)}
            >
              <View style={[styles.checkbox, rememberMe && styles.checked]}>
                {rememberMe && <Icon name="checkmark" size={14} color="#fff" />}
              </View>
              <Text style={styles.rememberText}>Remember me</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() =>
                Alert.alert(
                  'Reset password',
                  isGuard
                    ? 'Contact your society admin or supervisor to reset your Employee ID password.'
                    : 'Contact society office to reset your resident login. Demo password: 1234',
                )
              }
            >
              <Text style={styles.forgot}>Forgot?</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity style={styles.loginBtn} onPress={handleLogin}>
            <Text style={styles.loginBtnText}>Sign in</Text>
          </TouchableOpacity>

          <View style={styles.footer}>
            <Text style={styles.footerText}>New here? </Text>
            <TouchableOpacity
              onPress={() =>
                Alert.alert(
                  'Create account',
                  'Ask your society admin to register your flat / employee ID in IntefAI Security.',
                )
              }
            >
              <Text style={styles.footerLink}>Create account</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  scrollContainer: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 40,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#F1F5F9',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 30,
  },
  logo: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#2563EB',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#0F172A',
  },
  subtitle: {
    fontSize: 16,
    color: '#64748B',
    marginTop: 8,
    marginBottom: 32,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#475569',
    marginBottom: 8,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 20,
    paddingHorizontal: 16,
    height: 56,
    marginBottom: 20,
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#0F172A',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 40,
  },
  rememberContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 2,
    borderColor: '#2563EB',
    borderRadius: 4,
    marginRight: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checked: {
    backgroundColor: '#2563EB',
  },
  rememberText: {
    fontSize: 15,
    color: '#64748B',
  },
  forgot: {
    color: '#2563EB',
    fontSize: 15,
    fontWeight: '600',
  },
  loginBtn: {
    backgroundColor: '#2563EB',
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 30,
    elevation: 3,
    shadowColor: '#2563EB',
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 8,
  },
  loginBtnText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  footerText: {
    fontSize: 15,
    color: '#64748B',
  },
  footerLink: {
    fontSize: 15,
    color: '#2563EB',
    fontWeight: '600',
  },
});