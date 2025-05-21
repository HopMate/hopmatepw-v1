import { Link } from 'react-router-dom';
import { useState, useRef } from 'react';
import { ChevronDown } from 'lucide-react';

export default function DesktopNavbar() {
    const [openMenu, setOpenMenu] = useState<string | null>(null);
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);

    const navItems = [
        { label: 'Home', href: '/' },
        {
            label: 'Booking',
            dropdown: [
                { label: 'Create Booking', href: '/booking/new' },
                { label: 'My Bookings', href: '/booking' },
            ],
        },
        {
            label: 'Pooling',
            dropdown: [
                { label: 'Join Pool', href: '/pooling/join' },
                { label: 'My Pools', href: '/pooling' },
            ],
        },
        {
            label: 'Profile',
            dropdown: [
                { label: 'View Profile', href: '/profile' },
                { label: 'My Vehicles', href: '/vehicles' },
            ],
        },
    ];

    const handleMouseEnter = (label: string) => {
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
            timeoutRef.current = null;
        }
        setOpenMenu(label);
    };

    const handleMouseLeave = () => {
        timeoutRef.current = setTimeout(() => {
            setOpenMenu(null);
        }, 200); // Delay closing by 200ms
    };

    return (
        <nav className="bg-gradient-to-r border-b border-teal-800 from-teal-900 to-teal-700 text-white shadow-md">
            <div className="flex items-center justify-between px-10 py-4">

                {/* Navigation Items */}
                <div className="flex space-x-8">
                    {navItems.map((item) => {
                        const isOpen = openMenu === item.label;

                        return (
                            <div
                                key={item.label}
                                className="relative"
                                onMouseEnter={() => handleMouseEnter(item.label)}
                                onMouseLeave={handleMouseLeave}
                            >
                                {item.href ? (
                                    <Link
                                        to={item.href}
                                        className="flex items-center font-medium transition-colors hover:text-teal-100"
                                    >
                                        {item.label}
                                        {item.dropdown && (
                                            <ChevronDown
                                                className={`ml-1 h-4 w-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''
                                                    }`}
                                            />
                                        )}
                                    </Link>
                                ) : (
                                    <span className="flex cursor-pointer items-center font-medium hover:text-teal-100">
                                        {item.label}
                                        {item.dropdown && (
                                            <ChevronDown
                                                className={`ml-1 h-4 w-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''
                                                    }`}
                                            />
                                        )}
                                    </span>
                                )}

                                {item.dropdown && isOpen && (
                                    <div className="absolute top-full left-0 z-10 mt-2 w-48 rounded-md border border-gray-200 bg-white text-gray-800 shadow-lg">
                                        {item.dropdown.map((subItem) => (
                                            <Link
                                                key={subItem.label}
                                                to={subItem.href}
                                                className="block px-4 py-2 text-sm hover:bg-teal-50"
                                            >
                                                {subItem.label}
                                            </Link>
                                        ))}
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>

                {/* Logo Section */}
                <Link to="/" className="flex items-center space-x-2">
                    <span className="text-xl font-bold text-white">Hopmate</span>
                </Link>
            </div>
        </nav>
    );
}
