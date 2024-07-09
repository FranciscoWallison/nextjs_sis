import React from 'react';
import { Container, Box, Typography } from '@mui/material';
import LoginForm from '@/components/LoginForm';
import withAuthRedirect from '@/hoc/withAuthRedirect';

const LoginPage: React.FC = () => {
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
          Login
        </Typography>
        <LoginForm />
      </Box>
    </Container>
  );
};

export default withAuthRedirect(LoginPage);
