import { useState, useEffect } from 'react';
import { colorService } from '@/services/colorService';
import { vehicleService } from '@/services/vehicleService';
import type { Vehicle } from '@/types/vehicle';
import type { Color } from '@/types/color';

interface Props {
    open: boolean;
    vehicle?: Vehicle;
    onSuccess: () => void;
    onCancel: () => void;
}

const VehicleFormModal = ({ open, vehicle, onSuccess, onCancel }: Props) => {
    const [formData, setFormData] = useState({
        brand: '',
        model: '',
        plate: '',
        seats: 4,
        idColor: '',
        imageFilePath: '',
    });

    const [colors, setColors] = useState<Color[]>([]);

    useEffect(() => {
        if (vehicle) setFormData(vehicle);
    }, [vehicle]);

    useEffect(() => {
        const fetchColors = async () => {
            try {
                const result = await colorService.getAllColors();
                setColors(result);
            } catch (err) {
                console.error('Failed to load colors:', err);
            }
        };
        fetchColors();
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleColorChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setFormData({ ...formData, idColor: e.target.value });
    };

    const handleSubmit = async () => {
        try {
            if (vehicle) {
                await vehicleService.update(vehicle.id, formData);
            } else {
                await vehicleService.create(formData);
            }
            onSuccess();
        } catch (err) {
            console.error('Error saving vehicle:', err);
        }
    };

    if (!open) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <div className="w-full max-w-xl rounded-lg bg-white p-6 shadow-lg">
                <h2 className="mb-4 text-xl font-semibold">
                    {vehicle ? 'Edit Vehicle' : 'Create Vehicle'}
                </h2>

                <div className="grid grid-cols-2 gap-4">
                    <input
                        className="rounded border p-2"
                        placeholder="Brand"
                        name="brand"
                        value={formData.brand}
                        onChange={handleChange}
                    />
                    <input
                        className="rounded border p-2"
                        placeholder="Model"
                        name="model"
                        value={formData.model}
                        onChange={handleChange}
                    />
                    <input
                        className="rounded border p-2"
                        placeholder="Plate"
                        name="plate"
                        value={formData.plate}
                        onChange={handleChange}
                    />
                    <input
                        className="rounded border p-2"
                        placeholder="Seats"
                        type="number"
                        name="seats"
                        value={formData.seats}
                        onChange={handleChange}
                    />

                    <select
                        className="col-span-2 rounded border p-2"
                        value={formData.idColor}
                        onChange={handleColorChange}
                    >
                        <option value="">Select a color</option>
                        {colors.map((color) => (
                            <option key={color.id} value={color.id}>
                                {color.name}
                            </option>
                        ))}
                    </select>

                    <input
                        className="col-span-2 rounded border p-2"
                        placeholder="Image URL"
                        name="imageFilePath"
                        value={formData.imageFilePath}
                        onChange={handleChange}
                    />
                </div>

                <div className="mt-6 flex justify-end gap-2">
                    <button
                        onClick={onCancel}
                        className="rounded border border-gray-300 px-4 py-2 text-gray-700 hover:bg-gray-100"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSubmit}
                        className="rounded bg-teal-600 px-4 py-2 text-white hover:bg-teal-700"
                    >
                        {vehicle ? 'Update' : 'Create'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default VehicleFormModal;
