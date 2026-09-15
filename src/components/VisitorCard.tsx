import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';

const VisitorCard = ({ name, purpose, time, image }: any) => {
  return (
    <View style={styles.card}>
      <Image
        source={{ uri: image }}
        style={styles.image}
      />

      <Text style={styles.name}>{name}</Text>

      <Text style={styles.purpose}>
        {purpose}
      </Text>

      <Text style={styles.time}>
        {time}
      </Text>
    </View>
  );
};

export default VisitorCard;

const styles = StyleSheet.create({
  card: {
    width: 140,
    backgroundColor: '#fff',
    borderRadius: 24,
    padding: 16,
    marginRight: 15,
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

  name: {
    marginTop: 16,
    fontWeight: '700',
    fontSize: 15,
    color: '#1E293B',
  },

  purpose: {
    color: '#64748B',
    marginTop: 4,
    fontSize: 13,
  },

  time: {
    color: '#2563EB',
    marginTop: 12,
    fontWeight: '600',
    fontSize: 13,
  },
});