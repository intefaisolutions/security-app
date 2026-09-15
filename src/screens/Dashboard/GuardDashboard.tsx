import { useNavigation, CommonActions, useRoute } from '@react-navigation/native';
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, StatusBar, ScrollView, TextInput, Image, Linking, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import FeatherIcon from 'react-native-vector-icons/Feather';
import { showToast } from '../../utils/toast';

const ResidentsList = () => {
  const [searchQuery, setSearchQuery] = useState('');

  const residents = [
    { id: '1', name: 'Arjun Mehta', flat: 'A-1203 • Tower A', initials: 'AM', phone: '+919876543210' },
    { id: '2', name: 'Sneha Kapoor', flat: 'B-0505 • Tower B', initials: 'SK', phone: '+919876543211' },
    { id: '3', name: 'Vikram Reddy', flat: 'C-0802 • Tower C', initials: 'VR', phone: '+919876543212' },
    { id: '4', name: 'Neha Malhotra', flat: 'A-0304 • Tower A', initials: 'NM', phone: '+919876543213' },
    { id: '5', name: 'Rohit Gupta', flat: 'D-1101 • Tower D', initials: 'RG', phone: '+919876543214' },
    { id: '6', name: 'Ananya Singh', flat: 'B-0201 • Tower B', initials: 'AS', phone: '+919876543215' },
    { id: '7', name: 'Kiran Joshi', flat: 'C-0409 • Tower C', initials: 'KJ', phone: '+919876543216' },
  ];

  const filteredResidents = residents.filter(resident => 
    resident.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    resident.flat.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <View style={styles.residentsContainer}>
      <View style={styles.residentsHeader}>
        <Text style={styles.residentsTitle}>Residents</Text>
        <Text style={styles.residentsSubtitle}>Search by name or flat</Text>
      </View>

      <View style={styles.searchContainer}>
        <Icon name="search-outline" size={20} color="#64748B" style={styles.searchIcon} />
        <TextInput 
          style={styles.searchInput}
          placeholder="Search name or flat number"
          placeholderTextColor="#94A3B8"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      {filteredResidents.map((resident) => (
        <View key={resident.id} style={styles.residentCard}>
          <View style={styles.residentLeft}>
            <View style={[styles.avatar, { backgroundColor: '#DBEAFE' }]}>
              <Text style={[styles.avatarText, { color: '#2563EB' }]}>{resident.initials}</Text>
            </View>
            <View>
              <Text style={styles.residentName}>{resident.name}</Text>
              <Text style={styles.residentFlat}>{resident.flat}</Text>
            </View>
          </View>
          <TouchableOpacity 
            style={styles.callButton}
            onPress={() => Linking.openURL(`tel:${resident.phone}`)}
          >
            <FeatherIcon name="phone" size={18} color="#059669" />
          </TouchableOpacity>
        </View>
      ))}
    </View>
  );
};

