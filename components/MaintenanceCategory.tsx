import React from 'react';
import { Typography, Box } from '@mui/material';
import MaintenanceActivity from './MaintenanceActivity';

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
}

interface MaintenanceCategoryProps {
  category: string;
  activities: Activity[];
}

const MaintenanceCategory: React.FC<MaintenanceCategoryProps> = ({ category, activities }) => {
  return (
    <Box mb={4}>
      <Typography variant="h4" component="div" gutterBottom>
        {category}
      </Typography>
      {activities.map((activity, index) => (
        <MaintenanceActivity key={index} activity={activity} />
      ))}
    </Box>
  );
};

export default MaintenanceCategory;
