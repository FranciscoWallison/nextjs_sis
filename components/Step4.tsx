import React, { useContext, useState } from "react";
import {
  Box,
  Button,
  Typography,
  FormControlLabel,
  Checkbox,
  TextField,
  Paper,
  Radio,
  RadioGroup,
} from "@mui/material";
import { FormContext } from "@/contexts/FormContext";

const Step4: React.FC<{ handleNext: () => void; handleBack: () => void }> = ({
  handleNext,
  handleBack,
}) => {
  const context = useContext(FormContext);

  if (!context) {
    throw new Error("FormContext must be used within a FormProvider");
  }

  const { formData, setFormData } = context;
  const [fillNow, setFillNow] = useState<"yes" | "no">("no");
  const [questions, setQuestions] = useState({});

  const handleRadioChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFillNow((e.target as HTMLInputElement).value as "yes" | "no");
  };

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const updatedQuestions = { ...questions, [name]: value };

    // Se o usuário selecionar uma data, limpar as opções de checkbox correspondentes
    if (name.includes("_date")) {
      const questionName = name.replace(/_date\d+$/, "");
      updatedQuestions[`${questionName}_nao_feito`] = false;
      updatedQuestions[`${questionName}_nao_lembro`] = false;
    }

    setQuestions(updatedQuestions);
    setFormData({ ...formData, ...updatedQuestions });
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    const updatedQuestions = { ...questions, [name]: checked };

    // Se o usuário selecionar uma opção de checkbox, limpar o valor da data correspondente
    if (name.includes("_nao_feito") || name.includes("_nao_lembro")) {
      const questionName = name.replace(/_(nao_feito|nao_lembro)\d*$/, "");
      updatedQuestions[`${questionName}_date`] = "";

      // Garantir que apenas uma checkbox possa ser selecionada por campo
      if (name.includes("_nao_feito")) {
        updatedQuestions[`${questionName}_nao_lembro`] = false;
      } else if (name.includes("_nao_lembro")) {
        updatedQuestions[`${questionName}_nao_feito`] = false;
      }
    }

    setQuestions(updatedQuestions);
    setFormData({ ...formData, ...updatedQuestions });
  };
  const addNext = () => {

    console.log('====================================');
    console.log(questions);
    console.log('====================================');
    // handleNext
  };

  return (
    <Box>
      <Typography component="h1" sx={{ mt: 2, mb: 1 }} variant="h6">
        Parabéns! Você avançou mais uma etapa. Você ainda não preencheu as datas
        das últimas manutenções, precisamos delas para gerar sua gestão de
        manutenções. Deseja preencher agora?
      </Typography>
      <Typography component="h1" sx={{ mt: 2, mb: 1 }} variant="h6">
        Se você não preencher agora, o sistema irá gerar alertas para os itens
        prioritários.
      </Typography>
      <RadioGroup value={fillNow} onChange={handleRadioChange}>
        <FormControlLabel
          value="yes"
          control={<Radio />}
          label="Sim, cadastrar agora"
        />
        <FormControlLabel
          value="no"
          control={<Radio />}
          label="Não, irei cadastrar no futuro"
        />
      </RadioGroup>
      {fillNow === "yes" && (
        <Paper
          sx={{
            p: 3,
            display: "flex",
            flexDirection: "column",
          }}
        >
          {formData.filteredQuestions.map((question, index) => (
            <Box key={index}>
              <Typography sx={{ mt: 3, mb: 2 }} component="h5" variant="h6">
                {question.label}
              </Typography>
              <TextField
                label="Data"
                name={`${question.name}_date${index}`}
                type="date"
                InputLabelProps={{
                  shrink: true,
                }}
                value={questions[`${question.name}_date${index}`] || ""}
                onChange={handleFormChange}
                fullWidth
                sx={{ mb: 1 }}
              />
              <FormControlLabel
                control={
                  <Checkbox
                    name={`${question.name}_nao_feito${index}`}
                    checked={
                      questions[`${question.name}_nao_feito${index}`] || false
                    }
                    onChange={handleCheckboxChange}
                  />
                }
                label="Não foi feito"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    name={`${question.name}_nao_lembro${index}`}
                    checked={
                      questions[`${question.name}_nao_lembro${index}`] || false
                    }
                    onChange={handleCheckboxChange}
                  />
                }
                label="Não lembro"
              />
            </Box>
          ))}
        </Paper>
      )}
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

export default Step4;
