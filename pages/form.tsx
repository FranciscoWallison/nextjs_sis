import React from "react";
import withAuthForm from "../hoc/withAuthForm";
import HorizontalLinearStepper from "@/components/HorizontalLinearStepper";
import { FormProvider } from "@/contexts/FormContext";
import { Container, Box } from "@mui/material";

const form: React.FC = () => {
  return (
    <FormProvider>
      <Container
        component="main"
        maxWidth="md" // Define o tamanho máximo do container
        sx={{
          padding: { xs: 2, sm: 4 },
          marginTop: { xs: 4, sm: 8 },
          marginBottom: { xs: 4, sm: 8 },
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <HorizontalLinearStepper />
      </Container>

    </FormProvider>
  );
};
export default withAuthForm(form);

