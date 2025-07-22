
import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useReservations } from "../../hooks/useReservations";
import { useSpaces } from "../../hooks/useSpaces";
import { Calendar, MapPin, Users, Edit, Trash2, Search, Filter, Clock, AlertCircle, CheckCircle, XCircle } from 'lucide-react';
import { Reservation } from "../../types/reservation";

interface ReservationListProps {
  reservations: ReturnType<typeof useReservations>;
  spaces: ReturnType<typeof useSpaces>;
  onEdit: (reservation: Reservation) => void;
}

export const ReservationList: React.FC<ReservationListProps> = ({
  reservations,
  spaces,
  onEdit
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [sortBy, setSortBy] = useState('date');

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'bg-green-100 text-green-800 border-green-200';
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'cancelled': return 'bg-red-100 text-red-800 border-red-200';
      case 'rejected': return 'bg-red-100 text-red-800 border-red-200';
      case 'approved': return 'bg-blue-100 text-blue-800 border-blue-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'confirmed': return 'Confirmée';
      case 'pending': return 'En attente';
      case 'cancelled': return 'Annulée';
      case 'rejected': return 'Rejetée';
      case 'approved': return 'Approuvée';
      default: return status;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'confirmed': return <CheckCircle className="h-3 w-3" />;
      case 'pending': return <Clock className="h-3 w-3" />;
      case 'cancelled': return <XCircle className="h-3 w-3" />;
      case 'rejected': return <XCircle className="h-3 w-3" />;
      case 'approved': return <CheckCircle className="h-3 w-3" />;
      default: return <AlertCircle className="h-3 w-3" />;
    }
  };

  const getPriorityLabel = (priority: number) => {
    switch (priority) {
      case 1: return { label: 'Très haute', color: 'bg-red-100 text-red-800 border-red-200' };
      case 2: return { label: 'Haute', color: 'bg-orange-100 text-orange-800 border-orange-200' };
      case 3: return { label: 'Normale', color: 'bg-blue-100 text-blue-800 border-blue-200' };
      case 4: return { label: 'Basse', color: 'bg-gray-100 text-gray-800 border-gray-200' };
      default: return { label: 'Non définie', color: 'bg-gray-100 text-gray-800 border-gray-200' };
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'course': return 'Cours';
      case 'exam': return 'Examen';
      case 'meeting': return 'Réunion';
      case 'event': return 'Événement';
      default: return type;
    }
  };

  const filteredAndSortedReservations = useMemo(() => {
    let filtered = reservations.reservations.filter(reservation => {
      const matchesSearch = 
        reservation.purpose.toLowerCase().includes(searchTerm.toLowerCase()) ||
        reservation.requester.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (reservation.spaceName && reservation.spaceName.toLowerCase().includes(searchTerm.toLowerCase()));
      
      const matchesStatus = statusFilter === 'all' || reservation.status === statusFilter;
      const matchesType = typeFilter === 'all' || reservation.type === typeFilter;
      
      return matchesSearch && matchesStatus && matchesType;
    });

    // Sort reservations
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'date':
          return new Date(b.dateTime.start).getTime() - new Date(a.dateTime.start).getTime();
        case 'priority':
          return a.priority - b.priority;
        case 'status':
          return a.status.localeCompare(b.status);
        case 'name':
          return a.purpose.localeCompare(b.purpose);
        default:
          return 0;
      }
    });

    return filtered;
  }, [reservations.reservations, searchTerm, statusFilter, typeFilter, sortBy]);

  const groupedReservations = useMemo(() => {
    const groups: { [key: string]: Reservation[] } = {
      today: [],
      upcoming: [],
      past: []
    };

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    filteredAndSortedReservations.forEach(reservation => {
      const reservationDate = new Date(reservation.dateTime.start);
      reservationDate.setHours(0, 0, 0, 0);

      if (reservationDate.getTime() === today.getTime()) {
        groups.today.push(reservation);
      } else if (reservationDate >= tomorrow) {
        groups.upcoming.push(reservation);
      } else {
        groups.past.push(reservation);
      }
    });

    return groups;
  }, [filteredAndSortedReservations]);

  const ReservationCard = ({ reservation }: { reservation: Reservation }) => {
    const priority = getPriorityLabel(reservation.priority);
    
    return (
      <Card className="hover:shadow-elegant transition-all duration-200 hover:scale-[1.01]">
        <CardContent className="p-4">
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <h3 className="font-semibold">{reservation.purpose}</h3>
                <Badge className={getStatusColor(reservation.status)}>
                  {getStatusIcon(reservation.status)}
                  <span className="ml-1">{getStatusLabel(reservation.status)}</span>
                </Badge>
                <Badge className={priority.color}>
                  {priority.label}
                </Badge>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 text-sm text-muted-foreground mb-3">
                <div className="flex items-center gap-1">
                  <MapPin className="h-3 w-3" />
                  {reservation.spaceName || 'Espace non défini'}
                </div>
                <div className="flex items-center gap-1">
                  <Users className="h-3 w-3" />
                  {reservation.participants} participant(s)
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  {reservation.dateTime.start.toLocaleDateString('fr-FR')}
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {reservation.dateTime.start.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })} - 
                  {reservation.dateTime.end.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                </div>
                <div className="text-xs">
                  Type: {getTypeLabel(reservation.type)}
                </div>
                <div className="text-xs">
                  ID: {reservation.id.slice(-8)}
                </div>
              </div>
              
              <div className="mb-2">
                <p className="text-sm">
                  <strong>Demandeur:</strong> {reservation.requester.name}
                </p>
                <p className="text-xs text-muted-foreground">
                  Contact: {reservation.requester.contact} • Tél: {reservation.requester.phone}
                </p>
              </div>
              
              {reservation.description && (
                <p className="text-sm text-muted-foreground bg-muted/50 p-2 rounded text-ellipsis">
                  {reservation.description}
                </p>
              )}

              {reservation.equipment && reservation.equipment.length > 0 && (
                <div className="mt-2">
                  <p className="text-xs font-medium text-muted-foreground mb-1">Équipements demandés:</p>
                  <div className="flex flex-wrap gap-1">
                    {reservation.equipment.map((eq, idx) => (
                      <Badge key={idx} variant="outline" className="text-xs">
                        {eq}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {reservation.recurrence && (
                <div className="mt-2 text-xs text-blue-600 bg-blue-50 p-2 rounded">
                  <strong>Récurrence:</strong> {reservation.recurrence.pattern} jusqu'au {reservation.recurrence.endDate}
                </div>
              )}
            </div>
            
            <div className="flex flex-col gap-2 ml-4">
              <Button
                size="sm"
                variant="outline"
                onClick={() => onEdit(reservation)}
                className="shrink-0"
              >
                <Edit className="h-3 w-3 mr-1" />
                Modifier
              </Button>
              <Button
                size="sm"
                variant="destructive"
                onClick={() => {
                  if (confirm('Êtes-vous sûr de vouloir supprimer cette réservation ?')) {
                    reservations.deleteReservation(reservation.id);
                  }
                }}
                className="shrink-0"
              >
                <Trash2 className="h-3 w-3 mr-1" />
                Supprimer
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="space-y-6">
      {/* Content removed as requested */}
    </div>
  );
};
