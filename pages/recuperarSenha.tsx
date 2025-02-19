import React from 'react';
import { Container, Box, Typography } from '@mui/material';
import ForgotPassword from '@/components/ForgotPassword';
import withAuthRedirect from '@/hoc/withAuthRedirect';

const RecuperarSenha: React.FC = () => {
  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Typography component="h1" variant="h5">
          Recuperar Senha
        </Typography>
        <ForgotPassword />
      </Box>
    </Container>
  );
};

export default withAuthRedirect(RecuperarSenha);
