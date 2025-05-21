import axios from 'axios';
import type { Vehicle } from '@/types/vehicle';

const API_BASE_URL = 'https://localhost:7293';
const API_URL = '/api/Vehicles';

const authAxios = axios.create({ baseURL: API_BASE_URL });

authAxios.interceptors.request.use(config => {
    const token = localStorage.getItem('auth_token');
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
});

async function handleRequest<T>(request: Promise<{ data: T }>): Promise<T> {
    try {
        const response = await request;
        return response.data;
    } catch (error) {
        console.error(error);
        throw new Error(error instanceof Error ? error.message : String(error));
    }
}

export type CreateVehicleDTO = Omit<Vehicle, 'id' | 'colorName' | 'driverName'>;

export const vehicleService = {
    getAllVehicles: () => handleRequest<Vehicle[]>(authAxios.get(API_URL)),
    getVehicleById: (id: string) => handleRequest<Vehicle>(authAxios.get(`${API_URL}/${id}`)),
    createVehicle: (vehicle: CreateVehicleDTO) => handleRequest<Vehicle>(authAxios.post(API_URL, vehicle)),
    updateVehicle: (id: string, vehicle: CreateVehicleDTO) => handleRequest<Vehicle>(authAxios.put(`${API_URL}/${id}`, vehicle)),
    deleteVehicle: (id: string) => handleRequest<void>(authAxios.delete(`${API_URL}/${id}`)),
};