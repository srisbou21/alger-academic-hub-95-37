
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import { Megaphone, Users, Calendar as CalendarIcon, Eye, Archive, Edit, Trash2, Clock } from "lucide-react";
import { useState } from "react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

export const AnnouncementSystem = () => {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [showNewAnnouncement, setShowNewAnnouncement] = useState(false);

  const announcements = [
    {
      id: 1,
      title: "Fermeture exceptionnelle de la faculté",
      category: "administrative",
      audience: "all",
      status: "active",
      createdDate: "2024-06-14",
      scheduledDate: "2024-06-15",
      readCount: 3847,
      totalAudience: 4200,
      priority: "high",
      content: "La faculté sera fermée le vendredi 15 juin en raison de travaux de maintenance..."
    },
    {
      id: 2,
      title: "Nouvelle procédure d'inscription aux examens",
      category: "pedagogique",
      audience: "students",
      status: "scheduled",
      createdDate: "2024-06-13",
      scheduledDate: "2024-06-16",
      readCount: 0,
      totalAudience: 4847,
      priority: "medium",
      content: "À partir du 16 juin, une nouvelle procédure sera mise en place..."
    }
  ];

  const getCategoryBadge = (category: string) => {
    const styles = {
      administrative: "bg-red-100 text-red-800 border-red-200",
      pedagogique: "bg-blue-100 text-blue-800 border-blue-200",
      evenementielle: "bg-green-100 text-green-800 border-green-200"
    };
    return styles[category as keyof typeof styles] || "bg-gray-100 text-gray-800";
  };

  const getStatusBadge = (status: string) => {
    const styles = {
      active: "bg-green-100 text-green-800",
      scheduled: "bg-amber-100 text-amber-800",
      archived: "bg-gray-100 text-gray-800"
    };
    return styles[status as keyof typeof styles] || "bg-gray-100 text-gray-800";
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-semibold">Système d'Annonces</h3>
        <Button 
          onClick={() => setShowNewAnnouncement(true)}
          className="bg-blue-600 hover:bg-blue-700"
        >
          <Megaphone className="h-4 w-4 mr-2" />
          Nouvelle Annonce
        </Button>
      </div>

      {showNewAnnouncement && (
        <Card className="border-blue-200">
          <CardHeader className="bg-blue-50">
            <CardTitle className="text-blue-800">Créer une Nouvelle Annonce</CardTitle>
            <CardDescription>Publication ciblée avec programmation de diffusion</CardDescription>
          </CardHeader>
          <CardContent className="p-6 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="title">Titre de l'annonce *</Label>
                <Input id="title" placeholder="Titre accrocheur..." />
              </div>
              <div className="space-y-2">
                <Label>Catégorie *</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner une catégorie" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="administrative">Administrative</SelectItem>
                    <SelectItem value="pedagogique">Pédagogique</SelectItem>
                    <SelectItem value="evenementielle">Événementielle</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Audience cible *</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Choisir l'audience" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tous les utilisateurs</SelectItem>
                    <SelectItem value="students">Étudiants uniquement</SelectItem>
                    <SelectItem value="teachers">Enseignants uniquement</SelectItem>
                    <SelectItem value="admin">Personnel administratif</SelectItem>
                    <SelectItem value="l1">Étudiants L1</SelectItem>
                    <SelectItem value="l2">Étudiants L2</SelectItem>
                    <SelectItem value="l3">Étudiants L3</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Priorité</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Niveau de priorité" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Basse</SelectItem>
                    <SelectItem value="medium">Moyenne</SelectItem>
                    <SelectItem value="high">Haute</SelectItem>
                    <SelectItem value="urgent">Urgente</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Programmation de diffusion</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !selectedDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {selectedDate ? format(selectedDate, "PPP") : <span>Diffuser maintenant ou programmer</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={selectedDate || undefined}
                    onSelect={(date) => setSelectedDate(date || null)}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2">
              <Label htmlFor="content">Contenu de l'annonce *</Label>
              <Textarea 
                id="content" 
                placeholder="Rédigez votre annonce ici..."
                className="min-h-32"
              />
            </div>

            <div className="flex gap-2 pt-4">
              <Button className="bg-blue-600 hover:bg-blue-700 flex-1">
                <Megaphone className="h-4 w-4 mr-2" />
                Publier l'Annonce
              </Button>
              <Button 
                variant="outline" 
                onClick={() => setShowNewAnnouncement(false)}
              >
                Annuler
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 gap-4">
        {announcements.map((announcement) => (
          <Card key={announcement.id} className="border-slate-200">
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h4 className="font-semibold text-lg">{announcement.title}</h4>
                    <Badge className={getCategoryBadge(announcement.category)}>
                      {announcement.category}
                    </Badge>
                    <Badge className={getStatusBadge(announcement.status)}>
                      {announcement.status}
                    </Badge>
                    {announcement.priority === 'high' && (
                      <Badge className="bg-red-100 text-red-800">Priorité haute</Badge>
                    )}
                  </div>
                  <p className="text-slate-600 text-sm mb-3">{announcement.content}</p>
                  <div className="flex items-center gap-4 text-sm text-slate-500">
                    <div className="flex items-center gap-1">
                      <Users className="h-4 w-4" />
                      Audience: {announcement.audience}
                    </div>
                    <div className="flex items-center gap-1">
                      <Eye className="h-4 w-4" />
                      {announcement.readCount}/{announcement.totalAudience} lectures
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      Programmé: {new Date(announcement.scheduledDate).toLocaleDateString('fr-FR')}
                    </div>
                  </div>
                </div>
                <div className="flex gap-2 ml-4">
                  <Button size="sm" variant="outline">
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button size="sm" variant="outline">
                    <Archive className="h-4 w-4" />
                  </Button>
                  <Button size="sm" variant="outline" className="text-red-600 hover:text-red-700">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <Separator className="my-4" />

              <div className="flex items-center justify-between">
                <div className="text-sm text-slate-500">
                  Créé le {new Date(announcement.createdDate).toLocaleDateString('fr-FR')}
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-full bg-slate-200 rounded-full h-2 flex-1 min-w-32">
                    <div 
                      className="bg-blue-600 h-2 rounded-full" 
                      style={{ width: `${(announcement.readCount / announcement.totalAudience) * 100}%` }}
                    ></div>
                  </div>
                  <span className="text-sm text-slate-600 ml-2">
                    {Math.round((announcement.readCount / announcement.totalAudience) * 100)}%
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
