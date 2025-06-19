import LoadingLoaders from "../components/loaders/LoadingLoaders";
import { useAuth } from "../context/AuthContext";
import { useRouter } from "next/navigation";
import UnauthorizedPage from "../utils/UnauthorizedPage";
import { useEffect } from "react";

const withAuth = (WrappedComponent: any) => {
  function WithAuthComponent(props: any) {
    const { isAuthenticated, loading, isLogout }: any = useAuth();
    const router = useRouter();

    useEffect(() => {
      if (!isAuthenticated && !loading) {
        router.push("/login");
      }
    }, [isAuthenticated, loading, router]);

    if (loading) return <LoadingLoaders />;

    if (!isAuthenticated) {
      if (isLogout) return <LoadingLoaders />;
      return <UnauthorizedPage />;
    }

    return <WrappedComponent {...props} />;
  }

  return WithAuthComponent;
};

export default withAuth;
