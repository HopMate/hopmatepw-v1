/**
 * @file UserContext.tsx
 * @description This file defines the UserContext, which provides user information and methods to manage user state in the application.
 */

import { createContext } from 'react';

export interface User {
    fullName: string;
    email: string;
}

export interface UserContextType {
    user: User | null;
    setUser: (user: User | null) => void;
}

export const UserContext = createContext<UserContextType | undefined>(undefined);