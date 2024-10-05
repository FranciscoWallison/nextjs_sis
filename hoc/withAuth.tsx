import { useEffect } from "react";
import { useRouter } from "next/router";
import AuthStorage from "../utils/AuthStorage";
import { interceptAuth } from "../services/authService";
import { validaUsuarioForm } from "@/services/firebaseService";

const withAuth = (WrappedComponent: React.FC) => {
  const Wrapper: React.FC = (props) => {
    const router = useRouter();

    useEffect(() => {
      const checkAuth = async () => {
        const user = AuthStorage.getUser();
        
        // Verifica se o usuário está autenticado
        if (!user || !(await interceptAuth())) {
          router.replace("/login");
          return;
        }

        // Verifica se o formulário foi preenchido
        if (!(await validaUsuarioForm())) {
          router.replace("/form");
          return;
        }

        // Redireciona para o dashboard se o caminho for a root "/"
        if (router.pathname === "/") {
          router.replace("/Dashboard");
        }
      };

      checkAuth();
    }, []); // Dependência vazia, pois `router` não precisa ser incluído aqui

    return <WrappedComponent {...props} />;
  };

  return Wrapper;
};

export default withAuth;
