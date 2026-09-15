import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';

import Icon from 'react-native-vector-icons/Ionicons';

type Props = {
  title: string;
  subtitle: string;
  icon: string;
  iconColor: string;
  iconBg: string;
  onPress: () => void;
};

const RoleCard = ({
  title,
  subtitle,
  icon,
  iconColor,
  iconBg,
  onPress,
}: Props) => {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <View style={[styles.iconContainer, { backgroundColor: iconBg }]}>
        <Icon name={icon} size={30} color={iconColor} />
      </View>

      <View style={styles.content}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.subtitle}>{subtitle}</Text>
      </View>

      <Icon name="arrow-forward-outline" size={24} color="#777" />
    </TouchableOpacity>
  );
};

export default RoleCard;

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 18,
    marginVertical: 12,
    elevation: 4,
  },

  iconContainer: {
    width: 70,
    height: 70,
    borderRadius: 35,
    justifyContent: 'center',
    alignItems: 'center',
  },

  content: {
    flex: 1,
    marginLeft: 18,
  },

  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#000',
  },

  subtitle: {
    fontSize: 15,
    color: '#666',
    marginTop: 4,
  },
});