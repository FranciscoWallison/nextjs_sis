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
import HelpQuestions from "@/utils/HelpQuestions";

interface Questions {
  [key: string]: string | boolean;
}



interface Question {
  id: number;
  name: string;
  label: string;
}

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
  const [questions, setQuestions] = useState<Questions>({});

  const handleRadioChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFillNow((e.target as HTMLInputElement).value as "yes" | "no");
  };

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, id } = e.target;
    const updatedQuestions: Questions = {
      ...questions,
      [name]: value,
    };

    const questionName = name.replace(/_(date)\d*$/, "");

    updatedQuestions[`${questionName}_id`] = id;

    // Se o usuário selecionar uma data, limpar as opções de checkbox correspondentes
    if (name.includes("_date")) {
      updatedQuestions[`${questionName}_nao_feito`] = false;
      updatedQuestions[`${questionName}_nao_lembro`] = false;
    }
    setQuestions(updatedQuestions);
    setFormData({ ...formData, ...updatedQuestions });
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked, id } = e.target;
    const updatedQuestions: Questions = {
      ...questions,
      [name]: checked,
    };
    const questionName = name.replace(/_(nao_feito|nao_lembro)\d*$/, "");

    updatedQuestions[`${questionName}_id`] = id;

    // Se o usuário selecionar uma opção de checkbox, limpar o valor da data correspondente
    if (name.includes("_nao_feito") || name.includes("_nao_lembro")) {
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

  const addNext = async () => {
    const result_questions = await HelpQuestions.formatDataStep4(questions);
    formData.questions = result_questions;
    setFormData(formData);
    handleNext(); // Chamando a função handleNext ao avançar
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
          {formData.filteredQuestions.map(
            (question: Question, index: number) => (
              <Box key={index}>
                <Typography sx={{ mt: 3, mb: 2 }} component="h5" variant="h6">
                  {question.label}
                </Typography>
                <TextField
                  label="Data"
                  id={`${question.id}`}
                  name={`${question.name}_date`}
                  type="date"
                  InputLabelProps={{
                    shrink: true,
                  }}
                  value={questions[`${question.name}_date`] || ""}
                  onChange={handleFormChange}
                  fullWidth
                  sx={{ mb: 1 }}
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      id={`${question.id}`}
                      name={`${question.name}_nao_feito`}
                      checked={Boolean(questions[`${question.name}_nao_feito`])}
                      onChange={handleCheckboxChange}
                    />
                  }
                  label="Não foi feito"
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      id={`${question.id}`}
                      name={`${question.name}_nao_lembro`}
                      checked={Boolean(
                        questions[`${question.name}_nao_lembro`]
                      )}
                      onChange={handleCheckboxChange}
                    />
                  }
                  label="Não lembro"
                />
              </Box>
            )
          )}
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
