import React, { createContext, useState, useEffect, useContext } from "react";
import { Activity, pegarUsuarioPeriodicidades } from "@/services/firebaseService";
import { getStatus } from "@/utils/statusHelper";

// Define a interface do contexto
interface NotificationContextType {
  notificationCount: number;
  alerts: Activity[];
}

// Cria o contexto
const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

// Provedor de notificações
export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [alerts, setAlerts] = useState<Activity[]>([]);
  const [notificationCount, setNotificationCount] = useState(0);

  useEffect(() => {
    const fetchNotifications = async () => {
      const activities: Activity[] = await pegarUsuarioPeriodicidades();
      const alertsToShow = await Promise.all(
        activities.questions.map(async (activity) => {
          const { status } = await getStatus(activity);
          if (status === "Vencido" || status === "A vencer") {
            return activity;
          }
          return null;
        })
      );

      const validAlerts = alertsToShow.filter(Boolean) as Activity[];
      setAlerts(validAlerts);
      setNotificationCount(validAlerts.length);
    };

    fetchNotifications();
  }, []);

  return (
    <NotificationContext.Provider value={{ notificationCount, alerts }}>
      {children}
    </NotificationContext.Provider>
  );
};

// Custom hook para usar o contexto
export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error("useNotification must be used within a NotificationProvider");
  }
  return context;
};
