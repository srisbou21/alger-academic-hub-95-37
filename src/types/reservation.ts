
export interface Space {
  id: string;
  name: string;
  code: string;
  type: 'classroom' | 'amphitheater' | 'laboratory' | 'computer_room' | 'meeting_room';
  capacity: number;
  surface: number;
  location: {
    building: string;
    floor: string;
    room: string;
  };
  status: 'available' | 'occupied' | 'maintenance' | 'out_of_service' | 'reserved_free' | 'cleaning';
  equipment: {
    multimedia: string[];
    computer: string[];
    specialized: string[];
    accessibility: boolean;
    airConditioning: boolean;
    naturalLight: boolean;
  };
  constraints: {
    openingHours: {
      start: string;
      end: string;
    };
    closedDays: string[];
    cleaningTime: number;
    restrictions: string[];
  };
}

export interface ValidationStep {
  id: string;
  validator: string;
  action: 'approved' | 'rejected';
  date: Date;
  comment?: string;
}

export interface Reservation {
  id: string;
  spaceId: string;
  spaceName?: string;
  requester: {
    name: string;
    contact: string;
    phone: string;
  };
  type: 'course' | 'exam' | 'meeting' | 'event';
  purpose: string;
  description?: string;
  participants: number;
  dateTime: {
    start: Date;
    end: Date;
  };
  equipment: string[];
  priority: 1 | 2 | 3 | 4; // 1 = très haute, 4 = basse
  status: 'pending' | 'confirmed' | 'cancelled' | 'approved' | 'rejected';
  recurrence?: {
    pattern: 'weekly' | 'biweekly' | 'monthly';
    endDate: string;
  };
  validationHistory: ValidationStep[];
  createdAt?: Date;
  updatedAt?: Date;
}

export interface Conflict {
  id: string;
  type: 'overlap' | 'capacity' | 'equipment' | 'maintenance' | 'time_overlap' | 'capacity_exceeded';
  severity: 'low' | 'medium' | 'high';
  space: string;
  reservations: Array<{
    id: string;
    purpose: string;
    requester: string;
    time: string;
    participants: number;
  }>;
  date: string;
  resolved: boolean;
  resolution?: string;
  maxCapacity?: number;
  suggestions?: string[];
}
