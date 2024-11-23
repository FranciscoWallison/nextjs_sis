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

  const [formItems, setFormItems] = useState<{ label: string; names: string[] }[]>([]);
  const [allItems, setAllItems] = useState<Item[]>([]);
  const [selectAllChecked, setSelectAllChecked] = useState(false);
  const [loading, setLoading] = useState(true);

  if (!context) {
    return <div>Erro: FormContext não está disponível</div>;
  }

  const { formData, setFormData } = context;

  const fetchFormItems = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch("/items/items.json");
      if (!response.ok) {
        throw new Error("Erro ao buscar os itens");
      }
      const items: Item[] = await response.json();

      const atividadesParaRemover = [
        "Fazer teste de funcionamento do sistema de ventilação conforme instruções do fornecedor e projeto",
        "Fazer manutenção geral dos sistemas conforme instruções do fornecedor",
        "Verificar o funcionamento, limpeza e regulagem, conforme legislação vigente",
        "Verificar e se necessário, encerar as peças polidas",
        "Efetuar a inspeção total de todos os elementos da edificação conforme ABNT NBR 16747",
      ];

      const filteredItems = items.filter(
        (item) => !atividadesParaRemover.includes(item.atividade)
      );

      // Agrupando por título e removendo duplicações de títulos
      const groupedItems = filteredItems.reduce((acc, item) => {
        const existingGroup = acc.find((group) => group.label === item.titulo);
        if (existingGroup) {
          existingGroup.names.push(item.id_name);
        } else {
          acc.push({
            label: item.titulo,
            names: [item.id_name],
          });
        }
        return acc;
      }, [] as { label: string; names: string[] }[]);

      // Ordena o array em ordem alfabética antes de setar o estado
      groupedItems.sort((a, b) => a.label.localeCompare(b.label));

      setFormItems(groupedItems);
      setAllItems(items);
    } catch (error) {
      console.error("Erro ao buscar ou processar os itens:", error);
      alert("Não foi possível carregar os itens. Tente novamente mais tarde.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchFormItems();
  }, [fetchFormItems]);

  const handleSelectAll = () => {
    const checked = !selectAllChecked;
    setSelectAllChecked(checked);

    const updatedFormData = formItems.reduce((acc, itemGroup) => {
      itemGroup.names.forEach((name) => {
        acc[name] = checked;
      });
      return acc;
    }, {} as Record<string, boolean>);

    setFormData({ ...formData, ...updatedFormData });
  };

  const handleChipClick = (names: string[]) => {
    if (!names) return;
    const allSelected = names.every((name) => formData[name] === true);

    const updatedFormData = names.reduce((acc, name) => {
      acc[name] = !allSelected;
      return acc;
    }, {} as Record<string, boolean>);

    setFormData((prevFormData: Record<string, any>) => ({
      ...prevFormData,
      ...updatedFormData,
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
    <Box sx={{ padding: { xs: 2, sm: 4 }, maxWidth: "800px", margin: "0 auto" }}>
      <Typography component="h1" sx={{ mt: 2, mb: 4 }} variant="h6" textAlign="center">
        Para o sistema gerar as manutenções necessárias conforme NBR 5674, por
        favor selecione abaixo caso o {formData.buildingName} possua algum desses itens:
      </Typography>

      <Container>
        {/* Botão de Seleção Geral */}
        <Box sx={{ textAlign: "center", mb: 4 }}>
          <Chip
            icon={selectAllChecked ? <DoneIcon /> : undefined}
            label={selectAllChecked ? "Todos Selecionados" : "Selecionar Todos"}
            onClick={handleSelectAll}
            color={selectAllChecked ? "primary" : "default"}
            sx={{ fontSize: "1rem", padding: "10px 20px" }}
          />
        </Box>

        {/* Lista de Itens */}
        <Grid container spacing={3}>
          {formItems.map((group) => (
            <Grid item xs={12} sm={6} key={group.label}>
              <Box
                sx={{
                  width: "100%",
                  display: "flex",
                  alignItems: "center",
                  border: "1px solid",
                  borderColor: "grey.300",
                  borderRadius: "16px",
                  padding: "10px 15px",
                  backgroundColor:
                    group.names &&
                      group.names.every((name) => formData[name])
                      ? "primary.main"
                      : "background.paper",
                  color:
                    group.names &&
                      group.names.every((name) => formData[name])
                      ? "white"
                      : "text.primary",
                }}
                onClick={() => handleChipClick(group.names)}
              >
                {/* Ícone de seleção */}
                {group.names && group.names.every((name) => formData[name]) && (
                  <DoneIcon sx={{ marginRight: "8px" }} />
                )}

                {/* Título com quebra de linha */}
                <Typography
                  variant="body2"
                  sx={{
                    wordWrap: "break-word", // Permite quebra de linha automática
                    overflow: "visible", // Evita cortar texto
                    whiteSpace: "normal", // Permite múltiplas linhas
                  }}
                >
                  {group.label}
                </Typography>
              </Box>
            </Grid>
          ))}
        </Grid>


        {/* Botões de Navegação */}
        <Box sx={{ display: "flex", justifyContent: "space-between", mt: 4 }}>
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
