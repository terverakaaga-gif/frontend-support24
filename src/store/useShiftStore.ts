import { create } from 'zustand';

export type ServiceCategory = 'personal-care' | 'transport' | 'therapy' | 'social-support' | 'household';
export type ShiftView = 'list' | 'calendar';
export type ParticipantType = 'participant' | 'guardian';

export interface Worker {
  id: string;
  name: string;
  role: string;
  rating: number;
  availability?: boolean;
  distance?: number;
}

export interface Participant {
  id: string;
  name: string;
  type: ParticipantType;
  contactNumber?: string;
  email?: string;
}

export interface Shift {
  id: string;
  workerId: string;
  worker: {
    name: string;
    role: string;
  };
  participantId: string;
  participant: {
    name: string;
    type: ParticipantType;
    contactNumber?: string;
  };
  date: string; // ISO date string
  timeStart: string;
  timeEnd: string;
  location: string;
  status: 'scheduled' | 'completed' | 'cancelled';
  serviceCategory?: ServiceCategory;
  notes?: string;
}

interface ShiftState {
  shifts: Shift[];
  filteredShifts: Shift[];
  currentView: ShiftView;
  searchQuery: string;
  isBookingModalOpen: boolean;
  bookingStep: number;
  currentBooking: {
    serviceCategory: ServiceCategory | null;
    date: Date | null;
    timeStart: string;
    timeEnd: string;
    workerId: string | null;
    participantId: string | null;
    notes: string;
  };
  
  // Actions
  setView: (view: ShiftView) => void;
  setSearchQuery: (query: string) => void;
  filterShifts: () => void;
  toggleBookingModal: () => void;
  setBookingStep: (step: number) => void;
  updateCurrentBooking: (booking: Partial<ShiftState['currentBooking']>) => void;
  resetCurrentBooking: () => void;
  addShift: (shift: Omit<Shift, 'id'>) => void;
}

// Mock data for shifts
const initialShifts: Shift[] = [
  {
    id: "1",
    workerId: "1",
    worker: {
      name: "Sarah Johnson",
      role: "Physical Therapist",
    },
    participantId: "p1",
    participant: {
      name: "Emma Davis",
      type: "participant",
      contactNumber: "123-456-7890"
    },
    date: "2025-03-13",
    timeStart: "9:00 AM",
    timeEnd: "11:00 AM",
    location: "Home",
    status: "scheduled",
    serviceCategory: "therapy"
  },
  {
    id: "2",
    workerId: "2",
    worker: {
      name: "Michael Smith",
      role: "Support Worker",
    },
    participantId: "p2",
    participant: {
      name: "Robert Anderson",
      type: "participant",
      contactNumber: "234-567-8901"
    },
    date: "2025-03-16",
    timeStart: "2:00 PM",
    timeEnd: "6:00 PM",
    location: "Community Center",
    status: "scheduled",
    serviceCategory: "social-support"
  },
  {
    id: "3",
    workerId: "3",
    worker: {
      name: "Emma Wilson",
      role: "Personal Care Assistant",
    },
    participantId: "g1",
    participant: {
      name: "Jennifer Parker",
      type: "guardian",
      contactNumber: "345-678-9012"
    },
    date: "2025-03-18",
    timeStart: "10:00 AM",
    timeEnd: "12:30 PM",
    location: "Home",
    status: "scheduled",
    serviceCategory: "personal-care"
  },
  {
    id: "4",
    workerId: "4",
    worker: {
      name: "David Thompson",
      role: "Transport Assistant",
    },
    participantId: "g2",
    participant: {
      name: "William Brooks",
      type: "guardian",
      contactNumber: "456-789-0123"
    },
    date: "2025-03-20",
    timeStart: "1:00 PM",
    timeEnd: "3:00 PM",
    location: "Medical Appointment",
    status: "scheduled",
    serviceCategory: "transport"
  },
  {
    id: "5",
    workerId: "5",
    worker: {
      name: "Jessica Parker",
      role: "Household Assistant",
    },
    participantId: "p3",
    participant: {
      name: "Thomas Miller",
      type: "participant",
      contactNumber: "567-890-1234"
    },
    date: "2025-03-22",
    timeStart: "9:00 AM",
    timeEnd: "12:00 PM",
    location: "Home",
    status: "scheduled",
    serviceCategory: "household"
  }
];

const useShiftStore = create<ShiftState>((set, get) => ({
  shifts: initialShifts,
  filteredShifts: initialShifts,
  currentView: 'list',
  searchQuery: '',
  isBookingModalOpen: false,
  bookingStep: 1,
  currentBooking: {
    serviceCategory: null,
    date: null,
    timeStart: '9:00 AM',
    timeEnd: '10:00 AM',
    workerId: null,
    participantId: null,
    notes: '',
  },
  
  // Actions
  setView: (view) => set({ currentView: view }),
  setSearchQuery: (query) => {
    set({ searchQuery: query });
    get().filterShifts();
  },
  filterShifts: () => {
    const { shifts, searchQuery } = get();
    const query = searchQuery.toLowerCase();
    
    const filtered = shifts.filter(shift => 
      shift.worker.name.toLowerCase().includes(query) ||
      shift.worker.role.toLowerCase().includes(query) ||
      shift.participant.name.toLowerCase().includes(query) ||
      shift.location.toLowerCase().includes(query) ||
      shift.date.toLowerCase().includes(query)
    );
    
    set({ filteredShifts: filtered });
  },
  toggleBookingModal: () => set(state => ({ isBookingModalOpen: !state.isBookingModalOpen, bookingStep: 1 })),
  setBookingStep: (step) => set({ bookingStep: step }),
  updateCurrentBooking: (booking) => set(state => ({
    currentBooking: { ...state.currentBooking, ...booking }
  })),
  resetCurrentBooking: () => set({
    currentBooking: {
      serviceCategory: null,
      date: null,
      timeStart: '9:00 AM',
      timeEnd: '10:00 AM',
      workerId: null,
      participantId: null,
      notes: '',
    },
  }),
  addShift: (shiftData) => {
    const newShift: Shift = {
      id: Math.random().toString(36).substring(2, 9),
      ...shiftData,
    };
    set(state => ({
      shifts: [...state.shifts, newShift],
      filteredShifts: [...state.shifts, newShift],
    }));
  }
}));

export default useShiftStore;
