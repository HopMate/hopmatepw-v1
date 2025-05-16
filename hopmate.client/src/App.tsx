/**
 * @file App.tsx
 * @description This file defines the main application component, which sets up the routing and context providers for the application.
 */

import type { JSX } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';

// Providers
import { AuthProvider } from '@/context/AuthProvider';
import { UserProvider } from '@/context/UserProvider';

// Hooks
import { useAuth } from '@/hooks/useAuth';

// Pages
import { Splash } from '@/pages/auth/Splash';
import { Login } from '@/pages/auth/Login';
import { SignUp } from '@/pages/auth/SignUp';
import { Home } from '@/pages/Home';
import { Vehicles } from './pages/vehicles/Vehicles';

// Protected route component
const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
    const { isAuthenticated } = useAuth();

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    return children;
};

const AppRoutes = () => {
    return (
        <Routes>
            <Route path="/" element={<Splash />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<SignUp />} />

            <Route
                path="/home"
                element={
                    <ProtectedRoute>
                        <Home />
                    </ProtectedRoute>
                }
            />

            <Route
                path="/vehicles"
                element={
                    <ProtectedRoute>
                        <Vehicles />
                    </ProtectedRoute>
                }
            />
        </Routes>
    );
};

const App = () => {
    return (
        <Router>
            <AuthProvider>
                <UserProvider>
                    <AppRoutes />
                </UserProvider>
            </AuthProvider>
        </Router>
    );
};

export default App;