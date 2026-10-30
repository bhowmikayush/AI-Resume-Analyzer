 
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

const Protected = ({ children, requireAdmin = false }) => {
    const { user, loading } = useAuth();
    const location = useLocation();

    if (loading) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-black text-white">
                Checking authentication...
            </div>
        );
    }

    // User must be logged in.
    if (!user) {
        return (
            <Navigate
                to="/login"
                replace
                state={{ from: location }}
            />
        );
    }

    // Only admins can access admin pages.
    if (requireAdmin && user.role !== "admin") {
        return <Navigate to="/" replace />;
    }

    return children;
};

export default Protected;
 