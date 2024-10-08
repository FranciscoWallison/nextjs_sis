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
        if (!user || !(await interceptAuth())) {
          router.push("/login");
          return;
        }
        if (!(await validaUsuarioForm())) {
          router.push("/form");
          return;
        }

      };

      if (router.pathname === "/") {
        router.push("/Dashboard");
      }

      checkAuth();
    }, [router]);

    return <WrappedComponent {...props} />;
  };

  return Wrapper;
};

export default withAuth;
