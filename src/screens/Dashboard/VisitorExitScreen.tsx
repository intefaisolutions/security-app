import React, { useState } from 'react';
import { 
  View, Text, StyleSheet, TouchableOpacity, SafeAreaView, 
  StatusBar, ScrollView, Image, ActivityIndicator 
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import FeatherIcon from 'react-native-vector-icons/Feather';
import { useNavigation } from '@react-navigation/native';
import { showToast } from '../../utils/toast';
import { guardService } from '../../services/guardService';
import { visitorService } from '../../services/visitorService';

const VisitorExitScreen = () => {
  const navigation = useNavigation();
  const [exitingId, setExitingId] = useState<string | null>(null);
  const [visitors, setVisitors] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  React.useEffect(() => {
    const fetchVisitorsInside = async () => {
      setLoading(true);
      try {
        const res: any = await visitorService.getVisitorHistory({ status: 'APPROVED' });
        const list = res?.data || res || [];
        if (Array.isArray(list)) {
          setVisitors(list.map((v: any, idx: number) => ({
            id: v.id || v._id || String(idx),
            name: v.visitorName || v.name || 'Visitor',
            purpose: v.category || v.type || 'Guest',
            details: `In at ${v.entryTime || v.in || '—'} · ${v.gate || 'Main Gate'}`,
            image: v.image || v.photoUrl || `https://randomuser.me/api/portraits/men/${(idx % 50) + 1}.jpg`,
          })));
        }
      } catch (err: any) {
        showToast(err.message || 'Failed to fetch visitors inside');
      } finally {
        setLoading(false);
      }
    };
    fetchVisitorsInside();
  }, []);

  const handleExit = async (id: string) => {
    setExitingId(id);
    try {
      const res: any = await guardService.markVisitorExit(id);
      if (res && res.success !== false) {
        showToast('Exit recorded successfully');
        setVisitors(prev => prev.filter(v => v.id !== id));
      } else {
        showToast(res?.message || 'Failed to record exit');
      }
    } catch (err: any) {
      showToast(err.message || 'Failed to record exit');
    } finally {
      setExitingId(null);
    }
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
              style={[styles.exitButton, exitingId === visitor.id && { opacity: 0.7 }]} 
              onPress={() => handleExit(visitor.id)}
              disabled={exitingId === visitor.id}
              activeOpacity={0.8}
            >
              {exitingId === visitor.id ? (
                <ActivityIndicator size="small" color="#FFFFFF" />
              ) : (
                <>
                  <FeatherIcon name="log-out" size={16} color="#FFFFFF" style={{ marginRight: 6 }} />
                  <Text style={styles.exitButtonText}>Exit</Text>
                </>
              )}
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
