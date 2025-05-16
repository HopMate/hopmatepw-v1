/**
 * @file userService.ts
 * @description Fixed user service
 */

import { authService } from './authService';
import type { User } from '@/types/user';

export const userService = {
    getCurrentUser: async (): Promise<User> => {
        const token = authService.getToken();
        if (!token) {
            throw new Error('No authentication token found');
        }

        try {
            const response = await fetch('https://localhost:7293/api/user', {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error(`Failed to fetch user data: ${response.statusText}`);
            }

            const userData = await response.json();

            // Create a formatted user object from the API response
            const user: User = {
                id: userData.id || '',  // The API may not return ID directly
                fullName: userData.fullName,
                email: userData.email,
                dateOfBirth: userData.dateOfBirth
            };

            return user;
        } catch (error) {
            console.error('Error in userService.getCurrentUser:', error);
            throw error;
        }
    },

    updateProfile: async (data: { fullName: string; dateOfBirth: string }): Promise<void> => {
        const token = authService.getToken();
        if (!token) {
            throw new Error('No authentication token found');
        }

        const response = await fetch('https://localhost:7293/api/user/profile', {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        if (!response.ok) {
            throw new Error('Failed to update profile');
        }
    }
};