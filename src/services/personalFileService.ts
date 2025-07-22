
import { PersonalFile, PersonalFileStatistics, PersonalDocument } from '../types/personalFile';

class PersonalFileService {
  // Récupérer tous les dossiers personnels
  async getAllPersonalFiles(): Promise<PersonalFile[]> {
    // Simulation - à remplacer par appel API réel
    return [
      {
        id: 'file_001',
        employeeId: 'EMP001',
        employeeName: 'Dr. Ahmed Benali',
        employeeType: 'enseignant',
        createdAt: new Date('2023-01-15'),
        updatedAt: new Date('2024-06-20'),
        personalInfo: {
          firstName: 'Ahmed',
          lastName: 'Benali',
          dateOfBirth: new Date('1980-05-15'),
          placeOfBirth: 'Alger',
          nationality: 'Algérienne',
          maritalStatus: 'marie',
          children: 2,
          nationalId: '1980051512345',
          contact: {
            email: 'ahmed.benali@univ.dz',
            personalEmail: 'ahmed.benali@gmail.com',
            phone: '+213 555 123 456',
            emergencyContact: {
              name: 'Fatima Benali',
              relationship: 'Épouse',
              phone: '+213 555 654 321'
            },
            address: {
              street: '15 Rue des Martyrs',
              city: 'Alger',
              wilaya: 'Alger',
              postalCode: '16000',
              country: 'Algérie'
            }
          }
        },
        professionalInfo: {
          employeeId: 'EMP001',
          startDate: new Date('2018-09-01'),
          currentPosition: 'Maitre de Conférences A',
          department: 'Informatique',
          grade: 'Maitre de Conférences A',
          echelon: 3,
          contractType: 'permanent',
          workSchedule: 'Temps plein',
          directSupervisor: 'Prof. Mohammed Amine',
          workLocation: 'Faculté des Sciences'
        },
        education: [
          {
            id: 'edu_001',
            level: 'Doctorat',
            field: 'Informatique',
            institution: 'Université d\'Alger',
            country: 'Algérie',
            startYear: 2005,
            endYear: 2009,
            grade: 'Très Honorable',
            isRecognized: true
          }
        ],
        experience: [
          {
            id: 'exp_001',
            employer: 'Entreprise IT Solutions',
            position: 'Développeur Senior',
            startDate: new Date('2009-01-01'),
            endDate: new Date('2018-08-31'),
            description: 'Développement d\'applications web',
            location: 'Alger'
          }
        ],
        skills: {
          languages: [
            { language: 'Arabe', level: 'natif' },
            { language: 'Français', level: 'avancé' },
            { language: 'Anglais', level: 'intermédiaire' }
          ],
          technical: ['Java', 'Python', 'React', 'Spring Boot'],
          certifications: []
        },
        evaluations: [
          {
            id: 'eval_001',
            year: 2023,
            score: 18,
            evaluator: 'Prof. Mohammed Amine',
            comments: 'Excellent travail',
            strengths: ['Recherche', 'Enseignement'],
            improvements: ['Publication'],
            goals: ['Publier 2 articles'],
            evaluationDate: new Date('2023-12-15')
          }
        ],
        trainings: [],
        documents: [
          {
            id: 'doc_001',
            type: 'diplome',
            title: 'Diplôme de Doctorat',
            description: 'Doctorat en Informatique',
            uploadDate: new Date('2023-01-15'),
            fileUrl: '/documents/diplome_doctorat.pdf',
            fileSize: 2048576,
            fileType: 'application/pdf',
            isRequired: true,
            isVerified: true,
            verifiedBy: 'Service RH',
            verifiedAt: new Date('2023-01-20')
          }
        ],
        leaves: [],
        disciplinary: [],
        status: {
          isComplete: false,
          missingDocuments: ['Copie CIN', 'Certificat médical'],
          lastReview: new Date('2024-06-20'),
          reviewedBy: 'Service RH',
          nextReviewDue: new Date('2024-12-20')
        }
      }
    ];
  }

  // Récupérer un dossier personnel par ID
  async getPersonalFileById(fileId: string): Promise<PersonalFile | null> {
    const files = await this.getAllPersonalFiles();
    return files.find(file => file.id === fileId) || null;
  }

  // Récupérer un dossier par ID employé
  async getPersonalFileByEmployeeId(employeeId: string): Promise<PersonalFile | null> {
    const files = await this.getAllPersonalFiles();
    return files.find(file => file.employeeId === employeeId) || null;
  }

  // Créer un nouveau dossier personnel
  async createPersonalFile(fileData: Partial<PersonalFile>): Promise<PersonalFile> {
    // Simulation - à remplacer par appel API réel
    const newFile: PersonalFile = {
      id: `file_${Date.now()}`,
      createdAt: new Date(),
      updatedAt: new Date(),
      documents: [],
      education: [],
      experience: [],
      evaluations: [],
      trainings: [],
      leaves: [],
      disciplinary: [],
      skills: {
        languages: [],
        technical: [],
        certifications: []
      },
      status: {
        isComplete: false,
        missingDocuments: [],
        lastReview: new Date(),
        reviewedBy: 'Système',
        nextReviewDue: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000)
      },
      ...fileData
    } as PersonalFile;

