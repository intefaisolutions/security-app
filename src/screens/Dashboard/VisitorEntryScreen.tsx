import React, { useState } from 'react';
import { 
  View, Text, StyleSheet, TouchableOpacity, SafeAreaView, 
  StatusBar, TextInput, ScrollView, Image, ActivityIndicator 
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import FeatherIcon from 'react-native-vector-icons/Feather';
import { useNavigation } from '@react-navigation/native';
import { showToast } from '../../utils/toast';
import { guardService } from '../../services/guardService';

const ProgressBar = ({ step, totalSteps }: { step: number, totalSteps: number }) => {
  return (
    <View style={styles.progressContainer}>
      {Array.from({ length: totalSteps }).map((_, index) => (
        <View 
          key={index} 
          style={[
            styles.progressLine, 
            { backgroundColor: index < step ? '#2563EB' : '#E2E8F0' }
          ]} 
        />
      ))}
    </View>
  );
};

const VisitorEntryScreen = () => {
  const navigation = useNavigation();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const totalSteps = 5;

  const getStepSubtitle = (currentStep: number) => {
    switch (currentStep) {
      case 1: return 'Capture visitor photo';
      case 2: return 'Enter visitor name';
      case 3: return 'Purpose of visit';
      case 4: return 'Select resident';
      case 5: return 'Request sent';
      default: return '';
    }
  };

  // Form State
  const [visitorName, setVisitorName] = useState('');
  const [visitorPhone, setVisitorPhone] = useState('');
  const [purpose, setPurpose] = useState('');
  const [selectedResident, setSelectedResident] = useState<string | null>(null);
  const [residentsList, setResidentsList] = useState<any[]>([]);

  React.useEffect(() => {
    const fetchResidents = async () => {
      try {
        const res: any = await guardService.searchResidents('');
        const list = res?.data || res || [];
        if (Array.isArray(list) && list.length > 0) {
          setResidentsList(list.map((r: any) => ({
            id: r.id || r._id,
            name: r.name || r.fullName,
            flat: r.flatNumber ? `Flat ${r.flatNumber}` : (r.flat || 'Flat'),
            tower: r.tower || r.block || 'Tower A',
            avatar: (r.name || 'R').charAt(0).toUpperCase(),
          })));
        }
      } catch (err) {}
    };
    fetchResidents();
  }, []);

  const handleNext = async () => {
    if (step === 4) {
      if (!visitorName.trim()) {
        showToast('Visitor name is required');
        return;
      }
      setLoading(true);
      try {
        const selectedResObj = residentsList.find(r => r.id === selectedResident) || residentsList[0];
        const categoryMap: Record<string, 'Guest' | 'Delivery' | 'Cab' | 'Service'> = {
          'Delivery': 'Delivery',
          'Guest / Family': 'Guest',
          'Cab / Taxi': 'Cab',
          'Service Staff': 'Service',
        };
        const category = categoryMap[purpose] || 'Guest';

        const res = await guardService.registerEntry({
          visitorName: visitorName.trim(),
          phone: visitorPhone.trim() || '9876543210',
          flat: selectedResObj ? selectedResObj.flat.replace('Flat ', '') : 'A-101',
          category: category,
          entryGate: 'Main Gate',
        });

        if (res && (res as any).success !== false) {
          showToast('Approval request sent to resident');
          setStep(5);
        } else {
          showToast((res as any)?.message || 'Failed to register entry');
        }
      } catch (err: any) {
        showToast(err.message || 'Failed to send request');
      } finally {
        setLoading(false);
      }
    } else if (step < 5) {
      setStep(step + 1);
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    } else {
      navigation.goBack();
    }
  };

  const renderStep1 = () => (
    <View style={styles.stepContent}>
      <View style={styles.cameraFrame}>
        <View style={styles.imageContainer}>
          <Image 
            source={{ uri: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?q=80&w=600&auto=format&fit=crop' }} 
            style={styles.visitorImage} 
            resizeMode="cover"
          />
          {/* Inner border */}
          <View style={styles.innerBorder} />
        </View>
      </View>
    </View>
  );

  const renderStep2 = () => (
    <View style={styles.stepContent}>
      <Text style={styles.inputLabel}>Visitor Name</Text>
      
      <View style={styles.inputWrapper}>
        <FeatherIcon name="user" size={22} color="#2563EB" style={styles.inputIcon} />
        <TextInput 
          style={[styles.inputField, { fontWeight: '600' }]}
          placeholder="Visitor Full Name"
          placeholderTextColor="#94A3B8"
          value={visitorName}
          onChangeText={setVisitorName}
        />
        <TouchableOpacity style={styles.micBtn}>
          <FeatherIcon name="mic" size={20} color="#2563EB" />
        </TouchableOpacity>
      </View>

      <View style={styles.infoCard}>
        <View style={styles.infoIconWrapper}>
          <FeatherIcon name="mic" size={18} color="#2563EB" />
        </View>
        <Text style={styles.infoText}>Tap the mic to speak — voice will fill the name automatically.</Text>
      </View>

      <TouchableOpacity style={[styles.primaryButton, { marginTop: 32 }]} onPress={handleNext}>
        <Text style={styles.primaryButtonText}>Continue</Text>
      </TouchableOpacity>
    </View>
  );

  const renderStep3 = () => (
    <View style={styles.stepContent}>
      <Text style={styles.inputLabel}>Purpose of visit</Text>
      
      <View style={styles.inputWrapper}>
        <FeatherIcon name="clipboard" size={22} color="#2563EB" style={styles.inputIcon} />
        <TextInput 
          style={[styles.inputField, { fontWeight: '600' }]}
          placeholder="E.g. Delivery, Guest"
          placeholderTextColor="#94A3B8"
          value={purpose}
          onChangeText={setPurpose}
        />
        <TouchableOpacity style={styles.micBtn}>
          <FeatherIcon name="mic" size={20} color="#2563EB" />
        </TouchableOpacity>
      </View>

      <Text style={styles.quickPickLabel}>QUICK PICK</Text>
      <View style={styles.chipsContainer}>
        {['Delivery', 'Guest / Family', 'Cab / Taxi', 'Service Staff', 'Other'].map((item) => (
          <TouchableOpacity 
            key={item} 
            style={[styles.chip, purpose === item && styles.chipActive]}
            onPress={() => setPurpose(item)}
          >
            <Text style={[styles.chipText, purpose === item && styles.chipTextActive]}>{item}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity style={[styles.primaryButton, { marginTop: 40 }]} onPress={handleNext}>
        <Text style={styles.primaryButtonText}>Continue</Text>
      </TouchableOpacity>
    </View>
  );

  const renderStep4 = () => (
    <View style={styles.stepContent}>
      <Text style={styles.inputLabel}>Select resident flat</Text>
      
      <View style={styles.inputWrapper}>
        <FeatherIcon name="home" size={22} color="#2563EB" style={styles.inputIcon} />
        <TextInput 
          style={[styles.inputField, { fontWeight: '600' }]}
          placeholder="Search Flat or Name"
          placeholderTextColor="#94A3B8"
          defaultValue="A-1203"
        />
      </View>

      <ScrollView style={styles.residentList} showsVerticalScrollIndicator={false}>
        {residentsList.map((res) => {
          const isSelected = selectedResident === res.id;
          return (
            <TouchableOpacity 
              key={res.id} 
              style={[styles.residentSelectCard, isSelected && styles.residentSelectCardActive]}
              onPress={() => setSelectedResident(res.id)}
              activeOpacity={0.7}
            >
              <View style={styles.residentSelectLeft}>
                <View style={[styles.residentAvatar, isSelected && styles.residentAvatarActive]}>
                  <Text style={styles.residentAvatarText}>{res.avatar}</Text>
                </View>
                <View>
                  <Text style={styles.residentSelectName}>{res.name}</Text>
                  <Text style={styles.residentSelectFlat}>{res.flat} · {res.tower}</Text>
                </View>
              </View>
              {isSelected && (
                <FeatherIcon name="check" size={24} color="#2563EB" />
              )}
            </TouchableOpacity>
          );
        })}
        <TouchableOpacity 
          style={[styles.primaryButton, { marginTop: 20 }, loading && { opacity: 0.7 }]} 
          onPress={handleNext}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <Text style={styles.primaryButtonText}>Send Approval Request</Text>
          )}
        </TouchableOpacity>
      </ScrollView>
    </View>
  );

  const renderStep5 = () => (
    <View style={styles.successContent}>
      <View style={styles.successIconWrapper}>
        <FeatherIcon name="check" size={50} color="#10B981" />
      </View>
      <Text style={styles.successTitle}>Request Sent</Text>
      <Text style={styles.successSubtitle}>Arjun Mehta will respond shortly.</Text>

      <View style={styles.summaryCard}>
        <Text style={styles.summaryTopLabel}>WAITING FOR APPROVAL</Text>
        <View style={{flexDirection: 'row', alignItems: 'center', marginBottom: 8}}>
          <Text style={styles.summaryMainText}>{visitorName || 'Priya Verma'}</Text>
          <FeatherIcon name="arrow-right" size={16} color="#0F172A" style={{marginHorizontal: 8}} />
          <Text style={styles.summaryMainText}>A-1203</Text>
        </View>
        <Text style={styles.summarySubText}>{purpose || 'Guest — Family visit'} · Gate 2</Text>
      </View>

      <TouchableOpacity style={[styles.primaryButton, { width: '100%' }]} onPress={() => {
        (navigation as any).navigate({
          name: 'GuardDashboard',
          params: {
            newEntry: {
              id: Date.now().toString(),
              initials: visitorName ? visitorName.substring(0, 2).toUpperCase() : 'PV',
              name: visitorName || 'Priya Verma',
              details: `Visiting A-1203 • Just now`,
              status: 'PENDING',
              statusColor: '#B45309',
              statusBg: '#FFEDD5',
            }
          },
          merge: true,
        });
      }}>
        <Text style={styles.primaryButtonText}>Back to Dashboard</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#F8FAFC" />
      
      {/* Header */}
      <View style={styles.header}>
        {step <= 5 ? (
          <TouchableOpacity onPress={handleBack} style={styles.backButton}>
            <Icon name="arrow-back" size={24} color="#1E293B" />
          </TouchableOpacity>
        ) : <View style={styles.backButton} />}
        <View style={styles.headerTextContainer}>
          <Text style={styles.headerTitle}>Step {step} of {totalSteps}</Text>
          <Text style={styles.headerSubtitle}>{getStepSubtitle(step)}</Text>
        </View>
        <View style={styles.backButton} />
      </View>

      {/* Progress Bar */}
      {step <= 5 && <ProgressBar step={step} totalSteps={totalSteps} />}

      {/* Main Content Area */}
      <ScrollView contentContainerStyle={styles.scrollArea} keyboardShouldPersistTaps="handled">
        {step === 1 && renderStep1()}
        {step === 2 && renderStep2()}
        {step === 3 && renderStep3()}
        {step === 4 && renderStep4()}
        {step === 5 && renderStep5()}
      </ScrollView>

      {/* Bottom Fixed Button Area */}
      {(step !== 2 && step !== 3 && step !== 4 && step !== 5) && (
        <View style={styles.bottomFooter}>
          {step === 1 && (
            <TouchableOpacity style={styles.retakeBtnBottom}>
              <FeatherIcon name="camera" size={20} color="#2563EB" style={{marginRight: 8}} />
              <Text style={styles.retakeTextBottom}>Retake Photo</Text>
            </TouchableOpacity>
          )}
          {step < 5 ? (
            <TouchableOpacity style={styles.primaryButton} onPress={handleNext}>
              <Text style={styles.primaryButtonText}>Continue</Text>
            </TouchableOpacity>
          ) : step === 5 ? (
            <TouchableOpacity style={styles.primaryButton} onPress={() => navigation.goBack()}>
              <Text style={styles.primaryButtonText}>Finish</Text>
            </TouchableOpacity>
          ) : null}
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 20,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#0F172A',
  },
  headerTextContainer: {
    flex: 1,
    alignItems: 'flex-start',
    marginLeft: 10,
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#64748B',
    marginTop: 2,
  },
  progressContainer: {
    flexDirection: 'row',
    paddingHorizontal: 24,
    marginBottom: 24,
    gap: 8,
  },
  progressLine: {
    flex: 1,
    height: 6,
    borderRadius: 3,
  },
  scrollArea: {
    paddingHorizontal: 24,
    paddingBottom: 40,
    flexGrow: 1,
  },
  stepContent: {
    flex: 1,
  },
  stepTitle: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#0F172A',
    marginBottom: 8,
  },
  stepSubtitle: {
    fontSize: 15,
    color: '#64748B',
    marginBottom: 32,
  },
  
  // Step 1 Specific
  cameraFrame: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
  },
  imageContainer: {
    width: '100%',
    aspectRatio: 1,
    borderRadius: 32,
    overflow: 'hidden',
    position: 'relative',
    backgroundColor: '#E2E8F0',
  },
  visitorImage: {
    width: '100%',
    height: '100%',
  },
  innerBorder: {
    position: 'absolute',
    top: 12,
    left: 12,
    right: 12,
    bottom: 12,
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.7)',
    borderRadius: 24,
  },

  // Input Wrappers
  inputLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: '#64748B',
    marginBottom: 12,
    marginLeft: 4,
    marginTop: 10,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 20,
    paddingHorizontal: 20,
    height: 70,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.02,
    shadowRadius: 8,
    elevation: 2,
  },
  inputIcon: {
    marginRight: 16,
  },
  inputField: {
    flex: 1,
    fontSize: 18,
    color: '#0F172A',
    height: '100%',
  },
  micBtn: {
    width: 48,
    height: 48,
    backgroundColor: '#EFF6FF',
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },

  // Info Card
  infoCard: {
    backgroundColor: '#EFF6FF',
    borderRadius: 20,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  infoIconWrapper: {
    marginTop: 2,
    marginRight: 12,
  },
  infoText: {
    flex: 1,
    color: '#2563EB',
    fontSize: 15,
    lineHeight: 22,
    fontWeight: '500',
  },

  // Chips
  quickPickLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: '#64748B',
    marginBottom: 12,
    marginLeft: 4,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  chipsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  chip: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 24,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  chipActive: {
    backgroundColor: '#2563EB',
    borderColor: '#2563EB',
  },
  chipText: {
    color: '#475569',
    fontSize: 14,
    fontWeight: '500',
  },
  chipTextActive: {
    color: '#FFFFFF',
  },

  // Resident List (Step 4)
  residentList: {
    marginTop: 8,
  },
  residentSelectCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 20,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  residentSelectCardActive: {
    backgroundColor: '#EFF6FF',
    borderColor: '#2563EB',
  },
  residentSelectLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  residentAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  residentAvatarActive: {
    backgroundColor: '#FFFFFF',
  },
  residentAvatarText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2563EB',
  },
  residentSelectName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#0F172A',
    marginBottom: 4,
  },
  residentSelectFlat: {
    fontSize: 13,
    color: '#64748B',
  },

  // Success Step (Step 5)
  successContent: {
    flex: 1,
    alignItems: 'center',
    paddingTop: 40,
  },
  successIconWrapper: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#D1FAE5',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  successTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#0F172A',
    marginBottom: 8,
  },
  successSubtitle: {
    fontSize: 16,
    color: '#64748B',
    marginBottom: 40,
  },
  summaryCard: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 4,
    borderWidth: 1,
    borderColor: '#F1F5F9',
    marginBottom: 32,
    alignItems: 'flex-start',
  },
  summaryTopLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#94A3B8',
    marginBottom: 12,
    letterSpacing: 0.5,
  },
  summaryMainText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#0F172A',
  },
  summarySubText: {
    fontSize: 15,
    color: '#64748B',
  },

  // Footer Buttons
  bottomFooter: {
    paddingHorizontal: 24,
    paddingVertical: 20,
    backgroundColor: '#F8FAFC',
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  primaryButton: {
    backgroundColor: '#2563EB',
    borderRadius: 20,
    height: 60,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#2563EB',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
    marginRight: 12,
  },
  primaryButtonOutline: {
    backgroundColor: '#EFF6FF',
    borderWidth: 2,
    borderColor: '#2563EB',
    borderRadius: 20,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
  },
  primaryButtonTextOutline: {
    color: '#2563EB',
    fontSize: 18,
    fontWeight: 'bold',
  },
  retakeBtnBottom: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    paddingVertical: 16,
    borderRadius: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  retakeTextBottom: {
    color: '#0F172A',
    fontWeight: '700',
    fontSize: 16,
  }
});

export default VisitorEntryScreen;
