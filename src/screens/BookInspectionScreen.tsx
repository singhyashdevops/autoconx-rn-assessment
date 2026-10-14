
import { useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
  Platform,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Location from 'expo-location';
import DateTimePicker from '@react-native-community/datetimepicker';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import type {
  BookingDraft,
  InspectionType,
  RootStackParamList,
} from '../types/booking';

type Props = NativeStackScreenProps<
  RootStackParamList,
  'BookInspection'
>;

const DRAFT_KEY = '@autoconx/booking-draft';

const inspectionOptions: {
  label: string;
  value: InspectionType;
}[] = [
  { label: 'Basic', value: 'BASIC' },
  { label: 'Comprehensive', value: 'COMPREHENSIVE' },
  { label: 'Pre-purchase', value: 'PRE_PURCHASE' },
];

function getToday(): Date {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth(), now.getDate());
}

function formatDate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
}

function parseDate(value?: string): Date {
  if (value && /^\d{4}-\d{2}-\d{2}$/.test(value)) {
    const [year, month, day] = value.split('-').map(Number);
    const parsed = new Date(year, month - 1, day);

    if (
      parsed.getFullYear() === year &&
      parsed.getMonth() === month - 1 &&
      parsed.getDate() === day &&
      parsed >= getToday()
    ) {
      return parsed;
    }
  }

  return getToday();
}

