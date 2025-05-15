/**
 * @file Splash.tsx
 * @description This file defines the Splash component, which serves as the initial screen of the application.
 */

import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { AuthLayout } from '@/components/layout/AuthLayout';
import logo from '@/images/logo.svg'
import { Button } from '@/components/ui/Button';

export const Splash = () => {
    const navigate = useNavigate();
    const { isAuthenticated } = useAuth();

    useEffect(() => {
        if (isAuthenticated) {
            navigate('/home');
        }
    }, [isAuthenticated, navigate]);

    const handleLoginClick = () => {
        navigate('/login');
    };

    return (
        <AuthLayout>
            <div className="flex h-full flex-col items-center justify-center">
                <img src={logo} alt="logo" />

                <Button type="button" onClick={handleLoginClick} className="mt-6 w-full">
                    Continue
                </Button>
            </div>
        </AuthLayout>
    );
};
