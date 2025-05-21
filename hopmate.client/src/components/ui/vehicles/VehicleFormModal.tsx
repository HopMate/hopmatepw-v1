// src/components/vehicles/VehicleFormModal.ts
import VehicleForm from './VehicleForm';
import { Modal } from '@/components/ui/Modal';
import type { Vehicle } from '@/types/vehicle';
import type { CreateVehicleDTO } from '@/services/vehicleService';

interface VehicleFormModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: CreateVehicleDTO) => Promise<void>;
    vehicle?: Vehicle;
    title: string;
    isSubmitting?: boolean;
}

const VehicleFormModal: React.FC<VehicleFormModalProps> = ({
    isOpen,
    onClose,
    onSubmit,
    vehicle,
    title,
    isSubmitting = false
}) => {
    const handleFormSubmit = async (data: CreateVehicleDTO) => {
        await onSubmit(data);
        onClose();
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={title}>
            <VehicleForm
                initialData={vehicle}
                onSubmit={handleFormSubmit}
                isSubmitting={isSubmitting}
                onCancel={onClose}
            />
        </Modal>
    );
};

export default VehicleFormModal;