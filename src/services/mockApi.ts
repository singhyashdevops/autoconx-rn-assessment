
import type {
  BookingDraft,
  Vehicle,
} from '../types/booking';
import { vehicles } from '../types/booking';

export type InspectionOption = {
  label: string;
  value: BookingDraft['inspectionType'];
};

export type BookingResponse = {
  reference: string;
  vehicle: Vehicle;
  booking: BookingDraft;
};

const inspectionTypes: InspectionOption[] = [
  { label: 'Basic', value: 'BASIC' },
  { label: 'Comprehensive', value: 'COMPREHENSIVE' },
  { label: 'Pre-purchase', value: 'PRE_PURCHASE' },
];

let bookingAttempt = 0;

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function getVehicle(): Promise<Vehicle> {
  await delay(500);
  return vehicles[0];
}

export async function getInspectionTypes(): Promise<InspectionOption[]> {
  await delay(500);
  return inspectionTypes;
}

export async function createBooking(
  booking: BookingDraft,
  selectedVehicle: Vehicle,
): Promise<BookingResponse> {
  await delay(1000);
  bookingAttempt += 1;

  // Every third attempt fails to test retry behaviour.
  if (bookingAttempt % 3 === 0) {
    throw new Error('Booking failed. Please try again.');
  }

  return {
    reference: `ACX-${Date.now().toString().slice(-8)}`,
    vehicle: selectedVehicle,
    booking,
  };
}
