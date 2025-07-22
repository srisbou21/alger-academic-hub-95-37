
import { Badge } from "@/components/ui/badge";
import { Clock, MapPin, CheckCircle, AlertTriangle } from "lucide-react";
import { ScheduleItem as ScheduleItemType } from "./types";

interface ScheduleItemProps {
  item: ScheduleItemType;
}

export const ScheduleItemComponent = ({ item }: ScheduleItemProps) => {
  const getTypeColor = (type: string) => {
    switch (type) {
      case "cours": return "bg-blue-100 text-blue-800 border-blue-200";
      case "td": return "bg-emerald-100 text-emerald-800 border-emerald-200";
      case "tp": return "bg-purple-100 text-purple-800 border-purple-200";
      case "examen": return "bg-red-100 text-red-800 border-red-200";
      default: return "bg-slate-100 text-slate-800 border-slate-200";
    }
  };

  const getChangeIcon = (changeType?: string) => {
    switch (changeType) {
      case "room": return <MapPin className="h-3 w-3" />;
      case "time": return <Clock className="h-3 w-3" />;
      case "teacher": return <CheckCircle className="h-3 w-3" />;
      case "cancelled": return <AlertTriangle className="h-3 w-3" />;
      default: return null;
    }
  };

  return (
    <div 
      className={`p-4 rounded-lg border ${
        item.isChanged ? 'bg-yellow-50 border-yellow-200' : 'bg-slate-50 border-slate-200'
      }`}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <Badge className={getTypeColor(item.type)}>
              {item.type.toUpperCase()}
            </Badge>
            <h5 className="font-medium text-slate-800">{item.subject}</h5>
            {item.isChanged && (
              <Badge variant="outline" className="text-amber-600 border-amber-300">
                {getChangeIcon(item.changeType)}
                Modifié
              </Badge>
            )}
          </div>
          
          <div className="grid grid-cols-3 gap-4 text-sm text-slate-600">
            <div className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {item.startTime} - {item.endTime}
            </div>
            <div className="flex items-center gap-1">
              <MapPin className="h-3 w-3" />
              {item.changeType === "cancelled" ? (
                <span className="text-red-600 font-medium">ANNULÉ</span>
              ) : (
                item.room
              )}
            </div>
            <div>
              {item.teacher}
            </div>
          </div>
          
          {item.isChanged && item.originalValue && item.changeType !== "cancelled" && (
            <div className="mt-2 text-xs text-amber-600">
              Anciennement : {item.originalValue}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
