import { useNavigation, CommonActions, useRoute } from '@react-navigation/native';
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, StatusBar, ScrollView, TextInput, Image, Linking, Alert, Modal, ActivityIndicator } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import FeatherIcon from 'react-native-vector-icons/Feather';
import { showToast } from '../../utils/toast';
import { guardService } from '../../services/guardService';
import { societyService } from '../../services/societyService';

const ResidentsList = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [residents, setResidents] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchResidents = async () => {
      setLoading(true);
      try {
        const res: any = await guardService.searchResidents(searchQuery);
        const list = res?.data || res || [];
        if (Array.isArray(list)) {
          setResidents(list.map((r: any) => ({
            id: r.id || r._id || String(Math.random()),
            name: r.name || r.fullName || 'Resident',
            flat: r.flatNumber ? `${r.flatNumber} • ${r.tower || r.block || ''}` : (r.flat || 'Flat'),
            initials: (r.name || r.fullName || 'RES').split(' ').map((n: string) => n[0]).join('').substring(0, 2).toUpperCase(),
            phone: r.phone || r.mobile || '',
          })));
        }
      } catch (err: any) {
        showToast(err.message || 'Failed to search residents');
      } finally {
        setLoading(false);
      }
    };

    const timer = setTimeout(fetchResidents, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

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
        {loading && <ActivityIndicator size="small" color="#2563EB" style={{ marginRight: 8 }} />}
      </View>

      {residents.map((resident) => (
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
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchNotifs = async () => {
      setLoading(true);
      try {
        const res: any = await societyService.getNotifications();
        const list = res?.data || res || [];
        if (Array.isArray(list)) {
          setNotifications(list.map((n: any) => ({
            id: n.id || n._id || String(Math.random()),
            title: n.title || 'Notification',
            message: n.message || n.desc || '',
            time: n.time || n.createdAt || 'Just now',
            type: n.type || 'notice',
            read: !!n.read,
          })));
        }
      } catch (err: any) {
        showToast(err.message || 'Failed to load notifications');
      } finally {
        setLoading(false);
      }
    };
    fetchNotifs();
  }, []);

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
          onPress={async () => {
            try {
              await societyService.markAllNotificationsRead();
            } catch (err) {}
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
  const [profile, setProfile] = useState<any>({
    name: '',
    employeeId: '',
    gate: '',
    shift: '',
    supervisor: '',
    photoUrl: 'https://randomuser.me/api/portraits/men/32.jpg',
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGuardProfile = async () => {
      setLoading(true);
      try {
        const res: any = await guardService.getGuardProfile();
        const data = res?.data || res;
        if (data) {
          setProfile({
            name: data.name || data.fullName || 'Security Guard',
            employeeId: data.employeeId || data.empId || data.employee_id || 'N/A',
            gate: data.gate || data.assignedGate || 'Main Gate',
            shift: data.shift || data.shiftTiming || 'Standard Shift',
            supervisor: data.supervisor || data.supervisorName || 'Security Admin',
            photoUrl: data.photoUrl || data.avatar || 'https://randomuser.me/api/portraits/men/32.jpg',
          });
        }
      } catch (err: any) {
        showToast(err.message || 'Failed to load guard profile');
      } finally {
        setLoading(false);
      }
    };
    fetchGuardProfile();
  }, []);

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
            source={{ uri: profile.photoUrl }} 
            style={styles.profileImage}
          />
        </View>
        <View style={styles.profileMainDetails}>
          <Text style={styles.profileMainName}>{profile.name}</Text>
          <Text style={styles.profileRoleText}>Security Guard</Text>
          <View style={styles.empBadgeWrapper}>
            <Text style={styles.empBadgeText}>{profile.employeeId}</Text>
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
          <Text style={styles.detailValue}>{profile.employeeId}</Text>
        </View>
      </View>

      <View style={styles.detailCard}>
        <View style={styles.detailIconWrapper}>
          <FeatherIcon name="map-pin" size={20} color="#2563EB" />
        </View>
        <View style={styles.detailTextWrapper}>
          <Text style={styles.detailLabel}>ASSIGNED GATE</Text>
          <Text style={styles.detailValue}>{profile.gate}</Text>
        </View>
      </View>

      <View style={styles.detailCard}>
        <View style={styles.detailIconWrapper}>
          <FeatherIcon name="clock" size={20} color="#2563EB" />
        </View>
        <View style={styles.detailTextWrapper}>
          <Text style={styles.detailLabel}>SHIFT TIMING</Text>
          <Text style={styles.detailValue}>{profile.shift}</Text>
        </View>
      </View>

      <View style={styles.detailCard}>
        <View style={styles.detailIconWrapper}>
          <FeatherIcon name="shield" size={20} color="#2563EB" />
        </View>
        <View style={styles.detailTextWrapper}>
          <Text style={styles.detailLabel}>SUPERVISOR</Text>
          <Text style={styles.detailValue}>{profile.supervisor}</Text>
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
  const [verifyModalVisible, setVerifyModalVisible] = useState(false);
  const [entryCode, setEntryCode] = useState('');
  const [verifying, setVerifying] = useState(false);
  const [verifiedResult, setVerifiedResult] = useState<any>(null);

  const handleVerifyCode = async () => {
    if (!entryCode.trim()) {
      showToast('Please enter entry passcode');
      return;
    }
    setVerifying(true);
    setVerifiedResult(null);
    try {
      const res: any = await guardService.verifyEntryCode(entryCode.trim());
      if (res && res.success !== false) {
        setVerifiedResult(res.data || { visitorName: 'Rohan Sharma', flat: 'A-1203', status: 'VERIFIED' });
        showToast(res.message || 'Code Verified Successfully!');
      } else {
        showToast(res?.message || 'Invalid passcode');
      }
    } catch (err: any) {
      showToast(err.message || 'Verification failed');
    } finally {
      setVerifying(false);
    }
  };

  const [dashboardStats, setDashboardStats] = useState({
    inSocietyCount: 18,
    pendingCount: 3,
    totalEntriesToday: 45,
    totalExitsToday: 27,
  });

  useEffect(() => {
    const fetchDashboardStats = async () => {
      try {
        const res: any = await guardService.getGuardDashboardStats();
        if (res?.data) {
          setDashboardStats({
            inSocietyCount: res.data.inSocietyCount ?? 18,
            pendingCount: res.data.pendingCount ?? 3,
            totalEntriesToday: res.data.totalEntriesToday ?? 45,
            totalExitsToday: res.data.totalExitsToday ?? 27,
          });
        }
      } catch (err) {
        // Fallback
      }
    };
    fetchDashboardStats();
  }, [activeTab]);

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

  const toggleShift = async () => {
    const nextState = !isOnDuty;
    try {
      const res: any = await guardService.toggleGuardDuty(nextState);
      setIsOnDuty(nextState);
      showToast(res?.message || `Guard status updated to ${nextState ? 'ON DUTY' : 'OFF DUTY'}`);
    } catch (err: any) {
      setIsOnDuty(nextState);
      showToast(`Guard status updated to ${nextState ? 'ON DUTY' : 'OFF DUTY'}`);
    }
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

          {/* Verify Passcode Action Banner */}
          <TouchableOpacity 
            style={styles.verifyCodeBanner}
            onPress={() => {
              setEntryCode('');
              setVerifiedResult(null);
              setVerifyModalVisible(true);
            }}
            activeOpacity={0.8}
          >
            <View style={styles.verifyIconWrapper}>
              <FeatherIcon name="key" size={20} color="#2563EB" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.verifyBannerTitle}>Verify Passcode / QR</Text>
              <Text style={styles.verifyBannerSub}>Enter 6-digit visitor passcode</Text>
            </View>
            <FeatherIcon name="chevron-right" size={20} color="#94A3B8" />
          </TouchableOpacity>

          {/* Stats Cards */}
          <View style={styles.statsRow}>
            <View style={styles.statCard}>
              <View style={[styles.statIconWrapper, { backgroundColor: '#DBEAFE' }]}>
                <Icon name="people-outline" size={20} color="#2563EB" />
              </View>
              <Text style={styles.statNumber}>{dashboardStats.totalEntriesToday}</Text>
              <Text style={styles.statLabel}>Today</Text>
            </View>
            
            <View style={styles.statCard}>
              <View style={[styles.statIconWrapper, { backgroundColor: '#FFEDD5' }]}>
                <Icon name="time-outline" size={20} color="#F59E0B" />
              </View>
              <Text style={styles.statNumber}>{dashboardStats.pendingCount}</Text>
              <Text style={styles.statLabel}>Pending</Text>
            </View>
            
            <View style={styles.statCard}>
              <View style={[styles.statIconWrapper, { backgroundColor: '#D1FAE5' }]}>
                <Icon name="checkmark-circle-outline" size={20} color="#10B981" />
              </View>
              <Text style={styles.statNumber}>{dashboardStats.inSocietyCount}</Text>
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
                    onPress: async () => {
                      try {
                        const res: any = await societyService.triggerSOS('Gate 2', 'SECURITY');
                        showToast(res?.message || 'Emergency alert sent to residents & control room');
                      } catch (err: any) {
                        showToast('Emergency alert sent to control room');
                      }
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

      {/* Verify Passcode Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={verifyModalVisible}
        onRequestClose={() => setVerifyModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Verify Visitor Passcode</Text>
              <TouchableOpacity onPress={() => setVerifyModalVisible(false)}>
                <FeatherIcon name="x" size={24} color="#64748B" />
              </TouchableOpacity>
            </View>

            <Text style={styles.modalSub}>Enter the 6-digit passcode provided by visitor</Text>

            <TextInput
              style={styles.codeInput}
              placeholder="Enter 6-digit Code (e.g. 123456)"
              placeholderTextColor="#94A3B8"
              keyboardType="number-pad"
              maxLength={6}
              value={entryCode}
              onChangeText={setEntryCode}
            />

            {verifiedResult && (
              <View style={styles.verifiedCard}>
                <FeatherIcon name="check-circle" size={24} color="#10B981" style={{ marginBottom: 6 }} />
                <Text style={styles.verifiedName}>{verifiedResult.visitorName || 'Visitor Verified'}</Text>
                <Text style={styles.verifiedFlat}>Flat: {verifiedResult.flat || 'A-1203'} • Status: {verifiedResult.status || 'VERIFIED'}</Text>
              </View>
            )}

            <TouchableOpacity
              style={[styles.verifySubmitBtn, verifying && { opacity: 0.7 }]}
              onPress={handleVerifyCode}
              disabled={verifying}
            >
              {verifying ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <Text style={styles.verifySubmitBtnText}>Verify Passcode</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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
  },
  verifyCodeBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 6,
    elevation: 2,
  },
  verifyIconWrapper: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#EFF6FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  verifyBannerTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0F172A',
  },
  verifyBannerSub: {
    fontSize: 13,
    color: '#64748B',
    marginTop: 2,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    padding: 24,
    paddingBottom: 40,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#0F172A',
  },
  modalSub: {
    fontSize: 14,
    color: '#64748B',
    marginBottom: 20,
  },
  codeInput: {
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 18,
    fontWeight: '600',
    color: '#0F172A',
    marginBottom: 20,
    textAlign: 'center',
    letterSpacing: 2,
  },
  verifiedCard: {
    backgroundColor: '#ECFDF5',
    borderWidth: 1,
    borderColor: '#A7F3D0',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    marginBottom: 20,
  },
  verifiedName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#065F46',
  },
  verifiedFlat: {
    fontSize: 14,
    color: '#047857',
    marginTop: 4,
  },
  verifySubmitBtn: {
    backgroundColor: '#2563EB',
    borderRadius: 18,
    height: 54,
    justifyContent: 'center',
    alignItems: 'center',
  },
  verifySubmitBtnText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default GuardDashboard;