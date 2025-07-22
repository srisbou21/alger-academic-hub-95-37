
import { TeacherAbsence } from '../types/teacher';
import { User } from '../types/user';
import { permissionService } from './permissionService';

// Mock data pour les absences
let mockAbsences: TeacherAbsence[] = [
  {
    id: "abs_1",
    teacherId: "teacher_1",
    startDate: new Date("2024-07-15"),
    endDate: new Date("2024-07-16"),
    type: "maladie",
    reason: "Grippe",
    isJustified: true,
    justificationDocument: "certificat_medical_001.pdf",
    status: "approved",
    coursesAffected: ["INF101", "INF102"],
    createdAt: new Date("2024-07-10"),
    updatedAt: new Date("2024-07-12")
  },
  {
    id: "abs_2",
    teacherId: "teacher_2",
    startDate: new Date("2024-07-20"),
    endDate: new Date("2024-07-21"),
    type: "formation",
    reason: "Formation pédagogique",
    isJustified: true,
    status: "pending",
    coursesAffected: ["BDD201"],
    createdAt: new Date("2024-07-15"),
    updatedAt: new Date("2024-07-15")
  },
  {
    id: "abs_3",
    teacherId: "teacher_3",
    startDate: new Date("2024-07-25"),
    endDate: new Date("2024-07-25"),
    type: "conge_annuel",
    reason: "Congé personnel",
    isJustified: true,
    status: "approved",
    replacementTeacherId: "teacher_1",
    coursesAffected: ["RES301"],
    createdAt: new Date("2024-07-18"),
    updatedAt: new Date("2024-07-19")
  }
];

export interface AbsenceFilters {
  department?: string;
  formation?: string;
  academicYear?: string;
  status?: 'pending' | 'approved' | 'rejected';
  type?: 'maladie' | 'conge_annuel' | 'formation' | 'mission' | 'autre';
  teacherId?: string;
  startDate?: Date;
  endDate?: Date;
}

export const absenceService = {
  async getAbsences(user: User, filters?: AbsenceFilters): Promise<TeacherAbsence[]> {
    console.log(`Récupération des absences pour l'utilisateur: ${user.name}`);
    
    const permissions = permissionService.getAbsencePermissions(user);
    let filteredAbsences = [...mockAbsences];

    // Filtrage par permissions
    if (!permissions.canViewAllAbsences) {
      if (permissions.canViewDepartmentAbsences && permissions.department) {
        // Filtrer par département (nécessiterait une relation teacher->department)
        filteredAbsences = filteredAbsences.filter(absence => {
          // Pour l'exemple, on assume que teacher_1 et teacher_2 sont du département de l'utilisateur
          return ['teacher_1', 'teacher_2'].includes(absence.teacherId);
        });
      } else if (permissions.canViewOwnAbsences) {
        // L'enseignant ne voit que ses propres absences
        filteredAbsences = filteredAbsences.filter(absence => absence.teacherId === user.id);
      } else {
        return [];
      }
    }

    // Application des filtres supplémentaires
    if (filters) {
      if (filters.status) {
        filteredAbsences = filteredAbsences.filter(absence => absence.status === filters.status);
      }
      if (filters.type) {
        filteredAbsences = filteredAbsences.filter(absence => absence.type === filters.type);
      }
      if (filters.teacherId) {
        filteredAbsences = filteredAbsences.filter(absence => absence.teacherId === filters.teacherId);
      }
      if (filters.startDate) {
        filteredAbsences = filteredAbsences.filter(absence => absence.startDate >= filters.startDate!);
      }
      if (filters.endDate) {
        filteredAbsences = filteredAbsences.filter(absence => absence.endDate <= filters.endDate!);
      }
    }

    return new Promise((resolve) => {
      setTimeout(() => {
        console.log(`${filteredAbsences.length} absences trouvées`);
        resolve(filteredAbsences);
      }, 300);
    });
  },

  async createAbsenceRequest(user: User, absenceData: Omit<TeacherAbsence, 'id' | 'createdAt' | 'updatedAt'>): Promise<TeacherAbsence> {
    console.log(`Création d'une demande d'absence pour: ${user.name}`);
    
    const permissions = permissionService.getAbsencePermissions(user);
    if (!permissions.canRequestAbsence) {
      throw new Error("Vous n'êtes pas autorisé à faire une demande d'absence");
    }

    const newAbsence: TeacherAbsence = {
      ...absenceData,
      id: `abs_${Date.now()}`,
      teacherId: user.id,
      status: 'pending',
      createdAt: new Date(),
      updatedAt: new Date()
    };

    mockAbsences.push(newAbsence);
    
    return new Promise((resolve) => {
      setTimeout(() => {
        console.log(`Demande d'absence créée avec l'ID: ${newAbsence.id}`);
        resolve(newAbsence);
      }, 500);
    });
  },

  async approveAbsence(user: User, absenceId: string, comment?: string): Promise<void> {
    console.log(`Approbation de l'absence: ${absenceId} par ${user.name}`);
    
    const permissions = permissionService.getAbsencePermissions(user);
    if (!permissions.canApproveAbsences) {
      throw new Error("Vous n'êtes pas autorisé à approuver des absences");
    }

    const absenceIndex = mockAbsences.findIndex(abs => abs.id === absenceId);
    if (absenceIndex === -1) {
      throw new Error("Absence non trouvée");
    }

    mockAbsences[absenceIndex] = {
      ...mockAbsences[absenceIndex],
      status: 'approved',
      updatedAt: new Date()
    };

    return new Promise((resolve) => {
      setTimeout(() => {
        console.log(`Absence ${absenceId} approuvée`);
        resolve();
      }, 300);
    });
  },

  async rejectAbsence(user: User, absenceId: string, reason: string): Promise<void> {
    console.log(`Rejet de l'absence: ${absenceId} par ${user.name}`);
    
    const permissions = permissionService.getAbsencePermissions(user);
    if (!permissions.canApproveAbsences) {
      throw new Error("Vous n'êtes pas autorisé à rejeter des absences");
    }

    const absenceIndex = mockAbsences.findIndex(abs => abs.id === absenceId);
    if (absenceIndex === -1) {
      throw new Error("Absence non trouvée");
    }

    mockAbsences[absenceIndex] = {
      ...mockAbsences[absenceIndex],
      status: 'rejected',
      updatedAt: new Date()
    };

    return new Promise((resolve) => {
      setTimeout(() => {
        console.log(`Absence ${absenceId} rejetée`);
        resolve();
      }, 300);
    });
  }
};