const NotificationsList = () => {
  const [notifications, setNotifications] = useState([
    {
      id: '1',
      title: 'Visitor Approved',
      message: 'Arjun Mehta approved Priya Verma',
      time: '1 min ago',
      type: 'approved',
      read: false,
    },
    {
      id: '2',
      title: 'Visitor Rejected',
      message: 'Sneha Kapoor rejected a delivery',
      time: '18 min ago',
      type: 'rejected',
      read: false,
    },
    {
      id: '3',
      title: 'Emergency Alert',
      message: 'SOS from Flat C-0802',
      time: '2 hr ago',
      type: 'emergency',
      read: false,
    },
    {
      id: '4',
      title: 'Visitor Approved',
      message: 'Vikram Reddy approved a guest',
      time: '3 hr ago',
      type: 'approved',
      read: true,
    },
  ]);

  const unreadCount = notifications.filter(n => !n.read).length;

  const getIcon = (type: string) => {
    switch (type) {
      case 'approved':
        return <FeatherIcon name="user-check" size={20} color="#059669" />;
      case 'rejected':
        return <FeatherIcon name="user-x" size={20} color="#DC2626" />;
      case 'emergency':
        return <FeatherIcon name="alert-triangle" size={20} color="#FFFFFF" />;
      default:
        return <FeatherIcon name="bell" size={20} color="#64748B" />;
    }
  };

  const getIconBg = (type: string) => {
    switch (type) {
      case 'approved':
        return { backgroundColor: '#D1FAE5' };
      case 'rejected':
        return { backgroundColor: '#FEE2E2' };
      case 'emergency':
        return { backgroundColor: '#DC2626' };
      default:
        return { backgroundColor: '#F1F5F9' };
    }
  };

  return (
    <View style={styles.notificationsContainer}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <View>
          <Text style={[styles.notificationsTitle, { marginBottom: 2 }]}>Notifications</Text>
          <Text style={{ fontSize: 13, color: '#64748B' }}>
            {unreadCount > 0 ? `${unreadCount} unread` : 'All caught up'}
          </Text>
        </View>
        <TouchableOpacity
          onPress={() => {
            setNotifications(prev => prev.map(n => ({ ...n, read: true })));
            showToast(unreadCount > 0 ? 'All notifications marked as read' : 'All caught up');
          }}
        >
          <Text style={{ color: '#2563EB', fontWeight: '600', fontSize: 14 }}>Mark all read</Text>
        </TouchableOpacity>
      </View>

      {notifications.map((notif) => (
        <TouchableOpacity
          key={notif.id}
          style={[styles.notificationCard, !notif.read && { backgroundColor: '#EFF6FF' }]}
          activeOpacity={0.85}
          onPress={() =>
            setNotifications(prev =>
              prev.map(n => (n.id === notif.id ? { ...n, read: true } : n)),
            )
          }
        >
          <View style={styles.notificationLeft}>
            <View style={[styles.notificationIconWrapper, getIconBg(notif.type)]}>
              {getIcon(notif.type)}
            </View>
            <View style={styles.notificationTextContainer}>
              <Text style={styles.notificationCardTitle}>{notif.title}</Text>
              <Text style={styles.notificationMessage}>{notif.message}</Text>
            </View>
          </View>
          <View style={{ alignItems: 'flex-end' }}>
            {!notif.read && (
              <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: '#2563EB', marginBottom: 6 }} />
            )}
            <Text style={styles.notificationTime}>{notif.time}</Text>
          </View>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const ProfileView = () => {
  const navigation = useNavigation();

  const handleLogout = () => {
    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{ name: 'Splash' }],
      })
    );
  };

  return (
    <View style={styles.profileContainer}>
      <Text style={styles.profileTitle}>My Profile</Text>

      {/* Main Profile Card */}
      <View style={styles.profileMainCard}>
        <View style={styles.profileImageContainer}>
          <Image 
            source={{ uri: 'https://randomuser.me/api/portraits/men/32.jpg' }} 
            style={styles.profileImage}
          />
        </View>
        <View style={styles.profileMainDetails}>
          <Text style={styles.profileMainName}>Ramesh Kumar</Text>
          <Text style={styles.profileRoleText}>Security Guard</Text>
          <View style={styles.empBadgeWrapper}>
            <Text style={styles.empBadgeText}>EMP-2481</Text>
          </View>
        </View>
      </View>

      {/* Detail Cards */}
      <View style={styles.detailCard}>
        <View style={styles.detailIconWrapper}>
          <FeatherIcon name="award" size={20} color="#2563EB" />
        </View>
        <View style={styles.detailTextWrapper}>
          <Text style={styles.detailLabel}>EMPLOYEE ID</Text>
          <Text style={styles.detailValue}>EMP-2481</Text>
        </View>
      </View>

      <View style={styles.detailCard}>
        <View style={styles.detailIconWrapper}>
          <FeatherIcon name="map-pin" size={20} color="#2563EB" />
        </View>
        <View style={styles.detailTextWrapper}>
          <Text style={styles.detailLabel}>ASSIGNED GATE</Text>
          <Text style={styles.detailValue}>Gate 2 • Main Entry</Text>
        </View>
      </View>

      <View style={styles.detailCard}>
        <View style={styles.detailIconWrapper}>
          <FeatherIcon name="clock" size={20} color="#2563EB" />
        </View>
        <View style={styles.detailTextWrapper}>
          <Text style={styles.detailLabel}>SHIFT TIMING</Text>
          <Text style={styles.detailValue}>8:00 AM – 8:00 PM</Text>
        </View>
      </View>

      <View style={styles.detailCard}>
        <View style={styles.detailIconWrapper}>
          <FeatherIcon name="shield" size={20} color="#2563EB" />
        </View>
        <View style={styles.detailTextWrapper}>
          <Text style={styles.detailLabel}>SUPERVISOR</Text>
          <Text style={styles.detailValue}>Mr. Singh • +91 98220 55555</Text>
        </View>
      </View>

      {/* Logout Button */}
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout} activeOpacity={0.8}>
        <FeatherIcon name="log-out" size={20} color="#DC2626" />
        <Text style={styles.logoutButtonText}>Log Out</Text>
      </TouchableOpacity>
    </View>
  );
};

