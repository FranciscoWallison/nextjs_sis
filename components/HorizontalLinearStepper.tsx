// src/components/HorizontalLinearStepper.tsx
import React, { useContext } from "react";
import {
  Box,
  Stepper,
  Step,
  StepLabel,
  Button,
  Typography,
} from "@mui/material";
import { FormProvider } from "@/contexts/FormContext";
import Step1 from "./Step1";
import Step2 from "./Step2";
import Step3 from "./Step3";
import Step4 from "./Step4";

const steps = [
  "Saudação Inicial",
  "Informações do Condomínio",
  "Cadastrando as Manutenções",
  "Confirmação e Conclusão",
];

export default function HorizontalLinearStepper() {
  const [activeStep, setActiveStep] = React.useState(0);

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleReset = () => {
    setActiveStep(0);
  };

  const getStepContent = (step: number) => {
    switch (step) {
      case 0:
        return <Step1 handleNext={handleNext} />;
      case 1:
        return <Step2 handleNext={handleNext} handleBack={handleBack} />;
      case 2:
        return <Step3 handleNext={handleNext} handleBack={handleBack} />;
      case 3:
        return <Step4 handleNext={handleNext} handleBack={handleBack} />;
      default:
        return "Unknown step";
    }
  };

  return (
    <FormProvider>
      <Box
        sx={{
          width: "100%",
          padding: { xs: 2, sm: 4 },
          boxSizing: "border-box",
        }}
      >
        <Stepper activeStep={activeStep} alternativeLabel>
          {steps.map((label, index) => (
            <Step key={label}>
              <StepLabel>
                <Typography variant="body2" sx={{ textAlign: "center" }}>
                  {label}
                </Typography>
              </StepLabel>
            </Step>
          ))}
        </Stepper>
        <Box
          sx={{
            marginTop: { xs: 2, sm: 4 },
            padding: { xs: 2, sm: 4 },
            display: "flex",
            justifyContent: "center",
          }}
        >
          {activeStep === steps.length ? (
            <Box textAlign="center">
              <Typography sx={{ mt: 2, mb: 1 }}>
                Todos os passos foram concluídos!
              </Typography>
              <Button onClick={handleReset} variant="contained">
                Reiniciar
              </Button>
            </Box>
          ) : (
            getStepContent(activeStep)
          )}
        </Box>
      </Box>

    </FormProvider>
  );
}
