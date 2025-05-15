// components/VehicleForm.tsx
import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { getVehicleById, createVehicle, updateVehicle } from '@/services/vehicleService';
import { useAuth } from '@/hooks/useAuth';
import { colorService } from '@/services/colorService';
import type { Color } from '@/types/color';

export const VehicleForm = () => {
    const { id } = useParams();
    const { user } = useAuth();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(!!id);
    const [error, setError] = useState<string | null>(null);
    const [colors, setColors] = useState<Color[]>([]);
    const [formData, setFormData] = useState({
        brand: '',
        model: '',
        plate: '',
        seats: 4,
        colorId: 0,
        imageFile: undefined as File | undefined,
        driverId: user?.id || '',
    });
    const [formErrors, setFormErrors] = useState({
        brand: '',
        model: '',
        plate: '',
        seats: '',
        colorId: ''
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);

                // Fetch colors using the updated service
                try {
                    const colorsData = await colorService.getAllColors();
                    setColors(colorsData);
                } catch (colorError) {
                    console.error('Error fetching colors:', colorError);
                    setError(`Failed to load colors: ${colorError instanceof Error ? colorError.message : String(colorError)}`);
                    // Continue to load vehicle data even if colors fail
                }

                // Then fetch vehicle data if editing
                if (id) {
                    try {
                        const vehicle = await getVehicleById(id);
                        setFormData({
                            brand: vehicle.brand,
                            model: vehicle.model,
                            plate: vehicle.plate,
                            seats: vehicle.seats,
                            colorId: vehicle.colorId,
                            imageFile: undefined,
                            driverId: vehicle.driverId,
                        });
                    } catch (vehicleError) {
                        console.error('Error fetching vehicle:', vehicleError);
                        setError(`Failed to load vehicle: ${vehicleError instanceof Error ? vehicleError.message : String(vehicleError)}`);
                    }
                }
            } catch (err) {
                const error = err as Error;
                console.error('Error fetching form data:', error);
                setError(error.message || 'Failed to load form data');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [id]);

    const validateForm = () => {
        const errors = {
            brand: !formData.brand ? 'Brand is required' : '',
            model: !formData.model ? 'Model is required' : '',
            plate: !formData.plate ? 'License plate is required' : '',
            seats: formData.seats < 1 || formData.seats > 10 ? 'Seats must be between 1-10' : '',
            colorId: !formData.colorId ? 'Color is required' : ''
        };
        setFormErrors(errors);
        return !Object.values(errors).some(error => error);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: name === 'seats' || name === 'colorId' ? parseInt(value) || 0 : value,
        }));
        if (formErrors[name as keyof typeof formErrors]) {
            setFormErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFormData(prev => ({
                ...prev,
                imageFile: e.target.files?.[0],
            }));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validateForm()) return;

        setLoading(true);
        setError(null);

        try {
            if (!user?.id) {
                throw new Error('User not authenticated');
            }

            const formDataWithDriver = {
                ...formData,
                driverId: user.id
            };

            if (id) {
                await updateVehicle(id, formDataWithDriver);
            } else {
                await createVehicle(formDataWithDriver);
            }
            navigate('/vehicles');
        } catch (err) {
            const error = err as Error;
            setError(error.message || 'Failed to save vehicle');
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div>Loading...</div>;

    return (
        <div className="space-y-4">
            <h2 className="text-xl font-bold">{id ? 'Edit Vehicle' : 'Add New Vehicle'}</h2>

            {error && (
                <div className="rounded bg-red-100 p-3 text-red-600">
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
                <Input
                    label="Brand"
                    name="brand"
                    value={formData.brand}
                    onChange={handleChange}
                    error={formErrors.brand}
                    required
                />

                <Input
                    label="Model"
                    name="model"
                    value={formData.model}
                    onChange={handleChange}
                    error={formErrors.model}
                    required
                />

                <Input
                    label="License Plate"
                    name="plate"
                    value={formData.plate}
                    onChange={handleChange}
                    error={formErrors.plate}
                    required
                />

                <div className="mb-4">
                    <label className="mb-1 block text-sm">Seats</label>
                    <input
                        type="number"
                        name="seats"
                        min="1"
                        max="10"
                        value={formData.seats}
                        onChange={handleChange}
                        className="w-full rounded border border-gray-300 p-2"
                        required
                    />
                    {formErrors.seats && (
                        <p className="mt-1 text-sm text-red-600">{formErrors.seats}</p>
                    )}
                </div>

                <div className="mb-4">
                    <label className="mb-1 block text-sm">Color</label>
                    <select
                        name="colorId"
                        value={formData.colorId}
                        onChange={handleChange}
                        className="w-full rounded border border-gray-300 p-2"
                        disabled={loading || colors.length === 0}
                        required
                    >
                        <option value="">Select a color</option>
                        {colors.map(color => (
                            <option key={color.id} value={color.id}>
                                {color.name}
                            </option>
                        ))}
                    </select>
                    {formErrors.colorId && (
                        <p className="mt-1 text-sm text-red-600">{formErrors.colorId}</p>
                    )}
                </div>

                <div className="mb-4">
                    <label className="mb-1 block text-sm">Vehicle Image</label>
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="block w-full text-sm
                                  text-gray-500 file:mr-4 file:py-2
                                  file:px-4 file:rounded
                                  file:border-0 file:text-sm
                                  file:font-semibold file:bg-teal-50
                                  file:text-teal-700 hover:file:bg-teal-100"
                    />
                    {formData.imageFile && (
                        <p className="mt-1 text-sm text-gray-500">
                            Selected: {formData.imageFile.name}
                        </p>
                    )}
                </div>

                <Button type="submit" disabled={loading} className="w-full">
                    {loading ? 'Saving...' : 'Save Vehicle'}
                </Button>
            </form>
        </div>
    );
};