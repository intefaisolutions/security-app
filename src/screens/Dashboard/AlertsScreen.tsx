import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Ionicons';
import { Colors } from '../../constants/theme';
import { showToast } from '../../utils/toast';

type NotificationItem = {
  id: string;
  title: string;
  desc: string;
  time: string;
  type: string;
  icon: string;
  color: string;
  iconColor: string;
  read: boolean;
};

const initialNotifications: NotificationItem[] = [
  { id: '1', title: 'Visitor at gate', desc: 'Priya Verma is waiting at Gate 1', time: '2 min ago', type: 'visitor', icon: 'people', color: '#DBEAFE', iconColor: '#2563EB', read: false },
  { id: '2', title: 'Guest approved', desc: 'You approved Rahul Sharma', time: '24 min ago', type: 'approved', icon: 'person-add', color: '#DCFCE7', iconColor: '#16A34A', read: false },
  { id: '3', title: 'Community notice', desc: 'Water tanker arriving Wed 6 AM', time: '1 hr ago', type: 'notice', icon: 'notifications', color: '#F1F5F9', iconColor: '#475569', read: false },
  { id: '4', title: 'Emergency drill', desc: 'Fire drill scheduled Sat 11 AM', time: '3 hr ago', type: 'emergency', icon: 'alert', color: '#FEE2E2', iconColor: '#DC2626', read: false },
  { id: '5', title: 'Entry rejected', desc: 'You rejected Deepak Iyer', time: 'Yesterday', type: 'rejected', icon: 'person-remove', color: '#F1F5F9', iconColor: '#64748B', read: true },
];

const AlertsScreen = () => {
  const [notifications, setNotifications] = useState(initialNotifications);
  const unreadCount = notifications.filter(n => !n.read).length;

  const markAllRead = () => {
    if (unreadCount === 0) {
      showToast('All caught up');
      return;
    }
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    showToast('All notifications marked as read');
  };

  const markOneRead = (id: string) => {
    setNotifications(prev =>
      prev.map(n => (n.id === id ? { ...n, read: true } : n)),
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Notifications</Text>
          <Text style={styles.subtitle}>
            {unreadCount > 0 ? `${unreadCount} unread · Today` : 'All caught up · Today'}
          </Text>
        </View>
        <TouchableOpacity onPress={markAllRead}>
          <Text style={styles.markReadText}>Mark all read</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.listContainer} showsVerticalScrollIndicator={false}>
        {notifications.map(item => (
          <TouchableOpacity
            key={item.id}
            style={[styles.card, !item.read && styles.cardUnread]}
            activeOpacity={0.85}
            onPress={() => markOneRead(item.id)}
          >
            <View style={[styles.iconCircle, { backgroundColor: item.color }]}>
              <Icon name={item.icon} size={20} color={item.iconColor} />
            </View>

            <View style={styles.content}>
              <Text style={styles.itemTitle}>{item.title}</Text>
              <Text style={styles.itemDesc}>{item.desc}</Text>
            </View>

            <View style={styles.meta}>
              {!item.read && <View style={styles.unreadDot} />}
              <Text style={styles.timeText}>{item.time}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

export default AlertsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 15,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.text,
  },
  subtitle: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  markReadText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.primary,
  },
  listContainer: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  card: {
    flexDirection: 'row',
    backgroundColor: Colors.surface,
    borderRadius: 24,
    padding: 16,
    marginBottom: 12,
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  cardUnread: {
    backgroundColor: '#EFF6FF',
    borderColor: Colors.primarySoft,
  },
  iconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
    marginLeft: 14,
    marginRight: 8,
  },
  itemTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: 2,
  },
  itemDesc: {
    fontSize: 13,
    color: Colors.textSecondary,
    lineHeight: 18,
  },
  meta: {
    alignItems: 'flex-end',
    gap: 6,
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.primary,
  },
  timeText: {
    fontSize: 11,
    color: Colors.textMuted,
  },
});
