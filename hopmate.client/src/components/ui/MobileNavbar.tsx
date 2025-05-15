/**
 * MobileNavbar.tsx
 * @description This file defines the MobileNavbar component, which is a responsive navigation bar for mobile devices.
 */

import { useState } from 'react';
import { Home, Ticket, User, CarFront } from 'lucide-react';

export default function MobileNavbar() {
    const [activeTab, setActiveTab] = useState('home');

    const tabs = [
        { id: 'home', label: 'Home', icon: Home },
        { id: 'booking', label: 'Booking', icon: Ticket },
        { id: 'pooling', label: 'Pooling', icon: CarFront },
        { id: 'profile', label: 'Profile', icon: User },
    ];

    return (
        <div className="h-16 w-full rounded-b-lg border-t border-gray-300 bg-white">
            <div className="flex h-full items-center justify-around">
                {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        className={`flex flex-col items-center justify-center w-full py-1 ${activeTab === tab.id ? 'text-teal-600' : 'text-gray-500'
                            }`}
                        onClick={() => setActiveTab(tab.id)}
                    >
                        <tab.icon size={20} />
                        <span className="mt-1 text-xs">{tab.label}</span>
                    </button>
                ))}
            </div>
        </div>
    );
}