
import { useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import type { RootStackParamList } from '../types/booking';
import { createBooking } from '../services/mockApi';
import { clearBookingDraft } from '../storage/bookingDraft';

type Props = NativeStackScreenProps<RootStackParamList, 'Confirmation'>;
type BookingStatus = 'loading' | 'success' | 'error';

const carImages: Record<string, number> = {
  vehicle_1: require('../../assets/cars/nissan_patrol_platinum_2024_8k-original.jpg'),
  vehicle_2: require('../../assets/cars/2026_LandCruiser_HeritageBlue_001.jpg'),
  vehicle_3: require('../../assets/cars/2026_Toyota-Camry_001.jpg'),
  vehicle_4: require('../../assets/cars/BMW X5.jpg'),
  vehicle_5: require('../../assets/cars/mercedes_benz_gle.jpg'),
};

const inspectionNames: Record<string, string> = {
  BASIC: 'Basic Inspection',
  COMPREHENSIVE: 'Comprehensive Inspection',
  PRE_PURCHASE: 'Pre-purchase Inspection',
};

export default function ConfirmationScreen({
  route,
  navigation,
}: Props) {
  const { vehicle, booking } = route.params;

  const [status, setStatus] = useState<BookingStatus>('loading');
  const [reference, setReference] = useState('');
  const [error, setError] = useState('');

  const requestInProgress = useRef(false);
  const mounted = useRef(false);

  async function submitBooking() {
    if (requestInProgress.current) return;

    requestInProgress.current = true;
    setStatus('loading');
    setError('');

    try {
      const result = await createBooking(booking, vehicle);

      if (!mounted.current) return;

      setReference(result.reference);
      setStatus('success');

      // Clear only this vehicle's saved draft.
      try {
        await clearBookingDraft(vehicle.id);
      } catch {
        // The booking succeeded; draft cleanup can be retried later.
      }
    } catch (err) {
      if (!mounted.current) return;

      setError(
        err instanceof Error
          ? err.message
          : 'Booking failed. Please try again.',
      );

      setStatus('error');
    } finally {
      requestInProgress.current = false;
    }
  }

  useEffect(() => {
    mounted.current = true;
    void submitBooking();

    return () => {
      mounted.current = false;
    };
  }, []);

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={styles.container}
      showsVerticalScrollIndicator={false}
    >
      <Text style={styles.eyebrow}>AUTOCONX / BOOKING</Text>

      <LinearGradient
        colors={
          status === 'error'
            ? ['#7F1D1D', '#B91C1C', '#EF4444']
            : ['#111827', '#1D4ED8', '#2563EB']
        }
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.hero}
      >
        <View style={styles.statusBadge}>
          {status === 'loading' ? (
            <ActivityIndicator size="small" color="#FFFFFF" />
          ) : (
            <Text style={styles.statusSymbol}>
              {status === 'success' ? '✓' : '!'}
            </Text>
          )}

          <Text style={styles.statusText}>
            {status === 'loading'
              ? 'PROCESSING'
              : status === 'success'
                ? 'BOOKING CONFIRMED'
                : 'BOOKING FAILED'}
          </Text>
        </View>

        <Text style={styles.heroTitle}>
          {status === 'loading'
            ? 'Almost there!'
            : status === 'success'
              ? 'You’re all set.'
              : 'Let’s try again.'}
        </Text>

        <Text style={styles.heroSubtitle}>
          {status === 'loading'
            ? 'Please wait while we process your inspection request.'
            : status === 'success'
              ? 'Your vehicle inspection request has been created.'
              : error}
        </Text>

        <View style={styles.vehiclePreview}>
          <View style={styles.vehicleInfo}>
            <Text style={styles.vehicleLabel}>
              YOUR SELECTED VEHICLE
            </Text>

            <Text style={styles.vehicleName}>
              {vehicle.make} {vehicle.model}
            </Text>

            <Text style={styles.vehicleMeta}>
              {vehicle.year} MODEL · {vehicle.bodyType}
            </Text>
          </View>

          {carImages[vehicle.id] !== undefined ? (
            <Image
              source={carImages[vehicle.id]}
              style={styles.carImage}
              resizeMode="contain"
              accessibilityLabel={`${vehicle.make} ${vehicle.model}`}
            />
          ) : null}
        </View>
      </LinearGradient>

      {status === 'success' && (
        <>
          <View style={styles.referenceCard}>
            <View style={styles.referenceTop}>
              <Text style={styles.sectionLabel}>
                BOOKING REFERENCE
              </Text>

              <View style={styles.confirmedPill}>
                <Text style={styles.confirmedText}>SUCCESS</Text>
              </View>
            </View>

            <Text style={styles.reference}>{reference}</Text>

            <Text style={styles.referenceHint}>
              Keep this reference for your records.
            </Text>
          </View>

          <Text style={styles.sectionTitle}>
            Inspection Summary
          </Text>

          <View style={styles.detailsCard}>
            <DetailRow
              label="Inspection Type"
              value={
                inspectionNames[booking.inspectionType] ??
                booking.inspectionType
              }
            />

            <View style={styles.divider} />

            <DetailRow
              label="Preferred Date"
              value={booking.date}
            />

            <View style={styles.divider} />

            <DetailRow
              label="Location"
              value={booking.address}
            />

            {booking.notes.trim() ? (
              <>
                <View style={styles.divider} />

                <DetailRow
                  label="Additional Notes"
                  value={booking.notes.trim()}
                />
              </>
            ) : null}
          </View>
        </>
      )}

      {status === 'error' && (
        <Pressable
          accessibilityRole="button"
          style={({ pressed }) => [
            styles.primaryButton,
            pressed && styles.pressed,
          ]}
          onPress={() => void submitBooking()}
        >
          <Text style={styles.primaryButtonText}>
            Retry Booking
          </Text>
        </Pressable>
      )}

      {status === 'success' && (
        <Pressable
          accessibilityRole="button"
          style={({ pressed }) => [
            styles.primaryButton,
            pressed && styles.pressed,
          ]}
          onPress={() =>
            navigation.navigate('BookingDetails', {
              vehicle,
              booking,
              reference,
            })
          }
        >
          <Text style={styles.primaryButtonText}>
            View Booking Details →
          </Text>
        </Pressable>
      )}

      {status === 'loading' && (
        <View style={styles.loadingRow}>
          <ActivityIndicator color="#2563EB" />

          <Text style={styles.loadingText}>
            Securely processing your request...
          </Text>
        </View>
      )}

      <Text style={styles.footer}>
        AUTOCONX · VEHICLE CARE MADE SIMPLE
      </Text>
    </ScrollView>
  );
}

