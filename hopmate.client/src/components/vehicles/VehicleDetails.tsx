// components/VehicleDetails.tsx
import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getVehicleById, deleteVehicle } from '@/services/vehicleService';
import { colorService } from '@/services/colorService';
import type { Vehicle } from '@/types/vehicle';
import { Button } from '@/components/ui/Button';
import { TextLink } from '@/components/ui/TextLink';
import type { Color } from '@/types/color';

export const VehicleDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [vehicle, setVehicle] = useState<Vehicle | null>(null);
    const [color, setColor] = useState<Color | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            if (!id) return;
            try {
                const vehicleData = await getVehicleById(id);
                setVehicle(vehicleData);

                // Fetch color details
                if (vehicleData.colorId) {
                    const colorData = await colorService.getColorById(vehicleData.colorId);
                    setColor(colorData);
                }
            } catch (err) {
                const error = err as Error;
                setError(error.message || 'Failed to load vehicle details');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [id]);

    // ... rest of the component ...

    return (
        <div className="space-y-4">
            {/* ... other details ... */}
            {color && (
                <div className="flex items-center">
                    <span className="text-sm text-gray-500">
                        {color.name}
                    </span>
                </div>
            )}
            {/* ... rest of the component ... */}
        </div>
    );
};