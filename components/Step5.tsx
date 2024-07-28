import React, { useContext } from "react";
import { Box, Button, Typography } from "@mui/material";
import { useRouter } from "next/router";
import { FormContext } from "@/contexts/FormContext";
import { salvarNovo } from "@/services/firebaseService";

interface Building {
  buildingName: string;
  address: string;
  hasElevator: boolean;
  elevatorCount: number;
}

interface SelectQuestions {
  grupo_gerador: boolean;
  sauna_umida: boolean;
  gerador_agua_quente: boolean;
  banheira_hidromassagem: boolean;
  porta_corta_fogo: boolean;
  sistema_seguranca: boolean;
  sistema_irrigacao: boolean;
  portao_automatico: boolean;
  bomba_incendio: boolean;
  bomba_agua_potavel: boolean;
  spda: boolean;
}

interface Activity {
  id: number;
  data?: string;
  nao_feito?: boolean;
  nao_lembro?: boolean;
  id_name: string;
}

interface Category {
  title: string;
  data: Activity[];
}

interface PrimeiroAcesso {
  sindicoName: string;
  buildings: Building[];
  select_questions: SelectQuestions;
}

const Step5: React.FC = () => {
  const context = useContext(FormContext);

  if (!context) {
    throw new Error("FormContext must be used within a FormProvider");
  }

  const { formData, setFormData } = context;
  const router = useRouter();

  const handleRedirect = async () => {
    const primeiroAcesso: PrimeiroAcesso = {
      sindicoName: formData.sindicoName,
      buildings: [],
      select_questions: {
        grupo_gerador: formData.grupo_gerador,
        sauna_umida: formData.sauna_umida,
        gerador_agua_quente: formData.gerador_agua_quente,
        banheira_hidromassagem: formData.banheira_hidromassagem,
        porta_corta_fogo: formData.porta_corta_fogo,
        sistema_seguranca: formData.sistema_seguranca,
        sistema_irrigacao: formData.sistema_irrigacao,
        portao_automatico: formData.portao_automatico,
        bomba_incendio: formData.bomba_incendio,
        bomba_agua_potavel: formData.bomba_agua_potavel,
        spda: formData.spda,
      },
    };

    const building: Building = {
      buildingName: formData.buildingName,
      address: formData.address,
      hasElevator: formData.hasElevator,
      elevatorCount: formData.elevatorCount,
    };

    primeiroAcesso.buildings.push(building);

    const response = await fetch("/data.json");
    const result = await response.json();

    const filtroPeriodicidades = (periodicidades: Category[], filtro: SelectQuestions) => {
      const selecionados: Category[] = [];
      const naoSelecionados: Category[] = [];

      periodicidades.forEach((categoria) => {
        const itensFiltrados = categoria.data.filter((item) => {
          return item.id_name in filtro && filtro[item.id_name as keyof SelectQuestions];
        });
        const itensNaoFiltrados = categoria.data.filter((item) => {
          return !(item.id_name in filtro && filtro[item.id_name as keyof SelectQuestions]);
        });

        if (itensFiltrados.length > 0) {
          selecionados.push({
            title: categoria.title,
            data: itensFiltrados,
          });
        }

        if (itensNaoFiltrados.length > 0) {
          naoSelecionados.push({
            title: categoria.title,
            data: itensNaoFiltrados,
          });
        }
      });

      return { selecionados, naoSelecionados };
    };

    const { selecionados, naoSelecionados } = filtroPeriodicidades(
      result,
      primeiroAcesso.select_questions
    );

    console.log("==========filtroPeriodicidades======");
    console.log(selecionados, naoSelecionados, formData.questions);
    console.log("====================================");

    const adicionarDados = (periodicidades: Category[], dadosAdicionais: any[]) => {
      // Criar um mapa de dados adicionais por ID para acesso rápido
      const dadosMap = new Map(dadosAdicionais.map((dado) => [dado.id, dado]));

      periodicidades.forEach((categoria) => {
        categoria.data.forEach((item) => {
          if (dadosMap.has(item.id)) {
            const dados = dadosMap.get(item.id);
            item.data = dados.data;
            item.nao_feito = dados.nao_feito;
            item.nao_lembro = dados.nao_lembro;
          }
        });
      });

      return periodicidades;
    };

    const resultado = adicionarDados(selecionados, formData.questions);

    const new_sindico = {
      questions: resultado,
      sindicoName: primeiroAcesso.sindicoName,
      buildings: primeiroAcesso.buildings
    }

    console.log("====================================");
    console.log(new_sindico);
    console.log("====================================");

    if (await salvarNovo(new_sindico)) {
      router.push("/");
    } else {
      // modal de aviso de erro
    }
  };

  return (
    <Box>
      <Typography component="h1" sx={{ mt: 2, mb: 1 }} variant="h6">
        Parabéns! Você cadastrou o seu prédio, e todas as manutenções
        obrigatórias já estão cadastradas.
      </Typography>
      <Button variant="contained" onClick={handleRedirect} sx={{ mt: 2 }}>
        Seguir para o Painel Principal
      </Button>
    </Box>
  );
};

export default Step5;
