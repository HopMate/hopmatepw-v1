/**
 * @file AuthContext.tsx
 * @description This file defines the AuthContext, which provides authentication state and methods to the application.
 */

import { createContext } from 'react';
import type { AuthResponse } from '@/types/auth';
import type { User } from '@/types/user';

export interface AuthContextType {
    isAuthenticated: boolean;
    token: string | null;
    user: User | null;
    login: (response: AuthResponse) => void;
    logout: () => void;
    setUser: (user: User) => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);
