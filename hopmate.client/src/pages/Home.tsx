/**
 * @file Home.tsx
 * @description This file defines the Home component, which serves as the main dashboard for authenticated users.
 */

import { AppLayout } from '@/components/layout/AppLayout';
import { useCurrentUser } from '@/hooks/useCurrentUser'; // Updated import
import ColorSelector from '@/components/ui/ColorSelector';

export const Home = () => {
    const { user, loading, error } = useCurrentUser(); // Simplified user fetching

    if (loading) {
        return (
            <AppLayout>
                <div>Loading user data...</div>
            </AppLayout>
        );
    }

    if (error) {
        return (
            <AppLayout>
                <div className="text-red-500">Error: {error}</div>
            </AppLayout>
        );
    }

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
}