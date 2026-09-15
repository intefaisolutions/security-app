import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

type Props = {
  title: string;
  icon: string;
  color?: string;
};

const QuickActionCard = ({
  title,
  icon,
  color = '#2563EB',
}: Props) => {
  return (
    <TouchableOpacity style={styles.container}>
      <Icon name={icon} size={28} color={color} />
      <Text style={styles.title}>{title}</Text>
    </TouchableOpacity>
  );
};

export default QuickActionCard;

const styles = StyleSheet.create({
  container: {
    width: 80,
    alignItems: 'center',
    marginRight: 20,
  },

  title: {
    marginTop: 10,
    fontSize: 13,
    color: '#334155',
    textAlign: 'center',
    fontWeight: '600',
  },
});