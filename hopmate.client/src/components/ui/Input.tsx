﻿/**
 * @file Input.tsx
 * @description This file defines the Input component, which is a reusable input element styled with Tailwind CSS.
 */

import { type InputHTMLAttributes, useState } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    showPassword?: boolean;
    error?: string;
}

export const Input = ({ label, type = 'text', className = '', showPassword, error, ...props }: InputProps) => {
    const [showPasswordValue, setShowPasswordValue] = useState(false);

    const inputType = type === 'password' ? (showPasswordValue ? 'text' : 'password') : type;

    return (
        <div className="mb-4">
            {label && <label className="mb-1 block text-sm">{label}</label>}
            <div className="relative">
                <input
                    type={inputType}
                    className={`w-full border ${error ? 'border-red-500' : 'border-gray-300'} rounded p-2 ${className}`}
                    {...props}
                />
                {type === 'password' && showPassword && (
                    <button
                        type="button"
                        className="absolute top-1/2 right-2 -translate-y-1/2 transform"
                        onClick={() => setShowPasswordValue(!showPasswordValue)}
                    >
                        {showPasswordValue ? (
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
                                <path d="M13.359 11.238C15.06 9.72 16 8 16 8s-3-5.5-8-5.5a7.028 7.028 0 0 0-2.79.588l.77.771A5.944 5.944 0 0 1 8 3.5c2.12 0 3.879 1.168 5.168 2.457A13.134 13.134 0 0 1 14.828 8c-.058.087-.122.183-.195.288-.335.48-.83 1.12-1.465 1.755-.165.165-.337.328-.517.486l.708.709z" />
                                <path d="M11.297 9.176a3.5 3.5 0 0 0-4.474-4.474l.823.823a2.5 2.5 0 0 1 2.829 2.829l.822.822zm-2.943 1.299.822.822a3.5 3.5 0 0 1-4.474-4.474l.823.823a2.5 2.5 0 0 0 2.829 2.829z" />
                                <path d="M3.35 5.47c-.18.16-.353.322-.518.487A13.134 13.134 0 0 0 1.172 8l.195.288c.335.48.83 1.12 1.465 1.755C4.121 11.332 5.881 12.5 8 12.5c.716 0 1.39-.133 2.02-.36l.77.772A7.029 7.029 0 0 1 8 13.5C3 13.5 0 8 0 8s.939-1.721 2.641-3.238l.708.709zm10.296 8.884-12-12 .708-.708 12 12-.708.708z" />
                            </svg>
                        ) : (
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
                                <path d="M10.5 8a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0z" />
                                <path d="M0 8s3-5.5 8-5.5S16 8 16 8s-3 5.5-8 5.5S0 8 0 8zm8 3.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7z" />
                            </svg>
                        )}
                    </button>
                )}
            </div>
            {error && (
                <p className="mt-1 text-sm text-red-600">{error}</p>
            )}
        </div>
    );
};