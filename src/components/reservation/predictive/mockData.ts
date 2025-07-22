
export const occupancyData = [
  { time: '8h', occupancy: 45, prediction: 50 },
  { time: '9h', occupancy: 75, prediction: 78 },
  { time: '10h', occupancy: 85, prediction: 87 },
  { time: '11h', occupancy: 92, prediction: 89 },
  { time: '12h', occupancy: 65, prediction: 68 },
  { time: '13h', occupancy: 45, prediction: 42 },
  { time: '14h', occupancy: 88, prediction: 85 },
  { time: '15h', occupancy: 90, prediction: 92 },
  { time: '16h', occupancy: 78, prediction: 80 },
  { time: '17h', occupancy: 55, prediction: 58 },
  { time: '18h', occupancy: 32, prediction: 35 },
];

export const demandForecast = [
  { space: 'Amphithéâtres', current: 85, predicted: 92, trend: '+8.2%' },
  { space: 'Salles TP', current: 72, predicted: 68, trend: '-5.6%' },
  { space: 'Laboratoires', current: 65, predicted: 78, trend: '+20.0%' },
  { space: 'Salles réunion', current: 58, predicted: 71, trend: '+22.4%' },
];

export const optimizationOpportunities = [
  {
    type: 'Énergie',
    savings: '23%',
    description: 'Regroupement géographique des cours',
    priority: 'high' as const,
    impact: 'Fort'
  },
  {
    type: 'Espace',
    savings: '15%',
    description: 'Optimisation des créneaux libres',
    priority: 'medium' as const,
    impact: 'Moyen'
  },
  {
    type: 'Maintenance',
    savings: '31%',
    description: 'Maintenance prédictive équipements',
    priority: 'high' as const,
    impact: 'Fort'
  }
];
