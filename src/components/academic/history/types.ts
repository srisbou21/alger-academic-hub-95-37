
export interface AcademicYear {
  year: string;
  level: string;
  semesters: {
    id: string;
    name: string;
    average: number;
    ects: number;
    status: "validated" | "failed" | "ongoing";
    rank?: number;
    totalStudents?: number;
  }[];
  yearAverage: number;
  totalEcts: number;
  status: "validated" | "failed" | "ongoing";
}
