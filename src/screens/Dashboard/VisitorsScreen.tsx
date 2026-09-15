import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';

const filterTabs = ['All', 'Approved', 'Pending', 'Rejected'];

const visitorsData = [
  { id: '1', name: 'Rahul Sharma', type: 'Amazon Delivery', status: 'APPROVED', in: '10:24 AM', out: '10:31 AM', gate: 'Gate 2', image: 'https://i.pravatar.cc/100?img=11' },
  { id: '2', name: 'Priya Verma', type: 'Guest — Family visit', status: 'PENDING', in: '11:05 AM', out: '—', gate: 'Gate 1', image: 'https://i.pravatar.cc/100?img=5' },
  { id: '3', name: 'Suresh Kumar', type: 'Swiggy Order', status: 'APPROVED', in: '12:12 PM', out: '12:16 PM', gate: 'Gate 2', image: 'https://i.pravatar.cc/100?img=12' },
];

const VisitorsScreen = () => {
  const [activeTab, setActiveTab] = useState('All');
  const navigation = useNavigation<any>();

  const filteredData = activeTab === 'All' 
    ? visitorsData 
    : visitorsData.filter(item => item.status === activeTab.toUpperCase());

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Visitors</Text>
          <Text style={styles.subtitle}>History & requests</Text>
        </View>
        <TouchableOpacity style={styles.filterBtn}>
          <Icon name="filter-outline" size={20} color="#111827" />
        </TouchableOpacity>
      </View>

      <View style={styles.tabsContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {filterTabs.map((tab) => (
            <TouchableOpacity 
              key={tab} 
              style={[styles.tab, activeTab === tab && styles.activeTab]}
              onPress={() => setActiveTab(tab)}
            >
              <Text style={[styles.tabText, activeTab === tab && styles.activeTabText]}>{tab}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <ScrollView contentContainerStyle={styles.listContainer}>
        {filteredData.map((item) => (
          <View key={item.id} style={styles.card}>
            <View style={styles.cardHeader}>
              <View style={styles.cardHeaderLeft}>
                <Image source={{ uri: item.image }} style={styles.avatar} />
                <View>
                  <Text style={styles.name}>{item.name}</Text>
                  <Text style={styles.type}>{item.type}</Text>
                </View>
              </View>
              <View style={[
                styles.badge, 
                item.status === 'APPROVED' ? styles.badgeApproved : styles.badgePending
              ]}>
                <Text style={[
                  styles.badgeText, 
                  item.status === 'APPROVED' ? styles.badgeTextApproved : styles.badgeTextPending
                ]}>{item.status}</Text>
              </View>
            </View>

            <View style={styles.detailsRow}>
              <View style={styles.detailBox}>
                <Text style={styles.detailLabel}>IN</Text>
                <Text style={styles.detailValue}>{item.in}</Text>
              </View>
              <View style={styles.detailBox}>
                <Text style={styles.detailLabel}>OUT</Text>
                <Text style={styles.detailValue}>{item.out}</Text>
              </View>
              <View style={styles.detailBox}>
                <Text style={styles.detailLabel}>GATE</Text>
                <Text style={styles.detailValue}>{item.gate}</Text>
              </View>
            </View>
          </View>
        ))}
      </ScrollView>

      <TouchableOpacity 
        style={styles.inviteBtn}
        onPress={() => navigation.navigate('InviteVisitor')}
      >
        <Icon name="add" size={24} color="#fff" />
        <Text style={styles.inviteBtnText}>Invite visitor</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default VisitorsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginTop: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#0F172A',
  },
  subtitle: {
    fontSize: 16,
    color: '#64748B',
    marginTop: 4,
  },
  filterBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#F1F5F9',
    justifyContent: 'center',
    alignItems: 'center',
  },
  tabsContainer: {
    marginTop: 20,
    paddingHorizontal: 20,
    marginBottom: 10,
  },
  tab: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: '#F1F5F9',
    marginRight: 10,
  },
  activeTab: {
    backgroundColor: '#2563EB',
  },
  tabText: {
    color: '#475569',
    fontWeight: '600',
    fontSize: 14,
  },
  activeTabText: {
    color: '#fff',
  },
  listContainer: {
    paddingHorizontal: 20,
    paddingBottom: 100,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 24,
    padding: 16,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#F1F5F9',
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  cardHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 12,
  },
  name: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0F172A',
  },
  type: {
    fontSize: 14,
    color: '#64748B',
    marginTop: 2,
  },
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  badgeApproved: {
    backgroundColor: '#DCFCE7',
  },
  badgePending: {
    backgroundColor: '#FFEDD5',
  },
  badgeText: {
    fontSize: 10,
    fontWeight: '700',
  },
  badgeTextApproved: {
    color: '#166534',
  },
  badgeTextPending: {
    color: '#9A3412',
  },
  detailsRow: {
    flexDirection: 'row',
    marginTop: 16,
    justifyContent: 'space-between',
  },
  detailBox: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    borderRadius: 16,
    padding: 10,
    marginRight: 8,
  },
  detailLabel: {
    fontSize: 10,
    color: '#64748B',
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  detailValue: {
    fontSize: 14,
    color: '#0F172A',
    fontWeight: '600',
    marginTop: 4,
  },
  inviteBtn: {
    position: 'absolute',
    bottom: 20,
    alignSelf: 'center',
    backgroundColor: '#2563EB',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 30,
    elevation: 5,
    shadowColor: '#2563EB',
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 10,
  },
  inviteBtnText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
    marginLeft: 8,
  },
});