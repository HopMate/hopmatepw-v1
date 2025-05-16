/**
 * @file AuthProvider.tsx
 * @description Fixed auth provider with better error handling
 */

import { useState, useEffect, type ReactNode } from 'react';
import { AuthContext, type AuthContextType } from './AuthContext';
import type { User } from '@/types/user';
import type { AuthResponse } from '@/types/auth';
import { userService } from '@/services/userService';
import { authService } from '@/services/authService';

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
    const [user, setUser] = useState<User | null>(null);
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(!!token);
    const [isLoading, setIsLoading] = useState<boolean>(!!token);

    useEffect(() => {
        const fetchUser = async () => {
            if (!token) return;

            setIsLoading(true);
            try {
                const userData = await userService.getCurrentUser();
                setUser(userData);
                setIsAuthenticated(true);
            } catch (error) {
                console.error('Failed to fetch user:', error);
                // If we can't fetch the user, the token might be invalid
                logout();
            } finally {
                setIsLoading(false);
            }
        };

        fetchUser();
    }, [token]);

    const login = async (response: AuthResponse) => {
        if (response.success && response.token) {
            // Set token in state and localStorage
            setToken(response.token);
            authService.setToken(response.token);

            // Store refresh token if available
            if (response.refreshToken) {
                localStorage.setItem('refreshToken', response.refreshToken);
            }

            try {
                // After setting the token, try to fetch the user data
                const userData = await userService.getCurrentUser();
                setUser(userData);
                setIsAuthenticated(true);
            } catch (error) {
                console.error('Failed to fetch user after login:', error);
                // Don't logout here, as the token might be valid but the user endpoint might have issues
            }
        }
    };

    const logout = () => {
        setToken(null);
        setUser(null);
        setIsAuthenticated(false);
        authService.removeToken();
        localStorage.removeItem('refreshToken');
    };

    const authContextValue: AuthContextType = {
        isAuthenticated,
        token,
        user,
        login,
        logout,
        setUser,
        isLoading
    };

    return (
        <AuthContext.Provider value={authContextValue}>
            {children}
        </AuthContext.Provider>
    );
};
