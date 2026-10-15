import AsyncStorage from '@react-native-async-storage/async-storage';
import type { BookingDraft } from '../types/booking';

const LEGACY_KEY = '@autoconx/booking-draft';
const DRAFT_PREFIX = '@autoconx/booking-draft:';

function isValidDraft(value: unknown): value is BookingDraft {
  if (typeof value !== 'object' || value === null) return false;

  const draft = value as Partial<BookingDraft>;

  return (
    ['BASIC', 'COMPREHENSIVE', 'PRE_PURCHASE'].includes(
      draft.inspectionType as string,
    ) &&
    typeof draft.address === 'string' &&
    typeof draft.date === 'string' &&
    typeof draft.notes === 'string'
  );
}

export async function saveBookingDraft(
  vehicleId: string,
  draft: BookingDraft,
): Promise<void> {
  await AsyncStorage.setItem(
    `${DRAFT_PREFIX}${vehicleId}`,
    JSON.stringify(draft),
  );
}

export async function loadBookingDraft(
  vehicleId: string,
): Promise<BookingDraft | null> {
  const vehicleKey = `${DRAFT_PREFIX}${vehicleId}`;

  try {
    // First, load this vehicle's own saved draft.
    const storedDraft = await AsyncStorage.getItem(vehicleKey);

    if (storedDraft) {
      const parsed: unknown = JSON.parse(storedDraft);
      return isValidDraft(parsed) ? parsed : null;
    }
    
    const legacyDraft = await AsyncStorage.getItem(LEGACY_KEY);

    if (!legacyDraft) return null;

    const parsed: unknown = JSON.parse(legacyDraft);

    if (!isValidDraft(parsed)) return null;

    await AsyncStorage.setItem(vehicleKey, JSON.stringify(parsed));
    await AsyncStorage.removeItem(LEGACY_KEY);

    return parsed;
  } catch {
    return null;
  }
}

export async function clearBookingDraft(
  vehicleId: string,
): Promise<void> {
  await AsyncStorage.removeItem(`${DRAFT_PREFIX}${vehicleId}`);
}