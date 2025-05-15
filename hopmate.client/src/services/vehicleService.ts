// services/vehicleService.ts
import axios from 'axios';
import type { Vehicle, VehicleFormData } from '@/types/vehicle';

const API_URL = '/api/vehicles';

export const getAllVehicles = async (): Promise<Vehicle[]> => {
    const response = await axios.get(API_URL);
    return response.data;
};

export const getVehicleById = async (id: string): Promise<Vehicle> => {
    const response = await axios.get(`${API_URL}/${id}`);
    return response.data;
};

export const getVehiclesByDriver = async (driverId: string): Promise<Vehicle[]> => {
    const response = await axios.get(`${API_URL}/driver/${driverId}`);
    return response.data;
};

export const createVehicle = async (vehicleData: VehicleFormData): Promise<Vehicle> => {
    const formData = new FormData();
    formData.append('brand', vehicleData.brand);
    formData.append('model', vehicleData.model);
    formData.append('plate', vehicleData.plate);
    formData.append('seats', vehicleData.seats.toString());
    formData.append('colorId', vehicleData.colorId.toString());
    formData.append('driverId', vehicleData.driverId);
    if (vehicleData.imageFile) {
        formData.append('imageFile', vehicleData.imageFile);
    }

    const response = await axios.post(API_URL, formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
    return response.data;
};

export const updateVehicle = async (id: string, vehicleData: VehicleFormData): Promise<Vehicle> => {
    const formData = new FormData();
    formData.append('brand', vehicleData.brand);
    formData.append('model', vehicleData.model);
    formData.append('plate', vehicleData.plate);
    formData.append('seats', vehicleData.seats.toString());
    formData.append('colorId', vehicleData.colorId.toString());
    formData.append('driverId', vehicleData.driverId);
    if (vehicleData.imageFile) {
        formData.append('imageFile', vehicleData.imageFile);
    }

    const response = await axios.put(`${API_URL}/${id}`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
    return response.data;
};

export const deleteVehicle = async (id: string): Promise<void> => {
    await axios.delete(`${API_URL}/${id}`);
};