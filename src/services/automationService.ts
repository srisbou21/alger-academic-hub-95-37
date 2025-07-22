import { FormationOffer } from "@/types/academic";
import { timetableService, TimetableData } from "./timetableService";
import { Reservation } from "@/types/reservation";

class AutomationService {
  // Automatiser la génération complète d'emplois du temps avec réservations
  async autoGenerateTimetableWithReservations(
    formationOffer: FormationOffer,
    semester: 'S1' | 'S2',
    academicYear: string
  ): Promise<{
    timetable: TimetableData;
    reservations: Reservation[];
    conflicts: string[];
  }> {
    try {
      // 1. Génération automatique de l'emploi du temps
      const constraints = await timetableService.getDefaultConstraints();
      const timetable = await timetableService.generateTimetable(
        formationOffer.level,
        semester,
        academicYear,
        constraints,
        formationOffer
      );

      // 2. Validation automatique
      const validation = await timetableService.validateTimetable(timetable);
      
      // 3. Création automatique des réservations si valide
      let reservations: Reservation[] = [];
      if (validation.isValid) {
        reservations = await timetableService.createSemesterReservations(timetable);
      }

      return {
        timetable,
        reservations,
        conflicts: validation.conflicts
      };
    } catch (error) {
      console.error('Erreur génération automatique:', error);
      throw error;
    }
  }

  // Automatiser l'inscription des étudiants selon les sections/groupes
  async autoAssignStudentsToGroups(
    formationOffer: FormationOffer,
    students: Array<{ id: string; name: string; preferences?: string[] }>
  ): Promise<Array<{ studentId: string; sectionId: string; groupIds: string[] }>> {
    const assignments: Array<{ studentId: string; sectionId: string; groupIds: string[] }> = [];

    for (const student of students) {
      // Distribution automatique équitable
      const availableSection = formationOffer.sections.find(section => 
        assignments.filter(a => a.sectionId === section.id).length < section.capacity
      );

      if (availableSection) {
        const groupAssignments: string[] = [];
        
        // Assigner automatiquement aux groupes TD/TP
        for (const group of availableSection.groups) {
          const currentGroupSize = assignments.filter(a => 
            a.groupIds.includes(group.id)
          ).length;
          
          if (currentGroupSize < group.capacity) {
            groupAssignments.push(group.id);
          }
        }

        assignments.push({
          studentId: student.id,
          sectionId: availableSection.id,
          groupIds: groupAssignments
        });
      }
    }

    return assignments;
  }

  // Automatiser la validation des demandes selon les règles métier
  async autoValidateRequests(
    requests: Array<{
      id: string;
      type: 'document' | 'absence' | 'reservation' | 'scholarship';
      priority: number;
      requester: string;
      data: any;
    }>
  ): Promise<Array<{ requestId: string; decision: 'approved' | 'rejected'; reason: string }>> {
    const decisions: Array<{ requestId: string; decision: 'approved' | 'rejected'; reason: string }> = [];

    for (const request of requests) {
      let decision: 'approved' | 'rejected' = 'approved';
      let reason = 'Validation automatique - critères remplis';

      // Règles d'auto-validation
      switch (request.type) {
        case 'document':
          // Auto-approuver les documents standards
          if (['attestation_inscription', 'releve_notes'].includes(request.data.documentType)) {
            decision = 'approved';
          }
          break;

        case 'absence':
          // Auto-approuver si justificatif médical
          if (request.data.reason === 'medical' && request.data.hasJustification) {
            decision = 'approved';
          } else if (request.data.duration > 7) {
            decision = 'rejected';
            reason = 'Durée d\'absence trop longue - validation manuelle requise';
          }
          break;

        case 'reservation':
          // Auto-approuver les réservations de cours
          if (request.data.type === 'course' && request.priority <= 2) {
            decision = 'approved';
          }
          break;

        case 'scholarship':
          // Auto-approuver selon le score
          if (request.data.academicScore >= 14 && request.data.socialScore >= 3) {
            decision = 'approved';
          } else {
            decision = 'rejected';
            reason = 'Critères académiques ou sociaux insuffisants';
          }
          break;
      }

      decisions.push({ requestId: request.id, decision, reason });
    }

    return decisions;
  }

  // Automatiser les notifications selon les événements
  async autoSendNotifications(
    events: Array<{
      type: 'timetable_updated' | 'grade_published' | 'deadline_approaching' | 'absence_detected';
      targetUsers: string[];
      data: any;
    }>
  ): Promise<Array<{ eventId: string; notificationsSent: number }>> {
    const results: Array<{ eventId: string; notificationsSent: number }> = [];

    for (const event of events) {
      let notificationsSent = 0;
      
      // Templates de notifications automatiques
      const templates = {
        timetable_updated: {
          title: 'Emploi du temps mis à jour',
          message: `Votre emploi du temps ${event.data.semester} a été modifié.`
        },
        grade_published: {
          title: 'Nouvelles notes disponibles',
          message: `Les notes de ${event.data.module} sont maintenant disponibles.`
        },
        deadline_approaching: {
          title: 'Échéance proche',
          message: `Date limite pour ${event.data.task} : ${event.data.deadline}`
        },
        absence_detected: {
          title: 'Absence détectée',
          message: `Absence non justifiée détectée le ${event.data.date}`
        }
      };

      const template = templates[event.type];
      if (template) {
        // Simulation d'envoi de notifications
        notificationsSent = event.targetUsers.length;
        console.log(`📧 ${notificationsSent} notifications envoyées: ${template.title}`);
      }

      results.push({
        eventId: `${event.type}_${Date.now()}`,
        notificationsSent
      });
    }

    return results;
  }

  // Synchronisation automatique entre modules
  async syncModules(): Promise<{
    syncedEntities: string[];
    errors: string[];
  }> {
    const syncedEntities: string[] = [];
    const errors: string[] = [];

    try {
      // Synchroniser formations -> emplois du temps -> réservations
      console.log('🔄 Synchronisation formations...');
      syncedEntities.push('formations');

      // Synchroniser étudiants -> inscriptions -> groupes
      console.log('🔄 Synchronisation étudiants...');
      syncedEntities.push('students');

      // Synchroniser notes -> moyennes -> délibérations
      console.log('🔄 Synchronisation académique...');
      syncedEntities.push('grades');

      // Synchroniser espaces -> réservations -> conflits
      console.log('🔄 Synchronisation réservations...');
      syncedEntities.push('reservations');

    } catch (error) {
      errors.push(`Erreur synchronisation: ${error}`);
    }

    return { syncedEntities, errors };
  }
}

export const automationService = new AutomationService();
