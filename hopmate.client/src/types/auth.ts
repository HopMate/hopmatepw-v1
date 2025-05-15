/**
 * @file auth.ts
 * @description This file defines the types and interfaces used for authentication-related requests and responses in the application.
 */

import type { User } from "./user";

export interface RegisterRequest {
    fullName: string;
    email: string;
    password: string;
    dateOfBirth: string;
}

export interface LoginRequest {
    email: string;
    password: string;
}

export interface RefreshTokenRequest {
    refreshToken: string;
}

export interface AuthResponse {
    success: boolean;
    message: string;
    token?: string;
    refreshToken?: string;
    user?: User;
    errors?: string[];
}