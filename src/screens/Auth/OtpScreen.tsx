import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Dimensions,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Ionicons';
import { DemoAuth } from '../../constants/theme';
import { showToast } from '../../utils/toast';
import { authService } from '../../services/authService';

const { width } = Dimensions.get('window');
const OTP_LENGTH = 4;

const OtpScreen = ({ route, navigation }: any) => {
  const role = route?.params?.role || 'resident';
  const username = route?.params?.username || '';
  const isGuard = role === 'guard';

  const primaryColor = isGuard ? '#16A34A' : '#0066FF';
  const secondaryBg = isGuard ? 'rgba(22, 163, 74, 0.12)' : 'rgba(0, 102, 255, 0.12)';

  const [otp, setOtp] = useState(['', '', '', '']);
  const [seconds, setSeconds] = useState(30);
  const [loading, setLoading] = useState(false);
  const inputs = useRef<Array<TextInput | null>>([]);

  useEffect(() => {
    if (seconds <= 0) return;
    const timer = setTimeout(() => setSeconds(s => s - 1), 1000);
    return () => clearTimeout(timer);
  }, [seconds]);

  const code = otp.join('');

  const handleChange = (value: string, index: number) => {
    const digit = value.replace(/[^0-9]/g, '').slice(-1);
    const next = [...otp];
    next[index] = digit;
    setOtp(next);

    if (digit && index < OTP_LENGTH - 1) {
      inputs.current[index + 1]?.focus();
    }
  };

  const handleKeyPress = (key: string, index: number) => {
    if (key === 'Backspace' && !otp[index] && index > 0) {
      inputs.current[index - 1]?.focus();
    }
  };

  const finishLogin = () => {
    showToast('Verified & Logged in successfully!');
    if (isGuard) {
      navigation.reset({ index: 0, routes: [{ name: 'GuardDashboard' }] });
    } else {
      navigation.reset({ index: 0, routes: [{ name: 'ResidentDashboard' }] });
    }
  };

  const handleVerify = async () => {
    if (code.length < OTP_LENGTH) {
      Alert.alert('Incomplete OTP', 'Please enter the 4-digit code.');
      return;
    }

    try {
      setLoading(true);
      await authService.verifyOtp({
        identifier: username,
        otp: code,
        role: isGuard ? 'guard' : 'resident',
      });
      finishLogin();
    } catch (err: any) {
      const expected = isGuard ? DemoAuth.guard.otp : DemoAuth.resident.otp;
      if (code === expected || code === '1234') {
        finishLogin();
      } else {
        Alert.alert('Invalid OTP', err?.message || 'Default Demo OTP is 1234');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setSeconds(30);
    setOtp(['', '', '', '']);
    inputs.current[0]?.focus();
    try {
      await authService.resendOtp(username);
      showToast('OTP resent · Use 1234');
    } catch (err: any) {
      showToast('OTP resent · Use 1234');
    }
  };

  const maskedTarget = username
    ? `+91 ${username}`
    : 'your mobile number';

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
                <Icon name="lock-closed" size={36} color="#ffffff" />
              </View>
            </View>

            {/* Title */}
            <Text style={styles.title}>
              Verify <Text style={{ color: primaryColor }}>OTP</Text>
            </Text>

            {/* Subtitle */}
            <Text style={styles.subtitle}>
              Enter 4-digit OTP code sent to{'\n'}
              <Text style={styles.targetText}>{maskedTarget}</Text>
            </Text>

            {/* 4-Digit OTP Input Boxes */}
            <View style={styles.otpRow}>
              {otp.map((digit, index) => (
                <TextInput
                  key={index}
                  ref={ref => {
                    inputs.current[index] = ref;
                  }}
                  style={[
                    styles.otpBox,
                    digit ? { borderColor: primaryColor, backgroundColor: '#F0F9FF' } : null,
                  ]}
                  value={digit}
                  onChangeText={value => handleChange(value, index)}
                  onKeyPress={({ nativeEvent }) => handleKeyPress(nativeEvent.key, index)}
                  keyboardType="number-pad"
                  maxLength={1}
                  selectTextOnFocus
                />
              ))}
            </View>

            {/* Verify & Continue Pill Button */}
            <TouchableOpacity
              style={[
                styles.primaryBtn,
                { backgroundColor: primaryColor },
                (code.length < OTP_LENGTH || loading) && styles.btnDisabled,
              ]}
              onPress={handleVerify}
              disabled={code.length < OTP_LENGTH || loading}
              activeOpacity={0.8}
            >
              {loading ? (
                <ActivityIndicator color="#ffffff" />
              ) : (
                <>
                  <Text style={styles.primaryBtnText}>Verify & Continue</Text>
                  <Icon name="arrow-forward" size={20} color="#ffffff" style={{ marginLeft: 8 }} />
                </>
              )}
            </TouchableOpacity>

            {/* Resend Section */}
            <View style={styles.resendRow}>
              {seconds > 0 ? (
                <Text style={styles.resendText}>Resend code in <Text style={{ fontWeight: '700', color: primaryColor }}>{seconds}s</Text></Text>
              ) : (
                <TouchableOpacity onPress={handleResend}>
                  <Text style={[styles.resendLink, { color: primaryColor }]}>Resend OTP</Text>
                </TouchableOpacity>
              )}
            </View>

            <Text style={styles.hint}>Demo OTP: 1234</Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default OtpScreen;

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
    lineHeight: 22,
  },
  targetText: {
    fontWeight: '700',
    color: '#0F172A',
  },
  otpRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 16,
    marginBottom: 32,
  },
  otpBox: {
    width: 58,
    height: 58,
    borderRadius: 18,
    borderWidth: 1.5,
    borderColor: '#CBD5E1',
    backgroundColor: '#FFFFFF',
    textAlign: 'center',
    fontSize: 24,
    fontWeight: '800',
    color: '#0F172A',
    elevation: 3,
    shadowColor: '#0066FF',
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 10,
  },
  primaryBtn: {
    width: '100%',
    height: 58,
    borderRadius: 29,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
    elevation: 6,
    shadowColor: '#0066FF',
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 6 },
    shadowRadius: 12,
  },
  btnDisabled: {
    opacity: 0.5,
  },
  primaryBtnText: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '700',
  },
  resendRow: {
    alignItems: 'center',
    marginBottom: 16,
  },
  resendText: {
    color: '#64748B',
    fontSize: 14,
  },
  resendLink: {
    fontSize: 14,
    fontWeight: '700',
  },
  hint: {
    textAlign: 'center',
    color: '#94A3B8',
    fontSize: 14,
    fontWeight: '500',
  },
});
