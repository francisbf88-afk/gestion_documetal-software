import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth debe ser usado dentro de un AuthProvider');
    }
    return context;
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [token, setToken] = useState(localStorage.getItem('token'));

    // Configurar axios con la URL base y el token
    useEffect(() => {
        const apiUrl = process.env.REACT_APP_API_URL || '';
        axios.defaults.baseURL = apiUrl;
        
        if (token) {
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        } else {
            delete axios.defaults.headers.common['Authorization'];
        }
    }, [token]);

    // Verificar token al cargar la aplicación
    useEffect(() => {
        const checkAuth = async () => {
            if (token) {
                try {
                    const response = await axios.get('/api/auth/profile');
                    setUser(response.data.user);
                } catch (error) {
                    console.error('Error verificando autenticación:', error);
                    logout();
                }
            }
            setLoading(false);
        };

        checkAuth();
    }, [token]);

    const login = async (username, password) => {
        try {
            const response = await axios.post('/api/auth/login', { username, password });
            const { token: newToken, user: userData } = response.data;
            
            setToken(newToken);
            setUser(userData);
            localStorage.setItem('token', newToken);
            
            return { success: true };
        } catch (error) {
            console.error('Error en login:', error);
            return {
                success: false,
                message: error.response?.data?.message || 'Error al iniciar sesión'
            };
        }
    };

    const logout = () => {
        setToken(null);
        setUser(null);
        localStorage.removeItem('token');
        delete axios.defaults.headers.common['Authorization'];
    };

    const register = async (userData) => {
        try {
            const response = await axios.post('/api/auth/register', userData);
            return { success: true, message: response.data.message };
        } catch (error) {
            return {
                success: false,
                message: error.response?.data?.message || 'Error al registrar usuario'
            };
        }
    };

    const changePassword = async (currentPassword, newPassword) => {
        try {
            const response = await axios.put('/api/auth/change-password', {
                currentPassword,
                newPassword
            });
            return { success: true, message: response.data.message };
        } catch (error) {
            return {
                success: false,
                message: error.response?.data?.message || 'Error al cambiar contraseña'
            };
        }
    };

    const value = {
        user,
        token,
        loading,
        login,
        logout,
        register,
        changePassword,
        isAuthenticated: !!user,
        isAdmin: user?.rol === 'admin',
        isEditor: user?.rol === 'editor',
        isAsesor: user?.rol === 'asesor'
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};