import React from "react";
// import withAuth from '../hoc/withAuth';
// import MainLayout from '../components/layout/MainLayout';
import HorizontalLinearStepper from "@/components/HorizontalLinearStepper";
import { FormProvider } from "@/contexts/FormContext";
import { Container, Box } from "@mui/material";


const form: React.FC = () => {
  return (
    <FormProvider>
      <Container component="main">
        <Box
          sx={{
            marginTop: 8,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <HorizontalLinearStepper />
        </Box>
      </Container>
    </FormProvider>
  );
};

export default form;
