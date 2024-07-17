import React from 'react';
import { Card, CardContent, Typography, Box } from '@mui/material';

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

interface MaintenanceActivityProps {
  activity: Activity;
}

const MaintenanceActivity: React.FC<MaintenanceActivityProps> = ({ activity }) => {
  return (
    <Card sx={{ mb: 2 }}>
      <CardContent>
        <Typography variant="h5" component="div">
          {activity.titulo}
        </Typography>
        <Typography sx={{ mb: 1.5 }} color="text.secondary">
          {activity.atividade}
        </Typography>
        <Typography variant="body2">
          <strong>Responsável:</strong> {activity.responsavel}
        </Typography>
        <Typography variant="body2">
          <strong>Periodicidade:</strong> {activity.Periodicidade}
        </Typography>
        <Typography variant="body2">
          <strong>Obrigatório:</strong> {activity.obrigatorio}
        </Typography>
        <Box mt={2}>
          <Typography variant="body2">
            <strong>Responsável Info:</strong>
          </Typography>
          <Typography variant="body2">Nome: {activity.responsavel_info.nome}</Typography>
          <Typography variant="body2">Telefone: {activity.responsavel_info.telefone}</Typography>
          <Typography variant="body2">Email: {activity.responsavel_info.email}</Typography>
        </Box>
      </CardContent>
    </Card>
  );
};

export default MaintenanceActivity;
