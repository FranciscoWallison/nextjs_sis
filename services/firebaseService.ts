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
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
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
}

export interface CategoryData {
  title: string;
  data: Activity[];
}

export interface PeriodicidadeResponse {
  questions: CategoryData[];
}

// Your pegarUsuarioPeriodicidades function
export const pegarUsuarioPeriodicidades =
  async (): Promise<PeriodicidadeResponse> => {
    try {
      const user: FirebaseUser | null = AuthStorage.getUser();
      if (!user || !user.uid) {
        throw new Error("User not authenticated");
      }
      const db = getFirestore(app);
      const docRef = doc(db, "cliente", user.uid);
      const docSnap = await getDoc(docRef);

      if (!docSnap.exists()) {
        throw new Error("No such document!");
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
    const data = await pegarUsuarioPeriodicidades();

    console.log("======usuarioPeriodicidadesAtualizar===========");
    console.log(updatedActivity, data.questions);
    console.log("====================================");

    const updateData = (data: CategoryData[], updatedActivity: Activity) => {
      return data.map((category) => ({
        ...category,
        data: category.data.map((activity) =>
          activity.id === updatedActivity.id
            ? { ...activity, ...updatedActivity }
            : activity
        ),
      }));
    };

    const updatedData = updateData(data.questions, updatedActivity);

    console.log(updatedData);
    data.questions = updatedData;

    await salvarNovo(data);
    return true;
  } catch (error) {
    console.log("====================================");
    console.error("usuarioPeriodicidadesAtualizar", error);
    console.log("====================================");
    return false;
  }
};



export const usuarioPeriodicidadesAdicionar = async (
  updatedActivity: any
): Promise<boolean> => {
  try {
    const data = await pegarUsuarioPeriodicidades();

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
