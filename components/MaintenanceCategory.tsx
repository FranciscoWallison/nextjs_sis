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
}

const MaintenanceCategory: React.FC<MaintenanceCategoryProps> = ({ category, activities }) => {
  return (
    <Box mb={4}>
      {/* <Typography variant="h4" gutterBottom>
        {category}
      </Typography> */}
      {activities.map((activity, index) => (
        <MaintenanceActivity key={index} activity={activity} />
      ))}
    </Box>
  );
};

export default MaintenanceCategory;
