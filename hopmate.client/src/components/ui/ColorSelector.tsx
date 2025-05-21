// src/components/ColorSelector.tsx
import React from 'react';
import { useColors } from '@/hooks/useColors';
import { Spinner } from '@/components/ui/Spinner';

interface ColorSelectorProps {
    value: string;
    onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
    name?: string;
    error?: string;
    label?: string;
    placeholder?: string;
    required?: boolean;
    disabled?: boolean;
    className?: string;
}

const ColorSelector: React.FC<ColorSelectorProps> = ({
    value,
    onChange,
    name = "idColor",
    error,
    label,
    placeholder = "Choose a vehicle color",
    required = false,
    disabled = false,
    className = ""
}) => {
    const { colors, loading, error: colorError } = useColors();

    if (colorError) {
        return (
            <div className="text-red-600">
                <p>Failed to load colors: {colorError}</p>
                <p className="text-sm">Please try refreshing the page</p>
            </div>
        );
    }

    return (
        <div className={`${className}`}>
            {label && <label className="mb-1 block text-sm">{label}</label>}
            <div className="relative">
                <select
                    id={`${name}-select`}
                    name={name}
                    className={`w-full rounded border ${error ? 'border-red-500' : 'border-gray-300'} px-3 py-2 ${disabled ? 'bg-gray-100' : ''}`}
                    value={value}
                    onChange={onChange}
                    required={required}
                    disabled={disabled || loading}
                >
                    <option value="" disabled>{loading ? "Loading colors..." : placeholder}</option>
                    {colors.map(color => (
                        <option key={color.id} value={color.id}>{color.name}</option>
                    ))}
                </select>

                {loading && (
                    <div className="absolute top-1/2 right-2 -translate-y-1/2">
                        <Spinner size="sm" />
                    </div>
                )}
            </div>
            {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
        </div>
    );
};

export default ColorSelector;