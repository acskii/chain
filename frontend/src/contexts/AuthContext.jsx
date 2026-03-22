import { createContext, useContext, useState, useEffect } from 'react';
import { userAPI } from "./APIContext";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [token, setToken] = useState(localStorage.getItem('user_token'));
    const [user, setUser] = useState(null);

    // Logic to handle the redirect from Google
    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const urlToken = params.get('user_token');

        if (urlToken) {
            saveToken(urlToken);
            fetchUser();
            // Clean the URL so the token doesn't stay in the address bar
            window.history.replaceState({}, document.title, window.location.pathname);
        }
    }, []);

    useEffect(() => {
        if (token) fetchUser();
    }, [token]);

    const fetchUser = async () => {
        try {
            const res = await userAPI.getProfile();
            setUser(res.data);
        } catch (err) {
            setUser(null);
        }
    };

    const saveToken = (userToken) => {
        localStorage.setItem('user_token', userToken);
        setToken(userToken);
        fetchUser();
    };

    const logout = () => {
        localStorage.removeItem('user_token');
        setToken(null);
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ token, user, saveToken, logout, isAuthenticated: !!token }}>
        {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);