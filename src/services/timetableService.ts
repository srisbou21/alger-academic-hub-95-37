export interface TimetableEntry {
  id: string;
  subject: string;
  teacher: string;
  room: string;
  day: string;
  startTime: string;
  endTime: string;
  type: 'cours' | 'td' | 'tp';
  level: string;
  semester: string;
  academicYear: string;
  group?: string;
  participants: number;
}

export interface TimetableData {
  id: string;
  level: string;
  semester: string;
  academicYear: string;
  entries: TimetableEntry[];
  validatedAt?: Date;
  validatedBy?: string;
}

export interface TimetableConstraints {
  teacherAvailability: Record<string, string[]>;
  roomCapacity: Record<string, number>;
  maxHoursPerDay: number;
  preferredTimeSlots: string[];
}

export interface ValidationResult {
  isValid: boolean;
  conflicts: string[];
  warnings: string[];
}

export interface GeneratedTimetable extends TimetableData {
  courses: Array<{
    id: string;
    courseName: string;
    teacher: string;
    roomName: string;
    dayOfWeek: string;
    startTime: string;
    endTime: string;
    type: string;
    studentsCount: number;
  }>;
}

class TimetableService {
  private readonly STORAGE_KEY = 'fsecsg_timetables';

  // Jours de travail universitaires: Samedi à Jeudi
  getUniversityWorkingDays(): string[] {
    return ['Samedi', 'Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi'];
  }

  // Heures de travail: 8h00 à 23h00
  getUniversityWorkingHours(): { start: string; end: string } {
    return { start: '08:00', end: '23:00' };
  }

  getTimeSlots(): string[] {
    return [
      '08:00-09:30',
      '09:45-11:15', 
      '11:30-13:00',
      '14:00-15:30',
      '15:45-17:15',
      '17:30-19:00',
      '19:15-20:45',
      '21:00-22:30'
    ];
  }

