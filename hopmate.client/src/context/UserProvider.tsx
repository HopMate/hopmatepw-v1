/**
 * @file UserProvider.tsx
 * @description Updated user provider that works with AuthProvider
 */

import { useState, useEffect, type ReactNode } from 'react';
import { UserContext, type UserContextType } from '@/context/UserContext';
import { useAuth } from '@/hooks/useAuth';

export const UserProvider = ({ children }: { children: ReactNode }) => {
    const { user: authUser, isAuthenticated } = useAuth();
    const [user, setUser] = useState<UserContextType['user']>(authUser);

    // Keep user state in sync with auth context
    useEffect(() => {
        if (isAuthenticated && authUser) {
            setUser(authUser);
        } else {
            setUser(null);
        }
    }, [authUser, isAuthenticated]);

    return (
        <UserContext.Provider value={{ user, setUser }}>
            {children}
        </UserContext.Provider>
    );
};