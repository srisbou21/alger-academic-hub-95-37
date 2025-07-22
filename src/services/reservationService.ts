
import { Space } from '../types/reservation';

// Mock data pour les espaces
const mockSpaces: Space[] = [
  {
    id: 'space_001',
    name: 'Amphithéâtre A',
    code: 'AMPH-A',
    type: 'amphitheater',
    capacity: 200,
    surface: 150,
    location: {
      building: 'Bâtiment Principal',
      floor: 'RDC',
      room: 'A001'
    },
    status: 'available',
    equipment: {
      multimedia: ['projecteur', 'micro', 'écran'],
      computer: [],
      specialized: [],
      accessibility: true,
      airConditioning: true,
      naturalLight: false
    },
    constraints: {
      openingHours: {
        start: '08:00',
        end: '23:00'
      },
      closedDays: [],
      cleaningTime: 30,
      restrictions: []
    }
  },
  {
    id: 'space_002',
    name: 'Salle 101',
    code: 'S-101',
    type: 'classroom',
    capacity: 40,
    surface: 60,
    location: {
      building: 'Bâtiment A',
      floor: '1er étage',
      room: '101'
    },
    status: 'available',
    equipment: {
      multimedia: ['tableau blanc', 'projecteur'],
      computer: [],
      specialized: [],
      accessibility: false,
      airConditioning: true,
      naturalLight: true
    },
    constraints: {
      openingHours: {
        start: '08:00',
        end: '23:00'
      },
      closedDays: [],
      cleaningTime: 15,
      restrictions: []
    }
  },
  {
    id: 'space_003',
    name: 'Laboratoire Info 1',
    code: 'LAB-INF1',
    type: 'computer_room',
    capacity: 25,
    surface: 80,
    location: {
      building: 'Bâtiment B',
      floor: '2ème étage',
      room: 'B201'
    },
    status: 'available',
    equipment: {
      multimedia: ['projecteur', 'écran'],
      computer: ['PC-25', 'serveur', 'imprimante'],
      specialized: ['logiciels dev'],
      accessibility: true,
      airConditioning: true,
      naturalLight: true
    },
    constraints: {
      openingHours: {
        start: '08:00',
        end: '23:00'
      },
      closedDays: [],
      cleaningTime: 20,
      restrictions: ['accès contrôlé']
    }
  },
  {
    id: 'space_004',
    name: 'Salle de Réunion Executive',
    code: 'SR-EXEC',
    type: 'meeting_room',
    capacity: 12,
    surface: 35,
    location: {
      building: 'Bâtiment Administration',
      floor: '3ème étage',
      room: 'A301'
    },
    status: 'available',
    equipment: {
      multimedia: ['écran tactile', 'visioconférence', 'tableau blanc'],
      computer: [],
      specialized: ['système audio avancé'],
      accessibility: true,
      airConditioning: true,
      naturalLight: true
    },
    constraints: {
      openingHours: {
        start: '07:00',
        end: '22:00'
      },
      closedDays: ['dimanche'],
      cleaningTime: 15,
      restrictions: ['réservation avec autorisation']
    }
  },
  {
    id: 'space_005',
    name: 'Laboratoire de Chimie',
    code: 'LAB-CHIM',
    type: 'laboratory',
    capacity: 20,
    surface: 100,
    location: {
      building: 'Bâtiment Sciences',
      floor: 'RDC',
      room: 'S001'
    },
    status: 'maintenance',
    equipment: {
      multimedia: ['tableau numérique'],
      computer: ['station de contrôle'],
      specialized: ['hottes', 'paillasses', 'équipement sécurité'],
      accessibility: false,
      airConditioning: true,
      naturalLight: false
    },
    constraints: {
      openingHours: {
        start: '08:00',
        end: '18:00'
      },
      closedDays: ['samedi', 'dimanche'],
      cleaningTime: 45,
      restrictions: ['formation sécurité obligatoire', 'supervision requise']
    }
  }
];

export const reservationService = {
  async getSpaces(): Promise<Space[]> {
    console.log('Récupération de la liste des espaces');
    return new Promise((resolve) => {
      setTimeout(() => {
        console.log(`${mockSpaces.length} espaces trouvés`);
        resolve([...mockSpaces]);
      }, 300);
    });
  },

  async getSpace(id: string): Promise<Space | null> {
    console.log(`Récupération de l'espace: ${id}`);
    return new Promise((resolve) => {
      const space = mockSpaces.find(s => s.id === id);
      setTimeout(() => {
        if (space) {
          console.log(`Espace trouvé: ${space.name}`);
        } else {
          console.warn(`Espace non trouvé: ${id}`);
        }
        resolve(space || null);
      }, 200);
    });
  }
};
