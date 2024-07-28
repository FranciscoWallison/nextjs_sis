export interface Building {
  buildingName: string;
  address: string;
  hasElevator: boolean;
  elevatorCount: number;
}

export interface SelectQuestions {
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

export interface Activity {
  id: number;
  data?: string;
  nao_feito?: boolean;
  nao_lembro?: boolean;
  id_name: string;
}

export interface Category {
  title: string;
  data: Activity[];
}

export interface PrimeiroAcesso {
  sindicoName: string;
  buildings: Building[];
  select_questions: SelectQuestions;
}

export interface FormattedData {
  id: number;
  data: string;
  nao_feito: boolean;
  nao_lembro: boolean;
}

export interface PrimeiroAcessoDTO {
  //
  sindicoName: string;
  buildings: Building[];
  //
  buildingName: string;
  address: string;
  hasElevator: boolean;
  elevatorCount: number;
  //
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
  //
  questions: any[];
}
