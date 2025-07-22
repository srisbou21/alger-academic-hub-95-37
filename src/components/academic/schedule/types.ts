
export interface ScheduleItem {
  id: string;
  subject: string;
  type: "cours" | "td" | "tp" | "examen";
  teacher: string;
  room: string;
  day: string;
  startTime: string;
  endTime: string;
  isChanged: boolean;
  changeType?: "room" | "time" | "teacher" | "cancelled";
  originalValue?: string;
}

export interface Notification {
  id: string;
  message: string;
  type: "info" | "warning" | "error";
  timestamp: Date;
  scheduleItemId: string;
}
