/**
 * @file Login.tsx
 * @description Example login component with proper error handling and type-safe form updates
 */ 

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { authService } from '@/services/authService';
import type { LoginRequest } from '@/types/auth';
import { AuthLayout } from '@/components/layout/AuthLayout';
import { TextLink } from '@/components/ui/TextLink';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';

export const Login = () => {
    const navigate = useNavigate();
    const { login } = useAuth();

    const [formData, setFormData] = useState<LoginRequest>({
        email: '',
        password: ''
    });

    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    // Type-safe handler using keyof LoginRequest
    const handleChange = (key: keyof LoginRequest) => (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData(prev => ({ ...prev, [key]: e.target.value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setIsLoading(true);

        try {
            const response = await authService.login(formData);

            if (response.success) {
                await login(response);
                navigate('/home');
            } else {
                setError(response.message || 'Login failed');
            }
        } catch (err) {
            setError('An error occurred during login. Please try again.');
            console.error('Login error:', err);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <AuthLayout>
            <form onSubmit={handleSubmit} className="flex h-full flex-col justify-between">
                <div>
                    <h1 className="mb-1 text-2xl font-bold">Welcome back!</h1>
                    <p className="mb-6 text-gray-600">
                        Login below or <TextLink to="/signup">create an account</TextLink>
                    </p>

                    {error && (
                        <div className="mb-4 rounded-md bg-red-50 p-3 text-red-700">
                            {error}
                        </div>
                    )}

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
                        {isLoading ? 'Signing In...' : 'Sign In'}
                    </Button>

                    <div className="mt-4 text-center">
                        <TextLink to="/forgot-password" variant="secondary">
                            Forgot Password
                        </TextLink>
                    </div>
                </div>
            </form>
        </AuthLayout>
    );
};