const GuardDashboard = () => {
  const navigation = useNavigation();
  const route = useRoute<any>();
  const [isOnDuty, setIsOnDuty] = useState(true);
  const [activeTab, setActiveTab] = useState('Home');

  const [recentEntries, setRecentEntries] = useState([
    { id: '1', initials: 'PV', name: 'Priya Verma', details: 'Visiting A-1203 • 11:05 AM', status: 'PENDING', statusColor: '#B45309', statusBg: '#FFEDD5' },
    { id: '2', initials: 'RS', name: 'Rahul Sharma', details: 'Visiting B-0505 • 10:24 AM', status: 'APPROVED', statusColor: '#059669', statusBg: '#D1FAE5' },
    { id: '3', initials: 'SK', name: 'Suresh Kumar', details: 'Visiting C-0802 • 12:12 PM', status: 'APPROVED', statusColor: '#059669', statusBg: '#D1FAE5' },
  ]);

  useEffect(() => {
    if (route.params?.newEntry) {
      setRecentEntries((prev) => [route.params.newEntry, ...prev]);
      navigation.setParams({ newEntry: undefined } as any);
    }
  }, [route.params?.newEntry]);

  const toggleShift = () => {
    setIsOnDuty(!isOnDuty);
  };

  const renderContent = () => {
    if (activeTab === 'Residents') {
      return (
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          <ResidentsList />
        </ScrollView>
      );
    }
    
    if (activeTab === 'Alerts') {
      return (
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          <NotificationsList />
        </ScrollView>
      );
    }

    if (activeTab === 'Profile') {
      return (
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          <ProfileView />
        </ScrollView>
      );
    }

    // Default Home Tab
    return (
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Header Section */}
        <View style={styles.header}>
          <View style={styles.headerTop}>
            <View>
              <Text style={styles.greeting}>Hello Guard</Text>
              <Text style={styles.guardName}>Ramesh Kumar</Text>
              <Text style={styles.shiftInfo}>Gate 2 • Shift 8 AM – 8 PM</Text>
            </View>
            <TouchableOpacity style={styles.notificationBtn} onPress={() => setActiveTab('Alerts')}>
              <View style={styles.notificationDot} />
              <Icon name="notifications-outline" size={24} color="#FFFFFF" />
            </TouchableOpacity>
          </View>

          {/* Shift Toggle Button */}
          <TouchableOpacity 
            style={[styles.shiftButton, { backgroundColor: isOnDuty ? '#10B981' : '#EF4444' }]} 
            onPress={toggleShift}
            activeOpacity={0.8}
          >
            <View>
              <Text style={styles.shiftStatusText}>{isOnDuty ? 'ON DUTY' : 'OFF DUTY'}</Text>
              <Text style={styles.shiftActionText}>{isOnDuty ? 'End Shift' : 'Start Shift'}</Text>
            </View>
            <View style={styles.shiftIconContainer}>
              <FeatherIcon name={isOnDuty ? "arrow-right" : "play"} size={24} color="#FFFFFF" />
            </View>
          </TouchableOpacity>
        </View>
        
        {/* Main Body */}
        <View style={styles.body}>
          
          {/* Action Buttons */}
          <View style={styles.actionRow}>
            <TouchableOpacity 
              style={[styles.actionCard, styles.actionCardPrimary]}
              onPress={() => (navigation as any).navigate('VisitorEntry')}
            >
              <View style={styles.actionIconWrapperPrimary}>
                <FeatherIcon name="camera" size={24} color="#FFFFFF" />
              </View>
              <Text style={styles.actionTextPrimary}>Visitor Entry</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.actionCard, styles.actionCardSecondary]}
              onPress={() => (navigation as any).navigate('VisitorExit')}
            >
              <View style={styles.actionIconWrapperSecondary}>
                <FeatherIcon name="log-out" size={24} color="#2563EB" />
              </View>
              <Text style={styles.actionTextSecondary}>Visitor Exit</Text>
            </TouchableOpacity>
          </View>

          {/* Stats Cards */}
          <View style={styles.statsRow}>
            <View style={styles.statCard}>
              <View style={[styles.statIconWrapper, { backgroundColor: '#DBEAFE' }]}>
                <Icon name="people-outline" size={20} color="#2563EB" />
              </View>
              <Text style={styles.statNumber}>28</Text>
              <Text style={styles.statLabel}>Today</Text>
            </View>
            
            <View style={styles.statCard}>
              <View style={[styles.statIconWrapper, { backgroundColor: '#FFEDD5' }]}>
                <Icon name="time-outline" size={20} color="#F59E0B" />
              </View>
              <Text style={styles.statNumber}>3</Text>
              <Text style={styles.statLabel}>Pending</Text>
            </View>
            
            <View style={styles.statCard}>
              <View style={[styles.statIconWrapper, { backgroundColor: '#D1FAE5' }]}>
                <Icon name="checkmark-circle-outline" size={20} color="#10B981" />
              </View>
              <Text style={styles.statNumber}>12</Text>
              <Text style={styles.statLabel}>Inside</Text>
            </View>
          </View>

          {/* Recent Entries Header */}
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recent Entries</Text>
            <TouchableOpacity style={styles.viewAllBtn} onPress={() => setActiveTab('Residents')}>
              <Icon name="search-outline" size={16} color="#2563EB" style={{marginRight: 4}} />
              <Text style={styles.viewAllText}>Residents</Text>
            </TouchableOpacity>
          </View>

          {/* Recent Entries List */}
          <View style={styles.entryList}>
            {recentEntries.map((entry) => (
              <View key={entry.id} style={styles.entryCard}>
                <View style={styles.entryLeft}>
                  <View style={[styles.avatar, { backgroundColor: '#DBEAFE' }]}>
                    <Text style={[styles.avatarText, { color: '#2563EB' }]}>{entry.initials}</Text>
                  </View>
                  <View>
                    <Text style={styles.entryName}>{entry.name}</Text>
                    <Text style={styles.entryDetails}>{entry.details}</Text>
                  </View>
                </View>
                <View style={[styles.statusBadge, { backgroundColor: entry.statusBg }]}>
                  <Text style={[styles.statusText, { color: entry.statusColor }]}>{entry.status}</Text>
                </View>
              </View>
            ))}
          </View>

          {/* Emergency Alert Button */}
          <TouchableOpacity
            style={styles.emergencyButton}
            activeOpacity={0.8}
            onPress={() =>
              Alert.alert(
                'Emergency Alert',
                'This will notify all residents and the control room. Continue?',
                [
                  { text: 'Cancel', style: 'cancel' },
                  {
                    text: 'Send Alert',
                    style: 'destructive',
                    onPress: () => {
                      showToast('Emergency alert sent to residents & control room');
                      Linking.openURL('tel:100');
                    },
                  },
                ],
              )
            }
          >
            <View style={styles.emergencyIconWrapper}>
              <FeatherIcon name="alert-triangle" size={28} color="#FFFFFF" />
            </View>
            <View>
              <Text style={styles.emergencyTitle}>Emergency Alert</Text>
              <Text style={styles.emergencySub}>Notify all residents & control room</Text>
            </View>
          </TouchableOpacity>

        </View>
      </ScrollView>
    );
  };

  const getStatusBarColor = () => {
    if (activeTab === 'Residents' || activeTab === 'Alerts' || activeTab === 'Profile') {
      return '#F8FAFC';
    }
    return '#2563EB';
  };

  const getStatusBarStyle = () => {
    if (activeTab === 'Residents' || activeTab === 'Alerts' || activeTab === 'Profile') {
      return 'dark-content';
    }
    return 'light-content';
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle={getStatusBarStyle()} backgroundColor={getStatusBarColor()} />
      
      {renderContent()}

      {/* Bottom Navigation */}
      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.navItem} onPress={() => setActiveTab('Home')}>
          <View style={[styles.navIconWrapper, activeTab === 'Home' && { backgroundColor: '#DBEAFE' }]}>
            <Icon name={activeTab === 'Home' ? 'home' : 'home-outline'} size={22} color={activeTab === 'Home' ? '#2563EB' : '#64748B'} />
          </View>
          <Text style={activeTab === 'Home' ? styles.navTextActive : styles.navText}>Home</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.navItem} onPress={() => setActiveTab('Residents')}>
          <View style={[styles.navIconWrapper, activeTab === 'Residents' && { backgroundColor: '#DBEAFE' }]}>
            <Icon name={activeTab === 'Residents' ? 'people' : 'people-outline'} size={24} color={activeTab === 'Residents' ? '#2563EB' : '#64748B'} />
          </View>
          <Text style={activeTab === 'Residents' ? styles.navTextActive : styles.navText}>Residents</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.navItem} onPress={() => setActiveTab('Alerts')}>
          <View style={[styles.navIconWrapper, activeTab === 'Alerts' && { backgroundColor: '#DBEAFE' }]}>
            <Icon name={activeTab === 'Alerts' ? 'notifications' : 'notifications-outline'} size={22} color={activeTab === 'Alerts' ? '#2563EB' : '#64748B'} />
          </View>
          <Text style={activeTab === 'Alerts' ? styles.navTextActive : styles.navText}>Alerts</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.navItem} onPress={() => setActiveTab('Profile')}>
          <View style={[styles.navIconWrapper, activeTab === 'Profile' && { backgroundColor: '#DBEAFE' }]}>
            <Icon name={activeTab === 'Profile' ? 'person' : 'person-outline'} size={22} color={activeTab === 'Profile' ? '#2563EB' : '#64748B'} />
          </View>
          <Text style={activeTab === 'Profile' ? styles.navTextActive : styles.navText}>Profile</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  scrollContent: {
    paddingBottom: 100, // Make room for bottom nav
  },
  header: {
    backgroundColor: '#2563EB',
    padding: 24,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
    paddingTop: 50, // For status bar area
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 28,
  },
  greeting: {
    color: '#E0E7FF',
    fontSize: 14,
    fontWeight: '500',
  },
  guardName: {
    color: '#FFFFFF',
    fontSize: 26,
    fontWeight: 'bold',
    marginTop: 4,
    marginBottom: 6,
  },
  shiftInfo: {
    color: '#E0E7FF',
    fontSize: 13,
  },
  notificationBtn: {
    width: 44,
    height: 44,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  notificationDot: {
    position: 'absolute',
    top: 10,
    right: 12,
    width: 8,
    height: 8,
    backgroundColor: '#10B981',
    borderRadius: 4,
    zIndex: 1,
    borderWidth: 1,
    borderColor: '#2563EB',
  },
  shiftButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  shiftStatusText: {
    color: 'rgba(255, 255, 255, 0.9)',
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: 1.2,
    marginBottom: 6,
  },
  shiftActionText: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: 'bold',
  },
  shiftIconContainer: {
    width: 52,
    height: 52,
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    borderRadius: 26,
    justifyContent: 'center',
    alignItems: 'center',
  },
  body: {
    padding: 24,
  },
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  actionCard: {
    width: '47%',
    padding: 20,
    borderRadius: 24,
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
    minHeight: 140,
  },
  actionCardPrimary: {
    backgroundColor: '#2563EB',
  },
  actionCardSecondary: {
    backgroundColor: '#FFFFFF',
  },
  actionIconWrapperPrimary: {
    width: 56,
    height: 56,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  actionIconWrapperSecondary: {
    width: 56,
    height: 56,
    borderRadius: 20,
    backgroundColor: '#EFF6FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  actionTextPrimary: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  actionTextSecondary: {
    color: '#1E293B',
    fontSize: 18,
    fontWeight: 'bold',
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 32,
  },
  statCard: {
    backgroundColor: '#FFFFFF',
    width: '31%',
    padding: 16,
    borderRadius: 20,
    alignItems: 'flex-start',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  statIconWrapper: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1E293B',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 13,
    color: '#64748B',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#0F172A',
  },
  viewAllBtn: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  viewAllText: {
    color: '#2563EB',
    fontWeight: '600',
    fontSize: 14,
  },
  entryList: {
    marginBottom: 24,
  },
  entryCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 20,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  entryLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  avatarText: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  entryName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1E293B',
    marginBottom: 4,
  },
  entryDetails: {
    fontSize: 13,
    color: '#64748B',
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 11,
    fontWeight: 'bold',
  },
  emergencyButton: {
    backgroundColor: '#DC2626',
    borderRadius: 24,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#DC2626',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
    marginBottom: 20,
  },
  emergencyIconWrapper: {
    width: 56,
    height: 56,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  emergencyTitle: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  emergencySub: {
    color: '#FECACA',
    fontSize: 14,
  },
  bottomNav: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    elevation: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: -2 },
    shadowRadius: 8,
  },
  navItem: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 70,
  },
  navIconWrapper: {
    width: 50,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 4,
  },
  navTextActive: {
    color: '#2563EB',
    fontSize: 12,
    fontWeight: '700',
  },
  navText: {
    color: '#64748B',
    fontSize: 12,
    fontWeight: '500',
  },
  
  // Residents styles
  residentsContainer: {
    padding: 24,
    paddingTop: 60,
  },
  residentsHeader: {
    marginBottom: 24,
  },
  residentsTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#0F172A',
    marginBottom: 4,
  },
  residentsSubtitle: {
    fontSize: 15,
    color: '#64748B',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  searchIcon: {
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#1E293B',
    padding: 0,
  },
  residentCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 20,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  residentLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  residentName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1E293B',
    marginBottom: 4,
  },
  residentFlat: {
    fontSize: 13,
    color: '#64748B',
  },
  callButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#D1FAE5',
    justifyContent: 'center',
    alignItems: 'center',
  },

  // Notifications styles
  notificationsContainer: {
    padding: 24,
    paddingTop: 60,
  },
  notificationsTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#0F172A',
    marginBottom: 24,
  },
  notificationCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 20,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  notificationLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  notificationIconWrapper: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  notificationTextContainer: {
    flex: 1,
    paddingRight: 10,
  },
  notificationCardTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1E293B',
    marginBottom: 4,
  },
  notificationMessage: {
    fontSize: 13,
    color: '#64748B',
    lineHeight: 18,
  },
  notificationTime: {
    fontSize: 12,
    color: '#94A3B8',
    marginTop: 2,
  },

  // Profile styles
  profileContainer: {
    padding: 24,
    paddingTop: 60,
  },
  profileTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#0F172A',
    marginBottom: 24,
  },
  profileMainCard: {
    backgroundColor: '#2563EB',
    borderRadius: 24,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    shadowColor: '#2563EB',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 8,
  },
  profileImageContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#E0E7FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
    borderWidth: 3,
    borderColor: 'rgba(255,255,255,0.3)',
    overflow: 'hidden',
  },
  profileImage: {
    width: '100%',
    height: '100%',
  },
  profileMainDetails: {
    flex: 1,
  },
  profileMainName: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  profileRoleText: {
    fontSize: 14,
    color: '#BFDBFE',
    marginBottom: 8,
  },
  empBadgeWrapper: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  empBadgeText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  detailCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#F1F5F9',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  detailIconWrapper: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#EFF6FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  detailTextWrapper: {
    flex: 1,
  },
  detailLabel: {
    fontSize: 12,
    color: '#64748B',
    fontWeight: '600',
    marginBottom: 4,
    letterSpacing: 0.5,
  },
  detailValue: {
    fontSize: 16,
    color: '#1E293B',
    fontWeight: '700',
  },
  logoutButton: {
    backgroundColor: '#FEE2E2',
    borderRadius: 20,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 12,
    marginBottom: 20,
  },
  logoutButtonText: {
    color: '#DC2626',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  }
});

export default GuardDashboard;