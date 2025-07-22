import { Reservation } from '../types/reservation';

export interface RecommendationEngine {
  suggestSpaces: (criteria: SpaceCriteria) => Promise<SpaceRecommendation[]>;
  predictOccupancy: (date: Date, spaceId?: string) => Promise<OccupancyPrediction>;
  analyzeUserBehavior: (userId: string) => Promise<UserBehaviorAnalysis>;
  optimizeSchedule: (reservations: Reservation[]) => Promise<ScheduleOptimization>;
}

export interface SpaceCriteria {
  capacity: number;
  equipments: string[];
  duration: number;
  date: Date;
  userId: string;
}

export interface SpaceRecommendation {
  spaceId: string;
  spaceName: string;
  confidence: number;
  reasons: string[];
  alternativeSlots: Date[];
}

export interface OccupancyPrediction {
  spaceId: string;
  date: Date;
  predictedOccupancy: number;
  peakHours: { start: string; end: string; occupancy: number }[];
  confidence: number;
}

export interface UserBehaviorAnalysis {
  userId: string;
  preferredSpaces: string[];
  preferredTimeSlots: string[];
  averageReservationDuration: number;
  cancellationRate: number;
  noShowRate: number;
  recommendations: string[];
}

export interface ScheduleOptimization {
  originalEfficiency: number;
  optimizedEfficiency: number;
  suggestions: OptimizationSuggestion[];
  energySavings: number;
}

export interface OptimizationSuggestion {
  type: 'move' | 'merge' | 'split' | 'cancel';
  reservationId: string;
  suggestedAction: string;
  impact: string;
  priority: 'low' | 'medium' | 'high';
}

export class AIRecommendationService implements RecommendationEngine {
  private analyzeUserHistory(userId: string) {
    // Simulation d'analyse des habitudes utilisateur
    return {
      preferredSpaceTypes: ['amphitheatre', 'lab'],
      preferredTimeSlots: ['09:00-11:00', '14:00-16:00'],
      equipmentUsage: ['projector', 'audio'],
      satisfactionScores: 4.2
    };
  }

  async suggestSpaces(criteria: SpaceCriteria): Promise<SpaceRecommendation[]> {
    // Simulation de l'IA de recommandation
    const userHistory = this.analyzeUserHistory(criteria.userId);
    
    return [
      {
        spaceId: "1",
        spaceName: "Amphithéâtre A",
        confidence: 0.95,
        reasons: [
          "Correspond à vos préférences habituelles",
          "Équipements disponibles",
          "Historique de satisfaction élevé"
        ],
        alternativeSlots: [
          new Date(criteria.date.getTime() + 60 * 60 * 1000),
          new Date(criteria.date.getTime() + 120 * 60 * 1000)
        ]
      },
      {
        spaceId: "2",
        spaceName: "Salle B12",
        confidence: 0.87,
        reasons: [
          "Capacité adaptée",
          "Localisation optimale",
          "Disponibilité garantie"
        ],
        alternativeSlots: [
          new Date(criteria.date.getTime() + 30 * 60 * 1000)
        ]
      }
    ];
  }

  async predictOccupancy(date: Date, spaceId?: string): Promise<OccupancyPrediction> {
    return {
      spaceId: spaceId || "global",
      date,
      predictedOccupancy: 0.75,
      peakHours: [
        { start: "09:00", end: "11:00", occupancy: 0.9 },
        { start: "14:00", end: "16:00", occupancy: 0.85 }
      ],
      confidence: 0.88
    };
  }

  async analyzeUserBehavior(userId: string): Promise<UserBehaviorAnalysis> {
    return {
      userId,
      preferredSpaces: ["Amphithéâtre A", "Labo C3"],
      preferredTimeSlots: ["09:00-11:00", "14:00-16:00"],
      averageReservationDuration: 120,
      cancellationRate: 0.05,
      noShowRate: 0.02,
      recommendations: [
        "Réservez vos créneaux favoris en récurrence",
        "Considérez les salles alternatives proposées",
        "Anticipez vos réservations d'au moins 48h"
      ]
    };
  }

  async optimizeSchedule(reservations: Reservation[]): Promise<ScheduleOptimization> {
    return {
      originalEfficiency: 0.72,
      optimizedEfficiency: 0.89,
      suggestions: [
        {
          type: 'move',
          reservationId: "1",
          suggestedAction: "Déplacer vers salle B12 pour regrouper géographiquement",
          impact: "Réduction déplacements de 15min",
          priority: 'medium'
        }
      ],
      energySavings: 23.5
    };
  }
}

export const aiService = new AIRecommendationService();
