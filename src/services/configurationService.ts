
import { ServiceConfiguration, PositionConfiguration } from '../types/administrative';

class ConfigurationService {
  // Gestion des services
  async getServices(): Promise<ServiceConfiguration[]> {
    // Simulation - à remplacer par API réelle
    return [
      {
        id: 'srv_001',
        name: 'Scolarité',
        description: 'Service de gestion des étudiants et des programmes',
        isActive: true,
        createdAt: new Date('2023-01-01'),
        updatedAt: new Date('2023-01-01')
      },
      {
        id: 'srv_002',
        name: 'Ressources Humaines',
        description: 'Gestion du personnel et des carrières',
        isActive: true,
        createdAt: new Date('2023-01-01'),
        updatedAt: new Date('2023-01-01')
      },
      {
        id: 'srv_003',
        name: 'Finances',
        description: 'Gestion financière et comptable',
        isActive: true,
        createdAt: new Date('2023-01-01'),
        updatedAt: new Date('2023-01-01')
      },
      {
        id: 'srv_004',
        name: 'Maintenance',
        description: 'Entretien et maintenance des équipements',
        isActive: true,
        createdAt: new Date('2023-01-01'),
        updatedAt: new Date('2023-01-01')
      },
      {
        id: 'srv_005',
        name: 'Sécurité',
        description: 'Sécurité et surveillance',
        isActive: true,
        createdAt: new Date('2023-01-01'),
        updatedAt: new Date('2023-01-01')
      },
      {
        id: 'srv_006',
        name: 'Direction',
        description: 'Direction générale et administration',
        isActive: true,
        createdAt: new Date('2023-01-01'),
        updatedAt: new Date('2023-01-01')
      },
      {
        id: 'srv_007',
        name: 'Bibliothèque',
        description: 'Services documentaires et bibliothèque',
        isActive: true,
        createdAt: new Date('2023-01-01'),
        updatedAt: new Date('2023-01-01')
      },
      {
        id: 'srv_008',
        name: 'Informatique',
        description: 'Services informatiques et systèmes',
        isActive: true,
        createdAt: new Date('2023-01-01'),
        updatedAt: new Date('2023-01-01')
      }
    ];
  }

  async createService(service: Omit<ServiceConfiguration, 'id' | 'createdAt' | 'updatedAt'>): Promise<ServiceConfiguration> {
    const newService: ServiceConfiguration = {
      id: `srv_${Date.now()}`,
      ...service,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    console.log('Nouveau service créé:', newService);
    return newService;
  }

  async updateService(id: string, updates: Partial<ServiceConfiguration>): Promise<ServiceConfiguration> {
    const services = await this.getServices();
    const service = services.find(s => s.id === id);
    if (!service) throw new Error('Service non trouvé');
    
    const updatedService = {
      ...service,
      ...updates,
      updatedAt: new Date()
    };
    
    console.log('Service mis à jour:', updatedService);
    return updatedService;
  }

  async deleteService(id: string): Promise<boolean> {
    console.log('Service supprimé:', id);
    return true;
  }

  // Gestion des postes
  async getPositions(): Promise<PositionConfiguration[]> {
    // Simulation - à remplacer par API réelle
    return [
      {
        id: 'pos_001',
        name: 'Secrétaire',
        description: 'Secrétariat et accueil',
        serviceId: 'srv_001',
        isActive: true,
        createdAt: new Date('2023-01-01'),
        updatedAt: new Date('2023-01-01')
      },
      {
        id: 'pos_002',
        name: 'Agent administratif',
        description: 'Traitement administratif',
        serviceId: 'srv_001',
        isActive: true,
        createdAt: new Date('2023-01-01'),
        updatedAt: new Date('2023-01-01')
      },
      {
        id: 'pos_003',
        name: 'Chef de service',
        description: 'Responsable de service',
        isActive: true,
        createdAt: new Date('2023-01-01'),
        updatedAt: new Date('2023-01-01')
      },
      {
        id: 'pos_004',
        name: 'Responsable',
        description: 'Responsable de département',
        isActive: true,
        createdAt: new Date('2023-01-01'),
        updatedAt: new Date('2023-01-01')
      },
      {
        id: 'pos_005',
        name: 'Technicien',
        description: 'Support technique',
        serviceId: 'srv_004',
        isActive: true,
        createdAt: new Date('2023-01-01'),
        updatedAt: new Date('2023-01-01')
      },
      {
        id: 'pos_006',
        name: 'Agent de sécurité',
        description: 'Surveillance et sécurité',
        serviceId: 'srv_005',
        isActive: true,
        createdAt: new Date('2023-01-01'),
        updatedAt: new Date('2023-01-01')
      },
      {
        id: 'pos_007',
        name: 'Agent d\'entretien',
        description: 'Nettoyage et entretien',
        serviceId: 'srv_004',
        isActive: true,
        createdAt: new Date('2023-01-01'),
        updatedAt: new Date('2023-01-01')
      }
    ];
  }

  async createPosition(position: Omit<PositionConfiguration, 'id' | 'createdAt' | 'updatedAt'>): Promise<PositionConfiguration> {
    const newPosition: PositionConfiguration = {
      id: `pos_${Date.now()}`,
      ...position,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    console.log('Nouveau poste créé:', newPosition);
    return newPosition;
  }

  async updatePosition(id: string, updates: Partial<PositionConfiguration>): Promise<PositionConfiguration> {
    const positions = await this.getPositions();
    const position = positions.find(p => p.id === id);
    if (!position) throw new Error('Poste non trouvé');
    
    const updatedPosition = {
      ...position,
      ...updates,
      updatedAt: new Date()
    };
    
    console.log('Poste mis à jour:', updatedPosition);
    return updatedPosition;
  }

  async deletePosition(id: string): Promise<boolean> {
    console.log('Poste supprimé:', id);
    return true;
  }
}

export const configurationService = new ConfigurationService();
