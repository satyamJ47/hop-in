import { createContext, useContext, useState } from "react";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [isLoggedIn, setIsLoggedIn] = useState(
        !!localStorage.getItem("token")
    );

    function login(token) {
        localStorage.setItem("token", token);
        setIsLoggedIn(true);
    }

    function logout() {
        localStorage.removeItem("token");
        setIsLoggedIn(false);
    }

    return (
        <AuthContext.Provider
            value={{
                isLoggedIn,
                login,
                logout,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}