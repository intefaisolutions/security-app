import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';

const VisitorRequestScreen = () => {
  const navigation = useNavigation<any>();

  const handleApprove = () => {
    // Navigate back to the Home tab and pass a parameter to show the toast
    navigation.navigate('ResidentDashboard', {
      screen: 'Home',
      params: { showToast: true, toastType: 'approve' }
    });
  };

  const handleReject = () => {
    navigation.navigate('ResidentDashboard', {
      screen: 'Home',
      params: { showToast: true, toastType: 'reject' }
    });
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Icon name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Visitor Request</Text>
      </View>

      <View style={styles.content}>
        <View style={styles.card}>
          <Image 
            source={{ uri: 'https://i.pravatar.cc/150?img=5' }} 
            style={styles.avatar} 
          />
          
          <Text style={styles.name}>Priya Verma</Text>
          <Text style={styles.subtitle}>Guest — Family visit</Text>
          
          <View style={styles.badge}>
            <Text style={styles.badgeText}>AWAITING APPROVAL</Text>
          </View>

          <View style={styles.grid}>
            <View style={styles.gridItem}>
              <View style={styles.gridItemHeader}>
                <Icon name="time-outline" size={16} color="#64748B" />
                <Text style={styles.gridItemLabel}>ENTRY TIME</Text>
              </View>
              <Text style={styles.gridItemValue}>11:05 AM</Text>
            </View>
            <View style={styles.gridItem}>
              <View style={styles.gridItemHeader}>
                <Icon name="location-outline" size={16} color="#64748B" />
                <Text style={styles.gridItemLabel}>GATE</Text>
              </View>
              <Text style={styles.gridItemValue}>Gate 1</Text>
            </View>
            <View style={styles.gridItem}>
              <View style={styles.gridItemHeader}>
                <Icon name="person-outline" size={16} color="#64748B" />
                <Text style={styles.gridItemLabel}>GUARD</Text>
              </View>
              <Text style={styles.gridItemValue}>Ramesh K.</Text>
            </View>
            <View style={styles.gridItem}>
              <View style={styles.gridItemHeader}>
                <Icon name="call-outline" size={16} color="#64748B" />
                <Text style={styles.gridItemLabel}>MOBILE</Text>
              </View>
              <Text style={styles.gridItemValue}>+91 98220...</Text>
            </View>
          </View>

          <TouchableOpacity style={styles.callGuardBtn}>
            <Icon name="call-outline" size={20} color="#0F172A" style={{ marginRight: 8 }} />
            <Text style={styles.callGuardText}>Call Guard</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.actionsContainer}>
          <TouchableOpacity style={[styles.actionBtn, styles.rejectBtn]} onPress={handleReject}>
            <Icon name="close" size={20} color="#DC2626" style={{ marginRight: 6 }} />
            <Text style={styles.rejectText}>Reject</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={[styles.actionBtn, styles.approveBtn]} onPress={handleApprove}>
            <Icon name="checkmark" size={20} color="#fff" style={{ marginRight: 6 }} />
            <Text style={styles.approveText}>Approve</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default VisitorRequestScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  header: {
    backgroundColor: '#2563EB',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 60, 
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  headerTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    marginTop: -40,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 24,
    padding: 24,
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 12,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 4,
    borderColor: '#DBEAFE',
    marginBottom: 16,
  },
  name: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#0F172A',
  },
  subtitle: {
    fontSize: 14,
    color: '#64748B',
    marginTop: 4,
    marginBottom: 12,
  },
  badge: {
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    marginBottom: 24,
  },
  badgeText: {
    color: '#B45309',
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 1,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 20,
  },
  gridItem: {
    width: '48%',
    backgroundColor: '#F1F5F9',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
  },
  gridItemHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  gridItemLabel: {
    fontSize: 10,
    fontWeight: '600',
    color: '#64748B',
    marginLeft: 6,
    letterSpacing: 0.5,
  },
  gridItemValue: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0F172A',
  },
  callGuardBtn: {
    flexDirection: 'row',
    backgroundColor: '#F1F5F9',
    width: '100%',
    height: 52,
    borderRadius: 26,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  callGuardText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#0F172A',
  },
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 24,
  },
  actionBtn: {
    flexDirection: 'row',
    flex: 1,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
  },
  rejectBtn: {
    backgroundColor: '#FEE2E2',
    marginRight: 10,
  },
  rejectText: {
    color: '#DC2626',
    fontSize: 16,
    fontWeight: 'bold',
  },
  approveBtn: {
    backgroundColor: '#10B981',
    marginLeft: 10,
  },
  approveText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
