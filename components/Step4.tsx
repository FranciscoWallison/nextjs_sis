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
    const { name, value, id } = e.target;
    const updatedQuestions = {
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
    const updatedQuestions = {
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

  const addNext = () => {
    console.log("====================================");
    const validar = {
      // banheira_hidromassagem
      banheira_hidromassagem_id: 7,
      banheira_hidromassagem_nao_lembro:
        questions.banheira_hidromassagem_nao_lembro || false,
      banheira_hidromassagem_date: questions.banheira_hidromassagem_date || "",
      banheira_hidromassagem_nao_feito:
        questions.banheira_hidromassagem_nao_feito || false,
      // sistema_seguranca
      sistema_seguranca_id: 14,
      sistema_seguranca_nao_lembro:
        questions.sistema_seguranca_nao_lembro || false,
      sistema_seguranca_date: questions.sistema_seguranca_date || "",
      sistema_seguranca_nao_feito:
        questions.sistema_seguranca_nao_feito || false,
      // grupo_gerador
      grupo_gerador_1_id: 2,
      grupo_gerador_1_nao_lembro: questions.grupo_gerador_1_nao_lembro || false,
      grupo_gerador_1_date: questions.grupo_gerador_1_date || "",
      grupo_gerador_1_nao_feito: questions.grupo_gerador_1_nao_feito || false,
      grupo_gerador_id: 1,
      grupo_gerador_nao_lembro: questions.grupo_gerador_nao_lembro || false,
      grupo_gerador_date: questions.grupo_gerador_date || "",
      grupo_gerador_nao_feito: questions.grupo_gerador_nao_feito || false,
      // sauna_umida
      sauna_umida_id: 0,
      sauna_umida_nao_lembro: questions.sauna_umida_nao_lembro || false,
      sauna_umida_date: questions.sauna_umida_date || "",
      sauna_umida_nao_feito: questions.sauna_umida_nao_feito || false,
    };

    console.log("====================================");
    console.log(questions);
    console.log("====================================");

    // Validando logica de formulario preenchido
    const formatData = (data) => {
      const formattedArray = [];
      const processedPrefixes = new Set();

      Object.keys(data).forEach((key) => {
        const [prefix, suffix] = key.split(/_(?=[^_]+$)/);

        if (!processedPrefixes.has(prefix)) {
          const id =
            data[`${prefix}_id`] !== undefined
              ? parseInt(data[`${prefix}_id`], 10)
              : null;
          const date =
            data[`${prefix}_date`] !== undefined ? data[`${prefix}_date`] : "";
          const nao_feito =
            data[`${prefix}_nao_feito`] !== undefined
              ? data[`${prefix}_nao_feito`]
              : false;
          const nao_lembro =
            data[`${prefix}_nao_lembro`] !== undefined
              ? data[`${prefix}_nao_lembro`]
              : false;

          if (id !== null && (date !== "" || nao_feito || nao_lembro)) {
            formattedArray.push({
              id: id,
              data: date,
              nao_feito: nao_feito,
              nao_lembro: nao_lembro,
            });
          }

          processedPrefixes.add(prefix);
        }
      });

      return formattedArray;
    };

    const result_questions = formatData(validar);

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
          {formData.filteredQuestions.map((question, index) => (
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
                    checked={questions[`${question.name}_nao_feito`] || false}
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
                    checked={questions[`${question.name}_nao_lembro`] || false}
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
