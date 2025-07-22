
export const calculateSemestersFromDuration = (durationInYears: number): string[] => {
  const semesters: string[] = [];
  for (let year = 1; year <= durationInYears; year++) {
    semesters.push(`S${year * 2 - 1}`, `S${year * 2}`);
  }
  return semesters;
};

export const getSemesterNumber = (semester: string): number => {
  const match = semester.match(/S(\d+)/);
  return match ? parseInt(match[1]) : 1;
};

export const getYearFromSemester = (semester: string): number => {
  const semesterNum = getSemesterNumber(semester);
  return Math.ceil(semesterNum / 2);
};

export const formatSemesterDisplay = (semester: string): string => {
  const year = getYearFromSemester(semester);
  const isFirstSemester = getSemesterNumber(semester) % 2 === 1;
  return `${semester} (${year}${isFirstSemester ? 'ère' : 'ème'} année - ${isFirstSemester ? '1er' : '2ème'} semestre)`;
};

export const getAvailableSemestersForSpecialty = (specialtyDuration: number): Array<{
  value: string;
  label: string;
  year: number;
}> => {
  const semesters = calculateSemestersFromDuration(specialtyDuration);
  return semesters.map(semester => ({
    value: semester,
    label: formatSemesterDisplay(semester),
    year: getYearFromSemester(semester)
  }));
};
