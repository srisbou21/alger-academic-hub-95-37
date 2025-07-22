import { TeacherScholarship, ScholarshipApplication, ScholarshipResult, ScholarshipReport } from "@/types/scholarship";

class ScholarshipService {
  // Gestion des bourses
  async getAllScholarships(): Promise<TeacherScholarship[]> {
    return [
      {
        id: "sch1",
        title: "Formation en IA - MIT",
        description: "Programme intensif d'intelligence artificielle au Massachusetts Institute of Technology",
        type: "formation",
        duration: {
          startDate: new Date("2024-07-01"),
          endDate: new Date("2024-07-15"),
          totalDays: 14
        },
        location: {
          country: "États-Unis",
          city: "Boston",
          institution: "MIT"
        },
        financialInfo: {
          totalAmount: 8000,
          currency: "USD",
          coverage: ["transport", "accommodation", "meals", "registration"],
          fundingSource: "Ministère de l'Enseignement Supérieur"
        },
        eligibility: {
          targetAudience: ["enseignant", "personnel_administratif"],
          minGrade: "Maitre Assistant A",
          maxAge: 45,
          minExperience: 3,
          languageRequirements: ["Anglais niveau B2"],
          academicRequirements: ["Doctorat en Informatique"],
          manualSelectionRequired: false
        },
        applicationPeriod: {
          openDate: new Date("2024-02-01"),
          closeDate: new Date("2024-03-15"),
          resultsDate: new Date("2024-04-30")
        },
        documents: [
          { type: "CV", required: true, description: "CV académique détaillé" },
          { type: "Lettre de motivation", required: true, description: "Maximum 2 pages" },
          { type: "Certificats", required: true, description: "Diplômes et certifications" }
        ],
        status: "open",
        maxApplications: 10,
        currentApplications: 7,
        createdBy: "admin1",
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];
  }

  async createScholarship(scholarship: Omit<TeacherScholarship, 'id' | 'createdAt' | 'updatedAt'>): Promise<TeacherScholarship> {
    const newScholarship: TeacherScholarship = {
      id: Date.now().toString(),
      ...scholarship,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    console.log("Nouvelle bourse créée:", newScholarship);
    return newScholarship;
  }

  // Gestion des candidatures
  async submitApplication(application: Omit<ScholarshipApplication, 'id' | 'createdAt' | 'updatedAt'>): Promise<ScholarshipApplication> {
    const newApplication: ScholarshipApplication = {
      id: Date.now().toString(),
      ...application,
      submissionDate: new Date(),
      createdAt: new Date(),
      updatedAt: new Date()
    };
    console.log("Candidature soumise:", newApplication);
    return newApplication;
  }

  async getApplications(scholarshipId?: string, applicantId?: string): Promise<ScholarshipApplication[]> {
    return [
      {
        id: "app1",
        scholarshipId: "sch1",
        scholarshipTitle: "Formation en IA - MIT",
        applicantId: "teacher1",
        applicantName: "Dr. Ahmed Benali",
        personalInfo: {
          userType: "enseignant",
          grade: "Maitre de Conférences A",
          department: "Informatique",
          experience: 8,
          currentPosition: "Enseignant-Chercheur"
        },
        motivation: {
          objectives: "Approfondir mes connaissances en IA pour améliorer mes cours",
          expectedOutcomes: "Intégrer les dernières avancées dans le curriculum",
          relevanceToWork: "Recherche en machine learning",
          personalStatement: "Passionné par l'IA depuis 10 ans..."
        },
        documents: [
          { type: "CV", fileName: "cv_benali.pdf", uploadDate: new Date(), verified: true }
        ],
        evaluation: {
          academicScore: 18,
          motivationScore: 16,
          relevanceScore: 17,
          totalScore: 17,
          evaluatorComments: "Excellent profil, très motivé",
          evaluatedBy: "evaluator1",
          evaluatedAt: new Date()
        },
        status: "evaluated",
        submissionDate: new Date("2024-03-10"),
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];
  }

  async evaluateApplication(applicationId: string, evaluation: any): Promise<ScholarshipApplication> {
    console.log("Évaluation candidature:", applicationId, evaluation);
    const applications = await this.getApplications();
    const app = applications.find(a => a.id === applicationId);
    if (!app) throw new Error("Candidature non trouvée");
    
    return {
      ...app,
      evaluation,
      status: "evaluated",
      updatedAt: new Date()
    };
  }

  // Gestion des résultats
  async publishResults(scholarshipId: string, results: ScholarshipResult[]): Promise<void> {
    console.log("Publication des résultats pour la bourse:", scholarshipId);
    // Envoi automatique de notifications aux candidats
    results.forEach(result => {
      console.log(`Notification envoyée à ${result.applicantName}: ${result.decision}`);
    });
  }

  async getResults(scholarshipId: string): Promise<ScholarshipResult[]> {
    return [
      {
        applicationId: "app1",
        scholarshipId: "sch1",
        applicantId: "teacher1",
        applicantName: "Dr. Ahmed Benali",
        decision: "accepted",
        ranking: 1,
        finalScore: 17,
        feedback: "Excellente candidature, très bien motivée",
        conditions: ["Soumission rapport mi-parcours", "Présentation au retour"],
        reportingRequirements: {
          midTermReport: true,
          finalReport: true,
          presentationRequired: true,
          deadlines: [new Date("2024-07-08"), new Date("2024-08-15")]
        },
        financialDetails: {
          approvedAmount: 8000,
          disbursementSchedule: [
            { amount: 6000, date: new Date("2024-06-15"), description: "Avance voyage", status: "pending" },
            { amount: 2000, date: new Date("2024-08-15"), description: "Solde final", status: "pending" }
          ]
        },
        announcedAt: new Date(),
        acceptanceDeadline: new Date("2024-05-15"),
        applicantResponse: "accepted",
        responseDate: new Date()
      }
    ];
  }

  // Gestion des rapports
  async submitReport(report: Omit<ScholarshipReport, 'id' | 'createdAt'>): Promise<ScholarshipReport> {
    const newReport: ScholarshipReport = {
      id: Date.now().toString(),
      ...report,
      submissionDate: new Date(),
      createdAt: new Date()
    };
    console.log("Rapport soumis:", newReport);
    return newReport;
  }

  async evaluateReport(reportId: string, evaluation: any): Promise<ScholarshipReport> {
    console.log("Évaluation rapport:", reportId, evaluation);
    // Simulation d'évaluation
    return {
      id: reportId,
      applicationId: "app1",
      scholarshipId: "sch1",
      reportType: "final",
      content: {
        activities: "Formation intensive en IA",
        achievements: "Certification obtenue",
        challenges: "Adaptation au rythme intensif",
        outcomes: "Nouvelles compétences acquises",
        recommendations: "Recommande vivement cette formation"
      },
      attachments: [],
      evaluation,
      status: "evaluated",
      createdAt: new Date()
    };
  }

  // Statistiques
  async getScholarshipStatistics(): Promise<any> {
    return {
      totalScholarships: 15,
      activeScholarships: 5,
      totalApplications: 87,
      acceptanceRate: 25,
      averageScore: 14.5,
      byType: {
        formation: 8,
        recherche: 4,
        conference: 2,
        stage: 1
      },
      byStatus: {
        accepted: 22,
        rejected: 45,
        pending: 20
      }
    };
  }
}

export const scholarshipService = new ScholarshipService();