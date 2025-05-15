/**
 * @file AuthLayout.tsx
 * @description This file defines the AuthLayout component, which is used to wrap the authentication-related content of the application.
 */

import type { ReactNode } from 'react';

interface AuthLayoutProps {
    children: ReactNode;
}

export const AuthLayout = ({ children }: AuthLayoutProps) => {
    return (
        <div className="bg-gradient-to-b flex min-h-screen items-start justify-center from-teal-900 to-teal-700">
            {/* Added text on the left side */}
            <div className="absolute top-4 left-4">
                <h1 className="text-3xl font-bold text-white">Hopmate App</h1>
                <p className="mt-1 text-xl text-white">Mobile Layout</p>
            </div>

            <div className="mt-4 flex h-[calc(100vh-2rem)] w-full max-w-md flex-col shadow-lg">
                <div className="flex-1 rounded-lg bg-white p-6">
                    {children}
                </div>
            </div>
        </div>
    );
};