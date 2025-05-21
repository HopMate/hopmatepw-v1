// src/components/ui/ConfirmDeleteModal.tsx
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';

interface ConfirmDeleteModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    isLoading?: boolean;
    itemName?: string;
}

export const ConfirmDeleteModal: React.FC<ConfirmDeleteModalProps> = ({
    isOpen,
    onClose,
    onConfirm,
    isLoading = false,
    itemName = 'this item',
}) => {
    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Confirm Deletion">
            <div className="space-y-4">
                <p className="text-gray-700">
                    Are you sure you want to delete <span className="font-semibold">{itemName}</span>? This action cannot be undone.
                </p>

                <div className="flex justify-end gap-4">
                    <Button onClick={onClose} variant="outline" disabled={isLoading}>
                        Cancel
                    </Button>
                    <Button onClick={onConfirm} variant="danger" isLoading={isLoading} disabled={isLoading}>
                        Delete
                    </Button>
                </div>
            </div>
        </Modal>
    );
};
