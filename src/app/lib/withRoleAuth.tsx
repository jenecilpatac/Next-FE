import LoadingLoaders from "../components/loaders/LoadingLoaders";
import { useAuth } from "../context/AuthContext";
import { useRouter } from "next/navigation";
import UnauthorizedPage from "../utils/UnauthorizedPage";
import { useEffect } from "react";

const withRoleAuth = (WrappedComponent: any) => {
  function WithRoleAuthComponent(props: any) {
    const {
      isAuthenticated,
      loading,
      hasHigherRole,
      isLogout,
      hasNormalRole,
    }: any = useAuth();
    const router = useRouter();

    useEffect(() => {
      if (!isAuthenticated && !loading) {
        router.push("/login");
      }
    }, [isAuthenticated, loading, router]);

    if (loading) {
      return <LoadingLoaders />;
    }

    if (!isAuthenticated || (!isLogout && !hasHigherRole) || hasNormalRole) {
      if (isLogout) return <LoadingLoaders />;
      return <UnauthorizedPage />;
    }

    return <WrappedComponent {...props} />;
  }
  
  return WithRoleAuthComponent;
};

export default withRoleAuth;
