export interface Vehicle {
    id: string;
    brand: string;
    model: string;
    plate: string;
    seats: number;
    imageFilePath: string;
    idDriver: string;
    idColor: string;
    colorName?: string;
    driverName?: string;
}
