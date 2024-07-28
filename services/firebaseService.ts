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
// const firebaseConfig = {
//   apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
//   authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
//   databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL,
//   projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
//   storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
//   messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
//   appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
//   measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
// };


const firebaseConfig = {
  apiKey: "AIzaSyAJXhhTYScTaOFUjeKWJ3yMcB7sbmknHrw",
  authDomain: "manut-mais-inteligente.firebaseapp.com",
  databaseURL: "https://manut-mais-inteligente-default-rtdb.firebaseio.com",
  projectId: "manut-mais-inteligente",
  storageBucket: "manut-mais-inteligente.appspot.com",
  messagingSenderId: "1077928484057",
  appId: "1:1077928484057:web:237e84101bffdac463b2c8",
  measurementId: "G-2JCT8W4KGM"
};
// Initialize Firebase
export const app = initializeApp(firebaseConfig);
// export const analytics = getAnalytics(app);

// TODO:: ADD informações na api com rotas rest-full

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

// TODO:: Logica de repositório e usar na api

export const validaUsuarioForm = async (): Promise<boolean> => {
  try {
    const user: FirebaseUser | null = AuthStorage.getUser(); // Ensure the user is of type User or null
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
    // const cliente = { ...infor.data(), id: user.uid };
  } catch (error) {
    console.log("====================================");
    console.log("validaUsuarioForm", error);
    console.log("====================================");
    return false;
  }
  return false;
};


export const pegarUsuarioPeriodicidades= async (): Promise<object> => {
  try {
    const user: FirebaseUser | null = AuthStorage.getUser(); // Ensure the user is of type User or null
    if (!user || !user.uid) {
      return false;
    }
    const db = getFirestore(app);

    const return_infor = doc(db, "cliente", user.uid);
    const infor = await getDoc(return_infor);

    return infor.data();
    // const cliente = { ...infor.data(), id: user.uid };
  } catch (error) {
    console.log("====================================");
    console.log("validaUsuarioForm", error);
    console.log("====================================");
    return false;
  }
  return false;
};


export const salvarNovo = async (data: any): Promise<boolean> => {
  try {
    const user: FirebaseUser | null = AuthStorage.getUser();
    if (!user || !user.uid) {
      return false;
    }

    // Log dos dados recebidos
    console.log("Dados recebidos para salvarNovo:", data);
    console.log("Tipo de data:", typeof data);
    console.log("É array?", Array.isArray(data));

    // Verificar se 'data' é um objeto válido
    if (typeof data !== 'object' || data === null || Array.isArray(data)) {
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