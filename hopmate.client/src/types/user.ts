/**
 * @file user.ts
 * @description This file defines the User interface, which represents the structure of a user object in the application.
 */

export interface User {
    id: string;
    fullName: string;
    email: string;
    dateOfBirth?: string;
}