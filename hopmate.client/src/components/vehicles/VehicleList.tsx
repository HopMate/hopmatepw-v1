// components/VehicleList.tsx
import { useEffect, useState } from 'react';
import type { Vehicle } from '@/types/vehicle';
import { getVehiclesByDriver } from '@/services/vehicleService';
import { colorService } from '@/services/colorService';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/Button';
import { TextLink } from '@/components/ui/TextLink';
import { CarFront } from 'lucide-react';
import type { Color } from '@/types/color';

export const VehicleList = () => {
    const { user } = useAuth();
    const [vehicles, setVehicles] = useState<Vehicle[]>([]);
    const [colors, setColors] = useState<Color[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            if (user?.id) {
                try {
                    const [vehiclesData, colorsData] = await Promise.all([
                        getVehiclesByDriver(user.id),
                        colorService.getAllColors()
                    ]);
                    setVehicles(vehiclesData);
                    setColors(colorsData);
                } catch (error) {
                    console.error('Error fetching data:', error);
                } finally {
                    setLoading(false);
                }
            }
        };

        fetchData();
    }, [user?.id]);

    const getColorById = (id: number) => {
        return colors.find(color => color.id === id);
    };

    if (loading) return <div>Loading...</div>;

    return (
        <div className="space-y-4">
            {/* ... rest of the component ... */}
            {vehicles.map((vehicle) => (
                <div key={vehicle.id} className="rounded-lg border p-4">
                    {/* ... other vehicle details ... */}
                    {vehicle.colorId && (
                        <div className="mt-1 flex items-center">
                            <span className="text-sm text-gray-500">
                                {getColorById(vehicle.colorId)?.name}
                            </span>
                        </div>
                    )}
                    {/* ... rest of the vehicle item ... */}
                </div>
            ))}
            {/* ... rest of the component ... */}
        </div>
    );
};