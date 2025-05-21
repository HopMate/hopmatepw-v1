    /**
     * @file AuthLayout.tsx
     * @description Responsive layout for authentication pages.
     */

    import type { ReactNode } from 'react';

    interface AuthLayoutProps {
        children: ReactNode;
    }

    export const AuthLayout = ({ children }: AuthLayoutProps) => {
        return (
            <div className="flex min-h-screen flex-col items-center justify-center lg:flex-row">
                {/* Auth Box */}
                <div className="mt-20 flex h-auto w-full max-w-md flex-col rounded-lg bg-white p-6 shadow-lg lg:mt-0 lg:max-w-3xl lg:p-10">
                    {children}
                </div>
            </div>
        );
    };
