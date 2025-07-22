
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { 
  History, 
  GitBranch, 
  GitCompare, 
  Eye,
  ArrowRight,
  Calendar,
  User,
  FileText
} from "lucide-react";
import { FormationOffer, FormationVersion } from "../../../types/academic";

interface FormationVersionManagerProps {
  formations: FormationOffer[];
  onUpdateFormation: (formation: FormationOffer) => void;
}

export const FormationVersionManager = ({ formations, onUpdateFormation }: FormationVersionManagerProps) => {
  const [selectedFormationId, setSelectedFormationId] = useState("");
  const [versions] = useState<FormationVersion[]>([
    {
      id: "v1",
      formationId: "form1",
      version: 1,
      changes: ["Création initiale de la formation"],
      createdAt: new Date('2024-01-15'),
      createdBy: "Dr. Ahmed Benali",
      status: "archived"
    },
    {
      id: "v2", 
      formationId: "form1",
      version: 2,
      changes: [
        "Ajout du module 'Intelligence Artificielle'",
        "Modification des prérequis pour le semestre 4",
        "Augmentation de la capacité d'accueil"
      ],
      createdAt: new Date('2024-03-10'),
      createdBy: "Pr. Sarah Amari",
      status: "active"
    }
  ]);

  const selectedFormation = formations.find(f => f.id === selectedFormationId);
  const formationVersions = versions.filter(v => v.formationId === selectedFormationId);

  const createNewVersion = (formationId: string) => {
    const formation = formations.find(f => f.id === formationId);
    if (!formation) return;

    // Create a new version
    const newVersion: FormationVersion = {
      id: Date.now().toString(),
      formationId,
      version: formationVersions.length + 1,
      changes: ["Nouvelle version créée"],
      createdAt: new Date(),
      createdBy: "Utilisateur actuel",
      status: "draft"
    };

    console.log("Nouvelle version créée:", newVersion);
    // In real implementation, this would be handled by the parent component
  };

  const compareVersions = (version1: FormationVersion, version2: FormationVersion) => {
    console.log("Comparaison des versions:", version1.version, "vs", version2.version);
    // Implementation for version comparison
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'draft': return <Badge variant="secondary">Brouillon</Badge>;
      case 'active': return <Badge className="bg-green-600">Active</Badge>;
      case 'archived': return <Badge variant="outline">Archivée</Badge>;
      default: return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <History className="h-5 w-5" />
            Gestion des Versions de Formation
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-6">
            <label className="block text-sm font-medium mb-2">Formation</label>
            <Select value={selectedFormationId} onValueChange={setSelectedFormationId}>
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner une formation" />
              </SelectTrigger>
              <SelectContent>
                {formations.map(formation => (
                  <SelectItem key={formation.id} value={formation.id}>
                    {formation.name} ({formation.academicYear})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {selectedFormation && (
            <div className="flex gap-2">
              <Button 
                onClick={() => createNewVersion(selectedFormation.id)}
                className="bg-blue-600 hover:bg-blue-700"
              >
                <GitBranch className="mr-2 h-4 w-4" />
                Créer une Nouvelle Version
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {selectedFormation && formationVersions.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Historique des Versions - {selectedFormation.name}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {formationVersions.map((version, index) => (
                <div key={version.id} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-2">
                        <GitBranch className="h-4 w-4 text-slate-500" />
                        <span className="font-semibold">Version {version.version}</span>
                      </div>
                      {getStatusBadge(version.status)}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-slate-500">
                      <Calendar className="h-4 w-4" />
                      <span>{version.createdAt.toLocaleDateString()}</span>
                      <User className="h-4 w-4 ml-2" />
                      <span>{version.createdBy}</span>
                    </div>
                  </div>

                  <div className="mb-4">
                    <h4 className="text-sm font-medium mb-2">Modifications apportées :</h4>
                    <ul className="text-sm text-slate-600 space-y-1">
                      {version.changes.map((change, changeIndex) => (
                        <li key={changeIndex} className="flex items-start gap-2">
                          <ArrowRight className="h-3 w-3 mt-1 text-blue-500 flex-shrink-0" />
                          <span>{change}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="flex gap-2">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button size="sm" variant="outline">
                          <Eye className="h-4 w-4 mr-1" />
                          Détails
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-2xl">
                        <DialogHeader>
                          <DialogTitle>Détails de la Version {version.version}</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <label className="text-sm font-medium text-slate-700">Date de création</label>
                              <p className="text-sm text-slate-600">{version.createdAt.toLocaleDateString()}</p>
                            </div>
                            <div>
                              <label className="text-sm font-medium text-slate-700">Créée par</label>
                              <p className="text-sm text-slate-600">{version.createdBy}</p>
                            </div>
                          </div>
                          <div>
                            <label className="text-sm font-medium text-slate-700">Statut</label>
                            <div className="mt-1">{getStatusBadge(version.status)}</div>
                          </div>
                          <div>
                            <label className="text-sm font-medium text-slate-700">Modifications</label>
                            <ul className="mt-2 space-y-2">
                              {version.changes.map((change, changeIndex) => (
                                <li key={changeIndex} className="text-sm text-slate-600 flex items-start gap-2">
                                  <FileText className="h-4 w-4 mt-0.5 text-blue-500 flex-shrink-0" />
                                  <span>{change}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>

                    {index < formationVersions.length - 1 && (
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => compareVersions(version, formationVersions[index + 1])}
                      >
                        <GitCompare className="h-4 w-4 mr-1" />
                        Comparer
                      </Button>
                    )}

                    {version.status === 'draft' && (
                      <Button 
                        size="sm" 
                        className="bg-green-600 hover:bg-green-700"
                      >
                        Activer
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {selectedFormation && formationVersions.length === 0 && (
        <Card>
          <CardContent className="text-center py-8">
            <History className="h-12 w-12 text-slate-400 mx-auto mb-4" />
            <p className="text-slate-500">Aucune version disponible pour cette formation</p>
          </CardContent> 
        </Card>
      )}
    </div>
  );
};
