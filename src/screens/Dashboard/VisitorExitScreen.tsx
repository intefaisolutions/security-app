import React, { useState } from 'react';
import { 
  View, Text, StyleSheet, TouchableOpacity, SafeAreaView, 
  StatusBar, ScrollView, Image 
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import FeatherIcon from 'react-native-vector-icons/Feather';
import { useNavigation } from '@react-navigation/native';
import { showToast } from '../../utils/toast';

const VisitorExitScreen = () => {
  const navigation = useNavigation();
  
  const initialVisitors = [
    {
      id: '1',
      name: 'Rahul Sharma',
      purpose: 'Amazon Delivery',
      details: 'In at 10:24 AM · Gate 2',
      image: 'https://randomuser.me/api/portraits/men/32.jpg',
    },
    {
      id: '2',
      name: 'Priya Verma',
      purpose: 'Guest — Family visit',
      details: 'In at 11:05 AM · Gate 1',
      image: 'https://randomuser.me/api/portraits/women/44.jpg',
    },
    {
      id: '3',
      name: 'Suresh Kumar',
      purpose: 'Swiggy Order',
      details: 'In at 12:12 PM · Gate 2',
      image: 'https://randomuser.me/api/portraits/men/22.jpg',
    },
  ];

  const [visitors, setVisitors] = useState(initialVisitors);

  const handleExit = (id: string) => {
    showToast('Exit recorded');
    setVisitors(visitors.filter(v => v.id !== id));
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#F8FAFC" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Icon name="arrow-back" size={24} color="#1E293B" />
        </TouchableOpacity>
        <View style={styles.headerTextContainer}>
          <Text style={styles.headerTitle}>Visitor Exit</Text>
          <Text style={styles.headerSubtitle}>Tap a visitor to mark exit</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.listContainer} showsVerticalScrollIndicator={false}>
        {visitors.map((visitor) => (
          <View key={visitor.id} style={styles.card}>
            <View style={styles.cardLeft}>
              <Image source={{ uri: visitor.image }} style={styles.avatar} />
              <View style={styles.infoContainer}>
                <Text style={styles.name}>{visitor.name}</Text>
                <Text style={styles.purpose}>{visitor.purpose}</Text>
                <Text style={styles.details}>{visitor.details}</Text>
              </View>
            </View>
            <TouchableOpacity 
              style={styles.exitButton} 
              onPress={() => handleExit(visitor.id)}
              activeOpacity={0.8}
            >
              <FeatherIcon name="log-out" size={16} color="#FFFFFF" style={{ marginRight: 6 }} />
              <Text style={styles.exitButtonText}>Exit</Text>
            </TouchableOpacity>
          </View>
        ))}
        {visitors.length === 0 && (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No visitors currently inside.</Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 20,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  headerTextContainer: {
    flex: 1,
    marginLeft: 10,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#0F172A',
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#64748B',
    marginTop: 2,
  },
  listContainer: {
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
  card: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 8,
    elevation: 2,
  },
  cardLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    marginRight: 16,
    backgroundColor: '#E2E8F0',
  },
  infoContainer: {
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#0F172A',
    marginBottom: 2,
  },
  purpose: {
    fontSize: 14,
    color: '#64748B',
    marginBottom: 2,
  },
  details: {
    fontSize: 12,
    color: '#94A3B8',
  },
  exitButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2563EB',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    marginLeft: 12,
  },
  exitButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 14,
  },
  emptyContainer: {
    alignItems: 'center',
    marginTop: 50,
  },
  emptyText: {
    fontSize: 16,
    color: '#64748B',
  }
});

export default VisitorExitScreen;
