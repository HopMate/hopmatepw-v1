// types/vehicle.ts
export interface Vehicle {
    id: string;
    brand: string;
    model: string;
    plate: string;
    seats: number;
    imageFilePath?: string;
    driverId: string;
    colorId: number;
    color?: {
        id: number;
        name: string;
        hexCode: string;
    };
}

export interface VehicleFormData {
    brand: string;
    model: string;
    plate: string;
    seats: number;
    colorId: number;
    imageFile?: File;
    driverId: string;
}