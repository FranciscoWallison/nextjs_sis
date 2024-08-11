import React from "react";
import MaintenanceActivity from "./MaintenanceActivity";
import { Typography, Box } from "@mui/material";

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
}

interface MaintenanceCategoryProps {
  category: string;
  activities: Activity[];
  onUpdate: (updatedActivity: Activity) => void;
  onRemove: (activityId: number) => void;
  removeValid: boolean;
  titleUpdate: string;
}

const MaintenanceCategory: React.FC<MaintenanceCategoryProps> = ({
  category,
  activities,
  onUpdate,
  onRemove,
  removeValid,
  titleUpdate
}) => {
  return (
    <>
      {/* <Typography variant="h4" component="div" gutterBottom>
        {category}
      </Typography> */}
      {activities.map((activity, index) => (
        <MaintenanceActivity
          key={index}
          activity={activity}
          onUpdate={onUpdate}
          onRemove={onRemove}
          removeValid={removeValid}
          titleUpdate={titleUpdate}
        />
      ))}
    </>
  );
};

export default MaintenanceCategory;
