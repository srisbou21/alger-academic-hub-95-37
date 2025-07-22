
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CalendarCheck } from "lucide-react";

interface ScheduleItem {
  day: string;
  time: string;
  subject: string;
  room: string;
  type: string;
}

interface TeachingScheduleProps {
  schedule: ScheduleItem[];
}

export const TeachingSchedule = ({ schedule }: TeachingScheduleProps) => {
  return (
    <Card className="border-blue-200 shadow-lg">
      <CardHeader className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-t-lg">
        <CardTitle className="flex items-center gap-2 text-blue-800">
          <CalendarCheck className="h-5 w-5" />
          Mon Planning d'Enseignement
        </CardTitle>
        <CardDescription>Emploi du temps de la semaine</CardDescription>
      </CardHeader>
      <CardContent className="p-6">
        <div className="space-y-3">
          {schedule.map((item, index) => (
            <div key={index} className="flex items-center justify-between p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors">
              <div className="flex items-center gap-4">
                <div className="text-sm font-mono text-blue-700 bg-blue-200 px-3 py-1 rounded">
                  {item.day}
                </div>
                <div className="text-sm font-mono text-blue-600">
                  {item.time}
                </div>
              </div>
              <div className="text-right">
                <p className="font-medium text-slate-800">{item.subject}</p>
                <p className="text-sm text-slate-500">{item.room} • {item.type}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
