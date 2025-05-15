// components/ui/Button.tsx
import type { ButtonHTMLAttributes } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    fullWidth?: boolean;
    asChild?: boolean;
}

export const Button = ({
    children,
    fullWidth = true,
    asChild = false,
    className = '',
    ...props
}: ButtonProps) => {
    if (asChild) {
        return <>{children}</>;
    }

    return (
        <button
            className={`py-3 px-4 bg-teal-600 text-white rounded ${fullWidth ? 'w-full' : ''
                } ${className}`}
            {...props}
        >
            {children}
        </button>
    );
};