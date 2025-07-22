
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { ScheduleItem, Notification } from "./schedule/types";
import { NotificationCard } from "./schedule/NotificationCard";
import { WeeklySchedule } from "./schedule/WeeklySchedule";
import { NotificationSettings } from "./schedule/NotificationSettings";

export const PersonalizedSchedule = () => {
  const { toast } = useToast();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [schedule, setSchedule] = useState<ScheduleItem[]>([
    {
      id: "1",
      subject: "Microéconomie",
      type: "cours",
      teacher: "Dr. Martin",
      room: "Amphi A",
      day: "Lundi",
      startTime: "08:30",
      endTime: "10:00",
      isChanged: true,
      changeType: "room",
      originalValue: "Amphi B"
    },
    {
      id: "2",
      subject: "Statistiques",
      type: "td",
      teacher: "Mme. Dubois",
      room: "Salle 201",
      day: "Lundi",
      startTime: "14:00",
      endTime: "15:30",
      isChanged: false
    },
    {
      id: "3",
      subject: "Management",
      type: "cours",
      teacher: "M. Bernard",
      room: "Amphi C",
      day: "Mardi",
      startTime: "10:00",
      endTime: "11:30",
      isChanged: true,
      changeType: "cancelled"
    }
  ]);

  useEffect(() => {
    // Simuler les notifications de changements
    const newNotifications: Notification[] = [
      {
        id: "1",
        message: "Cours de Microéconomie déplacé de l'Amphi B vers l'Amphi A",
        type: "info",
        timestamp: new Date(Date.now() - 3600000), // Il y a 1 heure
        scheduleItemId: "1"
      },
      {
        id: "2",
        message: "Cours de Management annulé pour demain",
        type: "warning",
        timestamp: new Date(Date.now() - 1800000), // Il y a 30 minutes
        scheduleItemId: "3"
      }
    ];
    setNotifications(newNotifications);
  }, []);

  const markAsRead = (notificationId: string) => {
    setNotifications(prev => prev.filter(n => n.id !== notificationId));
    toast({
      title: "Notification marquée comme lue",
      description: "La notification a été supprimée de votre liste"
    });
  };

  return (
    <div className="space-y-6">
      <NotificationCard notifications={notifications} onMarkAsRead={markAsRead} />
      <WeeklySchedule schedule={schedule} />
      <NotificationSettings />
    </div>
  );
};
