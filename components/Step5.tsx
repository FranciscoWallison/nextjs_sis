// src/components/Step5.tsx
import React from 'react';
import { Box, Button, Typography } from '@mui/material';
import { useRouter } from 'next/router';

const Step5: React.FC = () => {
  const router = useRouter();

  const handleRedirect = () => {
    router.push('/');
  };

  return (
    <Box>
      <Typography component="h1" sx={{ mt: 2, mb: 1 }} variant="h6">
        Parabéns! Você cadastrou o seu prédio, e todas as manutenções obrigatórias já estão cadastradas.
      </Typography>
      <Button variant="contained" onClick={handleRedirect} sx={{ mt: 2 }}>
        Seguir para o Painel Principal
      </Button>
    </Box>
  );
};

export default Step5;
