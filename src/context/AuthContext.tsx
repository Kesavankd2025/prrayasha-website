"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { getUser, getToken, clearAuth, setAuth } from "@/lib/auth";

interface AuthContextType {
    user: any;
    token: string | null;
    login: (token: string, user: any) => void;
    logout: () => void;
    updateUser: (user: any) => void;
    isLoggedIn: boolean;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<any>(null);
    const [token, setToken] = useState<string | null>(null);

    useEffect(() => {
        // Sync state with localStorage on mount
        setUser(getUser());
        setToken(getToken());
    }, []);

    const login = (token: string, user: any) => {
        setAuth(token, user);
        setUser(user);
        setToken(token);
    };

    const logout = () => {
        clearAuth();
        localStorage.removeItem("guestId"); 
        setUser(null);
        setToken(null);
    };

    const updateUser = (updatedUser: any) => {
        const currentToken = getToken();
        if (currentToken) {
            setAuth(currentToken, updatedUser);
            setUser(updatedUser);
        }
    };

    return (
        <AuthContext.Provider value={{ user, token, login, logout, updateUser, isLoggedIn: !!token }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => useContext(AuthContext);
