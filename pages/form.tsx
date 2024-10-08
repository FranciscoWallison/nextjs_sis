import React from "react";
import withAuthForm from "../hoc/withAuthForm";
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
            marginBottom: 8,
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
export default withAuthForm(form);
