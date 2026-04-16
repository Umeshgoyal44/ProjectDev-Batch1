import { createContext, useContext, useEffect, useState } from "react";
import { useGetMe } from "@workspace/api-client-react";
const AuthContext = createContext(undefined);
export function AuthProvider({ children }) {
    const [token, setToken] = useState(() => localStorage.getItem("carpool_token"));
    const { data: user, isLoading: isUserLoading, refetch } = useGetMe({
        query: {
            enabled: !!token,
            retry: false,
        }
    });
    // Re-fetch user if token changes
    useEffect(() => {
        if (token) {
            refetch();
        }
    }, [token, refetch]);
    const login = (newToken) => {
        localStorage.setItem("carpool_token", newToken);
        setToken(newToken);
    };
    const logout = () => {
        localStorage.removeItem("carpool_token");
        setToken(null);
    };
    return (<AuthContext.Provider value={{ user: user || null, isLoading: !!token && isUserLoading, login, logout }}>
      {children}
    </AuthContext.Provider>);
}
export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
}
