
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

interface Props {
  onSubmit: (data: {
    studentName: string;
    studentId: string;
    scholarshipType: string;
    amount: number;
    documents: File[];
  }) => void;
  onCancel: () => void;
}

const TYPES = [
  "Mérite Académique",
  "Besoin Social",
  "Excellence Sportive",
  "Recherche"
];

export function NewScholarshipApplicationForm({ onSubmit, onCancel }: Props) {
  const { toast } = useToast();
  const [studentName, setStudentName] = useState("");
  const [studentId, setStudentId] = useState("");
  const [scholarshipType, setScholarshipType] = useState(TYPES[0]);
  const [amount, setAmount] = useState("");
  const [documents, setDocuments] = useState<File[]>([]);

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (!e.target.files) return;
    setDocuments(Array.from(e.target.files));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!studentName || !studentId || !scholarshipType || !amount) {
      toast({ title: "Erreur", description: "Tous les champs sont requis." });
      return;
    }
    onSubmit({
      studentName,
      studentId,
      scholarshipType,
      amount: Number(amount),
      documents,
    });
    toast({ title: "Candidature ajoutée", description: "Soumise avec succès (fictif)" });
  }

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      <div>
        <Label>Nom Étudiant</Label>
        <Input value={studentName} onChange={e => setStudentName(e.target.value)} required />
      </div>
      <div>
        <Label>Numéro Étudiant</Label>
        <Input value={studentId} onChange={e => setStudentId(e.target.value)} required />
      </div>
      <div>
        <Label>Type de Bourse</Label>
        <Select value={scholarshipType} onValueChange={setScholarshipType}>
          <SelectTrigger>
            <SelectValue placeholder="Choisir..." />
          </SelectTrigger>
          <SelectContent>
            {TYPES.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label>Montant sollicité (€)</Label>
        <Input type="number" min={0} value={amount} onChange={e => setAmount(e.target.value)} required />
      </div>
      <div>
        <Label>Pièces jointes</Label>
        <Input type="file" multiple onChange={handleFileChange} />
        <div className="text-xs text-muted-foreground mt-1">
          {documents.length > 0 && documents.map((f, i) => (
            <div key={i}>{f.name}</div>
          ))}
        </div>
      </div>
      <div className="flex gap-2 justify-end">
        <Button variant="outline" type="button" onClick={onCancel}>
          Annuler
        </Button>
        <Button type="submit">Valider</Button>
      </div>
    </form>
  );
}