function DetailRow({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <View style={styles.detailRow}>
      <Text style={styles.detailLabel}>{label}</Text>
      <Text style={styles.detailValue}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#F3F6FC',
  },
  container: {
    padding: 20,
    paddingBottom: 32,
  },
  eyebrow: {
    color: '#2563EB',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1.8,
    marginTop: 8,
    marginBottom: 18,
  },
  hero: {
    borderRadius: 24,
    padding: 20,
    overflow: 'hidden',
    shadowColor: '#1D4ED8',
    shadowOpacity: 0.2,
    shadowRadius: 14,
    elevation: 6,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    gap: 8,
    backgroundColor: 'rgba(255,255,255,0.16)',
    borderRadius: 30,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  statusSymbol: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '900',
  },
  statusText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1,
  },
  heroTitle: {
    color: '#FFFFFF',
    fontSize: 29,
    fontWeight: '800',
    marginTop: 20,
  },
  heroSubtitle: {
    color: '#DBEAFE',
    fontSize: 13,
    lineHeight: 20,
    marginTop: 8,
  },
  vehiclePreview: {
    marginTop: 22,
    padding: 14,
    borderRadius: 17,
    backgroundColor: 'rgba(255,255,255,0.12)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.18)',
  },
  vehicleInfo: {
    gap: 5,
  },
  vehicleLabel: {
    color: '#BFDBFE',
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 1.2,
  },
  vehicleName: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '800',
  },
  vehicleMeta: {
    color: '#DBEAFE',
    fontSize: 11,
  },
  carImage: {
    width: '100%',
    height: 145,
    marginTop: 4,
  },
  referenceCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    padding: 18,
    marginTop: 18,
  },
  referenceTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
  },
  sectionLabel: {
    color: '#64748B',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1,
  },
  confirmedPill: {
    backgroundColor: '#DCFCE7',
    borderRadius: 20,
    paddingHorizontal: 9,
    paddingVertical: 6,
  },
  confirmedText: {
    color: '#166534',
    fontSize: 9,
    fontWeight: '800',
  },
  reference: {
    color: '#1D4ED8',
    fontSize: 25,
    fontWeight: '900',
    marginTop: 12,
  },
  referenceHint: {
    color: '#94A3B8',
    fontSize: 12,
    marginTop: 5,
  },
  sectionTitle: {
    color: '#101827',
    fontSize: 19,
    fontWeight: '800',
    marginTop: 25,
    marginBottom: 12,
  },
  detailsCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    paddingHorizontal: 17,
  },
  detailRow: {
    paddingVertical: 15,
    gap: 6,
  },
  detailLabel: {
    color: '#64748B',
    fontSize: 12,
    fontWeight: '600',
  },
  detailValue: {
    color: '#101827',
    fontSize: 15,
    fontWeight: '700',
    lineHeight: 22,
  },
  divider: {
    height: 1,
    backgroundColor: '#EDF0F5',
  },
  primaryButton: {
    backgroundColor: '#1D4ED8',
    padding: 17,
    borderRadius: 15,
    alignItems: 'center',
    marginTop: 22,
  },
  pressed: {
    opacity: 0.8,
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '800',
  },
  loadingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    marginTop: 25,
  },
  loadingText: {
    color: '#64748B',
    fontSize: 12,
  },
  footer: {
    color: '#94A3B8',
    fontSize: 9,
    fontWeight: '700',
    letterSpacing: 1,
    textAlign: 'center',
    marginTop: 26,
  },
});
