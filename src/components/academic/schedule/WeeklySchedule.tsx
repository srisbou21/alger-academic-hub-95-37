
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "lucide-react";
import { ScheduleItem } from "./types";
import { ScheduleItemComponent } from "./ScheduleItem";

interface WeeklyScheduleProps {
  schedule: ScheduleItem[];
}

export const WeeklySchedule = ({ schedule }: WeeklyScheduleProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="h-5 w-5" />
          Mon Emploi du Temps - Semaine courante
        </CardTitle>
        <CardDescription>
          Emploi du temps personnalisé avec notifications automatiques des changements
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi"].map((day) => {
            const daySchedule = schedule.filter(item => item.day === day);
            
            return (
              <div key={day} className="border-l-4 border-blue-400 pl-4">
                <h4 className="font-semibold text-slate-800 mb-3">{day}</h4>
                {daySchedule.length > 0 ? (
                  <div className="space-y-2">
                    {daySchedule.map((item) => (
                      <ScheduleItemComponent key={item.id} item={item} />
                    ))}
                  </div>
                ) : (
                  <p className="text-slate-500 text-sm italic">Aucun cours prévu</p>
                )}
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};
