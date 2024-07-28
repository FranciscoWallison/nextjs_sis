const periodicidades = [
  {
    title: "Equipamentos Industrializados",
    data: [
      {
        id_name: "sauna_umida",
        titulo: "Saúna úmida",
        atividade: "Fazer a drenagem de água no equipamento",
        responsavel: "Equipe de manutenção local",
        Periodicidade: "A cada semana",
        obrigatorio: "Não",
        responsavel_info: {
          nome: "",
          telefone: "",
          email: "",
        },
      },
      {
        id_name: "grupo_gerador",
        titulo: "Grupo Gerador",
        atividade:
          "Verificar após o uso do equipamento o nível de óleo combustível e se há obstrução nas entradas e saídas de ventilação",
        responsavel: "Equipe de manutenção local",
        Periodicidade: "A cada semana",
        obrigatorio: "Não",
        responsavel_info: {
          nome: "",
          telefone: "",
          email: "",
        },
      },
      {
        id_name: "grupo_gerador",
        titulo: "Grupo Gerador",
        atividade:
          "Efetuar teste de funcionamento dos sistemas conforme instruções do fornecedor",
        responsavel: "Equipe de manutenção local",
        Periodicidade: "A cada 15 dias",
        obrigatorio: "Não",
        responsavel_info: {
          nome: "",
          telefone: "",
          email: "",
        },
      },
      {
        titulo: "Iluminação de emergência",
        atividade:
          "Efetuar teste de funcionamento dos sistemas conforme instruções do fornecedor",
        responsavel: "Equipe de manutenção local",
        Periodicidade: "A cada 15 dias",
        obrigatorio: "Sim",
        responsavel_info: {
          nome: "",
          telefone: "",
          email: "",
        },
        id_name: "iluminacao_de_emergencia",
      },
      {
        titulo: "Iluminação de emergência",
        atividade:
          "Efetuar teste de funcionamento de todo o sistema conforme instruções do fornecedor",
        responsavel: "Equipe de manutenção local",
        Periodicidade: "A cada mês",
        obrigatorio: "Sim",
        responsavel_info: {
          nome: "",
          telefone: "",
          email: "",
        },
        id_name: "iluminacao_de_emergencia",
      },
      {
        titulo: "Pressurização de escadas",
        atividade:
          "Fazer teste de funcionamento do sistema de ventilação conforme instruções do fornecedor e projeto",
        responsavel: "Equipe de manutenção local",
        Periodicidade: "A cada mês",
        obrigatorio: "Não",
        responsavel_info: {
          nome: "",
          telefone: "",
          email: "",
        },
        id_name: "pressurizacao_de_escadas",
      },
      {
        titulo: "Pressurização de escadas",
        atividade:
          "Fazer manutenção geral dos sistemas conforme instruções do fornecedor",
        responsavel: "Empresa especializada",
        Periodicidade: "A cada mês",
        obrigatorio: "Não",
        responsavel_info: {
          nome: "",
          telefone: "",
          email: "",
        },
        id_name: "pressurizacao_de_escadas",
      },
      {
        id_name: "banheira_hidromassagem",
        titulo: "Banheira de hidromassagem/spa",
        atividade:
          "Fazer teste de funcionamento conforme instruções do fornecedor",
        responsavel: "Equipe de manutenção local",
        Periodicidade: "A cada mês",
        obrigatorio: "Não",
        responsavel_info: {
          nome: "",
          telefone: "",
          email: "",
        },
      },
      {
        titulo: "Ar condicionado",
        atividade:
          "Manutenção recomendada pelo fabricante e atendimento à legislação vigente",
        responsavel: "Empresa especializada",
        Periodicidade: "A cada mês",
        obrigatorio: "Não",
        responsavel_info: {
          nome: "",
          telefone: "",
          email: "",
        },
        id_name: "ar_condicionado",
      },
      {
        id_name: "gerador_agua_quente",
        titulo: "Gerador de água quente",
        atividade:
          "Limpar e regular os sistemas de queimadores e filtros de água conforme instruções do fabricante",
        responsavel: "Empresa capacitada",
        Periodicidade: "A cada dois meses",
        obrigatorio: "Não",
        responsavel_info: {
          nome: "",
          telefone: "",
          email: "",
        },
      },
      {
        titulo: "Iluminação de emergência",
        atividade:
          "Para unidades centrais, verificar fusíveis, led de carga da bateria selada e nível de eletrólito da bateria comum conforme instruções dos fabricantes",
        responsavel: "Equipe de manutenção local",
        Periodicidade: "A cada dois meses",
        obrigatorio: "Sim",
        responsavel_info: {
          nome: "",
          telefone: "",
          email: "",
        },
        id_name: "iluminacao_de_emergencia",
      },
      {
        id_name: "porta_corta_fogo",
        titulo: "Porta corta-fogo",
        atividade: "Aplicar óleo lubrificante nas dobradiças e maçanetas",
        responsavel: "Equipe de manutenção local",
        Periodicidade: "A cada três meses",
        obrigatorio: "Não",
        responsavel_info: {
          nome: "",
          telefone: "",
          email: "",
        },
      },
      {
        id_name: "porta_corta_fogo",
        titulo: "Porta corta-fogo",
        atividade:
          "Verificar a abertura e o fechamento a 45º. Se for necessário fazer regulagem, chamar empresa especializada",
        responsavel: "Equipe de manutenção local",
        Periodicidade: "A cada três meses",
        obrigatorio: "Não",
        responsavel_info: {
          nome: "",
          telefone: "",
          email: "",
        },
      },
      {
        id_name: "banheira_hidromassagem",
        titulo: "Banheira de hidromassagem/spa",
        atividade: "Limpar a tubulação",
        responsavel: "Equipe de manutenção local",
        Periodicidade: "A cada três meses",
        obrigatorio: "Não",
        responsavel_info: {
          nome: "",
          telefone: "",
          email: "",
        },
      },
      {
        id_name: "sistema_seguranca",
        titulo: "Sistema de segurança",
        atividade: "Manutenção recomendada pelo fornecedor",
        responsavel: "Empresa capacitada/empresa especializada",
        Periodicidade: "A cada ano",
        obrigatorio: "Não",
        responsavel_info: {
          nome: "",
          telefone: "",
          email: "",
        },
      },
      {
        id_name: "gerador_agua_quente",
        titulo: "Gerador de água quente",
        atividade:
          "Verificar sua integridade e reconstituir o funcionamento do sistema de levagem interna dos depósitos de água quente e limpeza das chaminés conforme instrução do fabricante",
        responsavel: "Empresa capacitada",
        Periodicidade: "A cada ano",
        obrigatorio: "Não",
        responsavel_info: {
          nome: "",
          telefone: "",
          email: "",
        },
      },
      {
        titulo: "Sistema de aquecimento individual",
        atividade:
          "Verificar o funcionamento, limpeza e regulagem, conforme legislação vigente",
        responsavel: "Empresa capacitada",
        Periodicidade: "A cada ano",
        obrigatorio: "Não",
        responsavel_info: {
          nome: "",
          telefone: "",
          email: "",
        },
        id_name: "sistema_de_aquecimento_individual",
      },
      {
        id_name: "banheira_hidromassagem",
        titulo: "Banheira de hidromassagem/spa",
        atividade:
          "Limpar e manter o sistema conforme instruções do fornecedor",
        responsavel: "Empresa capacitada",
        Periodicidade: "A cada ano",
        obrigatorio: "Não",
        responsavel_info: {
          nome: "",
          telefone: "",
          email: "",
        },
      },
      {
        id_name: "spda",
        titulo: "Sistema de proteção contra descargas atmosféricas",
        atividade:
          "Inspecionar sua integridade e reconstituir o sistema de medição de resistência conforme legislação vigente",
        responsavel: "Empresa especializada",
        Periodicidade: "A cada ano",
        obrigatorio: "Sim",
        responsavel_info: {
          nome: "",
          telefone: "",
          email: "",
        },
      },
      {
        id_name: "spda",
        titulo: "Sistema de proteção contra descargas atmosféricas",
        atividade:
          "Inspecionar periodicamente de acordo com a legislação vigente. Em locais expostos a corrosão severa, reduzir os intervalos entre verificações",
        responsavel: "Empresa especializada",
        Periodicidade: "A cada ano",
        obrigatorio: "Sim",
        responsavel_info: {
          nome: "",
          telefone: "",
          email: "",
        },
      },
      {
        id_name: "spda",
        titulo: "Sistema de proteção contra descargas atmosféricas",
        atividade: "Laudo de para raios com atestado de resistividade do solo",
        responsavel: "Empresa especializada",
        Periodicidade: "A cada 3 anos",
        obrigatorio: "Sim",
        responsavel_info: {
          nome: "",
          telefone: "",
          email: "",
        },
      },
      {
        titulo: "Elevadores",
        atividade: "Manutenção conforme indicação dos fornecedores",
        responsavel: "Empresa especializada",
        Periodicidade: "Conforme indicação dos fornecedores",
        obrigatorio: "Não",
        responsavel_info: {
          nome: "",
          telefone: "",
          email: "",
        },
        id_name: "elevadores",
      },
    ],
  },
  {
    title: "Sistemas Hidrossanitários",
    data: [
      {
        titulo: "Reservatórios de água potável",
        atividade:
          "Verificar o nível dos reservatórios e o funcionamento das boias",
        responsavel: "Equipe de manutenção local",
        Periodicidade: "A cada semana",
        obrigatorio: "Sim",
        responsavel_info: {
          nome: "",
          telefone: "",
          email: "",
        },
        id_name: "reservatorios_de_agua_potavel",
      },
      {
        id_name: "sistema_irrigacao",
        titulo: "Sistema de irrigação",
        atividade: "Verificar o funcionamento dos dispositivos",
        responsavel: "Equipe de manutenção local",
        Periodicidade: "A cada semana",
        obrigatorio: "Não",
        responsavel_info: {
          nome: "",
          telefone: "",
          email: "",
        },
      },
      {
        id_name: "bomba_agua_potavel",
        titulo: "Bombas de água potável, água servida e piscinas",
        atividade:
          "Verificar o funcionamento e alternar a chave no painel elétrico para utilizá-las em sistema de rodízio, quando aplicável",
        responsavel: "Equipe de manutenção local",
        Periodicidade: "A cada 15 dias",
        obrigatorio: "Sim",
        responsavel_info: {
          nome: "",
          telefone: "",
          email: "",
        },
      },
      {
        id_name: "bomba_incendio",
        titulo: "Bombas de incêndio",
        atividade: "Testar seu funcionamento, observada a legislação vigente",
        responsavel: "Equipe de manutenção local",
        Periodicidade: "A cada mês",
        obrigatorio: "Não",
        responsavel_info: {
          nome: "",
          telefone: "",
          email: "",
        },
      },
      {
        titulo: "Ralos, grelhas, calhas e canaletas",
        atividade:
          "Limpar o sistema das águas pluviais e ajustar a periodicidade em função da sazonalidade",
        responsavel: "Equipe de manutenção local",
        Periodicidade: "A cada mês",
        obrigatorio: "Sim",
        responsavel_info: {
          nome: "",
          telefone: "",
          email: "",
        },
        id_name: "ralos_grelhas_calhas_e_canaletas",
      },
      {
        titulo: "Caixas de esgoto, de gordura e de águas servidas",
        atividade: "Efetuar limpeza geral",
        responsavel: "Equipe de manutenção local",
        Periodicidade: "A cada três meses",
        obrigatorio: "Sim",
        responsavel_info: {
          nome: "",
          telefone: "",
          email: "",
        },
        id_name: "caixas_de_esgoto_de_gordura_e_de_aguas_servidas",
      },
      {
        titulo: "Reservatórios de água potável",
        atividade: "Efetuar limpeza geral",
        responsavel: "Empresa especializada",
        Periodicidade: "A cada seis meses",
        obrigatorio: "Sim",
        responsavel_info: {
          nome: "",
          telefone: "",
          email: "",
        },
        id_name: "reservatorios_de_agua_potavel",
      },
      {
        titulo: "Tubulações",
        atividade:
          "Verificar as tubulações de água potável e servida, para detectar obstruções, falhas ou entupimentos, e fixação e reconstituir a sua integridade, onde necessário",
        responsavel: "Equipe de manutenção local/ empresa especializada",
        Periodicidade: "A cada ano",
        obrigatorio: "Sim",
        responsavel_info: {
          nome: "",
          telefone: "",
          email: "",
        },
        id_name: "tubulacoes",
      },
      {
        titulo: "Metais, acessórios e registros",
        atividade:
          "Verificar os elementos de vedação dos metais, acessórios e registros",
        responsavel: "Equipe de manutenção local",
        Periodicidade: "A cada ano",
        obrigatorio: "Sim",
        responsavel_info: {
          nome: "",
          telefone: "",
          email: "",
        },
        id_name: "metais_acessorios_e_registros",
      },
    ],
  },
  {
    title: "Sistema de automação",
    data: [
      {
        id_name: "portao_automatico",
        titulo: "Automação de portões",
        atividade:
          "Fazer a manutenção geral dos sistemas conforme instruções do fornecedor",
        responsavel: "Empresa especializada",
        Periodicidade: "A cada mês",
        obrigatorio: "Sim",
        responsavel_info: {
          nome: "",
          telefone: "",
          email: "",
        },
      },
      {
        titulo:
          "Dados, informática, voz, telefonia, vídeo, TV, CFTV e segurança perimetral",
        atividade:
          "Verificar o funcionamento conforme instruções do fornecedor",
        responsavel: "Equipe de manutenção local/empresa capacitada",
        Periodicidade: "A cada mês",
        obrigatorio: "Não",
        responsavel_info: {
          nome: "",
          telefone: "",
          email: "",
        },
        id_name:
          "dados_informatica_voz_telefonia_video_tv_cftv_e_seguranca_perimetral",
      },
    ],
  },
  {
    title: "Revestimentos de parede, piso e teto",
    data: [
      {
        titulo: "Pedras naturais (mármore, granito e outros)",
        atividade: "Verificar e se necessário, encerar as peças polidas",
        responsavel: "Equipe de manutenção local",
        Periodicidade: "A cada mês",
        obrigatorio: "Não",
        responsavel_info: {
          nome: "",
          telefone: "",
          email: "",
        },
        id_name: "pedras_naturais_marmore_granito_e_outros_",
      },
      {
        titulo: "Paredes externas/fachadas e muros",
        atividade: "Verificar a integridade e reconstituir, onde necessário",
        responsavel: "Equipe de manutenção local/empresa especializada",
        Periodicidade: "A cada ano",
        obrigatorio: "Sim",
        responsavel_info: {
          nome: "",
          telefone: "",
          email: "",
        },
        id_name: "paredes_externas_fachadas_e_muros",
      },
      {
        titulo: "Piso acabado, revestimento de paredes e tetos",
        atividade: "Verificar a integridade e reconstituir, onde necessário",
        responsavel: "Equipe de manutenção local/empresa especializada",
        Periodicidade: "A cada ano",
        obrigatorio: "Sim",
        responsavel_info: {
          nome: "",
          telefone: "",
          email: "",
        },
        id_name: "piso_acabado_revestimento_de_paredes_e_tetos",
      },
      {
        titulo: "Deck de madeira",
        atividade: "Verificar a integridade e reconstituir, onde necessário",
        responsavel: "Equipe de manutenção local/empresa especializada",
        Periodicidade: "A cada ano",
        obrigatorio: "Não",
        responsavel_info: {
          nome: "",
          telefone: "",
          email: "",
        },
        id_name: "deck_de_madeira",
      },
    ],
  },
  {
    title: "Esquadrias",
    data: [
      {
        titulo: "Esquadrias de alumínio",
        atividade: "Efetuar limpeza geral das esquadrias e seus componentes",
        responsavel: "Equipe de manutenção local/empresa capacitada",
        Periodicidade: "A cada três meses",
        obrigatorio: "Sim",
        responsavel_info: {
          nome: "",
          telefone: "",
          email: "",
        },
        id_name: "esquadrias_de_aluminio",
      },
      {
        titulo: "Esquadrias em geral",
        atividade:
          "Verificar falhas de vedação, fixação das esquadrias, guarda corpos e reconstituir sua integridade, onde necessário",
        responsavel: "Equipe de manutenção local/ Empresa especializada",
        Periodicidade: "A cada ano",
        obrigatorio: "Sim",
        responsavel_info: {
          nome: "",
          telefone: "",
          email: "",
        },
        id_name: "esquadrias_em_geral",
      },
      {
        titulo: "Esquadrias em geral",
        atividade:
          "Efetuar limpeza geral das esquadrias incluindo os drenos, reapertar parafusos aparentes, regular freio e lubrificação. Observar a tipologia e a complexidade das esquadrias, os projetos e instruções dos fornecedores",
        responsavel: "Equipe de manutenção local/ Empresa especializada",
        Periodicidade: "A cada ano",
        obrigatorio: "Sim",
        responsavel_info: {
          nome: "",
          telefone: "",
          email: "",
        },
        id_name: "esquadrias_em_geral",
      },
      {
        titulo: "Esquadrias e elementos de madeira",
        atividade:
          "Verificar e, se necessário, pintar, encerar, envernizar ou executar tratamento recomendado pelo fornecedor",
        responsavel: "Equipe de manutenção local/ empresa especializada",
        Periodicidade: "A cada dois anos",
        obrigatorio: "Sim",
        responsavel_info: {
          nome: "",
          telefone: "",
          email: "",
        },
        id_name: "esquadrias_e_elementos_de_madeira",
      },
      {
        titulo: "Esquadrias e elementos de ferro",
        atividade:
          "Verificar e, se necessário, pintar ou executar tratamento recomendado pelo fornecedor",
        responsavel: "Equipe de manutenção local/ empresa especializada",
        Periodicidade: "A cada dois anos",
        obrigatorio: "Sim",
        responsavel_info: {
          nome: "",
          telefone: "",
          email: "",
        },
        id_name: "esquadrias_e_elementos_de_ferro",
      },
      {
        titulo: "Vidros e seus sistemas de fixação",
        atividade:
          "Verificar a presença de fissuras, falhas na vedação e fixação nos caixilhos e reconstituir sua integridade, onde necessário",
        responsavel: "Equipe de manutenção local/ empresa especializada",
        Periodicidade: "A cada ano",
        obrigatorio: "Sim",
        responsavel_info: {
          nome: "",
          telefone: "",
          email: "",
        },
        id_name: "vidros_e_seus_sistemas_de_fixacao",
      },
    ],
  },
  {
    title: "Instalações elétricas",
    data: [
      {
        titulo: "Quadro de distribuição e circuitos",
        atividade: "Reapertar todas as conexões",
        responsavel:
          "Equipe de manutenção local/ Empresa capacitada/ Empresa especializada",
        Periodicidade: "A cada ano",
        obrigatorio: "Sim",
        responsavel_info: {
          nome: "",
          telefone: "",
          email: "",
        },
        id_name: "quadro_de_distribuicao_e_circuitos",
      },
      {
        titulo: "Tomadas, interruptores e pontos de luz",
        atividade:
          "Verificar as conexões, estado dos contatos elétricos e seus componentes, e reconstituir onde necessário",
        responsavel:
          "Equipe de manutenção local/ Empresa capacitada/ Empresa especializada",
        Periodicidade: "A cada dois anos",
        obrigatorio: "Sim",
        responsavel_info: {
          nome: "",
          telefone: "",
          email: "",
        },
        id_name: "tomadas_interruptores_e_pontos_de_luz",
      },
    ],
  },
  {
    title: "Equipamentos de incêndio",
    data: [
      {
        titulo: "Extintores",
        atividade: "Recarregar os extintores",
        responsavel: "Empresa especializada",
        Periodicidade: "A cada ano",
        obrigatorio: "Sim",
        responsavel_info: {
          nome: "",
          telefone: "",
          email: "",
        },
        id_name: "extintores",
      },
      {
        titulo: "Mangueiras de hidrantes",
        atividade: "Efetuar teste hidrostático das mangueiras de hidrantes",
        responsavel: "Empresa especializada",
        Periodicidade: "A cada ano",
        obrigatorio: "Sim",
        responsavel_info: {
          nome: "",
          telefone: "",
          email: "",
        },
        id_name: "mangueiras_de_hidrantes",
      },
    ],
  },
  {
    title: "Outros",
    data: [
      {
        titulo: "Sistema de cobertura",
        atividade:
          "Verificar a integridade estrutural dos componentes, vedações, fixações, e reconstituir e tratar, onde necessário",
        responsavel: "Equipe de manutenção local/ empresa especializada",
        Periodicidade: "A cada ano",
        obrigatorio: "Sim",
        responsavel_info: {
          nome: "",
          telefone: "",
          email: "",
        },
        id_name: "sistema_de_cobertura",
      },
      {
        titulo: "Fachada",
        atividade:
          "Efetuar lavagem. Verificar os elementos e, se necessário, solicitar inspeção. Atender às prescrições do relatório ou laudo de inspeção",
        responsavel:
          "Equipe de manutenção local/ Empresa capacitada/ Empresa especializada",
        Periodicidade: "A cada três anos",
        obrigatorio: "Sim",
        responsavel_info: {
          nome: "",
          telefone: "",
          email: "",
        },
        id_name: "fachada",
      },
      {
        titulo: "Desratização e desinsetização (Residencial)",
        atividade: "Aplicação de produtos químicos",
        responsavel: "Empresa especializada",
        Periodicidade: "A cada seis meses",
        obrigatorio: "Sim",
        responsavel_info: {
          nome: "",
          telefone: "",
          email: "",
        },
        id_name: "desratizacao_e_desinsetizacao_residencial_",
      },
      {
        titulo: "Impermeabilização",
        atividade:
          "Áreas molhadas internas e externas, piscinas, reservatórios, coberturas, jardins, espelhos d'água. Verificar sua integridade e reconstituir a proteção mecânica, sinais de infiltração ou falhas da impermeabilização exposta",
        responsavel: "Equipe de manutenção local",
        Periodicidade: "A cada ano",
        obrigatorio: "Sim",
        responsavel_info: {
          nome: "",
          telefone: "",
          email: "",
        },
        id_name: "impermeabilizacao",
      },
      {
        titulo: "Rejuntamentos e vedações",
        atividade:
          "Verificar sua integridade e reconstituir os rejuntamentos internos e externos dos pisos, paredes, peitoris, soleiras, ralos, peças sanitárias, bordas de banheiras, chaminés, grelhas de ventilação, e outros elementos",
        responsavel: "Equipe de manutenção local/empresa capacitada",
        Periodicidade: "A cada ano",
        obrigatorio: "Sim",
        responsavel_info: {
          nome: "",
          telefone: "",
          email: "",
        },
        id_name: "rejuntamentos_e_vedacoes",
      },
      {
        titulo: "Estrutural",
        atividade: "Verificar a integridade estrutural conforme ABNT NBR 15575",
        responsavel: "Empresa especializada",
        Periodicidade: "A cada ano",
        obrigatorio: "Sim",
        responsavel_info: {
          nome: "",
          telefone: "",
          email: "",
        },
        id_name: "estrutural",
      },
      {
        titulo: "Inspeção predial total",
        atividade:
          "Efetuar a inspeção total de todos os elementos da edificação conforme ABNT NBR 16747",
        responsavel: "Empresa especializada",
        Periodicidade:
          "A cada 5 anos para edifícios de até 10 anos de entrega, A cada 3 anos para edifícios entre 11 a 30 anos de entrega, A cada ano para edifícios com mais de 30 anos de entrega",
        obrigatorio: "Sim",
        responsavel_info: {
          nome: "",
          telefone: "",
          email: "",
        },
        id_name: "inspecao_predial_total",
      },
    ],
  },
];

const exemploobjeto = {
  grupo_gerador: true,
  sauna_umida: true,
  gerador_agua_quente: true,
  banheira_hidromassagem: true,
  porta_corta_fogo: true,
  sistema_seguranca: true,
  sistema_irrigacao: true,
  portao_automatico: true,
  bomba_incendio: true,
  bomba_agua_potavel: true,
  spda: true,
};

const filtroPeriodicidades = (periodicidades, filtro) => {
  const resultado = [];

  periodicidades.forEach((categoria) => {
    const itensFiltrados = categoria.data.filter(
      (item) => filtro[item.id_name]
    );
    if (itensFiltrados.length > 0) {
      resultado.push({
        title: categoria.title,
        data: itensFiltrados,
      });
    }
  });

  return resultado;
};

const periodicidadesFiltradas = filtroPeriodicidades(
  periodicidades,
  exemploobjeto
);

console.log('====================================');
console.log(periodicidadesFiltradas);
console.log('====================================');

// console.log(JSON.stringify(periodicidadesFiltradas, null, 2));
