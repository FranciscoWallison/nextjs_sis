import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";
import { login as loginService, signUp } from "../services/authService";
import { LoginData, SignUpData } from "../interface/Login";
import { useRouter } from "next/router";
import AuthStorage from "../utils/AuthStorage";

interface AuthContextType {
  token: string | null;
  setToken: (token: string | null) => void;
  open: boolean;
  setOpen: (open: boolean) => void;
  login: (data: LoginData) => Promise<boolean>;
  createUser: (data: SignUpData) => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [token, setToken] = useState<string | null>(null);
  const [open, setOpen] = useState<boolean>(true);
  const router = useRouter();

  useEffect(() => {
    // TODO:: Implementar logica de token
    // const storedToken = AuthStorage.getToken();
    // if (storedToken) {
    //   setToken(storedToken);
    // }

  }, []);

  const login = async (data: LoginData): Promise<boolean> => {
    try {
      const response = await loginService(data);
      if (response) {
        // TODO:: Implementar logica de token
        // setToken(response.token);
        // AuthStorage.setToken(response.token);

        router.push("/");
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
        // TODO:: Implementar logica de token
        // setToken(response.token);
        // AuthStorage.setToken(response.token);
        // router.push("/");
        return true;
      }
    } catch (error) {
      console.error("createUser :", error);
      // throw new Error("Sign up failed");
    }
    return false;
  };

  return (
    <AuthContext.Provider
      value={{ token, setToken, open, setOpen, login, createUser }}
    >
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
