export interface ProviderData {
  providerId: string;
  uid: string;
  displayName: string | null;
  email: string | null;
  phoneNumber: string | null;
  photoURL: string | null;
}

export interface StsTokenManager {
  refreshToken: string;
  accessToken: string;
  expirationTime: number;
}

export interface FirebaseUser {
  uid: string;
  email: string;
  emailVerified: boolean;
  isAnonymous: boolean;
  providerData: ProviderData[];
  stsTokenManager: StsTokenManager;
  createdAt: string;
  lastLoginAt: string;
  apiKey: string;
  appName: string;
  data_user: BuildingData;
}

interface BuildingData {
  grupo_gerador_testes: boolean;
  buildingName: string;
  bairro: string;
  address: string;
  firstName: string;
  cidade: string;
  buildingAge: string; // Pode ser um Date se preferir
  lastName: string;
  cep: string;
  spda: boolean;
  grupo_gerador_verificacoes: boolean;
  uf: string;
  spda_para_raios: boolean;
}
