
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock } from "lucide-react";

interface Task {
  task: string;
  deadline: string;
  priority: string;
}

interface PendingTasksProps {
  tasks: Task[];
}

export const PendingTasks = ({ tasks }: PendingTasksProps) => {
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high": return "border-red-200 bg-red-50 text-red-800";
      case "medium": return "border-amber-200 bg-amber-50 text-amber-800";
      case "low": return "border-green-200 bg-green-50 text-green-800";
      default: return "border-slate-200 bg-slate-50 text-slate-800";
    }
  };

  return (
    <Card className="border-amber-200 shadow-lg">
      <CardHeader className="bg-gradient-to-r from-amber-50 to-amber-100 rounded-t-lg">
        <CardTitle className="flex items-center gap-2 text-amber-800">
          <Clock className="h-5 w-5" />
          Tâches en cours
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        <div className="space-y-3">
          {tasks.map((task, index) => (
            <div key={index} className={`p-3 border rounded-lg ${getPriorityColor(task.priority)}`}>
              <h4 className="font-medium text-sm">{task.task}</h4>
              <p className="text-xs mt-1">Échéance: {new Date(task.deadline).toLocaleDateString('fr-FR')}</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
