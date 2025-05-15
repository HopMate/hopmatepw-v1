/**
 * @file Home.tsx
 * @description This file defines the Home component, which serves as the main dashboard for authenticated users.
 */

import { AppLayout } from '@/components/layout/AppLayout';
import { useUser } from '@/hooks/useUser';
import { useFetchUser } from '@/hooks/useFetchUser';

export const Home = () => {
    const { user } = useUser();
    useFetchUser(); // This will fetch user data if not already loaded

    return (
        <AppLayout>
            <div className="flex-between flex h-full justify-between">
                <div>
                    <div className="text-md text-gray-600">Welcome</div>
                    <div className="text-2xl font-bold text-teal-900">{user?.fullName || 'User'}</div>
                </div>
                <div>a</div>
            </div>
        </AppLayout>
    );
};