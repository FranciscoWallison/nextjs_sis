import React, { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { login as loginService, signUp } from "../services/authService";
import { LoginData, SignUpData } from "../interface/Login";
import { useRouter } from "next/router";
import AuthStorage from "../utils/AuthStorage";
import { getAuth, sendPasswordResetEmail } from "firebase/auth"; // 🔹 Importe do Firebase

interface AuthContextType {
  token: string | null;
  setToken: (token: string | null) => void;
  open: boolean;
  setOpen: (open: boolean) => void;
  login: (data: LoginData) => Promise<boolean>;
  createUser: (data: SignUpData) => Promise<boolean>;
  resetPassword: (email: string) => Promise<void>; // 🔹 Adicione esta função
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [token, setToken] = useState<string | null>(null);
  const [open, setOpen] = useState<boolean>(true);
  const router = useRouter();

  useEffect(() => {
    // TODO:: Implementar logica de token futuramente
  }, []);

  const login = async (data: LoginData): Promise<boolean> => {
    try {
      const response = await loginService(data);
      if (response) {
        router.push("/Dashboard");
        return true;
      }
    } catch (error) {
      console.error("Login error:", error);
      throw new Error("Login failed");
    }
    return false;
  };

  const createUser = async (data: SignUpData): Promise<boolean> => {
    try {
      const new_user = {
        email: data.email,
        password: data.password,
      };
      const response = await signUp(new_user);
      if (response) {
        return true;
      }
    } catch (error) {
      console.error("createUser error:", error);
    }
    return false;
  };

  // 🔹 Função para resetar a senha
  const resetPassword = async (email: string): Promise<void> => {
    const auth = getAuth();
    try {
      await sendPasswordResetEmail(auth, email);
    } catch (error) {
      console.error("Erro ao enviar solicitação de redefinição de senha:", error);
      throw new Error("Erro ao enviar solicitação. Verifique o e-mail digitado.");
    }
  };

  return (
    <AuthContext.Provider value={{ token, setToken, open, setOpen, login, createUser, resetPassword }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
