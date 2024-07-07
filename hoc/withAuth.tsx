import { useEffect } from "react";
import { useRouter } from "next/router";
import AuthStorage from "../utils/AuthStorage";
import { interceptAuth } from "../services/authService";

const withAuth = (WrappedComponent: React.FC) => {
  const Wrapper: React.FC = (props) => {
    const router = useRouter();

    useEffect(() => {
      const checkAuth = async () => {
        const user = AuthStorage.getUser();
        if (!user || !(await interceptAuth())) {
          router.push("/login");
        }
      };

      checkAuth();
    }, [router]);

    return <WrappedComponent {...props} />;
  };

  return Wrapper;
};

export default withAuth;
