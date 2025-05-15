import { AppLayout } from '@/components/layout/AppLayout';
import { VehicleList } from '@/components/vehicles/VehicleList';

export const VehicleListPage = () => {
    return (
        <AppLayout>
            <VehicleList />
        </AppLayout>
    );
};