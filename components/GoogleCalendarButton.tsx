import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, Platform } from 'react-native';
import { Calendar, Check, X, Smartphone } from 'lucide-react-native';
import { GoogleCalendarService } from '@/utils/googleCalendar';

interface GoogleCalendarButtonProps {
  onAuthStatusChange?: (isAuthenticated: boolean) => void;
}

export default function GoogleCalendarButton({ onAuthStatusChange }: GoogleCalendarButtonProps) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    const authenticated = await GoogleCalendarService.isAuthenticated();
    setIsAuthenticated(authenticated);
    onAuthStatusChange?.(authenticated);
  };

  const handleConnect = async () => {
    setIsLoading(true);
    try {
      if (Platform.OS === 'web') {
        // Web'de demo mode uyarısı
        Alert.alert(
          'Demo Modu',
          'Web sürümünde Google Calendar entegrasyonu demo modunda çalışır. Gerçek entegrasyon için mobil uygulamayı kullanın.',
          [
            { text: 'İptal', style: 'cancel' },
            {
              text: 'Demo Modunu Etkinleştir',
              onPress: () => {
                localStorage.setItem('google_access_token', 'demo_token');
                setIsAuthenticated(true);
                onAuthStatusChange?.(true);
                Alert.alert(
                  'Demo Modu Etkin!',
                  'Google Calendar demo modu etkinleştirildi. Görevler konsola yazdırılacak.',
                  [{ text: 'Tamam' }]
                );
              },
            },
          ]
        );
        return;
      }

      const success = await GoogleCalendarService.authenticate();
      if (success) {
        setIsAuthenticated(true);
        onAuthStatusChange?.(true);
        Alert.alert(
          'Başarılı!',
          'Google Calendar ile bağlantı kuruldu. Artık görevleriniz otomatik olarak takviminize eklenecek.',
          [{ text: 'Tamam' }]
        );
      } else {
        Alert.alert(
          'Hata',
          'Google Calendar bağlantısı kurulamadı. Lütfen tekrar deneyin.',
          [{ text: 'Tamam' }]
        );
      }
    } catch (error) {
      console.error('Google Calendar connection error:', error);
      Alert.alert(
        'Hata',
        'Bir hata oluştu. Lütfen tekrar deneyin.',
        [{ text: 'Tamam' }]
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleDisconnect = async () => {
    Alert.alert(
      'Bağlantıyı Kes',
      'Google Calendar bağlantısını kesmek istediğinizden emin misiniz?',
      [
        { text: 'İptal', style: 'cancel' },
        {
          text: 'Evet',
          style: 'destructive',
          onPress: async () => {
            await GoogleCalendarService.signOut();
            setIsAuthenticated(false);
            onAuthStatusChange?.(false);
            Alert.alert(
              'Bağlantı Kesildi',
              'Google Calendar bağlantısı başarıyla kesildi.',
              [{ text: 'Tamam' }]
            );
          },
        },
      ]
    );
  };

  const getStatusText = () => {
    if (isLoading) return 'Bağlanıyor...';
    
    if (isAuthenticated) {
      return Platform.OS === 'web' 
        ? 'Demo Modu - Görevler konsola yazdırılıyor'
        : 'Bağlı - Görevler otomatik senkronize ediliyor';
    }
    
    return Platform.OS === 'web'
      ? 'Demo modunda Google Calendar entegrasyonu'
      : 'Görevlerinizi Google Calendar ile senkronize edin';
  };

  return (
    <TouchableOpacity
      style={[
        styles.container,
        isAuthenticated ? styles.connectedContainer : styles.disconnectedContainer,
      ]}
      onPress={isAuthenticated ? handleDisconnect : handleConnect}
      disabled={isLoading}
    >
      <View style={[
        styles.iconContainer,
        isAuthenticated ? styles.connectedIconContainer : styles.disconnectedIconContainer
      ]}>
        {isAuthenticated ? (
          <Check color="#10B981\" size={20} />
        ) : Platform.OS === 'web' ? (
          <Smartphone color="#6B7280" size={20} />
        ) : (
          <Calendar color="#6B7280" size={20} />
        )}
      </View>
      
      <View style={styles.textContainer}>
        <Text style={[
          styles.title,
          isAuthenticated ? styles.connectedTitle : styles.disconnectedTitle
        ]}>
          Google Calendar
          {Platform.OS === 'web' && ' (Demo)'}
        </Text>
        <Text style={styles.subtitle}>
          {getStatusText()}
        </Text>
      </View>
      
      {isAuthenticated && (
        <TouchableOpacity
          style={styles.disconnectButton}
          onPress={handleDisconnect}
        >
          <X color="#EF4444" size={16} />
        </TouchableOpacity>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginVertical: 8,
    borderWidth: 1,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
  },
  connectedContainer: {
    borderColor: '#10B981',
    backgroundColor: '#F0FDF4',
  },
  disconnectedContainer: {
    borderColor: '#E5E7EB',
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  connectedIconContainer: {
    backgroundColor: '#D1FAE5',
  },
  disconnectedIconContainer: {
    backgroundColor: '#F3F4F6',
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  connectedTitle: {
    color: '#065F46',
  },
  disconnectedTitle: {
    color: '#1F2937',
  },
  subtitle: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 18,
  },
  disconnectButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#FEE2E2',
    alignItems: 'center',
    justifyContent: 'center',
  },
});