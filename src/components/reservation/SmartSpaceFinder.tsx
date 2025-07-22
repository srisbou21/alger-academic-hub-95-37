import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { useSpaces } from "../../hooks/useSpaces";
import { useReservations } from "../../hooks/useReservations";
import { Space } from "../../types/reservation";
import { Search, MapPin, Users, Clock, Calendar, Lightbulb, Star, CheckCircle2 } from 'lucide-react';
import { format, isWithinInterval, addMinutes } from 'date-fns';
import { fr } from 'date-fns/locale';

interface SmartSpaceFinderProps {
  onSpaceSelect: (space: Space, timeSlot: { start: Date; end: Date }) => void;
}

interface SearchCriteria {
  date: string;
  startTime: string;
  duration: number;
  participants: number;
  spaceType: string;
  equipment: string[];
  building: string;
}

interface SpaceRecommendation {
  space: Space;
  score: number;
  availableSlots: Array<{ start: Date; end: Date }>;
  reasons: string[];
  isOptimal: boolean;
}

export const SmartSpaceFinder: React.FC<SmartSpaceFinderProps> = ({ onSpaceSelect }) => {
  const [criteria, setCriteria] = useState<SearchCriteria>({
    date: new Date().toISOString().split('T')[0],
    startTime: '09:00',
    duration: 60,
    participants: 1,
    spaceType: '',
    equipment: [],
    building: ''
  });

  const { spaces, equipment: allEquipment, buildings } = useSpaces();
  const { reservations } = useReservations();

  // Algorithme intelligent de recommandation d'espaces
  const recommendations = useMemo(() => {
    if (!criteria.date || !criteria.startTime) return [];

    const searchDate = new Date(criteria.date);
    const [hours, minutes] = criteria.startTime.split(':').map(Number);
    const startTime = new Date(searchDate);
    startTime.setHours(hours, minutes, 0, 0);
    const endTime = addMinutes(startTime, criteria.duration);

    // Filtrer les espaces disponibles (non en maintenance)
    const availableSpaces = spaces.filter(space => 
      space.status !== 'maintenance' && 
      space.status !== 'out_of_service'
    );

    const recs: SpaceRecommendation[] = availableSpaces.map(space => {
      let score = 0;
      const reasons: string[] = [];
      const availableSlots: Array<{ start: Date; end: Date }> = [];

      // 1. Vérifier la disponibilité horaire
      const [spaceStartHour] = space.constraints.openingHours.start.split(':').map(Number);
      const [spaceEndHour] = space.constraints.openingHours.end.split(':').map(Number);
      
      if (hours < spaceStartHour || hours >= spaceEndHour) {
        return { space, score: -1, availableSlots: [], reasons: ['Hors horaires d\'ouverture'], isOptimal: false };
      }

      // 2. Vérifier les conflits de réservation
      const hasConflict = reservations.some(reservation => {
        if (reservation.spaceId !== space.id || reservation.status === 'cancelled') return false;
        
        return isWithinInterval(startTime, { start: reservation.dateTime.start, end: reservation.dateTime.end }) ||
               isWithinInterval(endTime, { start: reservation.dateTime.start, end: reservation.dateTime.end }) ||
               (startTime <= reservation.dateTime.start && endTime >= reservation.dateTime.end);
      });

      if (hasConflict) {
        // Chercher des créneaux alternatifs
        const dayStart = new Date(searchDate);
        dayStart.setHours(spaceStartHour, 0, 0, 0);
        const dayEnd = new Date(searchDate);
        dayEnd.setHours(spaceEndHour, 0, 0, 0);

        // Générer des créneaux de 30 minutes
        let current = new Date(dayStart);
        while (current < dayEnd) {
          const slotEnd = addMinutes(current, criteria.duration);
          if (slotEnd <= dayEnd) {
            const slotHasConflict = reservations.some(reservation => {
              if (reservation.spaceId !== space.id || reservation.status === 'cancelled') return false;
              return isWithinInterval(current, { start: reservation.dateTime.start, end: reservation.dateTime.end }) ||
                     isWithinInterval(slotEnd, { start: reservation.dateTime.start, end: reservation.dateTime.end }) ||
                     (current <= reservation.dateTime.start && slotEnd >= reservation.dateTime.end);
            });

            if (!slotHasConflict) {
              availableSlots.push({ start: new Date(current), end: new Date(slotEnd) });
            }
          }
          current = addMinutes(current, 30);
        }

        if (availableSlots.length === 0) {
          return { space, score: -1, availableSlots: [], reasons: ['Aucun créneau disponible'], isOptimal: false };
        }
        
        score -= 20; // Pénalité pour horaire non optimal
        reasons.push(`${availableSlots.length} créneaux alternatifs disponibles`);
      } else {
        availableSlots.push({ start: startTime, end: endTime });
        score += 50; // Bonus pour disponibilité à l'heure demandée
        reasons.push('Disponible à l\'heure demandée');
      }

      // 3. Score de capacité (optimal = +/- 20% de la demande)
      const capacityRatio = criteria.participants / space.capacity;
      if (capacityRatio <= 0.8) {
        score += Math.max(0, 30 - (0.8 - capacityRatio) * 100);
        if (capacityRatio >= 0.6) {
          reasons.push('Capacité optimale');
        } else {
          reasons.push('Capacité supérieure disponible');
        }
      } else if (capacityRatio <= 1) {
        score += 20;
        reasons.push('Capacité juste suffisante');
      } else {
        return { space, score: -1, availableSlots: [], reasons: ['Capacité insuffisante'], isOptimal: false };
      }

      // 4. Correspondance du type d'espace
      if (criteria.spaceType && space.type === criteria.spaceType) {
        score += 25;
        reasons.push('Type d\'espace correspondant');
      }

      // 5. Équipements demandés
      const spaceEquipment = [
        ...space.equipment.multimedia,
        ...space.equipment.computer,
        ...space.equipment.specialized
      ];
      
      const matchingEquipment = criteria.equipment.filter(eq => spaceEquipment.includes(eq));
      const equipmentScore = (matchingEquipment.length / Math.max(1, criteria.equipment.length)) * 20;
      score += equipmentScore;
      
      if (matchingEquipment.length === criteria.equipment.length && criteria.equipment.length > 0) {
        reasons.push('Tous les équipements disponibles');
      } else if (matchingEquipment.length > 0) {
        reasons.push(`${matchingEquipment.length}/${criteria.equipment.length} équipements disponibles`);
      }

      // 6. Localisation
      if (criteria.building && space.location.building === criteria.building) {
        score += 15;
        reasons.push('Bâtiment préféré');
      }

      // 7. Bonus pour équipements supplémentaires utiles
      if (space.equipment.accessibility) {
        score += 5;
        reasons.push('Accessible PMR');
      }
      if (space.equipment.airConditioning) {
        score += 3;
        reasons.push('Climatisé');
      }
      if (space.equipment.naturalLight) {
        score += 3;
        reasons.push('Éclairage naturel');
      }

      // 8. Déterminer si l'espace est optimal
      const isOptimal = score >= 80 && availableSlots.some(slot => 
        slot.start.getTime() === startTime.getTime()
      );

      return {
        space,
        score,
        availableSlots,
        reasons,
        isOptimal
      };
    });

    // Trier par score décroissant et filtrer les scores négatifs
    return recs
      .filter(rec => rec.score >= 0)
      .sort((a, b) => b.score - a.score);
  }, [criteria, spaces, reservations]);

  const handleEquipmentChange = (equipment: string) => {
    setCriteria(prev => ({
      ...prev,
      equipment: prev.equipment.includes(equipment)
        ? prev.equipment.filter(eq => eq !== equipment)
        : [...prev.equipment, equipment]
    }));
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreLabel = (score: number) => {
    if (score >= 80) return 'Excellent';
    if (score >= 60) return 'Bon';
    if (score >= 40) return 'Acceptable';
    return 'Limité';
  };

  return (
    <div className="space-y-6">
      {/* Formulaire de recherche intelligente */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lightbulb className="h-5 w-5 text-yellow-500" />
            Recherche intelligente d'espaces
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Notre IA vous propose les meilleurs espaces selon vos critères
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Critères principaux */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="text-sm font-medium mb-1 block">Date</label>
              <Input
                type="date"
                value={criteria.date}
                onChange={(e) => setCriteria(prev => ({ ...prev, date: e.target.value }))}
                min={new Date().toISOString().split('T')[0]}
              />
            </div>
            
            <div>
              <label className="text-sm font-medium mb-1 block">Heure de début</label>
              <Input
                type="time"
                value={criteria.startTime}
                onChange={(e) => setCriteria(prev => ({ ...prev, startTime: e.target.value }))}
              />
            </div>
            
            <div>
              <label className="text-sm font-medium mb-1 block">Durée (minutes)</label>
              <Select 
                value={criteria.duration.toString()} 
                onValueChange={(value) => setCriteria(prev => ({ ...prev, duration: parseInt(value) }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="30">30 min</SelectItem>
                  <SelectItem value="60">1 heure</SelectItem>
                  <SelectItem value="90">1h30</SelectItem>
                  <SelectItem value="120">2 heures</SelectItem>
                  <SelectItem value="180">3 heures</SelectItem>
                  <SelectItem value="240">4 heures</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <label className="text-sm font-medium mb-1 block">Participants</label>
              <Input
                type="number"
                min="1"
                value={criteria.participants}
                onChange={(e) => setCriteria(prev => ({ ...prev, participants: parseInt(e.target.value) || 1 }))}
              />
            </div>
          </div>

          <Separator />

          {/* Critères avancés */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium mb-1 block">Type d'espace</label>
              <Select 
                value={criteria.spaceType || "all"} 
                onValueChange={(value) => setCriteria(prev => ({ ...prev, spaceType: value === "all" ? "" : value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Tous types" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous types</SelectItem>
                  <SelectItem value="classroom">Salle de classe</SelectItem>
                  <SelectItem value="amphitheater">Amphithéâtre</SelectItem>
                  <SelectItem value="laboratory">Laboratoire</SelectItem>
                  <SelectItem value="computer_room">Salle informatique</SelectItem>
                  <SelectItem value="meeting_room">Salle de réunion</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <label className="text-sm font-medium mb-1 block">Bâtiment</label>
              <Select 
                value={criteria.building || "all"} 
                onValueChange={(value) => setCriteria(prev => ({ ...prev, building: value === "all" ? "" : value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Tous bâtiments" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous bâtiments</SelectItem>
                  {buildings.map(building => (
                    <SelectItem key={building} value={building}>
                      {building}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Équipements */}
          <div>
            <label className="text-sm font-medium mb-2 block">Équipements requis</label>
            <div className="flex flex-wrap gap-2">
              {allEquipment.slice(0, 10).map(equipment => (
                <Badge
                  key={equipment}
                  variant={criteria.equipment.includes(equipment) ? "default" : "outline"}
                  className="cursor-pointer"
                  onClick={() => handleEquipmentChange(equipment)}
                >
                  {equipment}
                </Badge>
              ))}
            </div>
          </div>

          <Button 
            className="w-full" 
            size="lg"
            disabled={!criteria.date || !criteria.startTime}
          >
            <Search className="h-4 w-4 mr-2" />
            Rechercher les meilleurs espaces
          </Button>
        </CardContent>
      </Card>

      {/* Résultats de la recherche */}
      {recommendations.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Star className="h-5 w-5 text-yellow-500" />
                Recommandations ({recommendations.length})
              </div>
              <Badge variant="outline">
                {recommendations.filter(r => r.isOptimal).length} optimaux
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recommendations.map((rec, index) => (
                <Card 
                  key={rec.space.id} 
                  className={`
                    border-2 transition-all hover:shadow-md
                    ${rec.isOptimal ? 'border-green-200 bg-green-50/50' : 'border-border'}
                  `}
                >
                  <CardContent className="pt-4">
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          {rec.isOptimal && <CheckCircle2 className="h-4 w-4 text-green-600" />}
                          <h4 className="font-semibold text-lg">{rec.space.name}</h4>
                          <Badge variant="outline" className="text-xs">
                            #{index + 1}
                          </Badge>
                        </div>
                        
                        <div className="flex items-center gap-4 text-sm text-muted-foreground mb-2">
                          <div className="flex items-center gap-1">
                            <MapPin className="h-3 w-3" />
                            {rec.space.location.building} - {rec.space.location.room}
                          </div>
                          <div className="flex items-center gap-1">
                            <Users className="h-3 w-3" />
                            {rec.space.capacity} places
                          </div>
                        </div>
                        
                        <div className="flex flex-wrap gap-1 mb-3">
                          {rec.reasons.map((reason, idx) => (
                            <Badge key={idx} variant="secondary" className="text-xs">
                              {reason}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      
                      <div className="text-right ml-4">
                        <div className={`text-2xl font-bold ${getScoreColor(rec.score)}`}>
                          {rec.score}%
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {getScoreLabel(rec.score)}
                        </div>
                      </div>
                    </div>
                    
                    {/* Créneaux disponibles */}
                    <div className="border-t pt-3">
                      <h5 className="text-sm font-medium mb-2">Créneaux disponibles:</h5>
                      <div className="flex flex-wrap gap-2">
                        {rec.availableSlots.slice(0, 6).map((slot, slotIndex) => (
                          <Button
                            key={slotIndex}
                            size="sm"
                            variant={slotIndex === 0 ? "default" : "outline"}
                            onClick={() => onSpaceSelect(rec.space, slot)}
                            className="text-xs"
                          >
                            <Clock className="h-3 w-3 mr-1" />
                            {format(slot.start, 'HH:mm')} - {format(slot.end, 'HH:mm')}
                          </Button>
                        ))}
                        {rec.availableSlots.length > 6 && (
                          <span className="text-xs text-muted-foreground self-center">
                            +{rec.availableSlots.length - 6} autres
                          </span>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Aucun résultat */}
      {recommendations.length === 0 && criteria.date && criteria.startTime && (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-8 text-muted-foreground">
              <Search className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p className="text-lg font-medium">Aucun espace disponible</p>
              <p>Essayez de modifier vos critères de recherche</p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};