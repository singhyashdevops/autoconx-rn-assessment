
export type InspectionType =
  | 'PRE_PURCHASE'
  | 'COMPREHENSIVE'
  | 'BASIC';

export type BookingDraft = {
  inspectionType: InspectionType;
  address: string;
  date: string;
  notes: string;
};

export type Vehicle = {
  id: string;
  make: string;
  model: string;
  year: number;
  bodyType: string;
  plate?: string;
};

export type RootStackParamList = {
  MyVehicle: undefined;
  BookInspection: { vehicle: Vehicle };
  Confirmation: {
    vehicle: Vehicle;
    booking: BookingDraft;
  };
  BookingDetails: {
    vehicle: Vehicle;
    booking: BookingDraft;
    reference: string;
  };
};

export const vehicles: Vehicle[] = [
  {
    id: 'vehicle_1',
    make: 'Nissan',
    model: 'Patrol',
    year: 2026,
    bodyType: 'SUV',
  },
  {
    id: 'vehicle_2',
    make: 'Toyota',
    model: 'Land Cruiser',
    year: 2026,
    bodyType: 'SUV',
  },
  {
    id: 'vehicle_3',
    make: 'Toyota',
    model: 'Camry',
    year: 2026,
    bodyType: 'Sedan',
  },
  {
    id: 'vehicle_4',
    make: 'BMW',
    model: 'X5',
    year: 2026,
    bodyType: 'Luxury SUV',
  },
  {
    id: 'vehicle_5',
    make: 'Mercedes-Benz',
    model: 'GLE',
    year: 2026,
    bodyType: 'Luxury SUV',
  },
];
