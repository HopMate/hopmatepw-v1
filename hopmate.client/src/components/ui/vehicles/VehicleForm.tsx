// src/components/vehicles/VehicleForm.tsx
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import ColorSelector from '@/components/ui/ColorSelector';
import { useCurrentUser } from '@/hooks/useCurrentUser'; // We'll create this hook
import type { Vehicle } from '@/types/vehicle';
import type { CreateVehicleDTO } from '@/services/vehicleService';

interface VehicleFormProps {
    initialData?: Vehicle;
    onSubmit: (data: CreateVehicleDTO) => Promise<void>;
    isSubmitting?: boolean;
    onCancel?: () => void;
}

const VehicleForm: React.FC<VehicleFormProps> = ({
    initialData,
    onSubmit,
    isSubmitting = false,
    onCancel
}) => {
    const [formData, setFormData] = useState<CreateVehicleDTO>({
        brand: '',
        model: '',
        plate: '',
        seats: 0,
        imageFilePath: '',
        idDriver: '',
        idColor: ''
    });
    const [errors, setErrors] = useState<Record<string, string>>({});
    const { user } = useCurrentUser(); // Get only the current user

    useEffect(() => {
        if (initialData) {
            setFormData({
                brand: initialData.brand,
                model: initialData.model,
                plate: initialData.plate,
                seats: initialData.seats,
                imageFilePath: initialData.imageFilePath,
                idDriver: initialData.idDriver,
                idColor: initialData.idColor
            });
        } else if (user) {
            // Set the current user as the driver when creating a new vehicle
            setFormData(prev => ({
                ...prev,
                idDriver: user.id,
            }));
        }
    }, [initialData, user]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: name === 'seats' ? parseInt(value) || 0 : value }));

        // Clear error when field is edited
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const validateForm = (): boolean => {
        const newErrors: Record<string, string> = {};

        if (!formData.brand.trim()) newErrors.brand = 'Brand is required';
        if (!formData.model.trim()) newErrors.model = 'Model is required';
        if (!formData.plate.trim()) newErrors.plate = 'License plate is required';
        if (formData.seats <= 0) newErrors.seats = 'Vehicle must have at least 1 seat';
        if (!formData.idColor) newErrors.idColor = 'Please select a color';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) return;

        try {
            await onSubmit(formData);
        } catch (error) {
            console.error('Error submitting form:', error);
            setErrors(prev => ({ ...prev, form: 'Failed to save vehicle. Please try again.' }));
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            {errors.form && (
                <div className="mb-4 rounded-md bg-red-50 p-4">
                    <p className="text-sm text-red-700">{errors.form}</p>
                </div>
            )}

                <Input
                    label="Brand"
                    name="brand"
                    value={formData.brand}
                    onChange={handleChange}
                    error={errors.brand}
                    required
                />

                <Input
                    label="Model"
                    name="model"
                    value={formData.model}
                    onChange={handleChange}
                    error={errors.model}
                    required
                />

                <Input
                    label="License Plate"
                    name="plate"
                    value={formData.plate}
                    onChange={handleChange}
                    error={errors.plate}
                    required
                />

                <Input
                    label="Number of Seats"
                    name="seats"
                    type="number"
                    min="1"
                    max="100"
                    value={formData.seats.toString()}
                    onChange={handleChange}
                    error={errors.seats}
                    required
                />

                <div>
                    <label className="mb-1 block text-sm">Color</label>
                    <ColorSelector
                        value={formData.idColor}
                        onChange={handleChange}
                        name="idColor"
                        error={errors.idColor}
                    />
                </div>

            {/*<Input*/}
            {/*    label="Image URL"*/}
            {/*    name="imageFilePath"*/}
            {/*    value={formData.imageFilePath}*/}
            {/*    onChange={handleChange}*/}
            {/*    placeholder="https://example.com/vehicle-image.jpg"*/}
            {/*/>*/}

            <div className="mt-6 flex flex-col gap-2 sm:flex-row sm:justify-end">
                {onCancel && (
                    <Button
                        type="button"
                        onClick={onCancel}
                        variant="outline"
                        fullWidth={false}
                        className="order-2 sm:order-1"
                    >
                        Cancel
                    </Button>
                )}
                <Button
                    type="submit"
                    disabled={isSubmitting}
                    variant="primary"
                    fullWidth={false}
                    className="order-1 sm:order-2"
                >
                    {isSubmitting ? 'Saving...' : initialData ? 'Update Vehicle' : 'Add Vehicle'}
                </Button>
            </div>
        </form>
    );
};

export default VehicleForm;