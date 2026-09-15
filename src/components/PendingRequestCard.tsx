import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';

const PendingRequestCard = ({ onPress }: { onPress?: () => void }) => {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.8}>
      <Image
        source={{ uri: 'https://i.pravatar.cc/100?img=5' }}
        style={styles.image}
      />

      <View style={styles.info}>
        <Text style={styles.name}>Priya Verma</Text>
        <Text style={styles.purpose}>Guest — Family visit</Text>
        <Text style={styles.time}>Gate 1 • 11:05 AM</Text>
      </View>

      <View style={styles.badgeContainer}>
        <Text style={styles.badgeText}>PENDING</Text>
      </View>
    </TouchableOpacity>
  );
};

export default PendingRequestCard;

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 24,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },

  image: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },

  info: {
    flex: 1,
    marginLeft: 15,
  },

  name: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1E293B',
  },

  purpose: {
    color: '#64748B',
    marginTop: 4,
    fontSize: 14,
  },

  time: {
    color: '#94A3B8',
    marginTop: 4,
    fontSize: 12,
  },

  badgeContainer: {
    backgroundColor: '#FFEDD5',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },

  badgeText: {
    color: '#9A3412',
    fontSize: 12,
    fontWeight: '700',
  },
});