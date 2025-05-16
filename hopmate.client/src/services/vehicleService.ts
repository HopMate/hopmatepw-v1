import { authService } from './authService';
import type { Vehicle } from '@/types/vehicle';

const API_URL = 'https://localhost:7293/api/vehicles';

const getHeaders = () => ({
    'Content-Type': 'application/json',
    Authorization: `Bearer ${authService.getToken()}`
});

export const vehicleService = {
    getAll: async (): Promise<Vehicle[]> => {
        const res = await fetch(API_URL, { headers: getHeaders() });
        return res.json();
    },

    create: async (data: any) => {
        const response = await fetch('/api/vehicles', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        });

        if (!response.ok) {
            let errorMessage = 'Unknown error';
            try {
                const clonedResponse = response.clone();
                const errorData = await clonedResponse.json();
                errorMessage = errorData.message || JSON.stringify(errorData);
            } catch {
                errorMessage = await response.text();
            }

            console.error('Response status:', response.status);
            console.error('Response headers:', Array.from(response.headers.entries()));
            console.error('Backend error message:', errorMessage);

            throw new Error(`Failed to create vehicle: ${errorMessage}`);
        }
    },

    update: async (id: string, data: Partial<Vehicle>) => {
        const res = await fetch(`${API_URL}/${id}`, {
            method: 'PUT',
            headers: getHeaders(),
            body: JSON.stringify(data),
        });
        if (!res.ok) throw new Error('Failed to update vehicle');
        return res.json();
    },

    delete: async (id: string) => {
        const res = await fetch(`${API_URL}/${id}`, {
            method: 'DELETE',
            headers: getHeaders(),
        });
        if (!res.ok) throw new Error('Failed to delete vehicle');
    },
};
