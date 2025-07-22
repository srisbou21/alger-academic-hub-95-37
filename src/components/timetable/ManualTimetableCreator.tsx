
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  Calendar, 
  Plus, 
  Save, 
  Clock,
  Users,
  MapPin,
  CheckCircle2,
  AlertTriangle
} from "lucide-react";
import { ManualTimetable, FormationOffer, Module, PedagogicalAtom } from "../../types/academic";

export const ManualTimetableCreator = () => {
  const [timetables, setTimetables] = useState<ManualTimetable[]>([]);
  const [currentTimetable, setCurrentTimetable] = useState<Partial<ManualTimetable>>({
    status: 'draft',
    semester: 'S1',
    academicYear: '2024-2025'
  });

  // Données de test pour les offres de formation
  const formationOffers: FormationOffer[] = [
    {
      id: "offer1",
      name: "Licence Informatique L1",
      code: "L1-INFO",
      specialtyId: "spec1",
      level: "L1",
      academicYear: "2024-2025",
      diplomaType: "licence",
      duration: 6,
      modality: "presential",
      language: "fr",
      maxCapacity: 120,
      admissionRequirements: "Baccalauréat scientifique",
      pedagogicalObjectives: ["Maîtriser les fondamentaux de l'informatique"],
      careerProspects: ["Développeur", "Analyste"],
      status: "validated",
      responsibleId: "resp1",
      responsibleName: "Dr. Amari",
      lastModifiedBy: "admin",
      validationHistory: [],
      totalECTS: 180,
      modules: [
        {
          id: "mod1",
          name: "Algorithmique",
          code: "INFO101",
          credits: 6,
          coefficient: 2,
          teacher: "Dr. Amrani",
          teacherId: "teacher1",
          type: "presential",
          semester: 1,
          moduleType: "cours",
          pedagogicalAtoms: [
            {
              id: "atom1",
              type: "cours",
              hours: 48,
              totalWeeks: 16,
              groupSize: 120,
              requiresReservation: true
            },
            {
              id: "atom2",
              type: "td",
              hours: 32,
              totalWeeks: 16,
              groupSize: 30,
              requiresReservation: true
            },
            {
              id: "atom3",
              type: "tp",
              hours: 32,
              totalWeeks: 16,
              groupSize: 15,
              requiresReservation: true
            }
          ]
        },
        {
          id: "mod2",
          name: "Stage d'Observation",
          code: "STAGE101",
          credits: 2,
          coefficient: 1,
          teacher: "Dr. Benali",
          teacherId: "teacher2",
          type: "presential",
          semester: 1,
          moduleType: "stage",
          pedagogicalAtoms: [
            {
              id: "atom4",
              type: "stage",
              hours: 35,
              totalWeeks: 1,
              groupSize: 1,
              requiresReservation: false,
              location: 'external'
            }
          ]
        }
      ],
      sections: [
        {
          id: "sect1",
          name: "Section A",
          code: "L1-INFO-A",
          capacity: 120,
          currentEnrollment: 110,
          specialtyId: "spec1",
          groups: [
            { 
              id: "grp1", 
              name: "Groupe 1", 
              code: "G1", 
              sectionId: "sect1", 
              capacity: 30, 
              currentEnrollment: 28,
              type: "td",
              isActive: true,
              createdAt: new Date(),
              updatedAt: new Date()
            },
            { 
              id: "grp2", 
              name: "Groupe 2", 
              code: "G2", 
              sectionId: "sect1", 
              capacity: 30, 
              currentEnrollment: 29,
              type: "td",
              isActive: true,
              createdAt: new Date(),
              updatedAt: new Date()
            }
          ],
          isActive: true,
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ],
      createdAt: new Date(),
      updatedAt: new Date()
    }
  ];

  const createTimetable = () => {
    if (!currentTimetable.name || !currentTimetable.formationId) {
      return;
    }

    const selectedOffer = formationOffers.find(o => o.id === currentTimetable.formationId);
    if (!selectedOffer) return;

    const newTimetable: ManualTimetable = {
      id: Date.now().toString(),
      name: currentTimetable.name!,
      formationId: currentTimetable.formationId!,
      academicYear: currentTimetable.academicYear!,
      semester: currentTimetable.semester!,
      status: 'draft',
      schedules: [],
      createdBy: 'current_user',
      createdAt: new Date(),
      updatedAt: new Date()
    };

    setTimetables([...timetables, newTimetable]);
    setCurrentTimetable({
      status: 'draft',
      semester: 'S1',
      academicYear: '2024-2025'
    });
  };

  const validateTimetable = (timetableId: string) => {
    setTimetables(prev => prev.map(t => 
      t.id === timetableId 
        ? { ...t, status: 'validated', validatedAt: new Date(), validatedBy: 'current_user' }
        : t
    ));
    
    // Ici on génèrerait automatiquement les réservations
    console.log("Génération automatique des réservations pour l'emploi du temps validé");
  };

  const invalidateTimetable = (timetableId: string) => {
    setTimetables(prev => prev.map(t => 
      t.id === timetableId 
        ? { ...t, status: 'invalidated', validatedAt: undefined, validatedBy: undefined }
        : t
    ));
    
    // Ici on supprimerait automatiquement toutes les réservations liées
    console.log("Suppression automatique des réservations pour l'emploi du temps invalidé");
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'draft': return <Badge variant="secondary">Brouillon</Badge>;
      case 'validated': return <Badge className="bg-green-600">Validé</Badge>;
      case 'published': return <Badge className="bg-blue-600">Publié</Badge>;
      case 'invalidated': return <Badge variant="destructive">Invalidé</Badge>;
      default: return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-6 w-6" />
            Création Manuelle d'Emplois du Temps
          </CardTitle>
          <p className="text-slate-600">
            Créez des emplois du temps manuellement avec intégration automatique au système de réservation
          </p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium mb-2">Nom de l'emploi du temps</label>
              <Input
                value={currentTimetable.name || ''}
                onChange={(e) => setCurrentTimetable({ ...currentTimetable, name: e.target.value })}
                placeholder="EDT L1 Informatique S1"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Offre de formation</label>
              <Select 
                value={currentTimetable.formationId || ''} 
                onValueChange={(value) => setCurrentTimetable({ ...currentTimetable, formationId: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Choisir une formation" />
                </SelectTrigger>
                <SelectContent>
                  {formationOffers.map(offer => (
                    <SelectItem key={offer.id} value={offer.id}>
                      {offer.name} ({offer.level})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Semestre</label>
              <Select 
                value={currentTimetable.semester || 'S1'} 
                onValueChange={(value: 'S1' | 'S2') => setCurrentTimetable({ ...currentTimetable, semester: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="S1">Semestre 1</SelectItem>
                  <SelectItem value="S2">Semestre 2</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Année académique</label>
              <Select 
                value={currentTimetable.academicYear || '2024-2025'} 
                onValueChange={(value) => setCurrentTimetable({ ...currentTimetable, academicYear: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="2024-2025">2024-2025</SelectItem>
                  <SelectItem value="2025-2026">2025-2026</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <Button onClick={createTimetable} className="bg-green-600 hover:bg-green-700">
            <Plus className="mr-2 h-4 w-4" />
            Créer l'emploi du temps
          </Button>
        </CardContent>
      </Card>

      {/* Informations sur l'offre sélectionnée */}
      {currentTimetable.formationId && (
        <Card>
          <CardHeader>
            <CardTitle>Détails de l'Offre de Formation</CardTitle>
          </CardHeader>
          <CardContent>
            {(() => {
              const selectedOffer = formationOffers.find(o => o.id === currentTimetable.formationId);
              if (!selectedOffer) return null;

              const presentielModules = selectedOffer.modules.filter(m => m.type === 'presential');
              const distanceModules = selectedOffer.modules.filter(m => m.type === 'distance');

              return (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="text-center p-4 bg-blue-50 rounded-lg">
                      <p className="text-2xl font-bold text-blue-600">{presentielModules.length}</p>
                      <p className="text-sm text-blue-800">Modules Présentiels</p>
                    </div>
                    <div className="text-center p-4 bg-orange-50 rounded-lg">
                      <p className="text-2xl font-bold text-orange-600">{distanceModules.length}</p>
                      <p className="text-sm text-orange-800">Modules À Distance</p>
                    </div>
                    <div className="text-center p-4 bg-purple-50 rounded-lg">
                      <p className="text-2xl font-bold text-purple-600">{selectedOffer.sections.length}</p>
                      <p className="text-sm text-purple-800">Sections</p>
                    </div>
                  </div>

                  <Alert>
                    <CheckCircle2 className="h-4 w-4" />
                    <AlertDescription>
                      <strong>Génération automatique :</strong> Seuls les modules présentiels seront inclus dans l'emploi du temps. 
                      Les modules à distance et les stages externes n'apparaîtront pas.
                    </AlertDescription>
                  </Alert>

                  <div className="space-y-2">
                    <h4 className="font-medium">Modules Présentiels à Planifier :</h4>
                    {presentielModules.map(module => (
                      <div key={module.id} className="flex items-center justify-between p-3 bg-slate-50 rounded border">
                        <div>
                          <span className="font-medium">{module.name}</span>
                          <span className="text-sm text-slate-500 ml-2">({module.code})</span>
                        </div>
                        <div className="flex gap-2">
                          {module.pedagogicalAtoms.filter(atom => atom.requiresReservation).map(atom => (
                            <Badge key={atom.id} variant="outline">
                              {atom.type.toUpperCase()} - {Math.ceil(atom.hours / atom.totalWeeks)}h/sem
                            </Badge>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })()}
          </CardContent>
        </Card>
      )}

      {/* Liste des emplois du temps créés */}
      <Card>
        <CardHeader>
          <CardTitle>Emplois du Temps Créés</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {timetables.map((timetable) => (
              <div key={timetable.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <h3 className="font-semibold">{timetable.name}</h3>
                  <p className="text-sm text-slate-600">
                    {timetable.semester} - {timetable.academicYear} • 
                    Créé le {timetable.createdAt.toLocaleDateString()}
                  </p>
                  {timetable.validatedAt && (
                    <p className="text-sm text-green-600">
                      Validé le {timetable.validatedAt.toLocaleDateString()} par {timetable.validatedBy}
                    </p>
                  )}
                </div>
                
                <div className="flex items-center gap-3">
                  {getStatusBadge(timetable.status)}
                  
                  <div className="flex gap-2">
                    {timetable.status === 'draft' && (
                      <Button
                        size="sm"
                        onClick={() => validateTimetable(timetable.id)}
                        className="bg-green-600 hover:bg-green-700"
                      >
                        <CheckCircle2 className="h-4 w-4 mr-1" />
                        Valider
                      </Button>
                    )}
                    
                    {timetable.status === 'validated' && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => invalidateTimetable(timetable.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <AlertTriangle className="h-4 w-4 mr-1" />
                        Invalider
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            ))}
            
            {timetables.length === 0 && (
              <p className="text-center text-slate-500 py-8">
                Aucun emploi du temps créé pour le moment
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
