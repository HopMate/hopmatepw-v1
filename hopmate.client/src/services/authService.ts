/**
 * @file authService.ts
 * @description This file defines the authService, which provides methods for user authentication, including registration, login, and token refresh.
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
        // Note: This endpoint isn't in your controller yet, but adding it for completeness
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
        // Note: This endpoint isn't in your controller yet, but adding it for completeness
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
    }
};