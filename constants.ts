import { InventoryItem, VehicleStatus, Customer, PaymentType } from './types';

export const MOCK_INVENTORY: InventoryItem[] = [
  {
    id: '1',
    sNo: 1,
    frameNo: 'FRM123456789',
    engineNo: 'ENG987654321',
    model: 'Speedster X1',
    variant: 'Disc Brake',
    color: 'Midnight Blue',
    status: VehicleStatus.AVAILABLE,
    price: 85000,
  },
  {
    id: '2',
    sNo: 2,
    frameNo: 'FRM123456790',
    engineNo: 'ENG987654322',
    model: 'Speedster X1',
    variant: 'Drum Brake',
    color: 'Scarlet Red',
    status: VehicleStatus.BOOKED,
    price: 78000,
  },
  {
    id: '3',
    sNo: 3,
    frameNo: 'FRM123456791',
    engineNo: 'ENG987654323',
    model: 'Cruiser 300',
    variant: 'Standard',
    color: 'Matte Black',
    status: VehicleStatus.SOLD,
    price: 150000,
  },
  {
    id: '4',
    sNo: 4,
    frameNo: 'FRM123456792',
    engineNo: 'ENG987654324',
    model: 'Scooty Pep',
    variant: 'ZX',
    color: 'Yellow',
    status: VehicleStatus.AVAILABLE,
    price: 65000,
  },
  {
    id: '5',
    sNo: 5,
    frameNo: 'FRM123456793',
    engineNo: 'ENG987654325',
    model: 'Cruiser 300',
    variant: 'Pro',
    color: 'Silver',
    status: VehicleStatus.AVAILABLE,
    price: 165000,
  },
];

export const MOCK_CUSTOMERS: Customer[] = [
  {
    id: 'c1',
    name: 'Rahul Sharma',
    relationName: 'S/o Ramesh Sharma',
    mobile: '9876543210',
    email: 'rahul@example.com',
    vehicleDetails: 'Speedster X1 - Midnight Blue',
    balance: 15000,
    lastPaymentDate: '2023-10-15',
    history: [
      { date: '2023-10-15', amount: 5000, type: PaymentType.CASH, description: 'Part Payment' }
    ]
  },
  {
    id: 'c2',
    name: 'Anita Desai',
    relationName: 'W/o Vikram Desai',
    mobile: '9123456789',
    email: 'anita@example.com',
    vehicleDetails: 'Scooty Pep - Yellow',
    balance: 0,
    lastPaymentDate: '2023-10-20',
    history: []
  },
  {
    id: 'c3',
    name: 'Vikram Singh',
    relationName: 'S/o Balwant Singh',
    mobile: '9988776655',
    vehicleDetails: 'Cruiser 300 - Black',
    balance: 45000,
    lastPaymentDate: '2023-09-01',
    history: []
  },
  {
    id: 'c4',
    name: 'Priya Patel',
    mobile: '8877665544',
    balance: -2000, // Advance
    lastPaymentDate: '2023-10-25',
    history: []
  },
];