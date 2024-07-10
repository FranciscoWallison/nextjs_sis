// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
} from "firebase/auth";

import { LoginData } from "../interface/Login";
import AuthStorage from "../utils/AuthStorage";
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
} from "@firebase/firestore";
// import { getFirestore } from "firebase/firestore";

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
const auth = getAuth(app);

// TODO:: ADD informações na api com rotas rest-full

export const CriarUsuario = async (data: LoginData): Promise<boolean> => {
  return await createUserWithEmailAndPassword(auth, data.email, data.password)
    .then((userCredential) => true)
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;

      return false;
    });
};

export const Login = async (data: LoginData): Promise<boolean> => {
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

export const pegarTodos = async (): Promise<object> => {
  const database = getFirestore(app);

  const dbInstance = collection(database, "cliente");

  const querySnapshot = await getDocs(collection(database, "cliente"));
  querySnapshot.forEach((doc) => {
    // doc.data() is never undefined for query doc snapshots
    console.log(doc.id, " => ", doc.data());
  });
};

export const salvarNovo = async (data: object): Promise<void> => {
  const database = getFirestore(app);

  const dbInstance = collection(database, "cliente");
  debugger;
  console.log(data);

  // await setDoc(collection(database, "cliente", data.uid), data);
  await setDoc(doc(database, "cliente", data.uid), data);
  await setDoc(doc(db, "cliente", "LA"), {
    name: "Los Angeles",
    state: "CA",
    country: "USA",
  });
  // dbInstance.doc(data.uid).set(data)

  // return await addDoc(dbInstance, data)
  //   .then(() => console.log("gravamos"))
  //   .catch((error) => {
  //     const errorCode = error.code;
  //     const errorMessage = error.message;

  //     return false;
  //   });
};
