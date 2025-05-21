// src/hooks/useCurrentUser.ts
import { useEffect, useState } from 'react';
import { userService } from '@/services/userService';
import type { User } from '@/types/user';

export const useCurrentUser = () => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchCurrentUser = async () => {
            setLoading(true);
            setError(null);
            try {
                const currentUser = await userService.getCurrentUser();
                setUser(currentUser);
            } catch (err) {
                console.error('Error fetching current user:', err);
                setError(err instanceof Error ? err.message : 'Failed to load current user');
            } finally {
                setLoading(false);
            }
        };

        fetchCurrentUser();
    }, []);

    return {
        user,
        loading,
        error
    };
};