export default function BookInspectionScreen({
  navigation,
  route,
}: Props) {
  const { vehicle } = route.params;

  const [inspectionType, setInspectionType] =
    useState<InspectionType>('BASIC');
  const [address, setAddress] = useState('');
  const [selectedDate, setSelectedDate] = useState<Date>(getToday());
  const [notes, setNotes] = useState('');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [loadingDraft, setLoadingDraft] = useState(true);
  const [gettingLocation, setGettingLocation] = useState(false);

  const mountedRef = useRef(true);
  const locationRequestRef = useRef(false);

  useEffect(() => {
    mountedRef.current = true;

    async function restoreDraft() {
      try {
        const saved = await AsyncStorage.getItem(DRAFT_KEY);

        if (!saved || !mountedRef.current) return;

        const draft = JSON.parse(saved) as Partial<BookingDraft>;

        if (
          draft.inspectionType &&
          inspectionOptions.some(
            (option) => option.value === draft.inspectionType,
          )
        ) {
          setInspectionType(draft.inspectionType);
        }

        if (typeof draft.address === 'string') {
          setAddress(draft.address);
        }

        if (typeof draft.date === 'string') {
          setSelectedDate(parseDate(draft.date));
        }

        if (typeof draft.notes === 'string') {
          setNotes(draft.notes);
        }
      } catch {
        // Continue with default form values.
      } finally {
        if (mountedRef.current) setLoadingDraft(false);
      }
    }

    void restoreDraft();

    return () => {
      mountedRef.current = false;
    };
  }, []);

  useEffect(() => {
    if (loadingDraft) return;

    const draft: BookingDraft = {
      inspectionType,
      address,
      date: formatDate(selectedDate),
      notes,
    };

    void AsyncStorage.setItem(DRAFT_KEY, JSON.stringify(draft)).catch(
      () => {
        // Draft persistence is optional; the form remains usable.
      },
    );
  }, [inspectionType, address, selectedDate, notes, loadingDraft]);

  async function useCurrentLocation() {
    if (locationRequestRef.current) return;

    locationRequestRef.current = true;
    setGettingLocation(true);

    try {
      const permission =
        await Location.requestForegroundPermissionsAsync();

      if (permission.status !== 'granted') {
        Alert.alert(
          'Location permission',
          'Allow location access or enter your address manually.',
        );
        return;
      }

      const position = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });

      const results = await Location.reverseGeocodeAsync({
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
      });

      const place = results[0];

      if (place) {
        const formattedAddress = [
          place.name,
          place.street,
          place.district,
          place.city,
          place.region,
          place.postalCode,
          place.country,
        ]
          .filter(Boolean)
          .filter((part, index, all) => all.indexOf(part) === index)
          .join(', ');

        if (mountedRef.current && formattedAddress) {
          setAddress(formattedAddress);
        } else {
          Alert.alert(
            'Address unavailable',
            'Please enter your address manually.',
          );
        }
      } else {
        Alert.alert(
          'Address unavailable',
          'Please enter your address manually.',
        );
      }
    } catch {
      Alert.alert(
        'Location error',
        'Could not get your location. Please enter the address manually.',
      );
    } finally {
      locationRequestRef.current = false;
      if (mountedRef.current) setGettingLocation(false);
    }
  }

  function continueToConfirmation() {
    const trimmedAddress = address.trim();

    if (!trimmedAddress) {
      Alert.alert('Address required', 'Please enter the inspection address.');
      return;
    }

    const booking: BookingDraft = {
      inspectionType,
      address: trimmedAddress,
      date: formatDate(selectedDate),
      notes: notes.trim(),
    };

    navigation.navigate('Confirmation', {
      vehicle,
      booking,
    });
  }

  if (loadingDraft) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#2563EB" />
        <Text style={styles.loadingText}>Loading booking form...</Text>
      </View>
    );
  }

  return (
    <ScrollView
      keyboardShouldPersistTaps="handled"
      contentContainerStyle={styles.container}
    >
      <Text style={styles.eyebrow}>AUTOCONX INSPECTIONS</Text>
      <Text style={styles.title}>Book Inspection</Text>
      <Text style={styles.subtitle}>
        Enter your preferred inspection details.
      </Text>

      <View style={styles.vehicleCard}>
        <Text style={styles.fieldLabel}>SELECTED VEHICLE</Text>
        <Text style={styles.vehicleName}>
          {vehicle.year} {vehicle.make} {vehicle.model}
        </Text>
        <Text style={styles.mutedText}>{vehicle.bodyType}</Text>
      </View>

      <Text style={styles.fieldLabel}>INSPECTION TYPE</Text>
      <View style={styles.optionsContainer}>
        {inspectionOptions.map((option) => {
          const selected = inspectionType === option.value;

          return (
            <Pressable
              key={option.value}
              accessibilityRole="radio"
              accessibilityState={{ checked: selected }}
              onPress={() => setInspectionType(option.value)}
              style={[
                styles.option,
                selected && styles.selectedOption,
              ]}
            >
              <View
                style={[
                  styles.radio,
                  selected && styles.selectedRadio,
                ]}
              >
                {selected ? <View style={styles.radioDot} /> : null}
              </View>

              <Text
                style={[
                  styles.optionText,
                  selected && styles.selectedOptionText,
                ]}
              >
                {option.label}
              </Text>
            </Pressable>
          );
        })}
      </View>

      <Text style={styles.fieldLabel}>INSPECTION ADDRESS</Text>
      <TextInput
        value={address}
        onChangeText={setAddress}
        placeholder="Enter your complete address"
        placeholderTextColor="#94A3B8"
        multiline
        style={[styles.input, styles.addressInput]}
        accessibilityLabel="Inspection address"
      />

      <Pressable
        accessibilityRole="button"
        disabled={gettingLocation}
        onPress={() => void useCurrentLocation()}
        style={[
          styles.locationButton,
          gettingLocation && styles.disabledButton,
        ]}
      >
        {gettingLocation ? (
          <ActivityIndicator color="#2563EB" />
        ) : (
          <Text style={styles.locationButtonText}>
            Use Current Location
          </Text>
        )}
      </Pressable>

      <Text style={styles.fieldLabel}>INSPECTION DATE</Text>

      <Pressable
        accessibilityRole="button"
        onPress={() => setShowDatePicker(true)}
        style={styles.dateButton}
      >
        <Text style={styles.calendarIcon}>▦</Text>
        <Text style={styles.dateButtonText}>
          {selectedDate.toLocaleDateString('en-GB', {
            day: '2-digit',
            month: 'long',
            year: 'numeric',
          })}
        </Text>
        <Text style={styles.changeDateText}>Choose date</Text>
      </Pressable>

      {showDatePicker ? (
        <View style={styles.datePickerContainer}>
          <DateTimePicker
            value={selectedDate}
            mode="date"
            display={Platform.OS === 'ios' ? 'inline' : 'calendar'}
            minimumDate={getToday()}
            onChange={(event, pickedDate) => {
              if (Platform.OS !== 'ios') {
                setShowDatePicker(false);
              }

              if (event.type === 'set' && pickedDate) {
                setSelectedDate(pickedDate);
              }

              if (event.type === 'dismissed') {
                setShowDatePicker(false);
              }
            }}
          />

          {Platform.OS === 'ios' ? (
            <Pressable
              style={styles.doneButton}
              onPress={() => setShowDatePicker(false)}
            >
              <Text style={styles.doneButtonText}>Done</Text>
            </Pressable>
          ) : null}
        </View>
      ) : null}

      <Text style={styles.helperText}>
        Select a date today or later.
      </Text>

      <Text style={styles.fieldLabel}>ADDITIONAL NOTES (OPTIONAL)</Text>
      <TextInput
        value={notes}
        onChangeText={setNotes}
        placeholder="Any specific instructions?"
        placeholderTextColor="#94A3B8"
        multiline
        textAlignVertical="top"
        style={[styles.input, styles.notesInput]}
        accessibilityLabel="Additional notes"
      />

      <Pressable
        accessibilityRole="button"
        style={styles.submitButton}
        onPress={continueToConfirmation}
      >
        <Text style={styles.submitButtonText}>
          Continue to Confirmation →
        </Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingBottom: 36,
    backgroundColor: '#F8FAFC',
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F8FAFC',
  },
  loadingText: {
    color: '#64748B',
    marginTop: 12,
  },
  eyebrow: {
    color: '#2563EB',
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 2,
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
    lineHeight: 21,
    marginTop: 8,
    marginBottom: 22,
  },
  vehicleCard: {
    backgroundColor: '#EFF6FF',
    borderColor: '#BFDBFE',
    borderWidth: 1,
    borderRadius: 14,
    padding: 16,
    marginBottom: 24,
  },
  fieldLabel: {
    color: '#334155',
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 0.7,
    marginBottom: 10,
    marginTop: 18,
  },
  vehicleName: {
    color: '#101827',
    fontSize: 19,
    fontWeight: '800',
    marginTop: 5,
  },
  mutedText: {
    color: '#64748B',
    marginTop: 4,
  },
  optionsContainer: {
    gap: 10,
  },
  option: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 12,
    padding: 15,
    flexDirection: 'row',
    alignItems: 'center',
  },
  selectedOption: {
    borderColor: '#2563EB',
    backgroundColor: '#EFF6FF',
  },
  radio: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: '#94A3B8',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  selectedRadio: {
    borderColor: '#2563EB',
  },
  radioDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#2563EB',
  },
  optionText: {
    color: '#334155',
    fontSize: 15,
    fontWeight: '600',
  },
  selectedOptionText: {
    color: '#1D4ED8',
  },
  input: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 11,
    paddingHorizontal: 14,
    paddingVertical: 13,
    fontSize: 15,
    color: '#101827',
  },
  addressInput: {
    minHeight: 82,
    textAlignVertical: 'top',
  },
  locationButton: {
    alignSelf: 'flex-start',
    borderWidth: 1,
    borderColor: '#BFDBFE',
    backgroundColor: '#EFF6FF',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 11,
    marginTop: 10,
  },
  locationButtonText: {
    color: '#2563EB',
    fontWeight: '700',
  },
  disabledButton: {
    opacity: 0.6,
  },
  dateButton: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 11,
    padding: 15,
    flexDirection: 'row',
    alignItems: 'center',
  },
  calendarIcon: {
    color: '#2563EB',
    fontSize: 22,
    marginRight: 12,
  },
  dateButtonText: {
    color: '#101827',
    fontSize: 15,
    fontWeight: '700',
    flex: 1,
  },
  changeDateText: {
    color: '#2563EB',
    fontSize: 12,
    fontWeight: '700',
  },
  datePickerContainer: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 12,
    padding: 8,
    marginTop: 10,
  },
  doneButton: {
    alignSelf: 'flex-end',
    backgroundColor: '#2563EB',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
    margin: 8,
  },
  doneButtonText: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  helperText: {
    color: '#64748B',
    fontSize: 12,
    marginTop: 8,
  },
  notesInput: {
    minHeight: 100,
  },
  submitButton: {
    backgroundColor: '#2563EB',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginTop: 28,
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '800',
  },
});
