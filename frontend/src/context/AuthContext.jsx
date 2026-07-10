import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(null);
    const [loading, setLoading] = useState(true);

    // Al arrancar la web, comprobamos si ya había una sesión guardada
    useEffect(() => {
        const storedToken = localStorage.getItem('pams_token');
        const storedUser = localStorage.getItem('pams_user');

        if (storedToken && storedUser) {
            setToken(storedToken);
            setUser(JSON.parse(storedUser));
        }
        setLoading(false);
    }, []);

    const login = (userData, accessToken) => {
        setUser(userData);
        setToken(accessToken);
        localStorage.setItem('pams_token', accessToken);
        localStorage.setItem('pams_user', JSON.stringify(userData));
    };

    const logout = () => {
        setUser(null);
        setToken(null);
        localStorage.removeItem('pams_token');
        localStorage.removeItem('pams_user');
    };

    return (
        <AuthContext.Provider value={{ user, token, authenticated: !!token, login, logout, loading }}>
            {!loading && children}
        </AuthContext.Provider>
    );
}

// Hook personalizado para usar la autenticación
export function useAuth() {
    return useContext(AuthContext);
}