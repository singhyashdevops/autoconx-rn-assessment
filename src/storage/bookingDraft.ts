import AsyncStorage from '@react-native-async-storage/async-storage';
import type { BookingDraft } from '../types/booking';

const DRAFT_KEY = '@autoconx/booking-draft';

export async function saveBookingDraft(
  draft: BookingDraft,
): Promise<void> {
  await AsyncStorage.setItem(DRAFT_KEY, JSON.stringify(draft));
}

export async function loadBookingDraft(): Promise<BookingDraft | null> {
  try {
    const storedDraft = await AsyncStorage.getItem(DRAFT_KEY);

    if (!storedDraft) {
      return null;
    }

    const parsed: unknown = JSON.parse(storedDraft);

    if (
      typeof parsed !== 'object' ||
      parsed === null ||
      !('inspectionType' in parsed) ||
      !('address' in parsed) ||
      !('date' in parsed) ||
      !('notes' in parsed)
    ) {
      return null;
    }

    const draft = parsed as BookingDraft;

    if (
      !['BASIC', 'COMPREHENSIVE', 'PRE_PURCHASE'].includes(
        draft.inspectionType,
      ) ||
      typeof draft.address !== 'string' ||
      typeof draft.date !== 'string' ||
      typeof draft.notes !== 'string'
    ) {
      return null;
    }

    return draft;
  } catch {
    return null;
  }
}

export async function clearBookingDraft(): Promise<void> {
  await AsyncStorage.removeItem(DRAFT_KEY);
}