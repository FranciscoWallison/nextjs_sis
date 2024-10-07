import { useEffect } from "react";
import { useRouter } from "next/router";
import AuthStorage from "../utils/AuthStorage";
import { interceptAuth } from "../services/authService";
import { validaUsuarioForm, pegarUsuarioPeriodicidades } from "@/services/firebaseService";

const withAuth = (WrappedComponent: React.FC) => {
  const Wrapper: React.FC = (props) => {
    const router = useRouter();

    useEffect(() => {
      const checkAuth = async () => {
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
        }
      };

      checkAuth();
    }, [router.pathname]); // Verifica a cada mudança de rota

    return <WrappedComponent {...props} />;
  };

  return Wrapper;
};

export default withAuth;
