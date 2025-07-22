export interface DocumentArchive {
  id: string;
  applicantId: string;
  applicantName: string;
  applicantType: 'enseignant' | 'personnel_administratif' | 'etudiant';
  createdAt: Date;
  updatedAt: Date;
  documents: Array<{
    id: string;
    fileName: string;
    fileType: string;
    fileSize: number;
    uploadDate: Date;
    category: 'candidature' | 'plan_projet' | 'diplomes' | 'certificats' | 'rapports' | 'autre';
    description?: string;
    isVerified: boolean;
    verifiedBy?: string;
    verifiedAt?: Date;
  }>;
}

class DocumentArchiveService {
  private archives: DocumentArchive[] = [];

  // Créer un dossier d'archive pour un candidat
  async createArchive(applicantData: {
    applicantId: string;
    applicantName: string;
    applicantType: 'enseignant' | 'personnel_administratif' | 'etudiant';
  }): Promise<DocumentArchive> {
    const archive: DocumentArchive = {
      id: `archive_${Date.now()}`,
      ...applicantData,
      createdAt: new Date(),
      updatedAt: new Date(),
      documents: []
    };

    this.archives.push(archive);
    console.log('Dossier d\'archive créé:', archive);
    return archive;
  }

  // Récupérer un dossier d'archive par ID candidat
  async getArchiveByApplicantId(applicantId: string): Promise<DocumentArchive | null> {
    return this.archives.find(archive => archive.applicantId === applicantId) || null;
  }

  // Ajouter un document à un dossier d'archive
  async addDocumentToArchive(
    applicantId: string, 
    documentData: {
      fileName: string;
      fileType: string;
      fileSize: number;
      category: 'candidature' | 'plan_projet' | 'diplomes' | 'certificats' | 'rapports' | 'autre';
      description?: string;
    }
  ): Promise<boolean> {
    let archive = await this.getArchiveByApplicantId(applicantId);
    
    if (!archive) {
      return false;
    }

    const document = {
      id: `doc_${Date.now()}`,
      ...documentData,
      uploadDate: new Date(),
      isVerified: false
    };

    archive.documents.push(document);
    archive.updatedAt = new Date();
    
    console.log('Document ajouté à l\'archive:', document);
    return true;
  }

  // Vérifier un document
  async verifyDocument(applicantId: string, documentId: string, verifiedBy: string): Promise<boolean> {
    const archive = await this.getArchiveByApplicantId(applicantId);
    if (!archive) return false;

    const document = archive.documents.find(doc => doc.id === documentId);
    if (!document) return false;

    document.isVerified = true;
    document.verifiedBy = verifiedBy;
    document.verifiedAt = new Date();
    archive.updatedAt = new Date();

    console.log('Document vérifié:', document);
    return true;
  }

  // Récupérer tous les dossiers d'archive
  async getAllArchives(): Promise<DocumentArchive[]> {
    return this.archives;
  }

  // Rechercher dans les archives
  async searchArchives(query: string, type?: 'enseignant' | 'personnel_administratif' | 'etudiant'): Promise<DocumentArchive[]> {
    let filtered = this.archives;

    if (type) {
      filtered = filtered.filter(archive => archive.applicantType === type);
    }

    if (query.trim()) {
      const searchTerm = query.toLowerCase();
      filtered = filtered.filter(archive => 
        archive.applicantName.toLowerCase().includes(searchTerm) ||
        archive.applicantId.toLowerCase().includes(searchTerm)
      );
    }

    return filtered;
  }

  // Statistiques des archives
  async getArchiveStatistics(): Promise<{
    totalArchives: number;
    totalDocuments: number;
    verifiedDocuments: number;
    byType: Record<string, number>;
    byCategory: Record<string, number>;
  }> {
    const stats = {
      totalArchives: this.archives.length,
      totalDocuments: 0,
      verifiedDocuments: 0,
      byType: {} as Record<string, number>,
      byCategory: {} as Record<string, number>
    };

    this.archives.forEach(archive => {
      // Compter par type
      stats.byType[archive.applicantType] = (stats.byType[archive.applicantType] || 0) + 1;
      
      // Compter les documents
      archive.documents.forEach(doc => {
        stats.totalDocuments++;
        if (doc.isVerified) stats.verifiedDocuments++;
        stats.byCategory[doc.category] = (stats.byCategory[doc.category] || 0) + 1;
      });
    });

    return stats;
  }
}

export const documentArchiveService = new DocumentArchiveService();