  // Initialiser avec des emplois du temps d'exemple
  initializeExampleTimetables(): void {
    const existing = localStorage.getItem(this.STORAGE_KEY);
    if (!existing) {
      const exampleTimetables = this.generateExampleTimetables();
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(exampleTimetables));
      console.log('📅 Emplois du temps d\'exemple initialisés');
    }
  }

  private generateExampleTimetables(): TimetableData[] {
    return [
      {
        id: 'tt_eq_s1_2024',
        level: 'L3',
        semester: 'S1',
        academicYear: '2024-2025',
        validatedAt: new Date('2024-09-15'),
        validatedBy: 'Dr. Ahmed Benali',
        entries: [
          {
            id: 'entry_1',
            subject: 'Économétrie',
            teacher: 'Dr. Ahmed Benali',
            room: 'Amphithéâtre A',
            day: 'Samedi',
            startTime: '08:00',
            endTime: '09:30',
            type: 'cours',
            level: 'L3',
            semester: 'S1',
            academicYear: '2024-2025',
            participants: 120
          },
          {
            id: 'entry_2',
            subject: 'Statistiques Appliquées',
            teacher: 'Prof. Amina Cherifi',
            room: 'Salle 201',
            day: 'Dimanche',
            startTime: '09:45',
            endTime: '11:15',
            type: 'td',
            level: 'L3',
            semester: 'S1',
            academicYear: '2024-2025',
            group: 'Groupe A',
            participants: 45
          },
          {
            id: 'entry_3',
            subject: 'Analyse des Données',
            teacher: 'Dr. Mohamed Saidi',
            room: 'Laboratoire Informatique',
            day: 'Lundi',
            startTime: '14:00',
            endTime: '15:30',
            type: 'tp',
            level: 'L3',
            semester: 'S1',
            academicYear: '2024-2025',
            group: 'Groupe B',
            participants: 30
          },
          {
            id: 'entry_4',
            subject: 'Microéconomie Avancée',
            teacher: 'Prof. Fatima Khelifi',
            room: 'Amphithéâtre B',
            day: 'Mardi',
            startTime: '11:30',
            endTime: '13:00',
            type: 'cours',
            level: 'L3',
            semester: 'S1',
            academicYear: '2024-2025',
            participants: 120
          },
          {
            id: 'entry_5',
            subject: 'Modélisation Économique',
            teacher: 'Dr. Karim Boudjemaa',
            room: 'Salle 202',
            day: 'Mercredi',
            startTime: '15:45',
            endTime: '17:15',
            type: 'td',
            level: 'L3',
            semester: 'S1',
            academicYear: '2024-2025',
            group: 'Groupe A',
            participants: 40
          },
          {
            id: 'entry_6',
            subject: 'Théorie des Jeux',
            teacher: 'Dr. Nadia Benaissa',
            room: 'Salle 203',
            day: 'Jeudi',
            startTime: '17:30',
            endTime: '19:00',
            type: 'cours',
            level: 'L3',
            semester: 'S1',
            academicYear: '2024-2025',
            participants: 90
          }
        ]
      }
    ];
  }

  // Récupérer tous les emplois du temps
  getAllTimetables(): TimetableData[] {
    this.initializeExampleTimetables();
    const stored = localStorage.getItem(this.STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  }

  // Récupérer un emploi du temps par niveau et semestre
  getTimetable(level: string, semester: string, academicYear: string): TimetableData | null {
    const timetables = this.getAllTimetables();
    return timetables.find(tt => 
      tt.level === level && 
      tt.semester === semester && 
      tt.academicYear === academicYear
    ) || null;
  }

  // Génération automatique d'emploi du temps
  async generateTimetable(
    level: string,
    semester: string,
    academicYear: string,
    constraints: TimetableConstraints,
    formationOffer?: any
  ): Promise<GeneratedTimetable> {
    console.log(`🔄 Génération emploi du temps ${level} ${semester}`);
    
    // Simulation de génération basée sur les données existantes
    const existingTimetable = this.getTimetable(level, semester, academicYear);
    
    if (existingTimetable) {
      // Convertir en format GeneratedTimetable
      const courses = existingTimetable.entries.map(entry => ({
        id: entry.id,
        courseName: entry.subject,
        teacher: entry.teacher,
        roomName: entry.room,
        dayOfWeek: entry.day,
        startTime: entry.startTime,
        endTime: entry.endTime,
        type: entry.type,
        studentsCount: entry.participants
      }));

      return {
        ...existingTimetable,
        courses
      };
    }

    // Génération d'un nouvel emploi du temps si pas existant
    const newTimetable: GeneratedTimetable = {
      id: `tt_${level.toLowerCase()}_${semester.toLowerCase()}_${academicYear.split('-')[0]}`,
      level,
      semester,
      academicYear,
      entries: [],
      courses: []
    };

    return newTimetable;
  }

  // Validation d'emploi du temps
  async validateTimetable(timetable: TimetableData | GeneratedTimetable): Promise<ValidationResult> {
    const conflicts: string[] = [];
    const warnings: string[] = [];
    
    console.log(`🔍 Validation emploi du temps ${timetable.level} ${timetable.semester}`);
    
    // Vérifications basiques
    if (timetable.entries.length === 0) {
      warnings.push('Aucune entrée dans l\'emploi du temps');
    }
    
    // Vérification des conflits de salles
    const roomConflicts = this.checkRoomConflicts(timetable.entries);
    conflicts.push(...roomConflicts);
    
    // Vérification des conflits d'enseignants
    const teacherConflicts = this.checkTeacherConflicts(timetable.entries);
    conflicts.push(...teacherConflicts);
    
    // Vérification des jours de travail
    const invalidDays = this.checkWorkingDays(timetable.entries);
    conflicts.push(...invalidDays);
    
    // Vérification des heures de travail
    const invalidHours = this.checkWorkingHours(timetable.entries);
    conflicts.push(...invalidHours);
    
    return {
      isValid: conflicts.length === 0,
      conflicts,
      warnings
    };
  }

  private checkWorkingDays(entries: TimetableEntry[]): string[] {
    const conflicts: string[] = [];
    const workingDays = this.getUniversityWorkingDays();
    
    entries.forEach(entry => {
      if (!workingDays.includes(entry.day)) {
        conflicts.push(`${entry.subject} programmé le ${entry.day} - jour non travaillé à l'université`);
      }
    });
    
    return conflicts;
  }

  private checkWorkingHours(entries: TimetableEntry[]): string[] {
    const conflicts: string[] = [];
    const workingHours = this.getUniversityWorkingHours();
    
    entries.forEach(entry => {
      if (entry.startTime < workingHours.start || entry.endTime > workingHours.end) {
        conflicts.push(`${entry.subject} programmé en dehors des heures de travail (${workingHours.start}-${workingHours.end})`);
      }
    });
    
    return conflicts;
  }

  private checkRoomConflicts(entries: TimetableEntry[]): string[] {
    const conflicts: string[] = [];
    
    for (let i = 0; i < entries.length; i++) {
      for (let j = i + 1; j < entries.length; j++) {
        const entry1 = entries[i];
        const entry2 = entries[j];
        
        if (entry1.room === entry2.room && 
            entry1.day === entry2.day && 
            this.timesOverlap(entry1.startTime, entry1.endTime, entry2.startTime, entry2.endTime)) {
          conflicts.push(`Conflit salle ${entry1.room} le ${entry1.day} entre ${entry1.subject} et ${entry2.subject}`);
        }
      }
    }
    
    return conflicts;
  }

  private checkTeacherConflicts(entries: TimetableEntry[]): string[] {
    const conflicts: string[] = [];
    
    for (let i = 0; i < entries.length; i++) {
      for (let j = i + 1; j < entries.length; j++) {
        const entry1 = entries[i];
        const entry2 = entries[j];
        
        if (entry1.teacher === entry2.teacher && 
            entry1.day === entry2.day && 
            this.timesOverlap(entry1.startTime, entry1.endTime, entry2.startTime, entry2.endTime)) {
          conflicts.push(`Conflit enseignant ${entry1.teacher} le ${entry1.day} entre ${entry1.subject} et ${entry2.subject}`);
        }
      }
    }
    
    return conflicts;
  }

  private timesOverlap(start1: string, end1: string, start2: string, end2: string): boolean {
    const [h1, m1] = start1.split(':').map(Number);
    const [h2, m2] = end1.split(':').map(Number);
    const [h3, m3] = start2.split(':').map(Number);
    const [h4, m4] = end2.split(':').map(Number);
    
    const start1Minutes = h1 * 60 + m1;
    const end1Minutes = h2 * 60 + m2;
    const start2Minutes = h3 * 60 + m3;
    const end2Minutes = h4 * 60 + m4;
    
    return !(end1Minutes <= start2Minutes || end2Minutes <= start1Minutes);
  }

  // Création des réservations automatiques pour un semestre
  async createSemesterReservations(timetable: TimetableData | GeneratedTimetable): Promise<any[]> {
    console.log(`🎯 Création réservations automatiques pour ${timetable.level} ${timetable.semester}`);
    
    const reservations: any[] = [];
    
    timetable.entries.forEach(entry => {
      // Créer une réservation pour chaque cours de la semaine pendant 16 semaines
      for (let week = 1; week <= 16; week++) {
        const reservation = {
          id: `auto_${entry.id}_week_${week}`,
          spaceId: this.getRoomId(entry.room),
          spaceName: entry.room,
          requester: {
            id: this.getTeacherId(entry.teacher),
            name: entry.teacher,
            service: `Département ${timetable.level}`,
            contact: `${entry.teacher.toLowerCase().replace(' ', '.')}@fsecsg.dz`
          },
          type: 'course' as const,
          purpose: `${entry.subject} - ${entry.type.toUpperCase()}`,
          description: `Cours automatiquement réservé (Semaine ${week})`,
          participants: entry.participants,
          dateTime: {
            start: this.calculateDateForWeek(entry.day, entry.startTime, week),
            end: this.calculateDateForWeek(entry.day, entry.endTime, week)
          },
          equipment: this.getRequiredEquipment(entry.type),
          priority: 1 as const,
          status: 'confirmed' as const
        };
        
        reservations.push(reservation);
      }
    });

    console.log(`✅ ${reservations.length} réservations créées pour ${timetable.level} ${timetable.semester}`);
    return reservations;
  }

  // Valider un emploi du temps (sans duplication)
  validateTimetableById(timetableId: string, validatedBy: string): void {
    const timetables = this.getAllTimetables();
    const index = timetables.findIndex(tt => tt.id === timetableId);
    
    if (index !== -1) {
      timetables[index].validatedAt = new Date();
      timetables[index].validatedBy = validatedBy;
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(timetables));
      
      // Créer automatiquement les réservations pour l'emploi du temps validé
      this.createAutomaticReservations(timetables[index]);
    }
  }

  // Créer automatiquement les réservations pour un emploi du temps validé
  private createAutomaticReservations(timetable: TimetableData): void {
    const { reservationService } = require('./reservationService');
    
    timetable.entries.forEach(entry => {
      const reservation = {
        spaceId: this.getRoomId(entry.room),
        spaceName: entry.room,
        requester: {
          id: this.getTeacherId(entry.teacher),
          name: entry.teacher,
          service: `Département ${timetable.level}`,
          contact: `${entry.teacher.toLowerCase().replace(' ', '.')}@fsecsg.dz`
        },
        type: 'course' as const,
        purpose: `${entry.subject} - ${entry.type.toUpperCase()}`,
        description: `Cours automatiquement réservé depuis l'emploi du temps validé`,
        participants: entry.participants,
        dateTime: {
          start: this.calculateNextOccurrence(entry.day, entry.startTime),
          end: this.calculateNextOccurrence(entry.day, entry.endTime)
        },
        equipment: this.getRequiredEquipment(entry.type),
        priority: 1 as const,
        status: 'confirmed' as const
      };
      
      reservationService.addReservation(reservation);
    });

    console.log(`🎯 ${timetable.entries.length} réservations automatiques créées pour ${timetable.level} ${timetable.semester}`);
  }

  private getRoomId(roomName: string): string {
    const roomMap: Record<string, string> = {
      'Amphithéâtre A': 'spc001',
      'Amphithéâtre B': 'spc002',
      'Salle 201': 'spc002',
      'Salle 202': 'spc002', 
      'Salle 203': 'spc002',
      'Laboratoire Informatique': 'spc003'
    };
    return roomMap[roomName] || 'spc002';
  }

  private getTeacherId(teacherName: string): string {
    const teacherMap: Record<string, string> = {
      'Dr. Ahmed Benali': 'emp001',
      'Prof. Mohamed Saidi': 'emp003',
      'Dr. Amina Cherifi': 'emp005',
      'Mme. Fatima Khelifi': 'emp002',
      'Dr. Karim Boudjemaa': 'emp006',
      'Dr. Nadia Benaissa': 'emp007'
    };
    return teacherMap[teacherName] || 'emp001';
  }

  private calculateNextOccurrence(day: string, time: string): Date {
    const days = ['Samedi', 'Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi'];
    const targetDay = days.indexOf(day);
    const now = new Date();
    const nextWeek = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
    
    const [hours, minutes] = time.split(':').map(Number);
    
    // Calculer le prochain jour correspondant
    const currentDay = nextWeek.getDay();
    // Ajuster pour les jours universitaires (Samedi = 0 dans notre système)
    const adjustedCurrentDay = currentDay === 6 ? 0 : currentDay + 1;
    const daysUntilTarget = (targetDay - adjustedCurrentDay + 6) % 6;
    nextWeek.setDate(nextWeek.getDate() + daysUntilTarget);
    nextWeek.setHours(hours, minutes, 0, 0);
    
    return nextWeek;
  }

  private calculateDateForWeek(day: string, time: string, weekNumber: number): Date {
    const days = ['Samedi', 'Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi'];
    const targetDay = days.indexOf(day);
    
    // Date du début de l'année académique (septembre)
    const academicYearStart = new Date(2024, 8, 1); // 1er septembre 2024
    const [hours, minutes] = time.split(':').map(Number);
    
    // Trouver le premier jour correspondant
    const firstOccurrence = new Date(academicYearStart);
    const currentDay = firstOccurrence.getDay();
    const adjustedCurrentDay = currentDay === 6 ? 0 : currentDay + 1;
    const daysUntilTarget = (targetDay - adjustedCurrentDay + 6) % 6;
    firstOccurrence.setDate(firstOccurrence.getDate() + daysUntilTarget);
    
    // Ajouter les semaines
    const targetDate = new Date(firstOccurrence);
    targetDate.setDate(targetDate.getDate() + (weekNumber - 1) * 7);
    targetDate.setHours(hours, minutes, 0, 0);
    
    return targetDate;
  }

  private getRequiredEquipment(type: string): string[] {
    switch (type) {
      case 'cours': return ['Projecteur', 'Micro'];
      case 'tp': return ['Ordinateurs', 'Projecteur'];
      case 'td': return ['Tableau interactif'];
      default: return ['Projecteur'];
    }
  }

  // Contraintes par défaut avec les jours universitaires
  getDefaultConstraints(): TimetableConstraints {
    return {
      teacherAvailability: {
        'Dr. Ahmed Benali': ['Samedi', 'Dimanche', 'Lundi', 'Mardi'],
        'Prof. Mohamed Saidi': ['Dimanche', 'Lundi', 'Mardi', 'Mercredi'],
        'Dr. Amina Cherifi': ['Lundi', 'Mardi', 'Mercredi', 'Jeudi'],
        'Prof. Fatima Khelifi': ['Samedi', 'Dimanche', 'Mercredi', 'Jeudi'],
        'Dr. Karim Boudjemaa': ['Samedi', 'Lundi', 'Mercredi', 'Jeudi'],
        'Dr. Nadia Benaissa': ['Dimanche', 'Mardi', 'Mercredi', 'Jeudi']
      },
      roomCapacity: {
        'Amphithéâtre A': 300,
        'Amphithéâtre B': 200,
        'Salle 201': 45,
        'Salle 202': 40,
        'Salle 203': 35,
        'Laboratoire Informatique': 30
      },
      maxHoursPerDay: 8,
      preferredTimeSlots: [
        '08:00-09:30', '09:45-11:15', '11:30-13:00',
        '14:00-15:30', '15:45-17:15', '17:30-19:00'
      ]
    };
  }
}

export const timetableService = new TimetableService();
