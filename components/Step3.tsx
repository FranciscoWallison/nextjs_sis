import React, { useContext, useState, useEffect } from "react";
import {
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  Typography,
} from "@mui/material";
import { FormContext } from "../contexts/FormContext";

interface FormItem {
  name: string;
  label: string;
}

interface Item {
  titulo: string;
  atividade: string;
  responsavel: string;
  Periodicidade: string;
  obrigatorio: string;
  responsavel_info: {
    nome: string;
    telefone: string;
    email: string;
  };
  data: string;
  id_name: string;
  id: number;
  category_id: number;
}

const Step3: React.FC<{ handleNext: () => void; handleBack: () => void }> = ({
  handleNext,
  handleBack,
}) => {
  const context = useContext(FormContext);
  const [formItems, setFormItems] = useState<FormItem[]>([]);
  const [allItems, setAllItems] = useState<Item[]>([]);

  if (!context) {
    throw new Error("FormContext must be used within a FormProvider");
  }

  const { formData, setFormData } = context;

  // Função para buscar e processar os dados dos itens
  const fetchFormItems = async () => {
    try {
      const response = await fetch("/items/items.json");
      const items = await response.json();

      // Filtrar e mapear itens para remover duplicatas com base em id_name
      const mappedItems: FormItem[] = items.reduce((acc: FormItem[], item: any) => {
        if (!acc.some((formItem) => formItem.name === item.id_name)) {
          acc.push({
            name: item.id_name,
            label: item.titulo,
          });
        }
        return acc;
      }, []);
      // mappedItems.push({ name: "hasElevator", label: "Possui Elevadores?" })
      setFormItems(mappedItems);
      setAllItems(items); // Salva todos os itens para uso posterior
    } catch (error) {
      console.error("Erro ao buscar ou processar os itens:", error);
    }
  };

  useEffect(() => {
    fetchFormItems();
  }, []);

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.checked });
  };

  const addNext = () => {
    const trueAttributes = Object.keys(formData).filter(
      (key) => formData[key] === true
    );

    // Filtrar todos os itens que correspondem aos atributos selecionados
    const selectedItems = allItems.filter((item) =>
      trueAttributes.includes(item.id_name)
    );

    // Adicionar todos os itens obrigatórios
    // const mandatoryItems = allItems.filter((item) => item.obrigatorio === "Sim");

    // Combinar os itens selecionados e obrigatórios, removendo duplicatas
    // const combinedItems = Array.from(new Set([...selectedItems, ...mandatoryItems]));

    // Adicionar o campo `data` a cada item combinado
    const finalItems = selectedItems.map((item) => ({
      ...item,
      data: "", // Inicializa o campo data como string vazia
    }));

    // Atualizar o estado do formulário com os itens finais
    // TODO::ADICIONAR A TIPAGEM
    setFormData((prevData: any) => ({
      ...prevData,
      questions: finalItems,
    }));

    handleNext();
  };

  return (
    <Box>
      <Typography component="h1" sx={{ mt: 2, mb: 1 }} variant="h6">
        Para o sistema gerar as manutenções necessárias conforme NBR 5674, por
        favor selecione abaixo caso o {formData.buildingName} possua algum
        desses itens:
      </Typography>
      {formItems.map((item) => (
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
