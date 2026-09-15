import React from 'react';
import {
  View,
  Text,
  StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Ionicons';
import RoleCard from '../../components/RoleCard';
import { Brand } from '../../constants/theme';

const RoleSelectionScreen = ({ navigation }: any) => {
  return (
    <SafeAreaView style={styles.container}>

      {/* Top Icon */}
      <View style={styles.logo}>
        <Icon name="shield-checkmark-outline" size={40} color="#fff" />
      </View>

      {/* Heading */}
      <Text style={styles.title}>Choose your role</Text>

      <Text style={styles.subtitle}>
        How will you be using {Brand.name}?
      </Text>

      {/* Resident Card */}
      <RoleCard
        title="Resident"
        subtitle="Approve visitors, notices & services"
        icon="home-outline"
        iconColor="#2563EB"
        iconBg="#DBEAFE"
        onPress={() =>
          navigation.navigate('Login', {
            role: 'resident',
          })
        }
      />

      {/* Guard Card */}
      <RoleCard
        title="Security Guard"
        subtitle="Log visitors & manage the gate"
        icon="shield-checkmark-outline"
        iconColor="#16A34A"
        iconBg="#DCFCE7"
        onPress={() =>
          navigation.navigate('Login', {
            role: 'guard',
          })
        }
      />

      <View style={{ flex: 1 }} />

      <Text style={styles.footer}>
        By continuing you agree to our
        <Text style={{ color: '#2563EB' }}> Terms & Privacy</Text>
      </Text>

    </SafeAreaView>
  );
};

export default RoleSelectionScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    paddingHorizontal: 25,
    paddingTop: 30, // Reduced from 70 since SafeAreaView handles the top inset
  },

  logo: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#2563EB',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    marginBottom: 25,
  },

  title: {
    fontSize: 34,
    fontWeight: '700',
    textAlign: 'center',
    color: '#000',
  },

  subtitle: {
    fontSize: 18,
    color: '#666',
    textAlign: 'center',
    marginTop: 12,
    marginBottom: 40,
  },

  footer: {
    textAlign: 'center',
    marginBottom: 20, // Reduced slightly since SafeAreaView handles bottom inset
    color: '#666',
    fontSize: 15,
  },
});