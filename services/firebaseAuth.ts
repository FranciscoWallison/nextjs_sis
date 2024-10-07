import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
} from "firebase/auth";
import { app } from "./firebaseService";
import AuthStorage from "@/utils/AuthStorage";
import { LoginData } from "@/interface/Login";
import { pegarUsuarioPeriodicidades } from "./firebaseFirestore";

export const CriarUsuario = async (data: LoginData): Promise<boolean> => {
  const auth = getAuth(app);
  return await createUserWithEmailAndPassword(auth, data.email, data.password)
    .then(() => true)
    .catch(() => false);
};

export const Login = async (data: LoginData): Promise<boolean> => {
  const auth = getAuth(app);
  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      data.email,
      data.password
    );
    const user = userCredential.user;
    const dataUser = await pegarUsuarioPeriodicidades(user.uid);
    const userWithFullData = { ...user, data_user: dataUser };
    AuthStorage.setUser(userWithFullData);
    return true;
  } catch (error) {
    console.error("Erro no login:", error);
    return false;
  }
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
