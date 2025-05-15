// services/colorService.ts
import axios from 'axios';
import type { Color } from '@/types/color';

const API_URL = '/api/colors';

// Create an axios instance with authorization header
const authAxios = axios.create();

// Add an interceptor to include the auth token in all requests
authAxios.interceptors.request.use(config => {
    // Get token from localStorage
    const token = localStorage.getItem('auth_token');

    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, error => {
    return Promise.reject(error);
});

export const colorService = {
    getAllColors: async (): Promise<Color[]> => {
        try {
            const response = await axios.get<Color[]>(API_URL);
            return response.data;
        } catch (error) {
            console.error('Error fetching colors:', error);
            throw new Error(`Failed to fetch colors: ${error instanceof Error ? error.message : String(error)}`);
        }
    },

    getColorById: async (id: number): Promise<Color> => {
        try {
            const response = await axios.get<Color>(`${API_URL}/${id}`);
            return response.data;
        } catch (error) {
            console.error(`Error fetching color with id ${id}:`, error);
            throw new Error(`Failed to fetch color: ${error instanceof Error ? error.message : String(error)}`);
        }
    },

    createColor: async (color: Omit<Color, 'id'>): Promise<Color> => {
        try {
            const response = await axios.post<Color>(API_URL, color);
            return response.data;
        } catch (error) {
            console.error('Error creating color:', error);
            throw new Error(`Failed to create color: ${error instanceof Error ? error.message : String(error)}`);
        }
    },

    updateColor: async (id: number, color: Color): Promise<void> => {
        try {
            await axios.put(`${API_URL}/${id}`, color);
        } catch (error) {
            console.error(`Error updating color with id ${id}:`, error);
            throw new Error(`Failed to update color: ${error instanceof Error ? error.message : String(error)}`);
        }
    },

    deleteColor: async (id: number): Promise<void> => {
        try {
            await axios.delete(`${API_URL}/${id}`);
        } catch (error) {
            console.error(`Error deleting color with id ${id}:`, error);
            throw new Error(`Failed to delete color: ${error instanceof Error ? error.message : String(error)}`);
        }
    }
};