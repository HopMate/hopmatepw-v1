/**
 * @file useAuth.ts
 * @description This file defines the useAuth hook, which provides access to the authentication context in the application.
 */

import { useContext } from 'react';
import { AuthContext } from '@/context/AuthContext';

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
