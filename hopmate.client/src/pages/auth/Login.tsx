/**
 * @file Login.tsx
 * @description This file defines the Login component, which provides a login form for users to authenticate themselves.
 */

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthLayout } from '@/components/layout/AuthLayout';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { TextLink } from '@/components/ui/TextLink';
import { authService } from '@/services/authService';
import { useAuth } from '@/hooks/useAuth';

export const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const navigate = useNavigate();
    const { login } = useAuth();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setIsLoading(true);

        try {
            const response = await authService.login({
                email,
                password
            });

            if (response.success) {
                login(response);
                navigate('/home'); // Redirect to dashboard after successful login
            } else {
                setError(response.message || 'Login failed');
            }
        } catch (err) {
            console.log(err);
            setError('An error occurred. Please try again.');
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
                        <div className="mb-4 rounded bg-red-50 p-3 text-red-600">
                            {error}
                        </div>
                    )}

                    <Input
                        label="Email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />

                    <Input
                        label="Password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
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