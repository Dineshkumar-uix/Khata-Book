export enum VehicleStatus {
  AVAILABLE = 'Available',
  SOLD = 'Sold',
  BOOKED = 'Booked',
}

export enum PaymentType {
  CASH = 'Cash',
  ONLINE = 'Online',
  CHEQUE = 'Cheque',
  FINANCE = 'Finance',
}

export interface InventoryItem {
  id: string;
  sNo: number;
  frameNo: string;
  engineNo: string;
  model: string;
  variant: string;
  color: string;
  status: VehicleStatus;
  price: number;
}

export interface Customer {
  id: string;
  name: string;
  relationName?: string; // Father's or Husband's Name
  mobile: string;
  email?: string;
  vehicleDetails?: string; // Selected vehicle from inventory
  balance: number; // Positive = Due, Negative = Advance
  lastPaymentDate: string;
  history: {
    date: string;
    amount: number;
    type: PaymentType;
    description: string;
  }[];
}

export interface UserProfile {
  companyName: string;
  address: string;
  email: string;
}

export type ViewState = 'DASHBOARD' | 'INVENTORY' | 'CUSTOMERS' | 'SETTINGS';