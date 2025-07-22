import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  Calendar, 
  Clock, 
  Plus, 
  Edit, 
  Trash2, 
  Search,
  Users,
  MapPin
} from "lucide-react";

interface TimetableEvent {
  id: string;
  subject: string;
  type: 'cours' | 'td' | 'tp' | 'examen';
  teacher: string;
  group: string;
  room: string;
  day: string;
  startTime: string;
  endTime: string;
  students: number;
}

const mockTimetableEvents: TimetableEvent[] = [
  {
    id: "1",
    subject: "Mathématiques",
    type: "cours",
    teacher: "Dr. Martin",
    group: "L1 Groupe A",
    room: "Amphi 1",
    day: "Lundi",
    startTime: "08:00",
    endTime: "10:00",
    students: 80
  },
  {
    id: "2",
    subject: "Physique",
    type: "tp",
    teacher: "Dr. Dubois",
    group: "L2 Groupe B",
    room: "Lab 201",
    day: "Mardi",
    startTime: "14:00",
    endTime: "16:00",
    students: 25
  },
  {
    id: "3",
    subject: "Chimie",
    type: "td",
    teacher: "Dr. Leroy",
    group: "L1 Groupe C",
    room: "Salle 105",
    day: "Mercredi",
    startTime: "10:00",
    endTime: "12:00",
    students: 30
  }
];

export const SimpleFacultyTimetable = () => {
  const [events, setEvents] = useState<TimetableEvent[]>(mockTimetableEvents);
  const [searchTerm, setSearchTerm] = useState("");

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'cours': return 'bg-blue-100 text-blue-800';
      case 'td': return 'bg-green-100 text-green-800';
      case 'tp': return 'bg-purple-100 text-purple-800';
      case 'examen': return 'bg-red-100 text-red-800';
      default: return 'bg-slate-100 text-slate-800';
    }
  };

  const filteredEvents = events.filter(event => 
    event.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
    event.teacher.toLowerCase().includes(searchTerm.toLowerCase()) ||
    event.group.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const EventCard = ({ event }: { event: TimetableEvent }) => (
    <div className="p-4 border rounded-lg bg-white shadow-sm hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-3">
        <h4 className="font-medium text-slate-900">{event.subject}</h4>
        <Badge className={getTypeColor(event.type)}>{event.type.toUpperCase()}</Badge>
      </div>
      <div className="space-y-2 text-sm text-slate-600">
        <div className="flex items-center gap-2">
          <Users className="h-4 w-4" />
          <span>{event.group}</span>
        </div>
        <div className="flex items-center gap-2">
          <MapPin className="h-4 w-4" />
          <span>{event.room}</span>
        </div>
        <div className="flex items-center gap-2">
          <Clock className="h-4 w-4" />
          <span>{event.day} - {event.startTime} à {event.endTime}</span>
        </div>
        <div className="text-slate-500">
          {event.teacher}
        </div>
      </div>
      <div className="flex gap-2 mt-4">
        <Button size="sm" variant="outline">
          <Edit className="h-4 w-4" />
        </Button>
        <Button size="sm" variant="outline" className="text-red-600 hover:text-red-700">
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-6 w-6" />
            Emplois du Temps
          </CardTitle>
        </CardHeader>
      </Card>

      {/* Search and Add */}
      <Card>
        <CardContent className="p-4">
          <div className="flex gap-4 items-center">
            <div className="flex items-center gap-2 flex-1">
              <Search className="h-4 w-4 text-slate-500" />
              <Input
                placeholder="Rechercher un cours..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="max-w-md"
              />
            </div>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Ajouter
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Course List */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Liste des Cours</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredEvents.map(event => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
          
          {filteredEvents.length === 0 && (
            <div className="text-center py-8 text-slate-500">
              Aucun cours trouvé
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};