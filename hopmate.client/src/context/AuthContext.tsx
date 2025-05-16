/**
 * @file AuthContext.tsx
 * @description Updated auth context with loading state
 */

import { createContext } from 'react';
import type { AuthResponse } from '@/types/auth';
import type { User } from '@/types/user';

export interface AuthContextType {
    isAuthenticated: boolean;
    token: string | null;
    user: User | null;
    login: (response: AuthResponse) => Promise<void>;
    logout: () => void;
    setUser: (user: User) => void;
    isLoading: boolean;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);