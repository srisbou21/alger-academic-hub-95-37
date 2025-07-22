
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { FileText, Upload, Calendar, AlertTriangle } from "lucide-react";
import { useState } from "react";

export const AbsenceRequestForm = () => {
  const [formData, setFormData] = useState({
    startDate: "",
    endDate: "",
    reason: "",
    customReason: "",
    description: "",
    replacement: false,
    proposedReplacement: "",
    urgency: "normal",
    courses: [] as string[]
  });

  const reasons = [
    "Maladie",
    "Congé personnel",
    "Formation professionnelle",
    "Mission officielle",
    "Congé maternité/paternité",
    "Évènement familial",
    "Autre"
  ];

  const courses = [
    { id: "C001", name: "Microéconomie L3 - Groupe A", date: "2024-06-20", time: "08:00-10:00" },
    { id: "C002", name: "Statistiques L2 - Groupe B", date: "2024-06-20", time: "14:00-16:00" },
    { id: "C003", name: "Économie générale L1", date: "2024-06-21", time: "10:00-12:00" },
    { id: "C004", name: "Microéconomie L3 - Groupe B", date: "2024-06-21", time: "14:00-16:00" }
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Demande d'absence soumise:", formData);
    // Ici, logique de soumission
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Nouvelle Demande d'Absence</h2>
          <p className="text-slate-600">Formulaire de demande d'absence avec gestion automatique</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Informations générales */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Informations Générales
              </CardTitle>
              <CardDescription>Détails de votre absence</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="startDate">Date de début</Label>
                  <Input
                    id="startDate"
                    type="date"
                    value={formData.startDate}
                    onChange={(e) => setFormData(prev => ({ ...prev, startDate: e.target.value }))}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="endDate">Date de fin</Label>
                  <Input
                    id="endDate"
                    type="date"
                    value={formData.endDate}
                    onChange={(e) => setFormData(prev => ({ ...prev, endDate: e.target.value }))}
                    required
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="reason">Motif de l'absence</Label>
                <Select value={formData.reason} onValueChange={(value) => setFormData(prev => ({ ...prev, reason: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner un motif" />
                  </SelectTrigger>
                  <SelectContent>
                    {reasons.map((reason) => (
                      <SelectItem key={reason} value={reason}>
                        {reason}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {formData.reason === "Autre" && (
                <div>
                  <Label htmlFor="customReason">Préciser le motif</Label>
                  <Input
                    id="customReason"
                    value={formData.customReason}
                    onChange={(e) => setFormData(prev => ({ ...prev, customReason: e.target.value }))}
                    placeholder="Veuillez préciser..."
                  />
                </div>
              )}

              <div>
                <Label htmlFor="description">Description détaillée</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Description optionnelle..."
                  rows={3}
                />
              </div>

              <div>
                <Label htmlFor="urgency">Niveau d'urgence</Label>
                <Select value={formData.urgency} onValueChange={(value) => setFormData(prev => ({ ...prev, urgency: value }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Faible</SelectItem>
                    <SelectItem value="normal">Normal</SelectItem>
                    <SelectItem value="high">Élevé</SelectItem>
                    <SelectItem value="urgent">Urgent</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Cours concernés et remplacement */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Cours Concernés
              </CardTitle>
              <CardDescription>Sélectionnez les cours affectés</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                {courses
                  .filter(course => {
                    const courseDate = new Date(course.date);
                    const start = new Date(formData.startDate);
                    const end = new Date(formData.endDate);
                    return courseDate >= start && courseDate <= end;
                  })
                  .map((course) => (
                    <div key={course.id} className="flex items-center space-x-2 p-3 border border-slate-200 rounded-lg">
                      <Checkbox
                        id={course.id}
                        checked={formData.courses.includes(course.id)}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setFormData(prev => ({ ...prev, courses: [...prev.courses, course.id] }));
                          } else {
                            setFormData(prev => ({ ...prev, courses: prev.courses.filter(c => c !== course.id) }));
                          }
                        }}
                      />
                      <div className="flex-1">
                        <Label htmlFor={course.id} className="font-medium cursor-pointer">
                          {course.name}
                        </Label>
                        <p className="text-sm text-slate-600">
                          {new Date(course.date).toLocaleDateString('fr-FR')} - {course.time}
                        </p>
                      </div>
                    </div>
                  ))}
              </div>

              {formData.courses.length === 0 && formData.startDate && formData.endDate && (
                <div className="text-center py-4 text-slate-500">
                  <AlertTriangle className="h-8 w-8 mx-auto mb-2" />
                  <p>Aucun cours programmé sur cette période</p>
                </div>
              )}

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="replacement"
                  checked={formData.replacement}
                  onCheckedChange={(checked) => setFormData(prev => ({ ...prev, replacement: checked as boolean }))}
                />
                <Label htmlFor="replacement">Je propose un remplacement</Label>
              </div>

              {formData.replacement && (
                <div>
                  <Label htmlFor="proposedReplacement">Enseignant proposé</Label>
                  <Input
                    id="proposedReplacement"
                    value={formData.proposedReplacement}
                    onChange={(e) => setFormData(prev => ({ ...prev, proposedReplacement: e.target.value }))}
                    placeholder="Nom de l'enseignant remplaçant"
                  />
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Documents justificatifs */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Upload className="h-5 w-5" />
              Documents Justificatifs
            </CardTitle>
            <CardDescription>Ajoutez vos pièces justificatives (optionnel)</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="border-2 border-dashed border-slate-300 rounded-lg p-6 text-center">
              <Upload className="h-8 w-8 text-slate-400 mx-auto mb-2" />
              <p className="text-slate-600 mb-2">Glissez vos fichiers ici ou cliquez pour sélectionner</p>
              <p className="text-sm text-slate-500">PDF, JPG, PNG - Taille max: 10MB</p>
              <Button variant="outline" className="mt-2">
                Choisir des fichiers
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex justify-end gap-4">
          <Button variant="outline" type="button">
            Sauvegarder en brouillon
          </Button>
          <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
            Soumettre la demande
          </Button>
        </div>
      </form>
    </div>
  );
};
