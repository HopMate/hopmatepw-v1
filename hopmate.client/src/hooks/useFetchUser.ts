/**
 * @file useFetchUser.ts
 * @description This hook fetches the current user data from the server and sets it in the context.
 */

import { useEffect } from 'react';
import { useUser } from './useUser';
import { userService } from '@/services/userService';

export const useFetchUser = () => {
    const { user, setUser } = useUser();

    useEffect(() => {
        const fetchUser = async () => {
            try {
                if (!user) {
                    const userData = await userService.getCurrentUser();
                    setUser(userData);
                }
            } catch (error) {
                console.error('Failed to fetch user:', error);
            }
        };

        fetchUser();
    }, [user, setUser]);
};