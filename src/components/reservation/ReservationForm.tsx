
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { X } from 'lucide-react';
import { Space, Reservation } from "../../types/reservation";
import { useReservation } from "../../contexts/ReservationContext";

interface ReservationFormProps {
  space: Space | null;
  onClose: () => void;
  onSubmit: (data: Partial<Reservation>) => void;
}

export const ReservationForm: React.FC<ReservationFormProps> = ({
  space,
  onClose,
  onSubmit
}) => {
  const { createReservation } = useReservation();
  
  // Simulation données utilisateur connecté
  const currentUser = {
    name: 'Dr. Sophie Martin',
    contact: 'sophie.martin@universite.fr',
    phone: '+33 1 23 45 67 89'
  };

  const [formData, setFormData] = useState({
    requesterName: currentUser.name,
    requesterContact: currentUser.contact,
    requesterPhone: currentUser.phone,
    type: 'meeting' as const,
    purpose: '',
    description: '',
    participants: 1,
    startDate: '',
    startTime: '',
    endTime: '',
    priority: 3 as const
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!space) return;

    const startDateTime = new Date(`${formData.startDate}T${formData.startTime}`);
    const endDateTime = new Date(`${formData.startDate}T${formData.endTime}`);

    const reservationData: Partial<Reservation> = {
      spaceId: space.id,
      spaceName: space.name,
      requester: {
        name: formData.requesterName,
        contact: formData.requesterContact,
        phone: formData.requesterPhone || '+33 1 23 45 67 89'
      },
      type: formData.type,
      purpose: formData.purpose,
      description: formData.description,
      participants: formData.participants,
      dateTime: {
        start: startDateTime,
        end: endDateTime
      },
      equipment: [],
      priority: formData.priority
    };

    try {
      await createReservation(reservationData);
      onClose(); // Fermer le formulaire après création réussie
    } catch (error) {
      console.error('Erreur lors de la création de la réservation:', error);
    }
  };

  if (!space) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Nouvelle réservation - {space.name}</CardTitle>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="requesterName">Nom du demandeur</Label>
                <Input
                  id="requesterName"
                  value={formData.requesterName}
                  onChange={(e) => setFormData({...formData, requesterName: e.target.value})}
                  required
                />
              </div>
              <div>
                <Label htmlFor="requesterPhone">Numéro de téléphone</Label>
                <Input
                  id="requesterPhone"
                  type="tel"
                  value={formData.requesterPhone}
                  onChange={(e) => setFormData({...formData, requesterPhone: e.target.value})}
                  required
                />
              </div>
            </div>

            <div>
              <Label htmlFor="requesterContact">Email de contact</Label>
              <Input
                id="requesterContact"
                type="email"
                value={formData.requesterContact}
                onChange={(e) => setFormData({...formData, requesterContact: e.target.value})}
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="type">Type</Label>
                <Select
                  value={formData.type}
                  onValueChange={(value) => setFormData({...formData, type: value as any})}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="course">Cours</SelectItem>
                    <SelectItem value="exam">Examen</SelectItem>
                    <SelectItem value="meeting">Réunion</SelectItem>
                    <SelectItem value="event">Événement</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="participants">Nombre de participants</Label>
                <Input
                  id="participants"
                  type="number"
                  min="1"
                  max={space.capacity}
                  value={formData.participants}
                  onChange={(e) => setFormData({...formData, participants: parseInt(e.target.value)})}
                  required
                />
              </div>
            </div>

            <div>
              <Label htmlFor="purpose">Objet</Label>
              <Input
                id="purpose"
                value={formData.purpose}
                onChange={(e) => setFormData({...formData, purpose: e.target.value})}
                required
              />
            </div>

            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="startDate">Date</Label>
                <Input
                  id="startDate"
                  type="date"
                  value={formData.startDate}
                  onChange={(e) => setFormData({...formData, startDate: e.target.value})}
                  required
                />
              </div>
              <div>
                <Label htmlFor="startTime">Heure de début</Label>
                <Input
                  id="startTime"
                  type="time"
                  value={formData.startTime}
                  onChange={(e) => setFormData({...formData, startTime: e.target.value})}
                  required
                />
              </div>
              <div>
                <Label htmlFor="endTime">Heure de fin</Label>
                <Input
                  id="endTime"
                  type="time"
                  value={formData.endTime}
                  onChange={(e) => setFormData({...formData, endTime: e.target.value})}
                  required
                />
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={onClose}>
                Annuler
              </Button>
              <Button type="submit">
                Créer la réservation
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};
