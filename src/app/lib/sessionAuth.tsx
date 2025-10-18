import LoadingLoaders from "../components/loaders/LoadingLoaders";
import { useAuth } from "../context/AuthContext";
import { useRouter } from "next/navigation";
import UnauthorizedPage from "../utils/UnauthorizedPage";
import { useEffect } from "react";
import Cookies from "js-cookie";

const sessionAuth = (WrappedComponent: any) => {
  return (props: any) => {
    const router = useRouter();
    const { loading, isAuthenticated, isLogout }: any = useAuth();

    useEffect(() => {
      if (!isAuthenticated && !loading) {
        router.push("/login");
      }

      const urlParams = new URLSearchParams(window.location.search);
      const token = urlParams.get("token");
      const rememberToken = urlParams.get("rememberToken");
      if (token && rememberToken) {
        Cookies.set("APP-TOKEN", token, { sameSite: "Lax", expires: 7 });
        Cookies.set("APP-REMEMBER-TOKEN", rememberToken, {
          sameSite: "Lax",
          expires: 7,
        });
      }
    }, [router]);

    if (loading) return <LoadingLoaders />;

    if (!isAuthenticated) {
      if (isLogout) {
        return <LoadingLoaders />;
      }
      return <UnauthorizedPage />;
    }

    return <WrappedComponent {...props} />;
  };
};

export default sessionAuth;
