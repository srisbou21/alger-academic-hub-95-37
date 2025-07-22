
import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Calendar, FileText, GraduationCap, User, Users, Building } from "lucide-react";
import { personalFileService } from "@/services/personalFileService";

interface Props {
  onSubmit: (data: {
    applicantType: 'enseignant' | 'personnel_administratif' | 'etudiant';
    selectedApplicant?: any;
    studentInfo?: {
      nomArabe: string;
      nomFrancais: string;
      prenomArabe: string;
      prenomFrancais: string;
      matricule: string;
      dateNaissance: string;
      lieuNaissanceArabe: string;
      lieuNaissanceFrancais: string;
      niveauEtude: string;
      moyenneAnneeActuelle: number;
    };
    destinationVoulue: string;
    universiteReceptrice: string;
    beneficiePrecedente: boolean;
    consommePrecedente?: boolean;
    derniereAnneeBourse?: string;
    documents: File[];
    planProjet: string;
    objectifs: string;
  }) => void;
  onCancel: () => void;
}

const NIVEAUX_ETUDE = [
  "Licence 1",
  "Licence 2", 
  "Licence 3",
  "Master 1",
  "Master 2",
  "Doctorat",
  "Post-Doctorat"
];

export function NewScholarshipApplicationForm({ onSubmit, onCancel }: Props) {
  const { toast } = useToast();
  
  // Type de candidat
  const [applicantType, setApplicantType] = useState<'enseignant' | 'personnel_administratif' | 'etudiant'>('enseignant');
  const [selectedApplicant, setSelectedApplicant] = useState<any>(null);
  const [enseignants, setEnseignants] = useState<any[]>([]);
  const [personnel, setPersonnel] = useState<any[]>([]);
  
  // Informations étudiant
  const [nomArabe, setNomArabe] = useState("");
  const [nomFrancais, setNomFrancais] = useState("");
  const [prenomArabe, setPrenomArabe] = useState("");
  const [prenomFrancais, setPrenomFrancais] = useState("");
  const [matricule, setMatricule] = useState("");
  const [dateNaissance, setDateNaissance] = useState("");
  const [lieuNaissanceArabe, setLieuNaissanceArabe] = useState("");
  const [lieuNaissanceFrancais, setLieuNaissanceFrancais] = useState("");
  const [niveauEtude, setNiveauEtude] = useState(NIVEAUX_ETUDE[0]);
  const [moyenneAnneeActuelle, setMoyenneAnneeActuelle] = useState("");
  
  // Informations communes
  const [destinationVoulue, setDestinationVoulue] = useState("");
  const [universiteReceptrice, setUniversiteReceptrice] = useState("");
  const [beneficiePrecedente, setBeneficiePrecedente] = useState<boolean | null>(null);
  const [consommePrecedente, setConsommePrecedente] = useState<boolean | null>(null);
  const [derniereAnneeBourse, setDerniereAnneeBourse] = useState("");
  const [planProjet, setPlanProjet] = useState("");
  const [objectifs, setObjectifs] = useState("");
  const [documents, setDocuments] = useState<File[]>([]);

  useEffect(() => {
    loadPersonnelData();
  }, []);

  async function loadPersonnelData() {
    try {
      const files = await personalFileService.getAllPersonalFiles();
      const enseignantsData = files.filter(f => f.employeeType === 'enseignant');
      const personnelData = files.filter(f => f.employeeType === 'administratif');
      setEnseignants(enseignantsData);
      setPersonnel(personnelData);
    } catch (error) {
      console.error('Erreur lors du chargement des données:', error);
    }
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (!e.target.files) return;
    setDocuments(Array.from(e.target.files));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    
    // Validation des champs obligatoires
    if (applicantType !== 'etudiant' && !selectedApplicant) {
      toast({ title: "Erreur", description: "Veuillez sélectionner un candidat." });
      return;
    }
    
    if (applicantType === 'etudiant') {
      if (!nomArabe || !nomFrancais || !prenomArabe || !prenomFrancais || !matricule || !dateNaissance || !lieuNaissanceArabe || !lieuNaissanceFrancais || !niveauEtude || !moyenneAnneeActuelle) {
        toast({ title: "Erreur", description: "Tous les champs étudiants sont requis." });
        return;
      }
    }
    
    if (!destinationVoulue || !universiteReceptrice || beneficiePrecedente === null || !planProjet || !objectifs) {
      toast({ title: "Erreur", description: "Tous les champs communs sont requis." });
      return;
    }

    if (beneficiePrecedente && consommePrecedente === null) {
      toast({ title: "Erreur", description: "Veuillez indiquer si vous avez consommé la bourse précédente." });
      return;
    }

    if (!beneficiePrecedente && !derniereAnneeBourse) {
      toast({ title: "Erreur", description: "Veuillez indiquer la dernière année de bourse." });
      return;
    }

    const studentInfo = applicantType === 'etudiant' ? {
      nomArabe,
      nomFrancais,
      prenomArabe,
      prenomFrancais,
      matricule,
      dateNaissance,
      lieuNaissanceArabe,
      lieuNaissanceFrancais,
      niveauEtude,
      moyenneAnneeActuelle: Number(moyenneAnneeActuelle)
    } : undefined;

    onSubmit({
      applicantType,
      selectedApplicant,
      studentInfo,
      destinationVoulue,
      universiteReceptrice,
      beneficiePrecedente,
      consommePrecedente,
      derniereAnneeBourse,
      documents,
      planProjet,
      objectifs
    });
    
    toast({ title: "Candidature ajoutée", description: "Soumise avec succès" });
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
          Nouvelle Candidature de Bourse
        </h1>
        <p className="text-muted-foreground">Remplissez tous les champs pour soumettre votre candidature</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Section 1: Type de candidat */}
        <Card className="border-2 border-primary/20 shadow-lg">
          <CardHeader className="bg-gradient-to-r from-primary/5 to-primary/10">
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5 text-primary" />
              Type de Candidat
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <RadioGroup value={applicantType} onValueChange={(value: any) => setApplicantType(value)}>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex items-center space-x-2 p-4 border rounded-lg hover:bg-accent transition-colors">
                  <RadioGroupItem value="enseignant" id="enseignant" />
                  <Label htmlFor="enseignant" className="flex items-center gap-2 cursor-pointer">
                    <GraduationCap className="h-4 w-4" />
                    Enseignant
                  </Label>
                </div>
                <div className="flex items-center space-x-2 p-4 border rounded-lg hover:bg-accent transition-colors">
                  <RadioGroupItem value="personnel_administratif" id="personnel" />
                  <Label htmlFor="personnel" className="flex items-center gap-2 cursor-pointer">
                    <Users className="h-4 w-4" />
                    Personnel Administratif
                  </Label>
                </div>
                <div className="flex items-center space-x-2 p-4 border rounded-lg hover:bg-accent transition-colors">
                  <RadioGroupItem value="etudiant" id="etudiant" />
                  <Label htmlFor="etudiant" className="flex items-center gap-2 cursor-pointer">
                    <User className="h-4 w-4" />
                    Étudiant
                  </Label>
                </div>
              </div>
            </RadioGroup>
          </CardContent>
        </Card>

        {/* Section 2: Sélection candidat ou informations étudiant */}
        {applicantType !== 'etudiant' ? (
          <Card className="border-2 border-secondary/20 shadow-lg">
            <CardHeader className="bg-gradient-to-r from-secondary/5 to-secondary/10">
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5 text-secondary" />
                Sélection du {applicantType === 'enseignant' ? 'Enseignant' : 'Personnel Administratif'}
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <Select onValueChange={(value) => {
                const data = applicantType === 'enseignant' ? enseignants : personnel;
                setSelectedApplicant(data.find(p => p.id === value));
              }}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder={`Sélectionner un ${applicantType === 'enseignant' ? 'enseignant' : 'personnel administratif'}...`} />
                </SelectTrigger>
                <SelectContent>
                  {(applicantType === 'enseignant' ? enseignants : personnel).map((person) => (
                    <SelectItem key={person.id} value={person.id}>
                      {person.employeeName} - {person.professionalInfo.department}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {selectedApplicant && (
                <div className="mt-4 p-4 bg-accent/50 rounded-lg">
                  <h4 className="font-semibold">{selectedApplicant.employeeName}</h4>
                  <p className="text-sm text-muted-foreground">
                    {selectedApplicant.professionalInfo.currentPosition} - {selectedApplicant.professionalInfo.department}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        ) : (
          <Card className="border-2 border-accent/20 shadow-lg">
            <CardHeader className="bg-gradient-to-r from-accent/5 to-accent/10">
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5 text-accent" />
                Informations Étudiant
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="nomArabe">Nom (Arabe) *</Label>
                  <Input id="nomArabe" value={nomArabe} onChange={e => setNomArabe(e.target.value)} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="nomFrancais">Nom (Français) *</Label>
                  <Input id="nomFrancais" value={nomFrancais} onChange={e => setNomFrancais(e.target.value)} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="prenomArabe">Prénom (Arabe) *</Label>
                  <Input id="prenomArabe" value={prenomArabe} onChange={e => setPrenomArabe(e.target.value)} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="prenomFrancais">Prénom (Français) *</Label>
                  <Input id="prenomFrancais" value={prenomFrancais} onChange={e => setPrenomFrancais(e.target.value)} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="matricule">Matricule *</Label>
                  <Input id="matricule" value={matricule} onChange={e => setMatricule(e.target.value)} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="dateNaissance">Date de Naissance *</Label>
                  <Input id="dateNaissance" type="date" value={dateNaissance} onChange={e => setDateNaissance(e.target.value)} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lieuNaissanceArabe">Lieu de Naissance (Arabe) *</Label>
                  <Input id="lieuNaissanceArabe" value={lieuNaissanceArabe} onChange={e => setLieuNaissanceArabe(e.target.value)} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lieuNaissanceFrancais">Lieu de Naissance (Français) *</Label>
                  <Input id="lieuNaissanceFrancais" value={lieuNaissanceFrancais} onChange={e => setLieuNaissanceFrancais(e.target.value)} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="niveauEtude">Niveau d'Étude *</Label>
                  <Select value={niveauEtude} onValueChange={setNiveauEtude}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {NIVEAUX_ETUDE.map(niveau => (
                        <SelectItem key={niveau} value={niveau}>{niveau}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="moyenne">Moyenne Année Actuelle *</Label>
                  <Input 
                    id="moyenne" 
                    type="number" 
                    min="0" 
                    max="20" 
                    step="0.01"
                    value={moyenneAnneeActuelle} 
                    onChange={e => setMoyenneAnneeActuelle(e.target.value)} 
                    required 
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Section 3: Informations communes */}
        <Card className="border-2 border-green-200 shadow-lg">
          <CardHeader className="bg-gradient-to-r from-green-50 to-green-100">
            <CardTitle className="flex items-center gap-2">
              <Building className="h-5 w-5 text-green-600" />
              Informations de la Bourse
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="destination">Destination Voulue *</Label>
                <Input id="destination" value={destinationVoulue} onChange={e => setDestinationVoulue(e.target.value)} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="universite">Université Réceptrice *</Label>
                <Input id="universite" value={universiteReceptrice} onChange={e => setUniversiteReceptrice(e.target.value)} required />
              </div>
            </div>

            <Separator />

            <div className="space-y-4">
              <Label className="text-base font-semibold">Avez-vous bénéficié d'une bourse l'année précédente ? *</Label>
              <RadioGroup value={beneficiePrecedente?.toString()} onValueChange={(value) => setBeneficiePrecedente(value === 'true')}>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="true" id="beneficie-oui" />
                  <Label htmlFor="beneficie-oui">Oui</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="false" id="beneficie-non" />
                  <Label htmlFor="beneficie-non">Non</Label>
                </div>
              </RadioGroup>

              {beneficiePrecedente === true && (
                <div className="ml-6 space-y-4">
                  <Label className="text-base font-semibold">Avez-vous consommé la bourse précédente ? *</Label>
                  <RadioGroup value={consommePrecedente?.toString()} onValueChange={(value) => setConsommePrecedente(value === 'true')}>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="true" id="consomme-oui" />
                      <Label htmlFor="consomme-oui">Oui</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="false" id="consomme-non" />
                      <Label htmlFor="consomme-non">Non</Label>
                    </div>
                  </RadioGroup>
                </div>
              )}

              {beneficiePrecedente === false && (
                <div className="ml-6 space-y-2">
                  <Label htmlFor="derniereAnnee">Quelle est la dernière année où vous avez bénéficié d'une bourse ? *</Label>
                  <Input 
                    id="derniereAnnee" 
                    type="number" 
                    min="1900" 
                    max={new Date().getFullYear()} 
                    value={derniereAnneeBourse} 
                    onChange={e => setDerniereAnneeBourse(e.target.value)} 
                    required 
                  />
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Section 4: Projet et Documents */}
        <Card className="border-2 border-blue-200 shadow-lg">
          <CardHeader className="bg-gradient-to-r from-blue-50 to-blue-100">
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-blue-600" />
              Plan du Projet et Documents
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="planProjet">Plan du Projet *</Label>
              <Textarea 
                id="planProjet" 
                value={planProjet} 
                onChange={e => setPlanProjet(e.target.value)} 
                placeholder="Décrivez votre plan de projet détaillé..."
                className="min-h-[120px]"
                required 
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="objectifs">Objectifs du Projet *</Label>
              <Textarea 
                id="objectifs" 
                value={objectifs} 
                onChange={e => setObjectifs(e.target.value)} 
                placeholder="Décrivez les objectifs de votre projet..."
                className="min-h-[120px]"
                required 
              />
            </div>
            <div className="space-y-2">
              <Label>Documents Joints</Label>
              <Input type="file" multiple onChange={handleFileChange} className="file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-primary file:text-primary-foreground hover:file:bg-primary/90" />
              {documents.length > 0 && (
                <div className="mt-3 p-3 bg-accent/50 rounded-lg">
                  <p className="font-semibold text-sm mb-2">Fichiers sélectionnés :</p>
                  {documents.map((file, index) => (
                    <div key={index} className="text-sm text-muted-foreground flex items-center gap-2">
                      <FileText className="h-4 w-4" />
                      {file.name} ({Math.round(file.size / 1024)} KB)
                    </div>
                  ))}
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Boutons d'action */}
        <div className="flex gap-4 justify-end pt-6">
          <Button variant="outline" type="button" onClick={onCancel} className="px-8">
            Annuler
          </Button>
          <Button type="submit" className="px-8 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70">
            Soumettre la Candidature
          </Button>
        </div>
      </form>
    </div>
  );
}
