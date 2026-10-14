
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import {
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

import type { RootStackParamList } from '../types/booking';

type Props = NativeStackScreenProps<RootStackParamList, 'BookingDetails'>;

const carImages: Record<string, number> = {
  vehicle_1: require('../../assets/cars/nissan_patrol_platinum_2024_8k-original.jpg'),
  vehicle_2: require('../../assets/cars/2026_LandCruiser_HeritageBlue_001.jpg'),
  vehicle_3: require('../../assets/cars/2026_Toyota-Camry_001.jpg'),
  vehicle_4: require('../../assets/cars/BMW X5.jpg'),
  vehicle_5: require('../../assets/cars/mercedes_benz_gle.jpg'),
};

const inspectionNames = {
  BASIC: 'Basic Inspection',
  COMPREHENSIVE: 'Comprehensive Inspection',
  PRE_PURCHASE: 'Pre-purchase Inspection',
};

export default function BookingDetailsScreen({
  route,
  navigation,
}: Props) {
  const { vehicle, booking, reference } = route.params;

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={styles.container}
      showsVerticalScrollIndicator={false}
    >
      <Text style={styles.eyebrow}>AUTOCONX  /  MY BOOKINGS</Text>
      <Text style={styles.title}>Booking Details</Text>
      <Text style={styles.subtitle}>
        Your vehicle inspection is booked.
      </Text>

      <LinearGradient
        colors={['#111827', '#1D4ED8', '#2563EB']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.hero}
      >
        <View style={styles.heroTop}>
          <View>
            <Text style={styles.heroLabel}>SELECTED VEHICLE</Text>
            <Text style={styles.carName}>
              {vehicle.make} {vehicle.model}
            </Text>
            <Text style={styles.carYear}>
              {vehicle.year} MODEL · {vehicle.bodyType}
            </Text>
          </View>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>CONFIRMED</Text>
          </View>
        </View>

        <Image
          source={carImages[vehicle.id]}
          style={styles.carImage}
          resizeMode="contain"
          accessibilityLabel={`${vehicle.make} ${vehicle.model}`}
        />

        <View style={styles.referenceBox}>
          <View>
            <Text style={styles.referenceLabel}>BOOKING REFERENCE</Text>
            <Text style={styles.reference}>{reference}</Text>
          </View>
          <Text style={styles.checkmark}>✓</Text>
        </View>
      </LinearGradient>

      <Text style={styles.sectionTitle}>Inspection Summary</Text>

      <View style={styles.card}>
        <DetailRow
          label="Inspection Type"
          value={inspectionNames[booking.inspectionType]}
        />
        <View style={styles.divider} />
        <DetailRow label="Date" value={booking.date} />
        <View style={styles.divider} />
        <DetailRow label="Address" value={booking.address} />
        <View style={styles.divider} />
        <DetailRow
          label="Vehicle Plate"
          value={vehicle.plate || 'Not provided'}
        />
        <View style={styles.divider} />
        <DetailRow
          label="Notes"
          value={booking.notes.trim() || 'No notes added'}
        />
      </View>

      <Pressable
        accessibilityRole="button"
        style={({ pressed }) => [
          styles.button,
          pressed && styles.buttonPressed,
        ]}
        onPress={() => navigation.popToTop()}
      >
        <Text style={styles.buttonText}>Back to My Vehicles</Text>
      </Pressable>

      <Text style={styles.footer}>AUTOCONX · VEHICLE CARE MADE SIMPLE</Text>
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
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.value}>{value}</Text>
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
    paddingBottom: 30,
  },
  eyebrow: {
    color: '#2563EB',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1.8,
    marginTop: 8,
  },
  title: {
    color: '#101827',
    fontSize: 29,
    fontWeight: '800',
    marginTop: 12,
  },
  subtitle: {
    color: '#64748B',
    fontSize: 14,
    marginTop: 6,
    marginBottom: 22,
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
  heroTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: 8,
  },
  heroLabel: {
    color: '#BFDBFE',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1.5,
  },
  carName: {
    color: '#FFFFFF',
    fontSize: 23,
    fontWeight: '800',
    marginTop: 8,
  },
  carYear: {
    color: '#DBEAFE',
    fontSize: 12,
    marginTop: 5,
  },
  badge: {
    backgroundColor: '#DCFCE7',
    paddingHorizontal: 9,
    paddingVertical: 7,
    borderRadius: 20,
  },
  badgeText: {
    color: '#166534',
    fontSize: 9,
    fontWeight: '800',
  },
  carImage: {
    width: '100%',
    height: 190,
    marginTop: 8,
  },
  referenceBox: {
    backgroundColor: 'rgba(255,255,255,0.13)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
    borderRadius: 15,
    padding: 14,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  referenceLabel: {
    color: '#BFDBFE',
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 1,
  },
  reference: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '800',
    marginTop: 5,
  },
  checkmark: {
    color: '#FFFFFF',
    fontSize: 26,
    fontWeight: '800',
  },
  sectionTitle: {
    color: '#101827',
    fontSize: 19,
    fontWeight: '800',
    marginTop: 26,
    marginBottom: 13,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    paddingHorizontal: 17,
    paddingVertical: 5,
    borderWidth: 1,
    borderColor: '#E5EAF3',
  },
  detailRow: {
    paddingVertical: 14,
    gap: 6,
  },
  label: {
    color: '#64748B',
    fontSize: 12,
    fontWeight: '600',
  },
  value: {
    color: '#172033',
    fontSize: 15,
    fontWeight: '700',
    lineHeight: 22,
  },
  divider: {
    height: 1,
    backgroundColor: '#EDF0F5',
  },
  button: {
    backgroundColor: '#1D4ED8',
    borderRadius: 15,
    padding: 17,
    alignItems: 'center',
    marginTop: 22,
  },
  buttonPressed: {
    opacity: 0.8,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '800',
  },
  footer: {
    color: '#94A3B8',
    fontSize: 9,
    fontWeight: '700',
    letterSpacing: 1.2,
    textAlign: 'center',
    marginTop: 22,
  },
});
