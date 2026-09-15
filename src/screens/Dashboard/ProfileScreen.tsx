import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Alert, ActivityIndicator, Modal, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import { Brand } from '../../constants/theme';
import { authService } from '../../services/authService';
import { societyService } from '../../services/societyService';
import { showToast } from '../../utils/toast';

const ProfileScreen = () => {
  const navigation = useNavigation<any>();
  const [userProfile, setUserProfile] = useState<any>({
    name: '',
    address: '',
    phone: '',
    avatar: '',
    stats: { visitors: 0, invites: 0, family: 0 },
  });
  const [loading, setLoading] = useState(true);

  const [editModalVisible, setEditModalVisible] = useState(false);
  const [editName, setEditName] = useState('');
  const [editPhone, setEditPhone] = useState('');
  const [savingProfile, setSavingProfile] = useState(false);

  const [familyModalVisible, setFamilyModalVisible] = useState(false);
  const [familyList, setFamilyList] = useState<any[]>([]);
  const [loadingFamily, setLoadingFamily] = useState(false);
  const [newMemberName, setNewMemberName] = useState('');
  const [newMemberRelation, setNewMemberRelation] = useState('Spouse');
  const [addingMember, setAddingMember] = useState(false);

  const fetchFamily = async () => {
    setLoadingFamily(true);
    try {
      const res: any = await societyService.getFamilyMembers();
      const list = res?.data || res || [];
      if (Array.isArray(list)) {
        setFamilyList(list);
      }
    } catch (err: any) {
      showToast(err.message || 'Failed to load family members');
    } finally {
      setLoadingFamily(false);
    }
  };

  const handleAddFamilyMember = async () => {
    if (!newMemberName.trim()) {
      showToast('Name is required');
      return;
    }
    setAddingMember(true);
    try {
      const res: any = await societyService.addFamilyMember({
        name: newMemberName.trim(),
        relation: newMemberRelation,
      });
      if (res && res.success !== false) {
        showToast('Family member added');
        setNewMemberName('');
        fetchFamily();
      } else {
        showToast(res?.message || 'Failed to add member');
      }
    } catch (err: any) {
      showToast(err.message || 'Failed to add member');
    } finally {
      setAddingMember(false);
    }
  };

  const handleDeleteFamilyMember = async (id: string) => {
    try {
      const res: any = await societyService.deleteFamilyMember(id);
      if (res && res.success !== false) {
        showToast('Member removed');
        setFamilyList(prev => prev.filter(m => m.id !== id && m._id !== id));
      }
    } catch (err: any) {
      showToast(err.message || 'Failed to remove member');
    }
  };

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      try {
        const res: any = await authService.getUserProfile();
        const data = res?.data || res;
        if (data) {
          const profileData = {
            name: data.name || data.fullName || 'Resident',
            address: data.address || (data.flatNumber ? `${data.flatNumber}, ${data.tower || data.block || ''}` : data.flat || ''),
            phone: data.phone || data.mobile || '',
            avatar: data.photoUrl || data.avatar || 'https://i.pravatar.cc/150?img=11',
            stats: data.stats || { visitors: data.visitorCount || 0, invites: data.inviteCount || 0, family: data.familyCount || 0 },
          };
          setUserProfile(profileData);
          setEditName(profileData.name);
          setEditPhone(profileData.phone);
        }
      } catch (err: any) {
        showToast(err.message || 'Failed to load profile');
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleSaveProfile = async () => {
    if (!editName.trim()) {
      showToast('Name cannot be empty');
      return;
    }
    setSavingProfile(true);
    try {
      const res: any = await authService.updateUserProfile({
        name: editName.trim(),
        emergencyContact: editPhone.trim(),
      });
      if (res && res.success !== false) {
        setUserProfile((prev: any) => ({
          ...prev,
          name: editName.trim(),
          phone: editPhone.trim(),
        }));
        showToast('Profile updated successfully!');
        setEditModalVisible(false);
      } else {
        showToast(res?.message || 'Failed to update profile');
      }
    } catch (err: any) {
      showToast(err.message || 'Failed to update profile');
    } finally {
      setSavingProfile(false);
    }
  };

  const handleLogout = async () => {
    try {
      await authService.logout();
    } catch (err: any) {
      // Clear local auth token on error fallback
    }
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
            source={{ uri: userProfile.avatar }} 
            style={styles.avatar} 
          />
          <View style={styles.profileInfo}>
            <Text style={styles.name}>{userProfile.name}</Text>
            <Text style={styles.address}>{userProfile.address}</Text>
            <Text style={styles.phone}>{userProfile.phone}</Text>
          </View>
          <TouchableOpacity
            style={styles.editBtn}
            onPress={() => {
              setEditName(userProfile.name);
              setEditPhone(userProfile.phone);
              setEditModalVisible(true);
            }}
          >
            <Text style={styles.editBtnText}>Edit</Text>
          </TouchableOpacity>
        </View>

        {/* Stats Card */}
        <View style={styles.statsCard}>
          <View style={styles.statBox}>
            <Text style={styles.statNumber}>{userProfile.stats?.visitors ?? 128}</Text>
            <Text style={styles.statLabel}>VISITORS</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statNumber}>{userProfile.stats?.invites ?? 24}</Text>
            <Text style={styles.statLabel}>INVITES</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statNumber}>{userProfile.stats?.family ?? 4}</Text>
            <Text style={styles.statLabel}>FAMILY</Text>
          </View>
        </View>

        {/* Menu Items */}
        <View style={styles.menuContainer}>
          {menuItems.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={styles.menuItem}
              onPress={() => {
                if (item.id === '1') {
                  fetchFamily();
                  setFamilyModalVisible(true);
                } else {
                  Alert.alert(item.title, item.message);
                }
              }}
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

      {/* Edit Profile Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={editModalVisible}
        onRequestClose={() => setEditModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Edit Profile</Text>
              <TouchableOpacity onPress={() => setEditModalVisible(false)}>
                <Icon name="close" size={24} color="#64748B" />
              </TouchableOpacity>
            </View>

            <Text style={styles.inputLabel}>Full Name</Text>
            <TextInput
              style={styles.textInput}
              value={editName}
              onChangeText={setEditName}
              placeholder="Enter your name"
              placeholderTextColor="#94A3B8"
            />

            <Text style={styles.inputLabel}>Phone Number / Emergency Contact</Text>
            <TextInput
              style={styles.textInput}
              value={editPhone}
              onChangeText={setEditPhone}
              placeholder="Enter phone number"
              placeholderTextColor="#94A3B8"
              keyboardType="phone-pad"
            />

            <TouchableOpacity
              style={[styles.saveBtn, savingProfile && { opacity: 0.7 }]}
              onPress={handleSaveProfile}
              disabled={savingProfile}
            >
              {savingProfile ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <Text style={styles.saveBtnText}>Save Changes</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Family Members Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={familyModalVisible}
        onRequestClose={() => setFamilyModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Family Members</Text>
              <TouchableOpacity onPress={() => setFamilyModalVisible(false)}>
                <Icon name="close" size={24} color="#64748B" />
              </TouchableOpacity>
            </View>

            {loadingFamily ? (
              <ActivityIndicator color="#2563EB" style={{ marginVertical: 20 }} />
            ) : (
              <ScrollView style={{ maxHeight: 200, marginBottom: 16 }}>
                {familyList.map((mem) => (
                  <View key={mem.id} style={styles.familyItemRow}>
                    <View>
                      <Text style={styles.familyNameText}>{mem.name}</Text>
                      <Text style={styles.familyRelationText}>{mem.relation} {mem.phone ? `· ${mem.phone}` : ''}</Text>
                    </View>
                    <TouchableOpacity onPress={() => handleDeleteFamilyMember(mem.id)}>
                      <Icon name="trash-outline" size={20} color="#DC2626" />
                    </TouchableOpacity>
                  </View>
                ))}
              </ScrollView>
            )}

            <Text style={styles.inputLabel}>Add New Family Member</Text>
            <TextInput
              style={styles.textInput}
              value={newMemberName}
              onChangeText={setNewMemberName}
              placeholder="Member Full Name"
              placeholderTextColor="#94A3B8"
            />

            <TouchableOpacity
              style={[styles.saveBtn, addingMember && { opacity: 0.7 }]}
              onPress={handleAddFamilyMember}
              disabled={addingMember}
            >
              {addingMember ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <Text style={styles.saveBtnText}>Add Member</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#0F172A',
  },
  inputLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#64748B',
    marginBottom: 8,
  },
  textInput: {
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: '#0F172A',
    marginBottom: 20,
  },
  saveBtn: {
    backgroundColor: '#2563EB',
    borderRadius: 18,
    height: 52,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
  saveBtnText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  familyItemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    padding: 12,
    borderRadius: 14,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  familyNameText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0F172A',
  },
  familyRelationText: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 2,
  },
});