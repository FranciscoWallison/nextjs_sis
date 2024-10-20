import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import AuthStorage from "../utils/AuthStorage";
import { interceptAuth } from "../services/authService";
import {
  validaUsuarioForm,
  pegarUsuarioPeriodicidades,
} from "@/services/firebaseService";

const withAuth = (WrappedComponent: React.FC) => {
  const Wrapper: React.FC = (props) => {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
      const checkAuth = async () => {
        setIsLoading(true); // Ativa o estado de carregamento

        const user = AuthStorage.getUser();

        // Verifica se o usuário está autenticado antes de continuar
        if (!user || !(await interceptAuth())) {
          router.replace("/login");
          return;
        }

        // Se data_user for nulo, busca os dados completos e atualiza o storage
        if (user?.data_user === null) {
          const dataUser = await pegarUsuarioPeriodicidades(user.uid);
          const userWithFullData = {
            ...user,
            data_user: dataUser,
          };
          AuthStorage.setUser(userWithFullData);
        }

        // Verifica se o formulário foi preenchido
        if (!(await validaUsuarioForm())) {
          router.replace("/form");
          return;
        }

        // Redireciona para o dashboard se o caminho for a root "/"
        if (router.pathname === "/") {
          router.replace("/Dashboard");
          return;
        }

        setIsLoading(false); // Desativa o estado de carregamento após todas as validações
      };

      checkAuth();
    }, [router]);

    if (isLoading) {
      return <div></div>; // Pode customizar uma tela de carregamento ou spinner
    }

    return <WrappedComponent {...props} />;
  };

  return Wrapper;
};

export default withAuth;
