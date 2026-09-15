import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import { Brand } from '../../constants/theme';

const ProfileScreen = () => {
  const navigation = useNavigation<any>();

  const handleLogout = () => {
    navigation.reset({
      index: 0,
      routes: [{ name: 'Splash' }],
    });
  };

  const menuItems = [
    { id: '1', title: 'Family Members', icon: 'people-outline', rightText: '4 members', message: 'Arjun, Priya, Kabir, Anaya — manage family access from society office.' },
    { id: '2', title: 'Notification Preferences', icon: 'notifications-outline', message: 'Visitor alerts, community notices and SOS are enabled.' },
    { id: '3', title: 'Privacy & Security', icon: 'shield-checkmark-outline', message: `${Brand.name} encrypts visitor logs. Change password via society admin.` },
    { id: '4', title: 'App Settings', icon: 'settings-outline', message: 'Language: English · Theme: Light · Gate alerts: On' },
    { id: '5', title: 'Help & Support', icon: 'help-circle-outline', message: 'Email support@intefai.com or call society office for help.' },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Profile</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Profile Card */}
        <View style={styles.profileCard}>
          <Image 
            source={{ uri: 'https://i.pravatar.cc/150?img=11' }} 
            style={styles.avatar} 
          />
          <View style={styles.profileInfo}>
            <Text style={styles.name}>Arjun Mehta</Text>
            <Text style={styles.address}>A-1203, Tower A</Text>
            <Text style={styles.phone}>+91 98765 43210</Text>
          </View>
          <TouchableOpacity
            style={styles.editBtn}
            onPress={() =>
              Alert.alert('Edit profile', 'Contact society office to update your flat profile details.')
            }
          >
            <Text style={styles.editBtnText}>Edit</Text>
          </TouchableOpacity>
        </View>

        {/* Stats Card */}
        <View style={styles.statsCard}>
          <View style={styles.statBox}>
            <Text style={styles.statNumber}>128</Text>
            <Text style={styles.statLabel}>VISITORS</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statNumber}>24</Text>
            <Text style={styles.statLabel}>INVITES</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statNumber}>4</Text>
            <Text style={styles.statLabel}>FAMILY</Text>
          </View>
        </View>

        {/* Menu Items */}
        <View style={styles.menuContainer}>
          {menuItems.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={styles.menuItem}
              onPress={() => Alert.alert(item.title, item.message)}
            >
              <View style={styles.menuIconContainer}>
                <Icon name={item.icon} size={20} color="#2563EB" />
              </View>
              <Text style={styles.menuTitle}>{item.title}</Text>
              {item.rightText && (
                <Text style={styles.menuRightText}>{item.rightText}</Text>
              )}
              <Icon name="chevron-forward" size={20} color="#94A3B8" />
            </TouchableOpacity>
          ))}
          
          {/* Logout Button */}
          <TouchableOpacity style={styles.menuItem} onPress={handleLogout}>
            <View style={[styles.menuIconContainer, { backgroundColor: '#FEE2E2' }]}>
              <Icon name="log-out-outline" size={20} color="#DC2626" />
            </View>
            <Text style={[styles.menuTitle, { color: '#DC2626' }]}>Logout</Text>
            <Icon name="chevron-forward" size={20} color="#94A3B8" />
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default ProfileScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 15,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#0F172A',
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  profileCard: {
    backgroundColor: '#fff',
    borderRadius: 24,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  avatar: {
    width: 70,
    height: 70,
    borderRadius: 35,
    marginRight: 16,
  },
  profileInfo: {
    flex: 1,
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#0F172A',
    marginBottom: 4,
  },
  address: {
    fontSize: 14,
    color: '#64748B',
    marginBottom: 2,
  },
  phone: {
    fontSize: 14,
    color: '#64748B',
  },
  editBtn: {
    backgroundColor: '#2563EB',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  editBtnText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
  statsCard: {
    backgroundColor: '#fff',
    borderRadius: 24,
    padding: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  statBox: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: 'center',
    marginHorizontal: 4,
  },
  statNumber: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#2563EB',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 10,
    color: '#64748B',
    fontWeight: '700',
    letterSpacing: 1,
  },
  menuContainer: {
    marginBottom: 20,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 12,
    marginBottom: 12,
    elevation: 1,
    shadowColor: '#000',
    shadowOpacity: 0.03,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 4,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  menuIconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#DBEAFE',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  menuTitle: {
    flex: 1,
    fontSize: 16,
    fontWeight: '600',
    color: '#0F172A',
  },
  menuRightText: {
    fontSize: 14,
    color: '#64748B',
    marginRight: 8,
  },
});