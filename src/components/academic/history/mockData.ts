
import { AcademicYear } from "./types";

export const mockAcademicHistory: AcademicYear[] = [
  {
    year: "2024-2025",
    level: "L3 Économie",
    semesters: [
      {
        id: "s1-2024",
        name: "Semestre 1",
        average: 13.1,
        ects: 30,
        status: "ongoing",
        rank: 12,
        totalStudents: 85
      }
    ],
    yearAverage: 13.1,
    totalEcts: 30,
    status: "ongoing"
  },
  {
    year: "2023-2024",
    level: "L2 Économie",
    semesters: [
      {
        id: "s1-2023",
        name: "Semestre 1",
        average: 14.2,
        ects: 30,
        status: "validated",
        rank: 8,
        totalStudents: 92
      },
      {
        id: "s2-2023",
        name: "Semestre 2",
        average: 13.8,
        ects: 30,
        status: "validated",
        rank: 10,
        totalStudents: 88
      }
    ],
    yearAverage: 14.0,
    totalEcts: 60,
    status: "validated"
  },
  {
    year: "2022-2023",
    level: "L1 Économie",
    semesters: [
      {
        id: "s1-2022",
        name: "Semestre 1",
        average: 12.5,
        ects: 30,
        status: "validated",
        rank: 25,
        totalStudents: 120
      },
      {
        id: "s2-2022",
        name: "Semestre 2",
        average: 13.2,
        ects: 30,
        status: "validated",
        rank: 18,
        totalStudents: 115
      }
    ],
    yearAverage: 12.85,
    totalEcts: 60,
    status: "validated"
  }
];
