import axios from 'axios';
import type { Color } from '@/types/color';

const API_BASE_URL = 'https://localhost:7293';
const API_URL = '/api/Colors';

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

export const colorService = {
    getAllColors: () => handleRequest<Color[]>(authAxios.get(API_URL)),
    getColorById: (id: number) => handleRequest<Color>(authAxios.get(`${API_URL}/${id}`)),
    createColor: (color: Omit<Color, 'id'>) => handleRequest<Color>(authAxios.post(API_URL, color)),
    updateColor: (id: number, color: Color) => handleRequest<void>(authAxios.put(`${API_URL}/${id}`, color)),
    deleteColor: (id: number) => handleRequest<void>(authAxios.delete(`${API_URL}/${id}`)),
};