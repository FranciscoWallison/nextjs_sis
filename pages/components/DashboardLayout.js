import React from 'react';
import { Container } from '@mui/material';

const DashboardLayout = ({ children, handleOpenFilters }) => {
  return (
    <Container>
      {/* Implementação do layout do dashboard */}
      {children}
    </Container>
  );
};

export default DashboardLayout;
