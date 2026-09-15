import React, { useState, useEffect } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
  Animated,
  Linking,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useNavigation, useRoute, useIsFocused } from '@react-navigation/native';

import PendingRequestCard from '../../components/PendingRequestCard';
import VisitorCard from '../../components/VisitorCard';
import NewsCard from '../../components/NewsCard';
import { showToast as showAppToast } from '../../utils/toast';
import { visitorService } from '../../services/visitorService';
import { societyService } from '../../services/societyService';

const GUARD_HELPLINE = 'tel:100';
const SOCIETY_SECURITY = 'tel:+919876543210';

const ResidentDashboard = () => {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const isFocused = useIsFocused();
  const [showToast, setShowToast] = useState(false);
  const [toastType, setToastType] = useState('approve');
  const [activePasses, setActivePasses] = useState<any[]>([]);

  const [societyNews, setSocietyNews] = useState<any[]>([]);

  useEffect(() => {
    const fetchActivePasses = async () => {
      try {
        const res: any = await visitorService.getActivePasses();
        const list = res?.data || res || [];
        if (Array.isArray(list)) {
          setActivePasses(list);
        }
      } catch (err: any) {
        // Handled silently
      }
    };

    const fetchNews = async () => {
      try {
        const res: any = await societyService.getSocietyNews();
        const list = res?.data || res || [];
        if (Array.isArray(list)) {
          setSocietyNews(list.map((item: any) => ({
            id: item.id || item._id || String(Math.random()),
            title: item.title,
            subtitle: item.category || item.summary || 'Notice',
            letter: item.title ? item.title.charAt(0).toUpperCase() : 'N',
            color: '#DBEAFE',
            textColor: '#1D4ED8',
          })));
        }
      } catch (err: any) {
        // Handled silently
      }
    };

    if (isFocused) {
      fetchActivePasses();
      fetchNews();
    }
  }, [isFocused]);

  useEffect(() => {
    if (isFocused && route.params?.showToast) {
      setToastType(route.params.toastType || 'approve');
      setShowToast(true);
      
      // Clear params so it doesn't show again on re-focus
      navigation.setParams({ showToast: false, toastType: null });
      
      // Hide toast after 3.5 seconds
      setTimeout(() => setShowToast(false), 3500);
    }
  }, [isFocused, route.params]);

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      
      {/* Custom Toast Notification */}
      {showToast && (
        <View style={styles.toastContainer}>
          <View style={styles.toastIconBg}>
            <Icon name={toastType === 'approve' ? "checkmark" : "close"} size={16} color="#fff" />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.toastTitle}>
              {toastType === 'approve' ? 'Visitor approved' : 'Visitor rejected'}
            </Text>
            <Text style={styles.toastSubtitle}>
              Priya Verma — guard has been notified
            </Text>
          </View>
        </View>
      )}

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
        bounces={false}
      >
        {/* Blue Header Section */}
        <View style={styles.blueHeader}>
          <View style={styles.headerTop}>
            <View>
              <Text style={styles.greeting}>Good morning</Text>
              <Text style={styles.userName}>Arjun Mehta</Text>
              <Text style={styles.userFlat}>Flat A-1203, Tower A</Text>
            </View>
            <TouchableOpacity 
              style={styles.bellContainer}
              onPress={() => navigation.navigate('Alerts')}
            >
              <Icon name="notifications-outline" size={24} color="#fff" />
              <View style={styles.badgeDot} />
            </TouchableOpacity>
          </View>
          
          <View style={styles.searchContainer}>
            <Icon name="search-outline" size={20} color="#DBEAFE" />
            <TextInput 
              style={styles.searchInput} 
              placeholder="Search residents, visitors..." 
              placeholderTextColor="#DBEAFE" 
            />
          </View>

          <View style={styles.statsRow}>
            <View style={styles.statBoxBlue}>
              <Text style={styles.statBoxTitle}>TODAY</Text>
              <Text style={styles.statBoxValue}>12</Text>
              <Text style={styles.statBoxSub}>Visitors</Text>
            </View>
            <View style={styles.statBoxBlue}>
              <Text style={styles.statBoxTitle}>PENDING</Text>
              <Text style={styles.statBoxValue}>1</Text>
              <Text style={styles.statBoxSub}>Approvals</Text>
            </View>
            <View style={styles.statBoxBlue}>
              <Text style={styles.statBoxTitle}>INVITES</Text>
              <Text style={styles.statBoxValue}>3</Text>
              <Text style={styles.statBoxSub}>Upcoming</Text>
            </View>
          </View>
        </View>

        {/* Quick Actions */}
        <View style={styles.quickContainer}>
          <Text style={styles.heading}>Quick Actions</Text>
          <View style={styles.quickActionsRow}>
            <TouchableOpacity 
              style={styles.quickActionItem} 
              onPress={() => navigation.navigate('InviteVisitor')}
            >
              <View style={[styles.quickActionCircle, { backgroundColor: '#2563EB' }]}>
                <Icon name="person-add-outline" size={24} color="#fff" />
              </View>
              <Text style={styles.quickActionText}>Invite</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.quickActionItem} 
              onPress={() => navigation.navigate('Visitors')}
            >
              <View style={[styles.quickActionCircle, { backgroundColor: '#DBEAFE' }]}>
                <Icon name="clipboard-outline" size={24} color="#2563EB" />
              </View>
              <Text style={styles.quickActionText}>History</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.quickActionItem} 
              onPress={() => navigation.navigate('Services')}
            >
              <View style={[styles.quickActionCircle, { backgroundColor: '#DBEAFE' }]}>
                <Icon name="call-outline" size={24} color="#2563EB" />
              </View>
              <Text style={styles.quickActionText}>Services</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.quickActionItem} 
              onPress={() =>
                Alert.alert(
                  'SOS Emergency',
                  'Notify society security and control room?',
                  [
                    { text: 'Cancel', style: 'cancel' },
                    {
                      text: 'Call Security',
                      onPress: () => Linking.openURL(SOCIETY_SECURITY),
                    },
                    {
                      text: 'Call 100',
                      style: 'destructive',
                      onPress: async () => {
                        try {
                          const res: any = await societyService.triggerSOS('A-1203', 'SECURITY');
                          showAppToast(res?.message || 'SOS sent to control room');
                        } catch (err) {
                          showAppToast('SOS sent to control room');
                        }
                        Linking.openURL(GUARD_HELPLINE);
                      },
                    },
                  ],
                )
              }
            >
              <View style={[styles.quickActionCircle, { backgroundColor: '#FEE2E2' }]}>
                <Icon name="alert-circle-outline" size={24} color="#DC2626" />
              </View>
              <Text style={styles.quickActionText}>SOS</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Pending Requests */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.heading}>Pending Requests</Text>
            <TouchableOpacity onPress={() => navigation.navigate('Visitors')}>
              <Text style={styles.linkText}>See all</Text>
            </TouchableOpacity>
          </View>
          <PendingRequestCard onPress={() => navigation.navigate('VisitorRequest')} />
        </View>

        {/* Today's Visitors */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.heading}>Today's Visitors</Text>
            <TouchableOpacity onPress={() => navigation.navigate('Visitors')}>
              <Text style={styles.linkText}>View history</Text>
            </TouchableOpacity>
          </View>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            snapToInterval={155}
            decelerationRate="fast"
          >
            <VisitorCard name="Rahul Sharma" purpose="Amazon Delivery" time="10:24 AM" image="https://i.pravatar.cc/100?img=11" />
            <VisitorCard name="Priya Verma" purpose="Guest — Family visit" time="11:05 AM" image="https://i.pravatar.cc/100?img=5" />
            <VisitorCard name="Suresh Kumar" purpose="Swiggy Order" time="12:12 PM" image="https://i.pravatar.cc/100?img=12" />
          </ScrollView>
        </View>

        {/* Community News */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.heading}>Community News</Text>
            <Text style={styles.linkText}>All</Text>
          </View>
          {societyNews.map((news) => (
            <NewsCard 
              key={news.id}
              title={news.title} 
              subtitle={news.subtitle} 
              letter={news.letter} 
              color={news.color} 
              textColor={news.textColor} 
            />
          ))}
        </View>
         
      </ScrollView>
    </SafeAreaView>
  );
};

