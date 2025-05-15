/**
 * @file AppLayout.tsx
 * @description This file defines the AppLayout component, which is used to wrap the main content of the application.
 */

import type { ReactNode } from 'react';
import MobileNavbar from '@/components/ui/MobileNavbar';

interface AppLayoutProps {
    children: ReactNode;
}

export const AppLayout = ({ children }: AppLayoutProps) => {
    return (
        <div className="bg-gradient-to-b flex min-h-screen items-start justify-center from-teal-900 to-teal-700">
            {/* Added text on the left side */}
            <div className="absolute top-4 left-4">
                <h1 className="text-3xl font-bold text-white">Hopmate App</h1>
                <p className="mt-1 text-xl text-white">Mobile Layout</p>
            </div>

            <div className="mt-4 flex h-[calc(100vh-2rem)] w-full max-w-md flex-col shadow-lg">
                <div className="flex-1 overflow-auto rounded-t-lg bg-white p-6">
                    {children}
                </div>
                <MobileNavbar />
            </div>
        </div>
    );
};