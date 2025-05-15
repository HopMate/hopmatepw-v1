/**
 * @file userService.ts
 * @description This file defines the userService, which provides methods for user-related operations such as fetching user data and updating the user profile.
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
            if (!userData.id) {
                throw new Error('Invalid user data received');
            }

            return userData;
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