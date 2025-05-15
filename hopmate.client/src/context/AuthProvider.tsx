// context/AuthProvider.tsx
import { useState, useEffect, type ReactNode } from 'react';
import { AuthContext, type AuthContextType } from './AuthContext';
import type { User } from '@/types/user';
import { userService } from '@/services/userService';

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
    const [user, setUser] = useState<User | null>(null);
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(!!token);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                if (token) {
                    const userData = await userService.getCurrentUser();
                    setUser(userData);
                }
            } catch (error) {
                console.error('Failed to fetch user:', error);
                setUser(null);
            }
        };

        if (token) {
            localStorage.setItem('token', token);
            setIsAuthenticated(true);
            fetchUser();
        } else {
            localStorage.removeItem('token');
            setIsAuthenticated(false);
            setUser(null);
        }
    }, [token]);

    const login: AuthContextType['login'] = async (response) => {
        if (response.success && response.token) {
            setToken(response.token);

            // Set user from response if available, otherwise fetch it
            if (response.user) {
                setUser(response.user);
            } else {
                try {
                    const userData = await userService.getCurrentUser();
                    setUser(userData);
                } catch (error) {
                    console.error('Failed to fetch user:', error);
                }
            }

            if (response.refreshToken) {
                localStorage.setItem('refreshToken', response.refreshToken);
            }
        }
    };

    const logout = () => {
        setToken(null);
        setUser(null);
        localStorage.removeItem('refreshToken');
    };

    return (
        <AuthContext.Provider value={{
            isAuthenticated,
            token,
            user,
            login,
            logout,
            setUser
        }}>
            {children}
        </AuthContext.Provider>
    );
};