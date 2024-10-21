import React, { createContext, useState, useEffect, useContext } from "react";
import {
  Activity,
  pegarUsuarioPeriodicidades,
} from "@/services/firebaseService";
import { getStatus } from "@/utils/statusHelper";

// Define a interface do contexto
interface NotificationContextType {
  notificationCount: number;
  alerts: Activity[];
  fetchNotifications: any;
}

// Cria o contexto
const NotificationContext = createContext<NotificationContextType | undefined>(
  undefined
);

// Provedor de notificações
export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [alerts, setAlerts] = useState<Activity[]>([]);
  const [notificationCount, setNotificationCount] = useState(0);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    const responseP = await pegarUsuarioPeriodicidades();

    // Verifica se a resposta não é null
    if (responseP && responseP.questions) {
      const alertsToShow = await Promise.all(
        responseP.questions.map(async (activity) => {
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
    }
  };

  return (
    <NotificationContext.Provider value={{ notificationCount, alerts, fetchNotifications }}>
      {children}
    </NotificationContext.Provider>
  );
};

// Custom hook para usar o contexto
export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error(
      "useNotification must be used within a NotificationProvider"
    );
  }
  return context;
};
