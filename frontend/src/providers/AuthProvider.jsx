import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import axios from "axios";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [status, setStatus] = useState("checking");

    useEffect(() => {
        let active = true;
        axios.post("/user")
            .then(({ data }) => {
                if (!active) return;
                if (data.success && data.user) {
                    setUser(data.user);
                    setStatus("authenticated");
                } else setStatus("anonymous");
            })
            .catch(() => { if (active) setStatus("anonymous"); });
        return () => { active = false; };
    }, []);

    const login = useCallback((sessionUser) => {
        setUser(sessionUser);
        setStatus("authenticated");
    }, []);

    const logout = useCallback(async () => {
        await axios.post("/user/logout");
        setUser(null);
        setStatus("anonymous");
    }, []);

    const value = useMemo(() => ({ user, status, login, logout }), [user, status, login, logout]);
    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
