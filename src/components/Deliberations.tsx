
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Users, FileText, Check, X, Clock, Archive, Download, Eye, MessageSquare } from "lucide-react";

interface DeliberationCase {
  id: string;
  studentId: string;
  studentName: string;
  currentAverage: number;
  situation: string;
  recommendation: string;
  status: "pending" | "approved" | "rejected" | "discussion";
  votes: { member: string; vote: "approve" | "reject" | "abstain"; comment?: string }[];
  finalDecision?: string;
  decisionDate?: string;
  discussionPoints: string[];
}

interface DeliberationSession {
  id: string;
  name: string;
  date: string;
  promotion: string;
  status: "draft" | "active" | "completed" | "archived";
  members: string[];
  cases: DeliberationCase[];
}

export const Deliberations = () => {
  const { toast } = useToast();
  const [selectedSession, setSelectedSession] = useState("");
  const [activeCase, setActiveCase] = useState<DeliberationCase | null>(null);
  const [newComment, setNewComment] = useState("");
  const [selectedMember, setSelectedMember] = useState("Prof. Martin Durand");

  // Données de test
  const [sessions] = useState<DeliberationSession[]>([
    {
      id: "1",
      name: "Délibération L3 Économie - Session 1",
      date: "2024-01-20",
      promotion: "L3 Économie",
      status: "active",
      members: ["Prof. Martin Durand", "Dr. Sarah Leblanc", "Prof. Ahmed Benali", "Dr. Marie Petit"],
      cases: [
        {
          id: "c1",
          studentId: "20230001",
          studentName: "Amina Benali",
          currentAverage: 9.75,
          situation: "Moyenne générale légèrement inférieure à 10, mais excellent travail en stage",
          recommendation: "Admission avec mention du stage exceptionnel",
          status: "discussion",
          votes: [
            { member: "Prof. Martin Durand", vote: "approve", comment: "Stage exemplaire, potentiel confirmé" },
            { member: "Dr. Sarah Leblanc", vote: "approve" }
          ],
          discussionPoints: [
            "Excellente évaluation de stage (18/20)",
            "Progression constante au cours du semestre",
            "Difficultés ponctuelles en statistiques compensées"
          ]
        },
        {
          id: "c2",
          studentId: "20230007",
          studentName: "Omar Zidane",
          currentAverage: 8.25,
          situation: "Moyenne insuffisante, plusieurs absences non justifiées",
          recommendation: "Redoublement conseillé",
          status: "pending",
          votes: [],
          discussionPoints: [
            "Taux d'absentéisme élevé (>30%)",
            "Difficultés récurrentes en matières fondamentales",
            "Manque d'investissement personnel"
          ]
        }
      ]
    }
  ]);

  const [deliberationMinutes, setDeliberationMinutes] = useState({
    sessionId: "1",
    date: "2024-01-20",
    startTime: "14:00",
    endTime: "17:30",
    attendees: ["Prof. Martin Durand", "Dr. Sarah Leblanc", "Prof. Ahmed Benali", "Dr. Marie Petit"],
    decisions: [] as any[]
  });

  const currentSession = sessions.find(s => s.id === selectedSession);

  const handleVote = (caseId: string, vote: "approve" | "reject" | "abstain") => {
    if (!selectedMember) return;

    toast({
      title: "Vote enregistré",
      description: `Votre vote "${vote}" a été enregistré pour ${selectedMember}`
    });
  };

  const finalizeDecision = (caseId: string, decision: string) => {
    toast({
      title: "Décision finalisée",
      description: "La décision a été enregistrée et horodatée"
    });
  };

  const generatePV = () => {
    toast({
      title: "PV généré",
      description: "Le procès-verbal de délibération a été généré automatiquement"
    });
  };

  const archiveSession = () => {
    toast({
      title: "Session archivée",
      description: "La session de délibération a été archivée avec horodatage"
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "approved": return "bg-emerald-100 text-emerald-800 border-emerald-200";
      case "rejected": return "bg-red-100 text-red-800 border-red-200";
      case "discussion": return "bg-amber-100 text-amber-800 border-amber-200";
      default: return "bg-slate-100 text-slate-800 border-slate-200";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "approved": return <Check className="h-3 w-3" />;
      case "rejected": return <X className="h-3 w-3" />;
      case "discussion": return <MessageSquare className="h-3 w-3" />;
      default: return <Clock className="h-3 w-3" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="mb-6">
        <h2 className="text-3xl font-bold text-slate-800 mb-2">Délibérations</h2>
        <p className="text-slate-600">
          Interface numérique pour les délibérations collégiales et la génération des PV
        </p>
      </div>

      {/* Sélection de session */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Session de Délibération
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>Session</Label>
              <Select value={selectedSession} onValueChange={setSelectedSession}>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner une session" />
                </SelectTrigger>
                <SelectContent>
                  {sessions.map(session => (
                    <SelectItem key={session.id} value={session.id}>
                      {session.name} - {session.date}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label>Membre connecté</Label>
              <Select value={selectedMember} onValueChange={setSelectedMember}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {currentSession?.members.map(member => (
                    <SelectItem key={member} value={member}>{member}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {currentSession && (
            <div className="flex flex-wrap gap-2">
              <Button onClick={generatePV} className="bg-blue-600 hover:bg-blue-700">
                <FileText className="h-4 w-4 mr-2" />
                Générer PV
              </Button>
              <Button onClick={archiveSession} variant="outline">
                <Archive className="h-4 w-4 mr-2" />
                Archiver Session
              </Button>
              <Button variant="outline">
                <Download className="h-4 w-4 mr-2" />
                Exporter Dossiers
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Informations de session */}
      {currentSession && (
        <Card>
          <CardHeader>
            <CardTitle>Informations de la Session</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <div className="font-medium text-slate-700">Promotion</div>
                <div className="text-lg">{currentSession.promotion}</div>
              </div>
              <div>
                <div className="font-medium text-slate-700">Date</div>
                <div className="text-lg">{currentSession.date}</div>
              </div>
              <div>
                <div className="font-medium text-slate-700">Statut</div>
                <Badge className={getStatusColor(currentSession.status)}>
                  {currentSession.status}
                </Badge>
              </div>
            </div>
            
            <div className="mt-4">
              <div className="font-medium text-slate-700 mb-2">Membres présents</div>
              <div className="flex flex-wrap gap-2">
                {currentSession.members.map(member => (
                  <Badge key={member} variant="outline">{member}</Badge>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Cas de délibération */}
      {currentSession && (
        <Card>
          <CardHeader>
            <CardTitle>Dossiers à Délibérer</CardTitle>
            <CardDescription>
              {currentSession.cases.length} dossier(s) préparé(s) automatiquement
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Étudiant</TableHead>
                    <TableHead>Moyenne</TableHead>
                    <TableHead>Situation</TableHead>
                    <TableHead>Votes</TableHead>
                    <TableHead>Statut</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {currentSession.cases.map((case_) => (
                    <TableRow key={case_.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{case_.studentName}</div>
                          <div className="text-sm text-slate-500">{case_.studentId}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-lg font-bold">
                          {case_.currentAverage.toFixed(2)}/20
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="max-w-xs truncate" title={case_.situation}>
                          {case_.situation}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <span className="text-sm">{case_.votes.length}/{currentSession.members.length}</span>
                          <div className="flex gap-1">
                            {case_.votes.filter(v => v.vote === "approve").length > 0 && (
                              <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                            )}
                            {case_.votes.filter(v => v.vote === "reject").length > 0 && (
                              <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                            )}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(case_.status)}>
                          {getStatusIcon(case_.status)}
                          <span className="ml-1 capitalize">{case_.status}</span>
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button 
                                size="sm" 
                                variant="outline"
                                onClick={() => setActiveCase(case_)}
                              >
                                <Eye className="h-3 w-3 mr-1" />
                                Voir
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-4xl">
                              <DialogHeader>
                                <DialogTitle>Délibération - {case_.studentName}</DialogTitle>
                                <DialogDescription>
                                  Dossier détaillé et interface de vote
                                </DialogDescription>
                              </DialogHeader>
                              
                              <div className="space-y-6">
                                {/* Informations étudiant */}
                                <div className="grid grid-cols-2 gap-4">
                                  <div>
                                    <Label>Situation académique</Label>
                                    <p className="text-sm mt-1">{case_.situation}</p>
                                  </div>
                                  <div>
                                    <Label>Recommandation</Label>
                                    <p className="text-sm mt-1">{case_.recommendation}</p>
                                  </div>
                                </div>

                                {/* Points de discussion */}
                                <div>
                                  <Label>Points de discussion</Label>
                                  <div className="mt-2 space-y-1">
                                    {case_.discussionPoints.map((point, index) => (
                                      <div key={index} className="text-sm p-2 bg-slate-50 rounded">
                                        • {point}
                                      </div>
                                    ))}
                                  </div>
                                </div>

                                {/* Votes existants */}
                                <div>
                                  <Label>Votes enregistrés</Label>
                                  <div className="mt-2 space-y-2">
                                    {case_.votes.map((vote, index) => (
                                      <div key={index} className="flex items-center justify-between p-2 border rounded">
                                        <span className="font-medium">{vote.member}</span>
                                        <div className="flex items-center gap-2">
                                          <Badge className={getStatusColor(vote.vote === "approve" ? "approved" : "rejected")}>
                                            {vote.vote}
                                          </Badge>
                                          {vote.comment && (
                                            <span className="text-sm text-slate-600">"{vote.comment}"</span>
                                          )}
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                </div>

                                {/* Interface de vote */}
                                <div className="border-t pt-4">
                                  <Label>Votre vote ({selectedMember})</Label>
                                  <div className="flex gap-2 mt-2">
                                    <Button 
                                      size="sm" 
                                      onClick={() => handleVote(case_.id, "approve")}
                                      className="bg-emerald-600 hover:bg-emerald-700"
                                    >
                                      <Check className="h-3 w-3 mr-1" />
                                      Approuver
                                    </Button>
                                    <Button 
                                      size="sm" 
                                      onClick={() => handleVote(case_.id, "reject")}
                                      variant="destructive"
                                    >
                                      <X className="h-3 w-3 mr-1" />
                                      Rejeter
                                    </Button>
                                    <Button 
                                      size="sm" 
                                      onClick={() => handleVote(case_.id, "abstain")}
                                      variant="outline"
                                    >
                                      S'abstenir
                                    </Button>
                                  </div>
                                  
                                  <div className="mt-3">
                                    <Label>Commentaire (optionnel)</Label>
                                    <Textarea 
                                      placeholder="Ajoutez un commentaire à votre vote..."
                                      value={newComment}
                                      onChange={(e) => setNewComment(e.target.value)}
                                      className="mt-1"
                                    />
                                  </div>
                                </div>
                              </div>
                            </DialogContent>
                          </Dialog>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Procès-verbal */}
      {currentSession && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Procès-Verbal Automatique
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-slate-50 p-4 rounded-lg">
              <div className="text-sm text-slate-600 mb-4">
                Aperçu du PV qui sera généré automatiquement
              </div>
              
              <div className="space-y-2 text-sm">
                <div><strong>Session :</strong> {currentSession.name}</div>
                <div><strong>Date :</strong> {deliberationMinutes.date}</div>
                <div><strong>Horaires :</strong> {deliberationMinutes.startTime} - {deliberationMinutes.endTime}</div>
                <div><strong>Présents :</strong> {deliberationMinutes.attendees.join(", ")}</div>
                
                <div className="mt-4">
                  <strong>Décisions :</strong>
                  <ul className="ml-4 mt-2 space-y-1">
                    {currentSession.cases.map(case_ => (
                      <li key={case_.id}>
                        • {case_.studentName} ({case_.studentId}) - {case_.status === "approved" ? "ADMIS" : case_.status === "rejected" ? "AJOURNÉ" : "EN DISCUSSION"}
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div className="mt-4 text-xs text-slate-500">
                  Document horodaté et signé électroniquement - {new Date().toLocaleString('fr-FR')}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
