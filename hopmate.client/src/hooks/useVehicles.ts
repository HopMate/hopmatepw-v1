// src/hooks/useVehicles.ts
import { useState, useEffect, useCallback } from 'react';
import { vehicleService } from '@/services/vehicleService';
import type { Vehicle } from '@/types/vehicle';

export const useVehicles = () => {
    const [vehicles, setVehicles] = useState<Vehicle[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchVehicles = useCallback(async () => {
        setIsLoading(true);
        setError(null);

        try {
            const data = await vehicleService.getAllVehicles();
            setVehicles(data);
        } catch (err) {
            console.error('Error fetching vehicles:', err);
            setError(err instanceof Error ? err.message : 'Failed to load vehicles');
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchVehicles();
    }, [fetchVehicles]);

    const deleteVehicle = async (id: string): Promise<boolean> => {
        try {
            await vehicleService.deleteVehicle(id);
            setVehicles(vehicles.filter(vehicle => vehicle.id !== id));
            return true;
        } catch (err) {
            console.error('Error deleting vehicle:', err);
            setError(err instanceof Error ? err.message : 'Failed to delete vehicle');
            return false;
        }
    };

    const refetch = useCallback(async () => {
        await fetchVehicles();
    }, [fetchVehicles]);

    return {
        vehicles,
        isLoading,
        error,
        deleteVehicle,
        refetch
    };
};