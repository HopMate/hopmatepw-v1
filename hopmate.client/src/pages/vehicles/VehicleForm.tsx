import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { vehicleService } from '@/services/vehicleService';
import type { Vehicle } from '@/types/vehicle';
    import { AppLayout } from '@/components/layout/AppLayout';

interface Props {
    vehicle?: Vehicle;
    onSuccess: () => void;
    onCancel: () => void;
}

const VehicleForm = ({ vehicle, onSuccess, onCancel }: Props) => {
    const [formData, setFormData] = useState({
        brand: '',
        model: '',
        plate: '',
        seats: 4,
        idColor: '',
        imageFilePath: '',
    });

    useEffect(() => {
        if (vehicle) {
            setFormData(vehicle);
        }
    }, [vehicle]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async () => {
        try {
            if (vehicle) {
                await vehicleService.update(vehicle.id, formData);
            } else {
                await vehicleService.create(formData);
            }
            onSuccess();
        } catch (error) {
            console.error('Error submitting vehicle form:', error);
            alert('Failed to submit the vehicle. Please check the form and try again.');
        }
    };

    return (
        <div className="mb-4 rounded border bg-gray-50 p-4">
            <div className="grid grid-cols-2 gap-4">
                <Input label="Brand" name="brand" value={formData.brand} onChange={handleChange} />
                <Input label="Model" name="model" value={formData.model} onChange={handleChange} />
                <Input label="Plate" name="plate" value={formData.plate} onChange={handleChange} />
                <Input label="Seats" name="seats" type="number" value={formData.seats} onChange={handleChange} />
                <Input label="Color ID" name="idColor" value={formData.idColor} onChange={handleChange} />
                <Input label="Image URL" name="imageFilePath" value={formData.imageFilePath} onChange={handleChange} />
            </div>
            <div className="mt-4 flex gap-2">
                <Button onClick={handleSubmit}>{vehicle ? 'Update' : 'Create'}</Button>
                <Button value="outline" onClick={onCancel}>Cancel</Button>
            </div>
        </div>
    );
};

export default VehicleForm;
