/**
 * @file useUser.ts
 * @description This file defines the useUser hook, which provides access to the user context in the application.
 */

import { useContext } from 'react';
import { UserContext } from '@/context/UserContext';

export const useUser = () => {
    const context = useContext(UserContext);
    if (!context) {
        throw new Error('useUser must be used within a UserProvider');
    }
    return context;
};