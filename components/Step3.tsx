import React, { useContext, useState, useEffect, useCallback } from "react";
import {
  Box,
  Button,
  Chip,
  Typography,
  Grid,
  CircularProgress,
  Container,
} from "@mui/material";
import DoneIcon from "@mui/icons-material/Done";
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

  // Declarar estados incondicionalmente
  const [formItems, setFormItems] = useState<FormItem[]>([]);
  const [allItems, setAllItems] = useState<Item[]>([]);
  const [selectAllChecked, setSelectAllChecked] = useState(false);
  const [loading, setLoading] = useState(true);

  // Tratar o caso de context ser nulo diretamente no return
  if (!context) {
    return <div>Erro: FormContext não está disponível</div>;
  }

  const { formData, setFormData } = context;

  // useCallback deve ser chamado incondicionalmente
  const fetchFormItems = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch("/items/items.json");
      const items = await response.json();

      const atividadesParaRemover = [
        "Fazer teste de funcionamento do sistema de ventilação conforme instruções do fornecedor e projeto",
        "Fazer manutenção geral dos sistemas conforme instruções do fornecedor",
        "Verificar o funcionamento, limpeza e regulagem, conforme legislação vigente",
        "Verificar e se necessário, encerar as peças polidas",
        "Efetuar a inspeção total de todos os elementos da edificação conforme ABNT NBR 16747",
      ];

      const mappedItems: FormItem[] = items
        .filter((item: Item) => !atividadesParaRemover.includes(item.atividade))
        .map((item: Item) => ({
          name: item.id_name,
          label: item.titulo,
        }));

      setFormItems(mappedItems);
      setAllItems(items);
    } catch (error) {
      console.error("Erro ao buscar ou processar os itens:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  // useEffect deve ser chamado incondicionalmente
  useEffect(() => {
    fetchFormItems();
  }, [fetchFormItems]);

  // Outro useEffect incondicional
  useEffect(() => {
    const allChecked = formItems.every((item) => formData[item.name]);
    setSelectAllChecked(allChecked);
  }, [formItems, formData]);

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.checked });
  };

  // Função de "Selecionar Todos"
  const handleSelectAll = () => {
    const checked = !selectAllChecked; // Inverte o estado atual
    setSelectAllChecked(checked);

    const updatedFormData = formItems.reduce((acc, item) => {
      acc[item.name] = checked;
      return acc;
    }, {} as Record<string, boolean>);

    setFormData({ ...formData, ...updatedFormData });
  };

  const handleChipClick = (name: string) => {
    setFormData((prevFormData: Record<string, any>) => ({
      ...prevFormData,
      [name]: !prevFormData[name], // Alterna entre true e false
    }));
  };

  const addNext = async () => {
    const trueAttributes = Object.keys(formData).filter(
      (key) => formData[key] === true
    );

    if (trueAttributes.length === 0) {
      alert("Selecione ao menos um item antes de continuar.");
      return;
    }

    const selectedItems = allItems.filter((item) =>
      trueAttributes.includes(item.id_name)
    );

    const finalItems = selectedItems.map((item) => ({
      ...item,
      data: "",
    }));

    const response_all = await fetch("/items/items.json");
    const items_all = await response_all.json();

    const atividadesParaAdicionar = [
      "Efetuar a inspeção total de todos os elementos da edificação conforme ABNT NBR 16747",
    ];

    // Filtrar objetos com base nas atividades
    const objetosFiltrados = items_all.filter((objeto: Item) =>
      atividadesParaAdicionar.includes(objeto.atividade)
    );

    const arrayCombinado = [...objetosFiltrados, ...finalItems];

    setFormData((prevData: any) => ({
      ...prevData,
      questions: arrayCombinado,
    }));

    handleNext();
  };

  if (loading) return <CircularProgress />;

  return (
    <Box>
      <Typography component="h1" sx={{ mt: 2, mb: 1 }} variant="h6">
        Para o sistema gerar as manutenções necessárias conforme NBR 5674, por
        favor selecione abaixo caso o {formData.buildingName} possua algum
        desses itens:
      </Typography>
      <Container>
        <Grid container spacing={2}>
          {/* Chip substituindo o Checkbox para Selecionar Todos */}
          <Chip
            icon={selectAllChecked ? <DoneIcon /> : undefined}
            label={selectAllChecked ? "Todos Selecionados" : "Selecionar Todos"}
            onClick={handleSelectAll} // Alterna o estado ao clicar
            color={selectAllChecked ? "primary" : "default"} // Muda a cor do Chip
            sx={{ mt: 2, mb: 2 }}
          />
        </Grid>

        <Grid container spacing={2}>
          <Grid container spacing={2}>
            {formItems.map((item) => (
              <Grid item xs={12} sm={6} key={item.name}>
                <Chip
                  icon={formData[item.name] ? <DoneIcon /> : undefined} // Mostra o ícone apenas se o item estiver selecionado
                  label={item.label}
                  onClick={() => handleChipClick(item.name)} // Função para alternar o estado do Chip
                  color={formData[item.name] ? "primary" : "default"} // Muda a cor do Chip com base no estado
                  sx={{ mt: 1, mb: 1 }}
                />
              </Grid>
            ))}
          </Grid>
        </Grid>

        <Box sx={{ display: "flex", justifyContent: "space-between", mt: 2 }}>
          <Button variant="contained" onClick={handleBack}>
            Voltar
          </Button>
          <Button variant="contained" onClick={addNext}>
            Continuar
          </Button>
        </Box>
      </Container>
    </Box>
  );
};

export default Step3;
