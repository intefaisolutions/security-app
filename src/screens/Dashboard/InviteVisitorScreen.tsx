import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';

const InviteVisitorScreen = () => {
  const navigation = useNavigation<any>();
  const [name, setName] = useState('Karan Malhotra');
  const [mobile, setMobile] = useState('+91 98765 12340');
  const [purpose, setPurpose] = useState('Dinner at my place');
  const [date, setDate] = useState('Sat, 12 Oct');
  const [time, setTime] = useState('7:30 PM');

  const handleGenerate = () => {
    navigation.navigate('VisitorPass', { name, date, time });
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Icon name="arrow-back" size={24} color="#0F172A" />
        </TouchableOpacity>
        <View style={styles.headerTextContainer}>
          <Text style={styles.title}>Invite Visitor</Text>
          <Text style={styles.subtitle}>Pre-approve a guest</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.label}>Visitor Name</Text>
        <View style={styles.inputContainer}>
          <Icon name="person-outline" size={20} color="#64748B" style={styles.inputIcon} />
          <TextInput 
            style={styles.input} 
            value={name}
            onChangeText={setName}
            placeholder="Enter name"
          />
        </View>

        <Text style={styles.label}>Mobile Number</Text>
        <View style={styles.inputContainer}>
          <Icon name="call-outline" size={20} color="#64748B" style={styles.inputIcon} />
          <TextInput 
            style={styles.input} 
            value={mobile}
            onChangeText={setMobile}
            placeholder="Enter mobile number"
            keyboardType="phone-pad"
          />
        </View>

        <Text style={styles.label}>Purpose</Text>
        <View style={styles.inputContainer}>
          <Icon name="clipboard-outline" size={20} color="#64748B" style={styles.inputIcon} />
          <TextInput 
            style={styles.input} 
            value={purpose}
            onChangeText={setPurpose}
            placeholder="Enter purpose"
          />
        </View>

        <View style={styles.row}>
          <View style={styles.halfWidth}>
            <Text style={styles.label}>Date</Text>
            <View style={styles.inputContainer}>
              <Icon name="calendar-outline" size={20} color="#64748B" style={styles.inputIcon} />
              <TextInput style={styles.input} value={date} onChangeText={setDate} />
            </View>
          </View>
          <View style={styles.halfWidth}>
            <Text style={styles.label}>Time</Text>
            <View style={styles.inputContainer}>
              <Icon name="time-outline" size={20} color="#64748B" style={styles.inputIcon} />
              <TextInput style={styles.input} value={time} onChangeText={setTime} />
            </View>
          </View>
        </View>

        <View style={styles.passcodeContainer}>
          <Text style={styles.passcodeLabel}>PASS CODE PREVIEW</Text>
          <Text style={styles.passcodeValue}>4  8  2  •  6  1  9</Text>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity style={styles.generateBtn} onPress={handleGenerate}>
          <Text style={styles.generateBtnText}>Generate Visitor Pass</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default InviteVisitorScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC' },
  header: { flexDirection: 'row', alignItems: 'center', padding: 20 },
  backBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#F1F5F9', justifyContent: 'center', alignItems: 'center', marginRight: 15 },
  headerTextContainer: { flex: 1 },
  title: { fontSize: 20, fontWeight: 'bold', color: '#0F172A' },
  subtitle: { fontSize: 14, color: '#64748B', marginTop: 2 },
  content: { padding: 20, paddingBottom: 40 },
  label: { fontSize: 14, fontWeight: '600', color: '#475569', marginBottom: 8, marginTop: 16 },
  inputContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', borderWidth: 1, borderColor: '#E2E8F0', borderRadius: 16, paddingHorizontal: 15, height: 56 },
  inputIcon: { marginRight: 10 },
  input: { flex: 1, fontSize: 16, color: '#0F172A' },
  row: { flexDirection: 'row', justifyContent: 'space-between' },
  halfWidth: { width: '48%' },
  passcodeContainer: { backgroundColor: '#DBEAFE', borderRadius: 16, padding: 20, marginTop: 30, alignItems: 'center' },
  passcodeLabel: { fontSize: 12, fontWeight: '700', color: '#1D4ED8', textTransform: 'uppercase', marginBottom: 10 },
  passcodeValue: { fontSize: 28, fontWeight: 'bold', color: '#1D4ED8', letterSpacing: 2 },
  footer: { padding: 20, backgroundColor: '#F8FAFC' },
  generateBtn: { backgroundColor: '#2563EB', paddingVertical: 16, borderRadius: 30, alignItems: 'center' },
  generateBtnText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
});
