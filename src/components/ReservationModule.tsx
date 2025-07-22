import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Building2,
  Calendar,
  Clock,
  Users,
  MapPin,
  Search,
  Plus,
  CheckCircle,
  AlertCircle,
  XCircle
} from 'lucide-react';

interface Reservation {
  id: string;
  space: string;
  type: 'amphitheater' | 'classroom' | 'lab';
  date: string;
  startTime: string;
  endTime: string;
  status: 'confirmed' | 'pending' | 'cancelled';
  requestedBy: string;
  purpose: string;
  capacity: number;
}

interface Space {
  id: string;
  name: string;
  type: 'amphitheater' | 'classroom' | 'lab';
  capacity: number;
  equipment: string[];
  availability: 'available' | 'occupied' | 'maintenance';
}

export const ReservationModule: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');

  const mockReservations: Reservation[] = [
    {
      id: '1',
      space: 'Amphithéâtre A',
      type: 'amphitheater',
      date: '2024-01-25',
      startTime: '09:00',
      endTime: '11:00',
      status: 'confirmed',
      requestedBy: 'Dr. Ahmed Benali',
      purpose: 'Cours Magistral - Algorithmique',
      capacity: 200
    },
    {
      id: '2',
      space: 'Salle TP01',
      type: 'lab',
      date: '2024-01-25',
      startTime: '14:00',
      endTime: '16:00',
      status: 'pending',
      requestedBy: 'Dr. Fatima Zahra',
      purpose: 'TP Base de Données',
      capacity: 30
    }
  ];

  const mockSpaces: Space[] = [
    {
      id: '1',
      name: 'Amphithéâtre A',
      type: 'amphitheater',
      capacity: 200,
      equipment: ['Projecteur', 'Micro', 'Tableau intelligent'],
      availability: 'available'
    },
    {
      id: '2',
      name: 'Salle TP01',
      type: 'lab',
      capacity: 30,
      equipment: ['30 PC', 'Projecteur', 'Réseau'],
      availability: 'occupied'
    },
    {
      id: '3',
      name: 'Salle 101',
      type: 'classroom',
      capacity: 50,
      equipment: ['Projecteur', 'Tableau'],
      availability: 'available'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getAvailabilityColor = (availability: string) => {
    switch (availability) {
      case 'available': return 'bg-green-100 text-green-800';
      case 'occupied': return 'bg-red-100 text-red-800';
      case 'maintenance': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'amphitheater': return <Building2 className="h-4 w-4" />;
      case 'lab': return <Users className="h-4 w-4" />;
      case 'classroom': return <MapPin className="h-4 w-4" />;
      default: return <Building2 className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-6">
      <Card className="bg-gradient-to-r from-blue-600 to-blue-800 text-white">
        <CardHeader>
          <CardTitle className="text-2xl font-bold flex items-center gap-2">
            <Building2 className="h-8 w-8" />
            Système de Réservation d'Espaces
          </CardTitle>
          <p className="text-blue-100">
            Gestion des salles, amphithéâtres et laboratoires
          </p>
        </CardHeader>
      </Card>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
          <TabsTrigger value="reservations">Réservations</TabsTrigger>
          <TabsTrigger value="spaces">Espaces</TabsTrigger>
          <TabsTrigger value="calendar">Planning</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-green-100 rounded-full">
                    <CheckCircle className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Espaces Disponibles</h3>
                    <p className="text-2xl font-bold text-green-600">45</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-red-100 rounded-full">
                    <XCircle className="h-6 w-6 text-red-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Espaces Occupés</h3>
                    <p className="text-2xl font-bold text-red-600">12</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-yellow-100 rounded-full">
                    <AlertCircle className="h-6 w-6 text-yellow-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">En Attente</h3>
                    <p className="text-2xl font-bold text-yellow-600">8</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Réservations Récentes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockReservations.slice(0, 3).map((reservation) => (
                  <div key={reservation.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-4">
                      {getTypeIcon(reservation.type)}
                      <div>
                        <p className="font-semibold text-gray-900">{reservation.space}</p>
                        <p className="text-sm text-gray-600">{reservation.purpose}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge className={getStatusColor(reservation.status)}>
                        {reservation.status}
                      </Badge>
                      <p className="text-sm text-gray-600 mt-1">
                        {reservation.date} • {reservation.startTime}-{reservation.endTime}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reservations">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Gestion des Réservations</CardTitle>
              <Button className="bg-blue-600 hover:bg-blue-700">
                <Plus className="h-4 w-4 mr-2" />
                Nouvelle Réservation
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockReservations.map((reservation) => (
                  <Card key={reservation.id} className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        {getTypeIcon(reservation.type)}
                        <div>
                          <h4 className="font-semibold text-gray-900">{reservation.space}</h4>
                          <p className="text-sm text-gray-600">Par: {reservation.requestedBy}</p>
                          <p className="text-sm text-gray-600">{reservation.purpose}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <Badge className={getStatusColor(reservation.status)}>
                          {reservation.status}
                        </Badge>
                        <div className="mt-2 text-sm text-gray-600">
                          <p className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {reservation.date}
                          </p>
                          <p className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {reservation.startTime} - {reservation.endTime}
                          </p>
                          <p className="flex items-center gap-1">
                            <Users className="h-3 w-3" />
                            Capacité: {reservation.capacity}
                          </p>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="spaces">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Gestion des Espaces</CardTitle>
              <div className="flex gap-2">
                <Button variant="outline">
                  <Search className="h-4 w-4 mr-2" />
                  Rechercher
                </Button>
                <Button className="bg-blue-600 hover:bg-blue-700">
                  <Plus className="h-4 w-4 mr-2" />
                  Ajouter Espace
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {mockSpaces.map((space) => (
                  <Card key={space.id} className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-2">
                        {getTypeIcon(space.type)}
                        <h4 className="font-semibold text-gray-900">{space.name}</h4>
                      </div>
                      <Badge className={getAvailabilityColor(space.availability)}>
                        {space.availability}
                      </Badge>
                    </div>
                    <div className="space-y-2 text-sm text-gray-600">
                      <p className="flex items-center gap-1">
                        <Users className="h-3 w-3" />
                        Capacité: {space.capacity} personnes
                      </p>
                      <div>
                        <p className="font-medium">Équipements:</p>
                        <ul className="list-disc list-inside ml-2">
                          {space.equipment.map((item, index) => (
                            <li key={index}>{item}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                    <div className="mt-4 flex gap-2">
                      <Button size="sm" variant="outline" className="flex-1">
                        Détails
                      </Button>
                      <Button size="sm" className="flex-1 bg-blue-600 hover:bg-blue-700">
                        Réserver
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="calendar">
          <Card>
            <CardHeader>
              <CardTitle>Planning des Réservations</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-gray-50 p-8 rounded-lg text-center">
                <Calendar className="h-16 w-16 mx-auto text-gray-400 mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Vue Calendrier</h3>
                <p className="text-gray-600">
                  Le calendrier interactif sera disponible dans une prochaine version.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};