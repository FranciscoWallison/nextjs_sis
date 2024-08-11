// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
} from "firebase/auth";
import AuthStorage from "@/utils/AuthStorage";
import { LoginData } from "@/interface/Login";
import {
  collection,
  addDoc,
  doc,
  getDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  setDoc,
  getFirestore,
  // "@firebase/firestore";
} from "firebase/firestore";

import { FirebaseUser } from "@/interface/FirebaseUser";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
const firebaseConfig = {
  apiKey: "AIzaSyAJXhhTYScTaOFUjeKWJ3yMcB7sbmknHrw",
  authDomain: "manut-mais-inteligente.firebaseapp.com",
  databaseURL: "https://manut-mais-inteligente-default-rtdb.firebaseio.com",
  projectId: "manut-mais-inteligente",
  storageBucket: "manut-mais-inteligente.appspot.com",
  messagingSenderId: "1077928484057",
  appId: "1:1077928484057:web:237e84101bffdac463b2c8",
  measurementId: "G-2JCT8W4KGM",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);

export const CriarUsuario = async (data: LoginData): Promise<boolean> => {
  const auth = getAuth(app);

  return await createUserWithEmailAndPassword(auth, data.email, data.password)
    .then((userCredential) => true)
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;

      return false;
    });
};

export const Login = async (data: LoginData): Promise<boolean> => {
  const auth = getAuth(app);

  return await signInWithEmailAndPassword(auth, data.email, data.password)
    .then((userCredential) => {
      // Signed in
      const user = userCredential.user;
      AuthStorage.setUser(user);
      return true;
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;

      return false;
    });
};

export const ObservadorEstado = async (): Promise<boolean> => {
  const auth = getAuth();

  return new Promise((resolve) => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      unsubscribe();
      resolve(!!user);
    });
  });
};

export const validaUsuarioForm = async (): Promise<boolean> => {
  try {
    const user: FirebaseUser | null = AuthStorage.getUser();
    if (!user || !user.uid) {
      return false;
    }
    const db = getFirestore(app);

    const return_infor = doc(db, "cliente", user.uid);
    const infor = await getDoc(return_infor);

    if (infor.data() === undefined) {
      return false;
    }
    return true;
  } catch (error) {
    console.log("====================================");
    console.log("validaUsuarioForm", error);
    console.log("====================================");
    return false;
  }
  return false;
};

export interface ResponsibleInfo {
  nome: string;
  telefone: string;
  email: string;
}

export interface Activity {
  titulo: string;
  atividade: string;
  responsavel: string;
  Periodicidade: string;
  obrigatorio: string;
  responsavel_info: ResponsibleInfo;
  data?: string;
  nao_feito?: boolean;
  nao_lembro?: boolean;
  id_name: string;
  id: number;
  category_id?: number;
}

export interface CategoryData {
  titulo: string;
  atividade: string;
  responsavel: string;
  Periodicidade: string;
  obrigatorio: string;
  responsavel_info: ResponsibleInfo;
  data?: string;
  nao_feito?: boolean;
  nao_lembro?: boolean;
  id_name: string;
  id: number;
  category_id?: number;
}

export interface PeriodicidadeResponse {
  questions: CategoryData[];
}

// Your pegarUsuarioPeriodicidades function
export const pegarUsuarioPeriodicidades =
  async (): Promise<PeriodicidadeResponse | null> => {
    try {
      const user: FirebaseUser | null = AuthStorage.getUser();
      if (!user || !user.uid) {
        // throw new Error("User not authenticated");
        return null
      }
      const db = getFirestore(app);
      const docRef = doc(db, "cliente", user.uid);
      const docSnap = await getDoc(docRef);

      if (!docSnap.exists()) {
        // throw new Error("No such document!");
        return null;
      }

      const data = docSnap.data() as PeriodicidadeResponse;
      return data;
    } catch (error) {
      console.error("pegarUsuarioPeriodicidades error", error);
      throw error;
    }
  };

export const usuarioPeriodicidadesAtualizar = async (
  updatedActivity: Activity
): Promise<boolean> => {
  try {
    // Obter os dados atuais do usuário
    const data = await pegarUsuarioPeriodicidades();
    if (data === null) {
      return false;
    }
    console.log("======usuarioPeriodicidadesAtualizar===========");
    console.log(updatedActivity, data.questions);
    console.log("====================================");

    // Atualizar a atividade correspondente
    const updatedData = data.questions.map((activity: Activity) =>
      activity.id === updatedActivity.id
        ? { ...activity, ...updatedActivity } // Atualiza a atividade correspondente
        : activity
    );

    // Substituir as atividades no objeto data
    data.questions = updatedData;

    // Salvar os dados atualizados no servidor
    await salvarNovo(data);

    return true;
  } catch (error) {
    console.error("Erro em usuarioPeriodicidadesAtualizar:", error);
    return false;
  }
};

export const usuarioPeriodicidadesAdicionar = async (
  updatedActivity: any
): Promise<boolean> => {
  try {
    const data = await pegarUsuarioPeriodicidades();

    if (data === null) {
      return false;
    }

    console.log("======usuarioPeriodicidadesAdicionar===========");
    console.log(updatedActivity, data.questions);
    console.log("====================================");

    console.log(updatedActivity);
    data.questions = updatedActivity;

    await salvarNovo(data);
    return true;
  } catch (error) {
    console.log("====================================");
    console.log("usuarioPeriodicidadesAdicionar", error);
    console.log("====================================");
    return false;
  }
};

export const salvarNovo = async (data: any): Promise<boolean> => {
  try {
    const user: FirebaseUser | null = AuthStorage.getUser();
    if (!user || !user.uid) {
      return false;
    }

    console.log("Dados recebidos para salvarNovo:", data);
    console.log("Tipo de data:", typeof data);
    console.log("É array?", Array.isArray(data));

    if (typeof data !== "object" || data === null || Array.isArray(data)) {
      throw new Error("Data must be a valid object");
    }

    const db = getFirestore(app);
    await setDoc(doc(db, "cliente", user.uid), data);

    return await validaUsuarioForm();
  } catch (error) {
    console.log("============salvarNovo================");
    console.error(error);
    console.log("====================================");
  }
  return false;
};
