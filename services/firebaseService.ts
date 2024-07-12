// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
} from "firebase/auth";
import AuthStorage from "../utils/AuthStorage";
import { LoginData } from "../interface/Login";
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

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
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
    const user = AuthStorage.getUser();
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

export const salvarNovo = async (data: object): Promise<boolean> => {
  try {
    const user = AuthStorage.getUser();
    const db = getFirestore(app);

    const new_form = await setDoc(doc(db, "cliente", user.uid), data);

    return await validaUsuarioForm();
  } catch (error) {
    console.log("============salvarNovo================");
    console.log(error);
    console.log("====================================");
  }
  return false;
};
