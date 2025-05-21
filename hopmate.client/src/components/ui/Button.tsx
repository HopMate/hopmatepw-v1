// components/ui/Button.tsx
import React from 'react';
import type { ButtonHTMLAttributes } from 'react';
import { Link } from 'react-router-dom';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    fullWidth?: boolean;
    variant?: 'primary' | 'secondary' | 'danger' | 'success' | 'outline' | 'ghost';
    size?: 'sm' | 'md' | 'lg';
    asChild?: boolean;
    isLoading?: boolean;
    href?: string;
    leftIcon?: React.ReactNode;
    rightIcon?: React.ReactNode;
}

export const Button = ({
    children,
    fullWidth = false,
    variant = 'primary',
    size = 'md',
    asChild = false,
    className = '',
    isLoading = false,
    href,
    leftIcon,
    rightIcon,
    disabled,
    ...props
}: ButtonProps) => {
    const baseClasses = 'rounded font-medium inline-flex items-center justify-center transition-colors focus:outline-none focus:ring-2 focus:ring-opacity-50';

    const variantClasses = {
        primary: 'bg-blue-600 hover:bg-blue-700 text-white focus:ring-blue-500',
        secondary: 'bg-gray-600 hover:bg-gray-700 text-white focus:ring-gray-500',
        danger: 'bg-red-600 hover:bg-red-700 text-white focus:ring-red-500',
        success: 'bg-green-600 hover:bg-green-700 text-white focus:ring-green-500',
        outline: 'bg-transparent border border-gray-300 text-gray-700 hover:bg-gray-50 focus:ring-gray-500',
        ghost: 'bg-transparent hover:bg-gray-100 text-gray-700 focus:ring-gray-500'
    };

    const sizeClasses = {
        sm: 'text-xs px-2 py-1',
        md: 'text-sm px-4 py-2',
        lg: 'text-base px-6 py-3'
    };

    const widthClasses = fullWidth ? 'w-full' : '';
    const disabledClasses = disabled || isLoading ? 'opacity-60 cursor-not-allowed' : '';

    const allClasses = `${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${widthClasses} ${disabledClasses} ${className}`;

    if (asChild) {
        return <>{children}</>;
    }

    if (href) {
        return (
            <Link to={href} className={allClasses}>
                {leftIcon && <span className="mr-2">{leftIcon}</span>}
                {children}
                {rightIcon && <span className="ml-2">{rightIcon}</span>}
            </Link>
        );
    }

    return (
        <button
            className={allClasses}
            disabled={disabled || isLoading}
            {...props}
        >
            {isLoading && (
                <svg className="mr-2 h-4 w-4 animate-spin" viewBox="0 0 24 24">
                    <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                    />
                    <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                </svg>
            )}
            {leftIcon && !isLoading && <span className="mr-2">{leftIcon}</span>}
            {children}
            {rightIcon && <span className="ml-2">{rightIcon}</span>}
        </button>
    );
};