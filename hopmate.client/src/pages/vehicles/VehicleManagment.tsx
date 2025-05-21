// src/pages/VehicleManagement.tsx
import React, { useState } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Button } from '@/components/ui/Button';
import { Alert } from '@/components/ui/Alert';
import { Spinner } from '@/components/ui/Spinner';
import VehicleFormModal from '@/components/ui/vehicles/VehicleFormModal';
import { useVehicles } from '@/hooks/useVehicles';
import { vehicleService, type CreateVehicleDTO } from '@/services/vehicleService';
import type { Vehicle } from '@/types/vehicle';
import { ConfirmDeleteModal } from '@/components/ui/ConfirmDeleteModal';
import { useCurrentUser } from '@/hooks/useCurrentUser';

const VehicleManagement: React.FC = () => {
    const { vehicles, isLoading, error, refetch } = useVehicles();
    const { user } = useCurrentUser();
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [currentVehicle, setCurrentVehicle] = useState<Vehicle | undefined>(undefined);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [actionError, setActionError] = useState<string | null>(null);
    const [deletingId, setDeletingId] = useState<string | null>(null);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [vehicleToDelete, setVehicleToDelete] = useState<Vehicle | null>(null);

    console.log("Current user:", user);

    const handleCreateVehicle = async (data: CreateVehicleDTO) => {
        setIsSubmitting(true);
        setActionError(null);

        try {
            const vehicleData: CreateVehicleDTO = {
                ...data,
                idDriver: user.id,
            };

            await vehicleService.createVehicle(vehicleData);
            await refetch();
            setIsCreateModalOpen(false);
        } catch (err) {
            setActionError(err instanceof Error ? err.message : 'Failed to create vehicle');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleEditVehicle = async (data: CreateVehicleDTO) => {
        if (!currentVehicle) {
            setActionError("Vehicle information not available.");
            return;
        }

        setIsSubmitting(true);
        setActionError(null);

        try {
            const vehicleData: CreateVehicleDTO = {
                ...data,
                idDriver: user.id,
            };

            await vehicleService.updateVehicle(currentVehicle.id, vehicleData);
            await refetch();
            setIsEditModalOpen(false);
        } catch (err) {
            setActionError(err instanceof Error ? err.message : 'Failed to update vehicle');
        } finally {
            setIsSubmitting(false);
        }
    };

    const confirmDelete = (vehicle: Vehicle) => {
        setVehicleToDelete(vehicle);
        setIsDeleteModalOpen(true);
    };

    const handleDeleteConfirmed = async () => {
        if (!vehicleToDelete) return;
        setDeletingId(vehicleToDelete.id);
        setActionError(null);

        try {
            await vehicleService.deleteVehicle(vehicleToDelete.id);
            await refetch();
            setIsDeleteModalOpen(false);
            setVehicleToDelete(null);
        } catch (err) {
            setActionError(err instanceof Error ? err.message : 'Failed to delete vehicle');
        } finally {
            setDeletingId(null);
        }
    };

    const openEditModal = (vehicle: Vehicle) => {
        setCurrentVehicle(vehicle);
        setIsEditModalOpen(true);
    };

    const handleOpenCreateModal = () => {
        setIsCreateModalOpen(true);
    };

    return (
        <AppLayout>
            <div className="container mx-auto p-4">
                <div className="mb-6 flex items-center justify-between">
                    <h1 className="text-2xl font-bold">Vehicle Management</h1>
                    <Button
                        onClick={handleOpenCreateModal}
                        fullWidth={false}
                        leftIcon={
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
                            </svg>
                        }
                    >
                        Add Vehicle
                    </Button>
                </div>

                {actionError && (
                    <Alert
                        variant="error"
                        description={actionError}
                        onClose={() => setActionError(null)}
                        className="mb-4"
                    />
                )}

                {isLoading ? (
                    <div className="flex h-64 items-center justify-center">
                        <Spinner size="lg" />
                    </div>
                ) : error ? (
                    <Alert
                        variant="error"
                        title="Error Loading Vehicles"
                        description={error}
                        action={{
                            label: "Try Again",
                            onClick: refetch
                        }}
                    />
                ) : vehicles.length === 0 ? (
                    <div className="rounded-lg bg-gray-50 p-6 text-center shadow-sm">
                        <p className="text-gray-500">No registered vehicles.</p>
                        <Button
                            onClick={handleOpenCreateModal}
                            className="mt-4"
                            fullWidth={false}
                        >
                            Add Vehicle
                        </Button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {vehicles.map(vehicle => (
                            <div key={vehicle.id} className="overflow-hidden rounded-lg bg-white shadow-md">
                                <div className="h-48 overflow-hidden bg-gray-200">
                                    {vehicle.imageFilePath ? (
                                        <img
                                            src={vehicle.imageFilePath}
                                            alt={`${vehicle.brand} ${vehicle.model}`}
                                            className="h-full w-full object-cover"
                                        />
                                    ) : (
                                        <div className="flex h-full w-full items-center justify-center bg-gray-200">
                                            <svg className="h-16 w-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z" />
                                            </svg>
                                        </div>
                                    )}
                                </div>

                                <div className="p-4">
                                    <h2 className="mb-2 text-xl font-semibold">{vehicle.brand} {vehicle.model}</h2>
                                    <div className="mb-4 grid grid-cols-2 gap-y-2">
                                        <div className="text-sm text-gray-600">Plate:</div>
                                        <div className="text-sm font-medium">{vehicle.plate}</div>

                                        <div className="text-sm text-gray-600">Seats:</div>
                                        <div className="text-sm font-medium">{vehicle.seats}</div>

                                        <div className="text-sm text-gray-600">Color:</div>
                                        <div className="text-sm font-medium">{vehicle.colorName}</div>
                                    </div>

                                    <div className="mt-4 flex justify-between">
                                        <Button
                                            onClick={() => openEditModal(vehicle)}
                                            variant="outline"
                                            size="sm"
                                            fullWidth={false}
                                        >
                                            Edit
                                        </Button>
                                        <Button
                                            onClick={() => confirmDelete(vehicle)}
                                            variant="danger"
                                            size="sm"
                                            fullWidth={false}
                                            isLoading={deletingId === vehicle.id}
                                            disabled={deletingId === vehicle.id}
                                        >
                                            Delete
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <VehicleFormModal
                isOpen={isCreateModalOpen}
                onClose={() => setIsCreateModalOpen(false)}
                onSubmit={handleCreateVehicle}
                title="Add New Vehicle"
                isSubmitting={isSubmitting}
            />

            <VehicleFormModal
                isOpen={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                onSubmit={handleEditVehicle}
                vehicle={currentVehicle}
                title="Edit Vehicle"
                isSubmitting={isSubmitting}
            />

            <ConfirmDeleteModal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={handleDeleteConfirmed}
                isLoading={!!deletingId}
                itemName={vehicleToDelete ? `${vehicleToDelete.brand} ${vehicleToDelete.model}` : 'this vehicle'}
            />
        </AppLayout>
    );
};

export default VehicleManagement;