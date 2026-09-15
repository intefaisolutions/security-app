import React from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, Linking, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Ionicons';

const { width } = Dimensions.get('window');
const cardWidth = (width - 60) / 2;

const services = [
  { id: '1', title: 'Electrician', rating: '4.8', phone: '+919822012345', image: 'https://images.unsplash.com/photo-1621905252507-b35492cc74b4?auto=format&fit=crop&q=80&w=300&h=200' },
  { id: '2', title: 'Plumber', rating: '4.8', phone: '+919833022456', image: 'https://images.unsplash.com/photo-1585704032915-c3400ca199e7?auto=format&fit=crop&q=80&w=300&h=200' },
  { id: '3', title: 'Carpenter', rating: '4.8', phone: '+919845033567', image: 'https://images.unsplash.com/photo-1581141849291-1125c7b692b5?auto=format&fit=crop&q=80&w=300&h=200' },
  { id: '4', title: 'House Cleaning', rating: '4.8', phone: '+919822044678', image: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&q=80&w=300&h=200' },
  { id: '5', title: 'RO Service', rating: '4.8', phone: '+919833055789', image: 'https://images.unsplash.com/photo-1584820927498-cafe2c1c9c45?auto=format&fit=crop&q=80&w=300&h=200' },
  { id: '6', title: 'AC Repair', rating: '4.8', phone: '+919845066890', image: 'https://images.unsplash.com/photo-1599839619722-39751411ea63?auto=format&fit=crop&q=80&w=300&h=200' },
];

const ServicesScreen = () => {
  const handleCall = (phone: string) => {
    Linking.openURL(`tel:${phone}`);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Local Services</Text>
        <Text style={styles.subtitle}>Trusted help around your community</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.grid}>
          {services.map((service) => (
            <View key={service.id} style={styles.card}>
              <Image source={{ uri: service.image }} style={styles.image} />
              
              <View style={styles.cardBody}>
                <Text style={styles.serviceTitle}>{service.title}</Text>
                
                <View style={styles.ratingRow}>
                  <Icon name="star" size={14} color="#F59E0B" />
                  <Text style={styles.ratingText}>{service.rating} · Verified</Text>
                </View>
                
                <Text style={styles.phoneText}>
                  {service.phone.substring(0, 3)} {service.phone.substring(3, 8)} {service.phone.substring(8)}
                </Text>
                
                <TouchableOpacity 
                  style={styles.callBtn} 
                  onPress={() => handleCall(service.phone)}
                >
                  <Icon name="call-outline" size={16} color="#fff" />
                  <Text style={styles.callBtnText}>Call</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default ServicesScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 15,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#0F172A',
  },
  subtitle: {
    fontSize: 16,
    color: '#64748B',
    marginTop: 4,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  card: {
    width: cardWidth,
    backgroundColor: '#fff',
    borderRadius: 20,
    marginBottom: 20,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  image: {
    width: '100%',
    height: 120,
  },
  cardBody: {
    padding: 12,
  },
  serviceTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 6,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  ratingText: {
    fontSize: 12,
    color: '#64748B',
    marginLeft: 4,
    fontWeight: '500',
  },
  phoneText: {
    fontSize: 12,
    color: '#64748B',
    marginBottom: 12,
  },
  callBtn: {
    backgroundColor: '#2563EB',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: 20,
  },
  callBtnText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
    marginLeft: 6,
  },
});