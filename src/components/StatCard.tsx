import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

type Props = {
  title: string;
  value: string;
  color?: string;
};

const StatCard = ({ title, value, color = '#2563EB' }: Props) => {
  return (
    <View style={styles.card}>
      <Text style={styles.title}>{title}</Text>
      <Text style={[styles.value, { color }]}>{value}</Text>
    </View>
  );
};

export default StatCard;

const styles = StyleSheet.create({
  card: {
    width: 110,
    backgroundColor: '#fff',
    borderRadius: 18,
    padding: 16,
    marginRight: 12,
    elevation: 3,
  },

  title: {
    fontSize: 14,
    color: '#64748B',
  },

  value: {
    marginTop: 12,
    fontSize: 28,
    fontWeight: '700',
  },
});