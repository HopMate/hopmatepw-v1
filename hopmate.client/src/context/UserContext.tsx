/**
 * @file UserContext.tsx
 * @description This file defines the UserContext, which provides user information and methods to manage user state in the application.
 */

import { createContext } from 'react';
import { type User } from '@/types/user';

export interface UserContextType {
    user: User | null;
    setUser: (user: User | null) => void;
}

export const UserContext = createContext<UserContextType | undefined>(undefined);