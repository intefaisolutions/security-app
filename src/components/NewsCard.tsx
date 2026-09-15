import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

const NewsCard = ({ title, subtitle, letter, color, textColor }: any) => {
  return (
    <View style={styles.card}>
      <View style={styles.left}>
        <View style={[styles.iconCircle, { backgroundColor: color }]}>
          <Text style={[styles.iconLetter, { color: textColor }]}>{letter}</Text>
        </View>

        <View style={styles.textContainer}>
          <Text style={styles.subtitle}>{subtitle}</Text>
          <Text style={styles.title}>{title}</Text>
        </View>
      </View>

      <Icon
        name="chevron-forward"
        size={22}
        color="#94A3B8"
      />
    </View>
  );
};

export default NewsCard;

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 24,
    padding: 16,
    marginBottom: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },

  left: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  iconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },

  iconLetter: {
    fontSize: 20,
    fontWeight: 'bold',
  },

  textContainer: {
    marginLeft: 15,
  },

  title: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1E293B',
    marginTop: 2,
  },

  subtitle: {
    fontSize: 13,
    color: '#64748B',
  },
});