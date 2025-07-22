import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { FileText, Search, Archive, CheckCircle, Clock, Users, GraduationCap, User } from "lucide-react";
import { documentArchiveService, DocumentArchive } from "@/services/documentArchiveService";
import { useToast } from "@/hooks/use-toast";

export function DocumentArchiveManager() {
  const { toast } = useToast();
  const [archives, setArchives] = useState<DocumentArchive[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState<'all' | 'enseignant' | 'personnel_administratif' | 'etudiant'>('all');
  const [selectedArchive, setSelectedArchive] = useState<DocumentArchive | null>(null);
  const [statistics, setStatistics] = useState<any>(null);

  useEffect(() => {
    loadArchives();
    loadStatistics();
  }, []);

  async function loadArchives() {
    try {
      const allArchives = await documentArchiveService.getAllArchives();
      setArchives(allArchives);
    } catch (error) {
      console.error('Erreur lors du chargement des archives:', error);
      toast({ 
        title: "Erreur", 
        description: "Impossible de charger les archives",
        variant: "destructive"
      });
    }
  }

  async function loadStatistics() {
    try {
      const stats = await documentArchiveService.getArchiveStatistics();
      setStatistics(stats);
    } catch (error) {
      console.error('Erreur lors du chargement des statistiques:', error);
    }
  }

  async function handleSearch() {
    try {
      const typeFilter = filterType === 'all' ? undefined : filterType;
      const results = await documentArchiveService.searchArchives(searchQuery, typeFilter);
      setArchives(results);
    } catch (error) {
      console.error('Erreur lors de la recherche:', error);
      toast({ 
        title: "Erreur", 
        description: "Erreur lors de la recherche",
        variant: "destructive"
      });
    }
  }

  async function handleVerifyDocument(archiveId: string, documentId: string) {
    try {
      await documentArchiveService.verifyDocument(archiveId, documentId, "Administrateur");
      await loadArchives();
      toast({ 
        title: "Succès", 
        description: "Document vérifié avec succès" 
      });
    } catch (error) {
      console.error('Erreur lors de la vérification:', error);
      toast({ 
        title: "Erreur", 
        description: "Impossible de vérifier le document",
        variant: "destructive"
      });
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'enseignant':
        return <GraduationCap className="h-4 w-4" />;
      case 'personnel_administratif':
        return <Users className="h-4 w-4" />;
      case 'etudiant':
        return <User className="h-4 w-4" />;
      default:
        return <User className="h-4 w-4" />;
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'enseignant':
        return 'Enseignant';
      case 'personnel_administratif':
        return 'Personnel Administratif';
      case 'etudiant':
        return 'Étudiant';
      default:
        return type;
    }
  };

  const filteredArchives = archives.filter(archive => {
    if (filterType !== 'all' && archive.applicantType !== filterType) return false;
    if (searchQuery && !archive.applicantName.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-8">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
          Gestion des Archives de Documents
        </h1>
        <p className="text-muted-foreground">Gérez les dossiers d'archivage des candidats aux bourses</p>
      </div>

      {/* Statistiques */}
      {statistics && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="border-2 border-primary/20">
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Archive className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-sm text-muted-foreground">Total Archives</p>
                  <p className="text-2xl font-bold">{statistics.totalArchives}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-2 border-blue-200">
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-blue-600" />
                <div>
                  <p className="text-sm text-muted-foreground">Total Documents</p>
                  <p className="text-2xl font-bold">{statistics.totalDocuments}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-2 border-green-200">
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <div>
                  <p className="text-sm text-muted-foreground">Vérifiés</p>
                  <p className="text-2xl font-bold">{statistics.verifiedDocuments}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-2 border-orange-200">
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-orange-600" />
                <div>
                  <p className="text-sm text-muted-foreground">En attente</p>
                  <p className="text-2xl font-bold">{statistics.totalDocuments - statistics.verifiedDocuments}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Recherche et filtres */}
      <Card className="border-2 border-secondary/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            Recherche et Filtres
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <div className="flex-1">
              <Label htmlFor="search">Rechercher par nom ou ID</Label>
              <Input
                id="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Nom du candidat ou ID..."
                className="mt-1"
              />
            </div>
            <div className="w-48">
              <Label>Type de candidat</Label>
              <Select value={filterType} onValueChange={(value: any) => setFilterType(value)}>
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous</SelectItem>
                  <SelectItem value="enseignant">Enseignants</SelectItem>
                  <SelectItem value="personnel_administratif">Personnel Administratif</SelectItem>
                  <SelectItem value="etudiant">Étudiants</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-end">
              <Button onClick={handleSearch} className="mt-1">
                <Search className="h-4 w-4 mr-2" />
                Rechercher
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Liste des archives */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="border-2 border-accent/20">
          <CardHeader>
            <CardTitle>Archives des Candidats</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 max-h-[600px] overflow-y-auto">
            {filteredArchives.map((archive) => (
              <div
                key={archive.id}
                className={`p-4 border rounded-lg cursor-pointer transition-all hover:bg-accent/50 ${
                  selectedArchive?.id === archive.id ? 'border-primary bg-primary/5' : 'border-border'
                }`}
                onClick={() => setSelectedArchive(archive)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {getTypeIcon(archive.applicantType)}
                    <div>
                      <h4 className="font-semibold">{archive.applicantName}</h4>
                      <p className="text-sm text-muted-foreground">
                        {getTypeLabel(archive.applicantType)} • {archive.documents.length} documents
                      </p>
                    </div>
                  </div>
                  <Badge variant={archive.documents.some(d => !d.isVerified) ? "secondary" : "default"}>
                    {archive.documents.filter(d => d.isVerified).length}/{archive.documents.length} vérifiés
                  </Badge>
                </div>
              </div>
            ))}
            {filteredArchives.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                <Archive className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Aucune archive trouvée</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Détails de l'archive sélectionnée */}
        <Card className="border-2 border-blue-200">
          <CardHeader>
            <CardTitle>
              {selectedArchive ? `Documents de ${selectedArchive.applicantName}` : 'Sélectionner une archive'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {selectedArchive ? (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <Label>Type</Label>
                    <p className="flex items-center gap-2 mt-1">
                      {getTypeIcon(selectedArchive.applicantType)}
                      {getTypeLabel(selectedArchive.applicantType)}
                    </p>
                  </div>
                  <div>
                    <Label>ID Candidat</Label>
                    <p className="mt-1">{selectedArchive.applicantId}</p>
                  </div>
                  <div>
                    <Label>Créé le</Label>
                    <p className="mt-1">{selectedArchive.createdAt.toLocaleDateString()}</p>
                  </div>
                  <div>
                    <Label>Modifié le</Label>
                    <p className="mt-1">{selectedArchive.updatedAt.toLocaleDateString()}</p>
                  </div>
                </div>

                <Separator />

                <div>
                  <Label className="text-base font-semibold">Documents ({selectedArchive.documents.length})</Label>
                  <div className="space-y-2 mt-2 max-h-[400px] overflow-y-auto">
                    {selectedArchive.documents.map((doc) => (
                      <div key={doc.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center gap-2">
                          <FileText className="h-4 w-4" />
                          <div>
                            <p className="font-medium">{doc.fileName}</p>
                            <p className="text-xs text-muted-foreground">
                              {doc.category} • {Math.round(doc.fileSize / 1024)} KB • {doc.uploadDate.toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {doc.isVerified ? (
                            <Badge variant="default" className="bg-green-500">
                              <CheckCircle className="h-3 w-3 mr-1" />
                              Vérifié
                            </Badge>
                          ) : (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleVerifyDocument(selectedArchive.applicantId, doc.id)}
                            >
                              <CheckCircle className="h-3 w-3 mr-1" />
                              Vérifier
                            </Button>
                          )}
                        </div>
                      </div>
                    ))}
                    {selectedArchive.documents.length === 0 && (
                      <div className="text-center py-4 text-muted-foreground">
                        <FileText className="h-8 w-8 mx-auto mb-2 opacity-50" />
                        <p>Aucun document dans cette archive</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <Archive className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Sélectionnez une archive pour voir les détails</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}