// src/components/Step3.tsx
import React, { useContext } from "react";
import {
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  Typography,
} from "@mui/material";
import { FormContext } from "../contexts/FormContext";

const Step3: React.FC<{ handleNext: () => void; handleBack: () => void }> = ({
  handleNext,
  handleBack,
}) => {
  const context = useContext(FormContext);

  if (!context) {
    throw new Error("FormContext must be used within a FormProvider");
  }

  const { formData, setFormData } = context;

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.checked });
  };

  const addNext = () => {
    const maintenanceQuestions = [
      {
        id: 0,
        id_name: "sauna_umida",
        name: "sauna_umida",
        label: "Saúna úmida - data da última drenagem?",
      },
      {
        id: 1,
        id_name: "grupo_gerador",
        name: "grupo_gerador",
        label: "Grupo gerador - data da última checagem do nível do óleo?",
      },
      {
        id: 2,
        id_name: "grupo_gerador",
        name: "grupo_gerador_1",
        label: "Grupo gerador - último teste de funcionamento?",
      },
      {
        id: 14,
        id_name: "sistema_seguranca",
        name: "sistema_seguranca",
        label: "Iluminação de emergência - último teste de funcionamento?",
      },
      {
        id: 7,
        id_name: "banheira_hidromassagem",
        name: "banheira_hidromassagem",
        label: "Banheira de hidromassagem - último teste de funcionamento?",
      },
    ];

    const trueAttributes = Object.keys(formData).filter(
      (key) => formData[key] === true
    );

    const filteredQuestions = maintenanceQuestions.filter((question) =>
      trueAttributes.includes(question.id_name)
    );
    formData.filteredQuestions = filteredQuestions;

    console.log("========handleCheckboxChange==========");
    console.log(filteredQuestions);
    console.log("====================================");
    setFormData(formData);
    handleNext();
  };

  const items = [
    { name: "sauna_umida", label: "Saúna úmida" },
    { name: "grupo_gerador", label: "Grupo gerador" },
    { name: "banheira_hidromassagem", label: "Banheira de hidromassagem" },
    { name: "gerador_agua_quente", label: "Gerador de água quente coletivo" },
    { name: "porta_corta_fogo", label: "Porta corta fogo" },
    { name: "sistema_seguranca", label: "Sistema de segurança" },
    {
      name: "spda",
      label: "SPDA (Sistema de proteção contra descargas atmosféricas)",
    },
    { name: "sistema_irrigacao", label: "Sistema de irrigação" },
    { name: "bomba_agua_potavel", label: "Bomba de água potável" },
    { name: "bomba_incendio", label: "Bomba de incêndio" },
    { name: "portao_automatico", label: "Portão automático" },
  ];

  return (
    <Box>
      <Typography component="h1" sx={{ mt: 2, mb: 1 }} variant="h6">
        Excelente! Estamos quase finalizando. Precisamos que você preencha as
        informações iniciais referentes às manutenções.{" "}
      </Typography>
      <Typography component="h1" sx={{ mt: 2, mb: 1 }} variant="h6">
        {" "}
        Para o sistema gerar as manutenções necessárias conforme NBR 5674, por
        favor selecione abaixo caso o {formData.buildingName} possua algum
        desses itens:
      </Typography>
      {items.map((item) => (
        <FormControlLabel
          key={item.name}
          control={
            <Checkbox
              checked={formData[item.name] || false}
              onChange={handleCheckboxChange}
              name={item.name}
            />
          }
          label={item.label}
        />
      ))}
      <Box sx={{ display: "flex", justifyContent: "space-between", mt: 2 }}>
        <Button variant="contained" onClick={handleBack}>
          Voltar
        </Button>
        <Button variant="contained" onClick={addNext}>
          Continuar
        </Button>
      </Box>
    </Box>
  );
};

export default Step3;
