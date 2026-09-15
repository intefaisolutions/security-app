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
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Ionicons';
import { Brand, Colors, DemoAuth } from '../../constants/theme';
import { showToast } from '../../utils/toast';

const OTP_LENGTH = 6;

const OtpScreen = ({ route, navigation }: any) => {
  const role = route?.params?.role || 'resident';
  const username = route?.params?.username || '';
  const isGuard = role === 'guard';

  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [seconds, setSeconds] = useState(30);
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
    if (isGuard) {
      navigation.reset({ index: 0, routes: [{ name: 'GuardDashboard' }] });
    } else {
      navigation.reset({ index: 0, routes: [{ name: 'ResidentDashboard' }] });
    }
  };

  const handleVerify = () => {
    const expected = isGuard ? DemoAuth.guard.otp : DemoAuth.resident.otp;
    if (code.length < OTP_LENGTH) {
      Alert.alert('Incomplete OTP', 'Please enter the 6-digit code.');
      return;
    }
    if (code !== expected) {
      Alert.alert('Invalid OTP', 'Demo OTP is 123456');
      return;
    }
    showToast('Verified successfully');
    finishLogin();
  };

  const handleResend = () => {
    setSeconds(30);
    setOtp(['', '', '', '', '', '']);
    inputs.current[0]?.focus();
    showToast('OTP resent · use 123456');
  };

  const maskedTarget = isGuard
    ? username || 'EMP****'
    : username
      ? `+91 ${username.slice(0, 2)}****${username.slice(-2)}`
      : '+91 ******';

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Icon name="arrow-back" size={24} color={Colors.text} />
        </TouchableOpacity>

        <View style={styles.logo}>
          <Icon name="shield-checkmark-outline" size={32} color={Colors.white} />
        </View>

        <Text style={styles.title}>Verify OTP</Text>
        <Text style={styles.subtitle}>
          Enter the 6-digit code sent for {Brand.shortName}
          {'\n'}
          {maskedTarget}
        </Text>

        <View style={styles.otpRow}>
          {otp.map((digit, index) => (
            <TextInput
              key={index}
              ref={ref => {
                inputs.current[index] = ref;
              }}
              style={[styles.otpBox, digit ? styles.otpBoxFilled : null]}
              value={digit}
              onChangeText={value => handleChange(value, index)}
              onKeyPress={({ nativeEvent }) => handleKeyPress(nativeEvent.key, index)}
              keyboardType="number-pad"
              maxLength={1}
              selectTextOnFocus
            />
          ))}
        </View>

        <TouchableOpacity
          style={[styles.verifyBtn, code.length < OTP_LENGTH && styles.verifyBtnDisabled]}
          onPress={handleVerify}
          disabled={code.length < OTP_LENGTH}
        >
          <Text style={styles.verifyBtnText}>Verify & Continue</Text>
        </TouchableOpacity>

        <View style={styles.resendRow}>
          {seconds > 0 ? (
            <Text style={styles.resendText}>Resend code in {seconds}s</Text>
          ) : (
            <TouchableOpacity onPress={handleResend}>
              <Text style={styles.resendLink}>Resend OTP</Text>
            </TouchableOpacity>
          )}
        </View>

        <Text style={styles.hint}>Demo OTP: 123456</Text>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default OtpScreen;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  container: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 20,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.border,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 28,
  },
  logo: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: Colors.text,
  },
  subtitle: {
    fontSize: 15,
    color: Colors.textSecondary,
    marginTop: 8,
    marginBottom: 32,
    lineHeight: 22,
  },
  otpRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 32,
  },
  otpBox: {
    width: 48,
    height: 56,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: Colors.borderStrong,
    backgroundColor: Colors.surface,
    textAlign: 'center',
    fontSize: 22,
    fontWeight: '700',
    color: Colors.text,
  },
  otpBoxFilled: {
    borderColor: Colors.primary,
    backgroundColor: Colors.primarySoft,
  },
  verifyBtn: {
    backgroundColor: Colors.primary,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
  },
  verifyBtnDisabled: {
    opacity: 0.5,
  },
  verifyBtnText: {
    color: Colors.white,
    fontSize: 17,
    fontWeight: '700',
  },
  resendRow: {
    alignItems: 'center',
    marginTop: 24,
  },
  resendText: {
    color: Colors.textSecondary,
    fontSize: 14,
  },
  resendLink: {
    color: Colors.primary,
    fontSize: 15,
    fontWeight: '600',
  },
  hint: {
    marginTop: 28,
    textAlign: 'center',
    color: Colors.textMuted,
    fontSize: 13,
  },
});
