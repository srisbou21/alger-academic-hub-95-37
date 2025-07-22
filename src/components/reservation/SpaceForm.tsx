
import React from 'react';
import { useForm } from 'react-hook-form';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Space } from "../../types/reservation";
import { Building2, Users, MapPin, Settings } from "lucide-react";

interface SpaceFormProps {
  space?: Space;
  onSubmit: (space: Partial<Space>) => void;
  onCancel?: () => void;
}

export const SpaceForm = ({ space, onSubmit, onCancel }: SpaceFormProps) => {
  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm<Partial<Space>>({
    defaultValues: space || {
      type: 'classroom',
      capacity: 30,
      surface: 50,
      status: 'available',
      equipment: {
        multimedia: [],
        computer: [],
        specialized: [],
        accessibility: false,
        airConditioning: false,
        naturalLight: false
      },
      constraints: {
        openingHours: {
          start: '08:00',
          end: '18:00'
        },
        closedDays: [],
        cleaningTime: 15,
        restrictions: []
      }
    }
  });

  const onFormSubmit = (data: Partial<Space>) => {
    console.log('SpaceForm - onFormSubmit appelé avec:', data);
    onSubmit(data);
  };

  return (
    <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-6">
      {/* Informations générales */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5" />
            Informations générales
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name">Nom de l'espace *</Label>
              <Input
                id="name"
                {...register("name", { required: "Le nom est requis" })}
                placeholder="Ex: Amphithéâtre A"
              />
              {errors.name && (
                <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
              )}
            </div>
            <div>
              <Label htmlFor="code">Code *</Label>
              <Input
                id="code"
                {...register("code", { required: "Le code est requis" })}
                placeholder="Ex: AMPH-A"
              />
              {errors.code && (
                <p className="text-red-500 text-sm mt-1">{errors.code.message}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="type">Type *</Label>
              <Select onValueChange={(value) => setValue("type", value as Space['type'])}>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner le type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="classroom">Salle de cours</SelectItem>
                  <SelectItem value="amphitheater">Amphithéâtre</SelectItem>
                  <SelectItem value="computer_room">Salle informatique</SelectItem>
                  <SelectItem value="meeting_room">Salle de réunion</SelectItem>
                  <SelectItem value="laboratory">Laboratoire</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="capacity">Capacité *</Label>
              <Input
                id="capacity"
                type="number"
                {...register("capacity", { 
                  required: "La capacité est requise",
                  min: { value: 1, message: "Minimum 1 place" }
                })}
                placeholder="Nombre de places"
              />
              {errors.capacity && (
                <p className="text-red-500 text-sm mt-1">{errors.capacity.message}</p>
              )}
            </div>
            <div>
              <Label htmlFor="surface">Surface (m²) *</Label>
              <Input
                id="surface"
                type="number"
                {...register("surface", { 
                  required: "La surface est requise",
                  min: { value: 1, message: "Minimum 1 m²" }
                })}
                placeholder="Surface en m²"
              />
              {errors.surface && (
                <p className="text-red-500 text-sm mt-1">{errors.surface.message}</p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Localisation */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            Localisation
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="building">Bâtiment *</Label>
              <Input
                id="building"
                {...register("location.building", { required: "Le bâtiment est requis" })}
                placeholder="Ex: Bâtiment A"
              />
              {errors.location?.building && (
                <p className="text-red-500 text-sm mt-1">{errors.location.building.message}</p>
              )}
            </div>
            <div>
              <Label htmlFor="floor">Étage *</Label>
              <Input
                id="floor"
                {...register("location.floor", { required: "L'étage est requis" })}
                placeholder="Ex: 1er étage"
              />
              {errors.location?.floor && (
                <p className="text-red-500 text-sm mt-1">{errors.location.floor.message}</p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Équipements */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Équipements et caractéristiques
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <Label>Options disponibles</Label>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="accessibility"
                    onCheckedChange={(checked) => setValue("equipment.accessibility", !!checked)}
                    defaultChecked={space?.equipment?.accessibility}
                  />
                  <Label htmlFor="accessibility">Accès PMR</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="airConditioning"
                    onCheckedChange={(checked) => setValue("equipment.airConditioning", !!checked)}
                    defaultChecked={space?.equipment?.airConditioning}
                  />
                  <Label htmlFor="airConditioning">Climatisation</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="naturalLight"
                    onCheckedChange={(checked) => setValue("equipment.naturalLight", !!checked)}
                    defaultChecked={space?.equipment?.naturalLight}
                  />
                  <Label htmlFor="naturalLight">Éclairage naturel</Label>
                </div>
              </div>

              <div className="space-y-3">
                <Label>Équipements multimédia disponibles</Label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    'Vidéoprojecteur', 'Écran géant', 'Tableau blanc interactif', 
                    'Tableau noir', 'Micro sans fil', 'Haut-parleurs', 
                    'Webcam', 'Système de visioconférence'
                  ].map((equipment) => (
                    <div key={equipment} className="flex items-center space-x-2">
                      <Checkbox
                        id={`multimedia-${equipment}`}
                        onCheckedChange={(checked) => {
                          const currentMultimedia = watch("equipment.multimedia") || [];
                          if (checked) {
                            setValue("equipment.multimedia", [...currentMultimedia, equipment]);
                          } else {
                            setValue("equipment.multimedia", currentMultimedia.filter(item => item !== equipment));
                          }
                        }}
                        defaultChecked={space?.equipment?.multimedia?.includes(equipment)}
                      />
                      <Label htmlFor={`multimedia-${equipment}`} className="text-sm">{equipment}</Label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="space-y-3">
              <Label>Équipements informatiques disponibles</Label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  'Ordinateurs fixes', 'Ordinateurs portables', 'Tablettes', 
                  'Imprimante', 'Scanner', 'Serveur local', 
                  'Wifi haute vitesse', 'Prises électriques multiples'
                ].map((equipment) => (
                  <div key={equipment} className="flex items-center space-x-2">
                    <Checkbox
                      id={`computer-${equipment}`}
                      onCheckedChange={(checked) => {
                        const currentComputer = watch("equipment.computer") || [];
                        if (checked) {
                          setValue("equipment.computer", [...currentComputer, equipment]);
                        } else {
                          setValue("equipment.computer", currentComputer.filter(item => item !== equipment));
                        }
                      }}
                      defaultChecked={space?.equipment?.computer?.includes(equipment)}
                    />
                    <Label htmlFor={`computer-${equipment}`} className="text-sm">{equipment}</Label>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Contraintes horaires */}
      <Card>
        <CardHeader>
          <CardTitle>Contraintes horaires</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="startTime">Heure d'ouverture</Label>
              <Input
                id="startTime"
                type="time"
                {...register("constraints.openingHours.start")}
                defaultValue="08:00"
              />
            </div>
            <div>
              <Label htmlFor="endTime">Heure de fermeture</Label>
              <Input
                id="endTime"
                type="time"
                {...register("constraints.openingHours.end")}
                defaultValue="18:00"
              />
            </div>
            <div>
              <Label htmlFor="cleaningTime">Temps de nettoyage (min)</Label>
              <Input
                id="cleaningTime"
                type="number"
                {...register("constraints.cleaningTime")}
                defaultValue={15}
                min={0}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex justify-end gap-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Annuler
        </Button>
        <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
          <Building2 className="mr-2 h-4 w-4" />
          {space ? 'Modifier' : 'Créer'} l'espace
        </Button>
      </div>
    </form>
  );
};
