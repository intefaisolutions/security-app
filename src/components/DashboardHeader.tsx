import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

const DashboardHeader = () => {
  return (
    <View style={styles.container}>

      <View style={styles.row}>

        <View>
          <Text style={styles.greeting}>
            Good Morning 👋
          </Text>

          <Text style={styles.name}>
            Goutam Yadav
          </Text>

          <Text style={styles.flat}>
            Flat A-302
          </Text>
        </View>


        <TouchableOpacity style={styles.notification}>

          <Icon
            name="notifications-outline"
            size={24}
            color="#fff"
          />

          <View style={styles.badge}>
            <Text style={styles.badgeText}>3</Text>
          </View>

        </TouchableOpacity>

      </View>


      <Image
        source={{
          uri: 'https://i.pravatar.cc/150?img=12',
        }}
        style={styles.avatar}
      />

    </View>
  );
};

export default DashboardHeader;

const styles = StyleSheet.create({

  container: {
    backgroundColor: '#2563EB',
    padding: 20,
    paddingBottom: 60,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },

  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  greeting: {
    color: '#DBEAFE',
    fontSize: 15,
  },

  name: {
    color: '#fff',
    fontSize: 28,
    fontWeight: '700',
    marginTop: 6,
  },

  flat: {
    color: '#DBEAFE',
    marginTop: 5,
    fontSize: 15,
  },

  notification: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255,255,255,0.15)',
    justifyContent: 'center',
    alignItems: 'center',
  },

  badge: {
    position: 'absolute',
    right: 4,
    top: 4,
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: '#EF4444',
    justifyContent: 'center',
    alignItems: 'center',
  },

  badgeText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '700',
  },

  avatar: {
    width: 70,
    height: 70,
    borderRadius: 35,
    borderWidth: 3,
    borderColor: '#fff',
    position: 'absolute',
    bottom: -35,
    left: 20,
  },

});