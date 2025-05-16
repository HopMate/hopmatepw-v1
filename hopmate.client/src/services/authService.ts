/**
 * @file authService.ts
 * @description Fixed authentication service
 */

import type { LoginRequest, RegisterRequest, RefreshTokenRequest, AuthResponse } from '@/types/auth';

const API_URL = 'https://localhost:7293/api/Auth';

export const authService = {
    register: async (data: RegisterRequest): Promise<AuthResponse> => {
        const response = await fetch(`${API_URL}/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });

        return await response.json();
    },

    login: async (data: LoginRequest): Promise<AuthResponse> => {
        const response = await fetch(`${API_URL}/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });

        return await response.json();
    },

    refreshToken: async (data: RefreshTokenRequest): Promise<AuthResponse> => {
        const response = await fetch(`${API_URL}/refresh-token`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });

        return await response.json();
    },

    forgotPassword: async (email: string): Promise<AuthResponse> => {
        const response = await fetch(`${API_URL}/forgot-password`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email }),
        });

        return await response.json();
    },

    resetPassword: async (username: string, newPassword: string): Promise<AuthResponse> => {
        const response = await fetch(`${API_URL}/reset-password`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, newPassword }),
        });

        return await response.json();
    },

    getToken: (): string | null => {
        return localStorage.getItem('token');
    },

    setToken: (token: string): void => {
        localStorage.setItem('token', token);
    },

    removeToken: (): void => {
        localStorage.removeItem('token');
    }
};