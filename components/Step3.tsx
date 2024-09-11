import React, { useContext, useState, useEffect } from "react";
import {
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  Typography,
  Grid,
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
  const [selectAllChecked, setSelectAllChecked] = useState(false); // Estado para controlar o botão "Selecionar Todos"

  if (!context) {
    throw new Error("FormContext must be used within a FormProvider");
  }

  const { formData, setFormData } = context;

  // Função para buscar e processar os dados dos itens
  const fetchFormItems = async () => {
    try {
      const response = await fetch("/items/items.json");
      const items = await response.json();

      const atividadesParaRemover = [
        "Fazer teste de funcionamento do sistema de ventilação conforme instruções do fornecedor e projeto",
        "Fazer manutenção geral dos sistemas conforme instruções do fornecedor",
        "Verificar o funcionamento, limpeza e regulagem, conforme legislação vigente",
        "Verificar e se necessário, encerar as peças polidas",
      ];

      const mappedItems: FormItem[] = items.reduce(
        (acc: FormItem[], item: any) => {
          // Verifica se o item possui uma das atividades que devem ser removidas
          if (!atividadesParaRemover.includes(item.atividade)) {
            if (!acc.some((formItem) => formItem.name === item.id_name)) {
              acc.push({
                name: item.id_name,
                label: item.titulo,
              });
            }
          }
          return acc;
        },
        []
      );

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

  // Função para o botão "Selecionar Todos"
  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    const checked = e.target.checked;
    setSelectAllChecked(checked); // Atualiza o estado do botão "Selecionar Todos"

    const updatedFormData = formItems.reduce((acc, item) => {
      acc[item.name] = checked;
      return acc;
    }, {} as Record<string, boolean>);

    setFormData({ ...formData, ...updatedFormData }); // Atualiza o formData com todos selecionados ou desmarcados
  };

  const addNext = () => {
    const trueAttributes = Object.keys(formData).filter(
      (key) => formData[key] === true
    );

    // Filtrar todos os itens que correspondem aos atributos selecionados
    const selectedItems = allItems.filter((item) =>
      trueAttributes.includes(item.id_name)
    );

    const finalItems = selectedItems.map((item) => ({
      ...item,
      data: "", // Inicializa o campo data como string vazia
    }));

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

      {/* Checkbox para "Selecionar Todos" */}
      <Grid spacing={2}>
        <FormControlLabel
          control={
            <Checkbox
              checked={selectAllChecked}
              onChange={handleSelectAll}
              name="selectAll"
            />
          }
          label="Selecionar Todos"
        />
      </Grid>

      {/* Checkbox para cada item do formulário */}
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
