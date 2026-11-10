import { CircularProgress } from "@mui/material";
import { Navigate } from "react-router-dom";
import { useAuth } from "../providers/AuthProvider";

export const RequireAuth = ({ children }) => {
    const { status } = useAuth();
    if (status === "checking") return <CircularProgress />;
    return status === "authenticated" ? children : <Navigate to="/login" replace />;
};

export const PublicOnly = ({ children }) => {
    const { status } = useAuth();
    if (status === "checking") return <CircularProgress />;
    return status === "authenticated" ? <Navigate to="/dashboard" replace /> : children;
};
