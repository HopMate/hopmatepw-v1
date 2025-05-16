/**
 * MobileNavbar.tsx
 * @description Responsive navigation bar for mobile devices using React Router.
 */

import { useLocation, Link } from 'react-router-dom';
import { Home, Ticket, User, CarFront } from 'lucide-react';

export default function MobileNavbar() {
    const location = useLocation(); 

    const tabs = [
        { id: 'home', label: 'Home', icon: Home, href: '/' },
        { id: 'booking', label: 'Booking', icon: Ticket, href: '/booking' },
        { id: 'pooling', label: 'Pooling', icon: CarFront, href: '/pooling' },
        { id: 'profile', label: 'Profile', icon: User, href: '/profile' },
    ];

    return (
        <div className="h-16 w-full rounded-b-lg border-t border-gray-300 bg-white">
            <div className="flex h-full items-center justify-around">
                {tabs.map((tab) => {
                    const isActive = location.pathname === tab.href;

                    return (
                        <Link key={tab.id} to={tab.href} className="w-full">
                            <div
                                className={`flex flex-col items-center justify-center py-1 ${isActive ? 'text-teal-600' : 'text-gray-500'}`}
                            >
                                <tab.icon size={20} />
                                <span className="mt-1 text-xs">{tab.label}</span>
                            </div>
                        </Link>
                    );
                })}
            </div>
        </div>
    );
}