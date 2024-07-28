import { LoginData } from "@/interface/Login";
import {
  CriarUsuario,
  Login,
  ObservadorEstado,
} from "@/services/firebaseService";

export const login = async (data: LoginData): Promise<boolean> => {
  try {
    return await Login(data);
  } catch (error) {
    console.log("============login============");
    console.log(error);
    console.log("====================================");
    return false;
  }
};

export const signUp = async (data: LoginData): Promise<boolean> => {
  try {
    return await CriarUsuario(data);
  } catch (error) {
    console.log("============signUp============");
    console.log(error);
    console.log("====================================");
    return false;
  }
};
export const interceptAuth = async (): Promise<boolean> => {
  try {
    return await ObservadorEstado();
  } catch (error) {
    console.log("============interceptAuth============");
    console.log(error);
    console.log("====================================");
    return false;
  }
};
