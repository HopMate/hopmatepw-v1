/**
 * @file UserProvider.tsx
 * @description This file defines the UserProvider component, which manages user state and provides user information to the application.
 */

import { useState, useEffect, type ReactNode } from 'react';
import { UserContext, type UserContextType } from '@/context/UserContext';
import { userService } from '@/services/userService';

export const UserProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<UserContextType['user']>(null);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const userData = await userService.getCurrentUser();
                setUser(userData);
            } catch (error) {
                console.error('Failed to fetch user:', error);
                setUser(null);
            }
        };

        fetchUser();
    }, []);

    return (
        <UserContext.Provider value={{ user, setUser }}>
            {children}
        </UserContext.Provider>
    );
};