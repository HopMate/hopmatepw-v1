import type { ReactNode } from 'react';
import MobileNavbar from '@/components/ui/MobileNavbar';
import DesktopNavbar from '@/components/ui/DesktopNavbar';

interface AppLayoutProps {
    children: ReactNode;
}

export const AppLayout = ({ children }: AppLayoutProps) => {
    return (
        <div className="min-h-screen w-full bg-white text-gray-900">
            {/* Desktop Navbar */}
            <div className="top-0 right-0 left-0 hidden lg:block">
                <DesktopNavbar />
            </div>

            {/* Mobile Navbar */}
            <div className="fixed right-0 bottom-0 left-0 z-50 lg:hidden">
                <MobileNavbar />
            </div>

            {/* Main Content */}
            <div className="lg:px-8">
                <div className="w-full">
                    {children}
                </div>
            </div>
        </div>
    );
};
