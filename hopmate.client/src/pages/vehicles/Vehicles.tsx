import { useEffect, useState } from 'react';
import type { Vehicle } from '@/types/vehicle';
import { vehicleService } from '@/services/vehicleService';
import { Button } from '@/components/ui/Button';
import VehicleForm from './VehicleForm';
import { AppLayout } from '@/components/layout/AppLayout';

export const Vehicles = () => {
    const [vehicles, setVehicles] = useState<Vehicle[]>([]);
    const [selected, setSelected] = useState<Vehicle | null>(null);
    const [isCreating, setIsCreating] = useState(false);

    const fetchVehicles = async () => {
        const data = await vehicleService.getAll();
        setVehicles(data);
    };

    useEffect(() => {
        fetchVehicles();
    }, []);

    const handleDelete = async (id: string) => {
        await vehicleService.delete(id);
        fetchVehicles();
    };

    return (
        <AppLayout>
        <div className="mx-auto max-w-4xl p-4">
            <div className="mb-4 flex items-center justify-between">
                <h1 className="text-2xl font-semibold">Vehicles</h1>
                <Button onClick={() => setIsCreating(true)}>Add Vehicle</Button>
            </div>

            {isCreating && (
                <VehicleForm
                    onSuccess={() => {
                        setIsCreating(false);
                        fetchVehicles();
                    }}
                    onCancel={() => setIsCreating(false)}
                />
            )}

            {selected && (
                <VehicleForm
                    vehicle={selected}
                    onSuccess={() => {
                        setSelected(null);
                        fetchVehicles();
                    }}
                    onCancel={() => setSelected(null)}
                />
            )}

            <ul className="space-y-4">
                {vehicles.map((v) => (
                    <li key={v.id} className="rounded border p-4 shadow">
                        <div className="flex items-center justify-between">
                            <div>
                                <h2 className="text-lg font-medium">{v.brand} {v.model}</h2>
                                <p className="text-sm text-gray-600">{v.plate} � {v.seats} seats � {v.colorName}</p>
                            </div>
                            <div className="flex gap-2">
                                <Button onClick={() => setSelected(v)}>Edit</Button>
                                <Button onClick={() => handleDelete(v.id)}>Delete</Button>
                            </div>
                        </div>
                    </li>
                ))}
            </ul>
            </div>
        </AppLayout>
    );
};