    return newFile;
  }

  // Mettre à jour un dossier personnel
  async updatePersonalFile(fileId: string, updates: Partial<PersonalFile>): Promise<PersonalFile | null> {
    // Simulation - à remplacer par appel API réel
    const file = await this.getPersonalFileById(fileId);
    if (!file) return null;

    const updatedFile = {
      ...file,
      ...updates,
      updatedAt: new Date()
    };

    return updatedFile;
  }

  // Ajouter un document au dossier
  async addDocumentToFile(fileId: string, document: Omit<PersonalDocument, 'id'>): Promise<boolean> {
    try {
      const file = await this.getPersonalFileById(fileId);
      if (!file) return false;

      const newDocument: PersonalDocument = {
        ...document,
        id: `doc_${Date.now()}`
      };

      file.documents.push(newDocument);
      file.updatedAt = new Date();

      return true;
    } catch (error) {
      console.error('Erreur lors de l\'ajout du document:', error);
      return false;
    }
  }

  // Supprimer un document du dossier
  async removeDocumentFromFile(fileId: string, documentId: string): Promise<boolean> {
    try {
      const file = await this.getPersonalFileById(fileId);
      if (!file) return false;

      file.documents = file.documents.filter(doc => doc.id !== documentId);
      file.updatedAt = new Date();

      return true;
    } catch (error) {
      console.error('Erreur lors de la suppression du document:', error);
      return false;
    }
  }

  // Vérifier un document
  async verifyDocument(fileId: string, documentId: string, verifiedBy: string): Promise<boolean> {
    try {
      const file = await this.getPersonalFileById(fileId);
      if (!file) return false;

      const document = file.documents.find(doc => doc.id === documentId);
      if (!document) return false;

      document.isVerified = true;
      document.verifiedBy = verifiedBy;
      document.verifiedAt = new Date();
      file.updatedAt = new Date();

      return true;
    } catch (error) {
      console.error('Erreur lors de la vérification du document:', error);
      return false;
    }
  }

  // Obtenir les statistiques des dossiers personnels
  async getPersonalFileStatistics(): Promise<PersonalFileStatistics> {
    const files = await this.getAllPersonalFiles();
    
    const stats: PersonalFileStatistics = {
      total: files.length,
      complete: files.filter(f => f.status.isComplete).length,
      incomplete: files.filter(f => !f.status.isComplete).length,
      pendingReview: files.filter(f => new Date() > f.status.nextReviewDue).length,
      byDepartment: {},
      byContractType: {},
      documentTypes: {}
    };

    // Compter par département
    files.forEach(file => {
      const dept = file.professionalInfo.department;
      stats.byDepartment[dept] = (stats.byDepartment[dept] || 0) + 1;
    });

    // Compter par type de contrat
    files.forEach(file => {
      const contract = file.professionalInfo.contractType;
      stats.byContractType[contract] = (stats.byContractType[contract] || 0) + 1;
    });

    // Compter les types de documents
    files.forEach(file => {
      file.documents.forEach(doc => {
        if (!stats.documentTypes[doc.type]) {
          stats.documentTypes[doc.type] = { total: 0, verified: 0 };
        }
        stats.documentTypes[doc.type].total++;
        if (doc.isVerified) {
          stats.documentTypes[doc.type].verified++;
        }
      });
    });

    return stats;
  }

  // Rechercher dans les dossiers
  async searchPersonalFiles(query: string, filters?: {
    department?: string;
    contractType?: string;
    employeeType?: 'enseignant' | 'administratif';
  }): Promise<PersonalFile[]> {
    let files = await this.getAllPersonalFiles();

    // Appliquer les filtres
    if (filters) {
      if (filters.department) {
        files = files.filter(f => f.professionalInfo.department === filters.department);
      }
      if (filters.contractType) {
        files = files.filter(f => f.professionalInfo.contractType === filters.contractType);
      }
      if (filters.employeeType) {
        files = files.filter(f => f.employeeType === filters.employeeType);
      }
    }

    // Recherche textuelle
    if (query && query.trim()) {
      const searchTerm = query.toLowerCase();
      files = files.filter(file => 
        file.employeeName.toLowerCase().includes(searchTerm) ||
        file.employeeId.toLowerCase().includes(searchTerm) ||
        file.personalInfo.firstName.toLowerCase().includes(searchTerm) ||
        file.personalInfo.lastName.toLowerCase().includes(searchTerm) ||
        file.professionalInfo.department.toLowerCase().includes(searchTerm)
      );
    }

    return files;
  }
}

export const personalFileService = new PersonalFileService();
