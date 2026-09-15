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
  Dimensions,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Ionicons';
import { showToast } from '../../utils/toast';
import { authService } from '../../services/authService';

const { width } = Dimensions.get('window');

const LoginScreen = ({ route, navigation }: any) => {
  const role = route?.params?.role || 'resident';
  const isGuard = role === 'guard';

  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(false);

  const primaryColor = isGuard ? '#16A34A' : '#0066FF';
  const secondaryBg = isGuard ? 'rgba(22, 163, 74, 0.12)' : 'rgba(0, 102, 255, 0.12)';

  const handleSendOtp = async () => {
    if (!username.trim()) {
      Alert.alert('Required', 'Please enter your Mobile Number');
      return;
    }

    try {
      setLoading(true);
      await authService.login({
        identifier: username.trim(),
        role: isGuard ? 'guard' : 'resident',
      });
      showToast('OTP sent! Use 1234');
      navigation.navigate('Otp', { role, username: username.trim() });
    } catch (err: any) {
      // Fallback navigation for demo/dev mode
      showToast('OTP sent! Use 1234');
      navigation.navigate('Otp', { role, username: username.trim() });
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Background Decorative Soft Waves */}
      <View style={[styles.bgCircleTopRight, { backgroundColor: secondaryBg }]} />
      <View style={[styles.bgCircleTopLeft, { backgroundColor: secondaryBg }]} />
      <View style={[styles.bgCircleBottom, { backgroundColor: secondaryBg }]} />

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
            activeOpacity={0.7}
          >
            <Icon name="arrow-back" size={24} color="#0F172A" />
          </TouchableOpacity>

          <View style={styles.mainContent}>
            {/* Double Circle Logo Badge */}
            <View style={[styles.logoOuter, { backgroundColor: secondaryBg }]}>
              <View style={[styles.logoInner, { backgroundColor: primaryColor }]}>
                <Icon
                  name={isGuard ? 'shield-checkmark' : 'home'}
                  size={38}
                  color="#ffffff"
                />
              </View>
            </View>

            {/* Main Heading */}
            <Text style={styles.title}>
              {isGuard ? (
                <>
                  Guard <Text style={{ color: primaryColor }}>Login</Text>
                </>
              ) : (
                <>
                  Welcome <Text style={{ color: primaryColor }}>back</Text>
                </>
              )}
            </Text>

            {/* Subtitle */}
            <Text style={styles.subtitle}>Enter your mobile number to get OTP</Text>

            {/* Input Container */}
            <View style={styles.inputContainer}>
              <Icon name="call-outline" size={20} color="#64748B" />
              <View style={styles.divider} />
              <TextInput
                style={styles.input}
                placeholder="Enter your mobile number"
                value={username}
                onChangeText={setUsername}
                keyboardType="phone-pad"
                maxLength={10}
                placeholderTextColor="#A0AEC0"
                autoCapitalize="none"
                autoCorrect={false}
              />
            </View>

            {/* Send OTP Button */}
            <TouchableOpacity
              style={[styles.primaryBtn, { backgroundColor: primaryColor }, loading && { opacity: 0.7 }]}
              onPress={handleSendOtp}
              activeOpacity={0.8}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#ffffff" />
              ) : (
                <>
                  <Text style={styles.primaryBtnText}>Send OTP</Text>
                  <Icon name="arrow-forward" size={20} color="#ffffff" style={{ marginLeft: 8 }} />
                </>
              )}
            </TouchableOpacity>

            {/* Footer Assistance */}
            <View style={styles.footerContainer}>
              <Text style={styles.footerText}>
                Need assistance?{' '}
                <Text
                  style={[styles.footerLink, { color: primaryColor }]}
                  onPress={() =>
                    Alert.alert(
                      'Support',
                      'Contact your society administrator to register or update your account details.',
                    )
                  }
                >
                  Contact Support
                </Text>
              </Text>
            </View>
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
    backgroundColor: '#F4F8FF',
  },
  bgCircleTopRight: {
    position: 'absolute',
    top: -50,
    right: -50,
    width: 220,
    height: 220,
    borderRadius: 110,
    opacity: 0.5,
  },
  bgCircleTopLeft: {
    position: 'absolute',
    top: -80,
    left: -70,
    width: 250,
    height: 250,
    borderRadius: 125,
    opacity: 0.3,
  },
  bgCircleBottom: {
    position: 'absolute',
    bottom: -100,
    left: width * 0.1,
    width: width * 0.8,
    height: 200,
    borderRadius: 100,
    opacity: 0.4,
  },
  scrollContainer: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 40,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 5,
  },
  mainContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 10,
  },
  logoOuter: {
    width: 110,
    height: 110,
    borderRadius: 55,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  logoInner: {
    width: 78,
    height: 78,
    borderRadius: 39,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#0066FF',
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 10,
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
    color: '#0F172A',
    textAlign: 'center',
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 15,
    color: '#64748B',
    marginTop: 8,
    marginBottom: 32,
    textAlign: 'center',
    fontWeight: '400',
  },
  inputContainer: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 28,
    paddingHorizontal: 16,
    height: 58,
    marginBottom: 20,
    elevation: 3,
    shadowColor: '#0066FF',
    shadowOpacity: 0.06,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 10,
  },
  divider: {
    width: 1,
    height: 20,
    backgroundColor: '#E2E8F0',
    marginHorizontal: 10,
  },
  input: {
    flex: 1,
    fontSize: 14,
    color: '#0F172A',
    fontWeight: '500',
    paddingVertical: 0,
  },
  primaryBtn: {
    width: '100%',
    height: 58,
    borderRadius: 29,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 28,
    elevation: 6,
    shadowColor: '#0066FF',
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 6 },
    shadowRadius: 12,
  },
  primaryBtnText: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '700',
  },
  footerContainer: {
    alignItems: 'center',
    marginTop: 4,
  },
  footerText: {
    fontSize: 14,
    color: '#64748B',
    fontWeight: '500',
  },
  footerLink: {
    fontWeight: '700',
  },
});