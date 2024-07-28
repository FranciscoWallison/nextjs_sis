import {
  Building,
  SelectQuestions,
  Activity,
  Category,
  PrimeiroAcesso,
  PrimeiroAcessoDTO,
  FormattedData,
} from "@/interface/Questions";

class HelpQuestions {
  static formatDataStep4 = async (questions: { [key: string]: any }) => {
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

    return await this.formatData(validar);
  };

  static formatData = async (data: { [key: string]: any }) => {
    const formattedArray: FormattedData[] = [];
    const processedPrefixes = new Set<string>();

    Object.keys(data).forEach((key) => {
      const [prefix] = key.split(/_(?=[^_]+$)/);

      if (!processedPrefixes.has(prefix)) {
        const id =
          data[`${prefix}_id`] !== undefined
            ? parseInt(data[`${prefix}_id`], 10)
            : null;
        const date =
          data[`${prefix}_date`] !== undefined ? data[`${prefix}_date`] : "";
        const nao_feito =
          data[`${prefix}_nao_feito`] !== undefined
            ? Boolean(data[`${prefix}_nao_feito`])
            : false;
        const nao_lembro =
          data[`${prefix}_nao_lembro`] !== undefined
            ? Boolean(data[`${prefix}_nao_lembro`])
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

  static formatDataStep5 = async (formData: PrimeiroAcessoDTO) => {
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

    const { selecionados, naoSelecionados } = await this.filtroPeriodicidades(
      result,
      primeiroAcesso.select_questions
    );

    console.log("==========filtroPeriodicidades======");
    console.log(selecionados, naoSelecionados, formData.questions);
    console.log("====================================");

    const resultado = await this.adicionarDados(
      selecionados,
      formData.questions
    );

    return {
      questions: resultado,
      sindicoName: primeiroAcesso.sindicoName,
      buildings: primeiroAcesso.buildings,
    };
  };

  static adicionarDados = async (
    periodicidades: Category[],
    dadosAdicionais: any[]
  ) => {
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

  static filtroPeriodicidades = async (
    periodicidades: Category[],
    filtro: SelectQuestions
  ) => {
    const selecionados: Category[] = [];
    const naoSelecionados: Category[] = [];

    periodicidades.forEach((categoria) => {
      const itensFiltrados = categoria.data.filter((item) => {
        return (
          item.id_name in filtro &&
          filtro[item.id_name as keyof SelectQuestions]
        );
      });
      const itensNaoFiltrados = categoria.data.filter((item) => {
        return !(
          item.id_name in filtro &&
          filtro[item.id_name as keyof SelectQuestions]
        );
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

  static filterItems = async (dataItens: Category[], item: Category[]) => {
    const itemIdsToRemove = item.flatMap(category => category.data.map(activity => activity.id));
  
    const filteredDataItens = dataItens.map(category => ({
      ...category,
      data: category.data.filter(activity => !itemIdsToRemove.includes(activity.id))
    }));
  
    return filteredDataItens;
  };

  static addItem = async (dataItens: Category[], item: Category[], newItem: Activity) => {
    // Encontrar a categoria em dataItens onde o novo item deve ser adicionado
    const category = dataItens.find(category => 
      category.data.some(activity => activity.id === newItem.id)
    );


    if (!category) {
      console.error("Categoria não encontrada em dataItens para o id:", newItem.id);
      return item;
    }
  
    const categoryTitle = category.title;
    const categoryIndex = item.findIndex(category => category.title === categoryTitle);
    

    console.log('==========addItem================');
    console.log(categoryTitle, categoryIndex);
    console.log('====================================');
  

    if (categoryIndex === -1) {
      // Categoria não encontrada em item.json, adicionar uma nova categoria com o newItem
      item.push({
        title: categoryTitle,
        data: [newItem]
      });
    } else {
      // Adicionar o novo item à categoria existente em item.json
      item[categoryIndex].data.push(newItem);
    }
  
    return item;
  };
  static removeActivityById = async (data, activityId) => {
  return data.map(category => {
    const filteredActivities = category.data.filter(activity => activity.id !== activityId);
    return {
      ...category,
      data: filteredActivities
    };
  });
};
  
}

export default HelpQuestions;
