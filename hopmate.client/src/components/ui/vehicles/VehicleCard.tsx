// src/components/vehicles/EmptyVehicleList.tsx
import React from 'react';
import { Link } from 'react-router-dom';

export const EmptyVehicleList: React.FC = () => {
    return (
        <div className="rounded-lg bg-gray-50 p-6 text-center shadow-sm">
            <p className="text-gray-500">No registered vehicles.</p>
            <Link
                to="/vehicles/new"
                className="mt-4 inline-block rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
            >
                Add vehicle
            </Link>
        </div>
    );
};
