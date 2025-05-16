/**
 * @file SignUp.tsx
 * @description This file defines the SignUp component with type-safe form handling.
 */

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthLayout } from '@/components/layout/AuthLayout';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { TextLink } from '@/components/ui/TextLink';
import { authService } from '@/services/authService';
import { useAuth } from '@/hooks/useAuth';
import type { RegisterRequest } from '@/types/auth';

export const SignUp = () => {
    const [formData, setFormData] = useState<RegisterRequest>({
        fullName: '',
        email: '',
        password: '',
        dateOfBirth: ''
    });

    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const navigate = useNavigate();
    const { login } = useAuth();

    const handleChange = (key: keyof RegisterRequest) => (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData(prev => ({ ...prev, [key]: e.target.value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setIsLoading(true);

        try {
            const response = await authService.register(formData);

            if (response.success) {
                login(response);
                navigate('/home');
            } else {
                setError(response.message || 'Registration failed');
            }
        } catch (err) {
            console.error(err);
            setError('An error occurred. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <AuthLayout>
            <form onSubmit={handleSubmit} className="flex h-full flex-col justify-between">
                <div>
                    <h1 className="mb-1 text-2xl font-bold">Create an account</h1>
                    <p className="mb-6 text-gray-600">
                        Enter your details below or <TextLink to="/login">log in</TextLink>
                    </p>

                    {error && (
                        <div className="mb-4 rounded bg-red-50 p-3 text-red-600">
                            {error}
                        </div>
                    )}

                    <Input
                        name="fullName"
                        label="Full Name"
                        value={formData.fullName}
                        onChange={handleChange('fullName')}
                        required
                    />

                    <Input
                        name="dateOfBirth"
                        label="Date of Birth"
                        type="date"
                        value={formData.dateOfBirth}
                        onChange={handleChange('dateOfBirth')}
                        required
                    />

                    <Input
                        name="email"
                        label="Email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange('email')}
                        required
                    />

                    <Input
                        name="password"
                        label="Password"
                        type="password"
                        value={formData.password}
                        onChange={handleChange('password')}
                        showPassword
                        required
                    />
                </div>

                <div>
                    <Button type="submit" disabled={isLoading} className="mt-6 w-full">
                        {isLoading ? 'Signing Up...' : 'Sign Up'}
                    </Button>

                    <div className="mt-4 text-center">
                        <TextLink to="/login" variant="secondary">
                            Already have an account?
                        </TextLink>
                    </div>
                </div>
            </form>
        </AuthLayout>
    );
};
