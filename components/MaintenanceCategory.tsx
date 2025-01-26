import React, { useEffect, useState } from "react";
import MaintenanceActivity from "./MaintenanceActivity";
import { Typography } from "@mui/material";
import { getStatus } from "@/utils/statusHelper";

interface ResponsibleInfo {
  nome: string;
  telefone: string;
  email: string;
}

interface Activity {
  titulo: string;
  atividade: string;
  responsavel: string;
  Periodicidade: string;
  obrigatorio: string;
  responsavel_info: ResponsibleInfo;
  data?: string;
  nao_feito?: boolean;
  nao_lembro?: boolean;
  id_name: string;
  id: number;
  dueDate?: string;
}

interface MaintenanceCategoryProps {
  category: string;
  activities: Activity[];
  onUpdate: (updatedActivity: Activity) => void;
  onRemove: (activityId: number) => void;
  removeValid: boolean;
  titleUpdate: string;
}

const formatDate = (date: Date): string => {
  return date.toLocaleDateString("pt-BR", {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
};

const MaintenanceCategory: React.FC<MaintenanceCategoryProps> = ({
  category,
  activities,
  onUpdate,
  onRemove,
  removeValid,
  titleUpdate,
}) => {
  const [statusData, setStatusData] = useState<{ [key: number]: any }>({});

  useEffect(() => {
    const fetchStatus = async () => {
      const statuses: { [key: number]: any } = {};

      for (const activity of activities) {
        const dataStatus = await getStatus(activity);

        if (dataStatus.dueDate instanceof Date) {
          statuses[activity.id] = {
            ...activity,
            dueDate: formatDate(dataStatus.dueDate),
          };
        } else {
          statuses[activity.id] = activity;
        }
      }

      setStatusData(statuses);
    };

    fetchStatus();
  }, [activities]);

  return (
    <>
      {activities
        ?.map((activity) => statusData[activity.id] || activity)
        .sort((a, b) => a.titulo.localeCompare(b.titulo)) // Ordena as atividades por 'titulo'
        .map((activityWithDueDate) => (
          <MaintenanceActivity
            key={activityWithDueDate.id}
            activity={activityWithDueDate}
            onUpdate={onUpdate}
            onRemove={onRemove}
            removeValid={removeValid}
            titleUpdate={titleUpdate}
          />
        ))}
    </>
  );
};

export default React.memo(MaintenanceCategory);
