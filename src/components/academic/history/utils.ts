
export const getStatusColor = (status: string) => {
  switch (status) {
    case "validated": return "bg-green-100 text-green-800 border-green-200";
    case "failed": return "bg-red-100 text-red-800 border-red-200";
    case "ongoing": return "bg-blue-100 text-blue-800 border-blue-200";
    default: return "bg-slate-100 text-slate-800 border-slate-200";
  }
};

export const getStatusText = (status: string) => {
  switch (status) {
    case "validated": return "Validé";
    case "failed": return "Non validé";
    case "ongoing": return "En cours";
    default: return status;
  }
};

export const getMentionColor = (average: number) => {
  if (average >= 16) return "text-purple-600";
  if (average >= 14) return "text-blue-600";
  if (average >= 12) return "text-emerald-600";
  if (average >= 10) return "text-yellow-600";
  return "text-red-600";
};

export const getMention = (average: number) => {
  if (average >= 16) return "Très Bien";
  if (average >= 14) return "Bien";
  if (average >= 12) return "Assez Bien";
  if (average >= 10) return "Passable";
  return "Ajourné";
};