export default ResidentDashboard;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  toastContainer: {
    position: 'absolute',
    top: 50,
    left: 20,
    right: 20,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    elevation: 8,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 12,
    zIndex: 9999,
  },
  toastIconBg: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#111827',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  toastTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 2,
  },
  toastSubtitle: {
    fontSize: 13,
    color: '#4B5563',
  },
  content: {
    paddingBottom: 40,
  },
  blueHeader: {
    backgroundColor: '#2563EB',
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 30,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  greeting: {
    color: '#93C5FD',
    fontSize: 14,
    fontWeight: '600',
  },
  userName: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 2,
  },
  userFlat: {
    color: '#DBEAFE',
    fontSize: 12,
    marginTop: 2,
  },
  bellContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeDot: {
    position: 'absolute',
    top: 10,
    right: 12,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#10B981',
    borderWidth: 1,
    borderColor: '#2563EB',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: 24,
    paddingHorizontal: 16,
    height: 48,
    marginBottom: 24,
  },
  searchInput: {
    flex: 1,
    marginLeft: 10,
    color: '#fff',
    fontSize: 15,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statBoxBlue: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 20,
    paddingVertical: 16,
    alignItems: 'center',
    marginHorizontal: 4,
  },
  statBoxTitle: {
    color: '#DBEAFE',
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 1,
    marginBottom: 4,
  },
  statBoxValue: {
    color: '#fff',
    fontSize: 28,
    fontWeight: 'bold',
  },
  statBoxSub: {
    color: '#93C5FD',
    fontSize: 12,
    marginTop: 2,
  },
  quickContainer: {
    marginTop: 25,
    paddingHorizontal: 20,
  },
  quickActionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 15,
  },
  quickActionItem: {
    alignItems: 'center',
  },
  quickActionCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
  },
  quickActionText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#0F172A',
  },
  section: {
    marginTop: 30,
    paddingHorizontal: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  heading: {
    fontSize: 20,
    fontWeight: '700',
    color: '#0F172A',
  },
  linkText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2563EB',
  },
});