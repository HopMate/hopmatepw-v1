/**
 * TextLink component
 * @description This component is a styled link that can be used to navigate within the application. It accepts variant props to style the link differently based on the context in which it is used.
 */

import { Link, type LinkProps } from 'react-router-dom';

interface TextLinkProps extends LinkProps {
    variant?: 'primary' | 'secondary';
}

export const TextLink = ({ children, variant = 'primary', className = '', ...props }: TextLinkProps) => {
    const variantClasses = {
        primary: 'text-teal-600',
        secondary: 'text-gray-500'
    };

    return (
        <Link className={`${variantClasses[variant]} hover:underline ${className}`} {...props}>
            {children}
        </Link>
    );
};