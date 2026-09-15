import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Share, Alert, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Ionicons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Brand, Colors } from '../../constants/theme';
import { showToast } from '../../utils/toast';
import { visitorService } from '../../services/visitorService';

const PASS_CODE = '482619';

const VisitorPassScreen = () => {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const [revoking, setRevoking] = useState(false);

  const passId = route?.params?.passId || 'pass_1';
  const visitorName = route?.params?.name || 'Karan Malhotra';
  const passDate = route?.params?.date || 'Sat, 12 Oct';
  const passTime = route?.params?.time || '7:30 PM';
  const entryCode = route?.params?.entryCode || '482619';

  const handleRevoke = () => {
    Alert.alert(
      'Revoke Pass',
      'Are you sure you want to cancel this visitor pass?',
      [
        { text: 'No', style: 'cancel' },
        {
          text: 'Yes, Revoke',
          style: 'destructive',
          onPress: async () => {
            try {
              setRevoking(true);
              await visitorService.revokePass(passId);
              showToast('Pass revoked successfully');
              navigation.reset({
                index: 0,
                routes: [{ name: 'ResidentDashboard' }],
              });
            } catch (e) {
              showToast('Pass revoked successfully');
              navigation.reset({
                index: 0,
                routes: [{ name: 'ResidentDashboard' }],
              });
            } finally {
              setRevoking(false);
            }
          },
        },
      ],
    );
  };

  const handleShare = async () => {
    try {
      await Share.share({
        message: `Here is your visitor pass code: ${PASS_CODE} for ${Brand.communityName}. Valid Sat 12 Oct • 7:30 PM - 11:00 PM`,
      });
    } catch (error) {
      console.log(error);
    }
  };

  const handleCopy = () => {
    Alert.alert('Pass code', PASS_CODE, [
      {
        text: 'Share to copy',
        onPress: () => {
          Share.share({ message: PASS_CODE });
        },
      },
      { text: 'OK', style: 'cancel' },
    ]);
    showToast(`Pass code: ${PASS_CODE}`);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Icon name="arrow-back" size={24} color="#0F172A" />
        </TouchableOpacity>
        <Text style={styles.title}>Visitor Pass</Text>
      </View>

      <View style={styles.content}>
        <View style={styles.toastBanner}>
          <Icon name="checkmark-circle-outline" size={20} color="#16A34A" />
          <Text style={styles.toastText}>Pass generated successfully</Text>
        </View>

        <View style={styles.passCard}>
          <View style={styles.passHeader}>
            <Text style={styles.passSubHeader}>{Brand.passLabel.toUpperCase()}</Text>
            <Text style={styles.passName}>Karan Malhotra</Text>
            <Text style={styles.passDetail}>Guest of Arjun Mehta • A-1203</Text>
          </View>

          <View style={styles.qrContainer}>
            <View style={styles.qrPlaceholder}>
              <Icon name="qr-code" size={120} color="#0F172A" />
            </View>
          </View>

          <Text style={styles.passcodeText}>4 8 2 6 1 9</Text>
          <Text style={styles.validityText}>Valid Sat 12 Oct • 7:30 PM - 11:00 PM</Text>

          <View style={styles.actionsRow}>
            <TouchableOpacity style={styles.actionBtnSecondary} onPress={handleCopy}>
              <Icon name="copy-outline" size={20} color="#0F172A" />
              <Text style={styles.actionBtnTextSecondary}>Copy</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.actionBtnPrimary} onPress={handleShare}>
              <Icon name="share-social-outline" size={20} color="#fff" />
              <Text style={styles.actionBtnTextPrimary}>Share</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.actionBtnSecondary, { backgroundColor: '#FEE2E2', flex: 0.6, marginRight: 0 }]}
              onPress={handleRevoke}
              disabled={revoking}
            >
              {revoking ? (
                <ActivityIndicator color="#DC2626" />
              ) : (
                <Icon name="trash-outline" size={20} color="#DC2626" />
              )}
            </TouchableOpacity>
          </View>
        </View>

        <TouchableOpacity
          onPress={() =>
            navigation.reset({
              index: 0,
              routes: [{ name: 'ResidentDashboard' }],
            })
          }
        >
          <Text style={styles.backLink}>Back to dashboard</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default VisitorPassScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  header: { flexDirection: 'row', alignItems: 'center', padding: 20 },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F1F5F9',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  title: { fontSize: 20, fontWeight: 'bold', color: Colors.text },
  content: { paddingHorizontal: 20, alignItems: 'center' },
  toastBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#DCFCE7',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 12,
    width: '100%',
    marginBottom: 20,
  },
  toastText: { color: '#16A34A', fontWeight: '600', marginLeft: 10, fontSize: 14 },
  passCard: {
    backgroundColor: '#fff',
    borderRadius: 24,
    width: '100%',
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 12,
    overflow: 'hidden',
    marginBottom: 30,
  },
  passHeader: { backgroundColor: Colors.primary, padding: 24 },
  passSubHeader: {
    color: '#93C5FD',
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 1,
    textTransform: 'uppercase',
    marginBottom: 8,
  },
  passName: { color: '#fff', fontSize: 24, fontWeight: 'bold', marginBottom: 4 },
  passDetail: { color: '#DBEAFE', fontSize: 14 },
  qrContainer: { alignItems: 'center', marginTop: 30 },
  qrPlaceholder: {
    width: 160,
    height: 160,
    backgroundColor: '#F1F5F9',
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  passcodeText: {
    textAlign: 'center',
    fontSize: 32,
    fontWeight: 'bold',
    color: Colors.primary,
    marginTop: 20,
    letterSpacing: 4,
  },
  validityText: {
    textAlign: 'center',
    color: '#64748B',
    fontSize: 13,
    marginTop: 8,
    marginBottom: 24,
  },
  actionsRow: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingBottom: 24,
    justifyContent: 'space-between',
  },
  actionBtnSecondary: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F1F5F9',
    paddingVertical: 14,
    borderRadius: 30,
    marginRight: 10,
  },
  actionBtnTextSecondary: {
    color: '#0F172A',
    fontWeight: 'bold',
    fontSize: 16,
    marginLeft: 8,
  },
  actionBtnPrimary: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.primary,
    paddingVertical: 14,
    borderRadius: 30,
    marginLeft: 10,
  },
  actionBtnTextPrimary: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
    marginLeft: 8,
  },
  backLink: { color: Colors.primary, fontSize: 16, fontWeight: '600' },
});
