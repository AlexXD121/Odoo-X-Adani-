"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FaChartBar, FaCalendarAlt, FaTools, FaColumns, FaUsers, FaBuilding, FaWrench } from 'react-icons/fa';

interface NavItem {
    href: string;
    label: string;
    icon: any;
    subItems?: NavItem[];
}

const navItems: NavItem[] = [
    { href: '/dashboard', label: 'Dashboard', icon: FaColumns },
    { href: '/dashboard/calendar', label: 'Maintenance Calendar', icon: FaCalendarAlt },
    {
        href: '/dashboard/equipment',
        label: 'Equipment',
        icon: FaTools,
        subItems: [
            { href: '/dashboard/work-centers', label: 'Work Center', icon: FaBuilding },
            { href: '/dashboard/equipment', label: 'Machines & Tools', icon: FaWrench },
        ]
    },
    {
        href: '/dashboard/reporting',
        label: 'Reporting',
        icon: FaChartBar,
        subItems: [
            { href: '/dashboard/reporting/maintenance', label: 'Maintenance Reports', icon: FaChartBar },
        ]
    },
    { href: '/dashboard/teams', label: 'Teams', icon: FaUsers },
];

export function Navbar() {
    const pathname = usePathname();

    // Helper to check if a route is active (exact or parent)
    const isActive = (path: string) => {
        if (path === '/dashboard' && pathname !== '/dashboard') return false;
        return pathname?.startsWith(path);
    };

    // Mock Auth State (Replace with real session check later)
    // For prototyping, we assume user is logged in if they are in /dashboard
    const isLoggedIn = true;
    const userName = "Technician Bob";

    return (
        <nav className="bg-white border-b border-slate-200 sticky top-0 z-50 shadow-sm">
            <div className="container mx-auto px-4">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <Link href="/dashboard" className="flex items-center gap-2">
                        <h1 className="text-xl font-bold tracking-tight text-orange-600">Maintenance</h1>
                        <span className="text-xs text-slate-500 hidden sm:inline-block">Operations</span>
                    </Link>

                    {/* Navigation Links */}
                    <div className="hidden md:flex items-center space-x-4">
                        {navItems.map((item) => {
                            const active = isActive(item.href);

                            return (
                                <div key={item.label} className="relative group">
                                    {item.subItems ? (
                                        <button
                                            className={`flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-md transition-colors focus:outline-none ${active
                                                ? 'bg-orange-50 text-orange-600'
                                                : 'text-slate-600 hover:bg-slate-50 hover:text-orange-600'
                                                }`}
                                        >
                                            <item.icon className="w-4 h-4" />
                                            {item.label}
                                        </button>
                                    ) : (
                                        <Link
                                            href={item.href}
                                            className={`flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-md transition-colors ${active
                                                ? 'bg-orange-50 text-orange-600'
                                                : 'text-slate-600 hover:bg-slate-50 hover:text-orange-600'
                                                }`}
                                        >
                                            <item.icon className="w-4 h-4" />
                                            {item.label}
                                        </Link>
                                    )}

                                    {/* Dropdown Menu */}
                                    {item.subItems && (
                                        <div className="absolute left-0 top-full pt-2 w-56 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 ease-in-out z-50">
                                            <div className="bg-white border border-slate-200 rounded-md shadow-lg overflow-hidden py-1">
                                                {item.subItems.map((subItem) => {
                                                    const subActive = pathname === subItem.href;
                                                    return (
                                                        <Link
                                                            key={subItem.href + subItem.label}
                                                            href={subItem.href}
                                                            className={`flex items-center gap-2 px-4 py-2 text-sm transition-colors ${subActive
                                                                ? 'bg-orange-50 text-orange-600 font-medium'
                                                                : 'text-slate-600 hover:bg-slate-50 hover:text-orange-600'
                                                                }`}
                                                        >
                                                            <subItem.icon className="w-3 h-3" />
                                                            {subItem.label}
                                                        </Link>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>

                    {/* Auth Buttons */}
                    <div className="flex items-center gap-3">
                        {isLoggedIn ? (
                            <div className="flex items-center gap-3">
                                <div className="text-right hidden sm:block">
                                    <p className="text-sm font-medium text-slate-900">{userName}</p>
                                    <p className="text-xs text-slate-500">Alpha Squad</p>
                                </div>
                                <div className="h-8 w-8 rounded-full bg-orange-100 flex items-center justify-center text-orange-600 font-bold border border-orange-200">
                                    TB
                                </div>
                                <Link
                                    href="/auth/logout"
                                    className="text-xs text-slate-500 hover:text-red-500 transition-colors ml-2"
                                >
                                    Logout
                                </Link>
                            </div>
                        ) : (
                            <>
                                <Link
                                    href="/auth/login"
                                    className="text-sm font-medium text-slate-600 hover:text-orange-600 transition-colors"
                                >
                                    Login
                                </Link>
                                <Link
                                    href="/auth/signup"
                                    className="px-4 py-2 text-sm font-medium bg-orange-500 text-white rounded-md hover:bg-orange-600 transition-colors shadow-sm"
                                >
                                    Sign Up
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            </div>

            {/* Mobile Menu (Simplified for prototype) */}
            <div className="md:hidden border-t border-slate-200 overflow-x-auto hide-scrollbar">
                <div className="flex items-center p-2 space-x-2">
                    {navItems.map((item) => {
                        const active = isActive(item.href);
                        return (
                            <div key={item.label} className="shrink-0">
                                {item.subItems ? (
                                    <span
                                        className={`flex items-center gap-2 px-3 py-2 text-xs font-medium rounded-md cursor-default ${active ? 'bg-orange-50 text-orange-600' : 'text-slate-500'
                                            }`}
                                    >
                                        <item.icon className="w-4 h-4" />
                                        {item.label}
                                    </span>
                                ) : (
                                    <Link
                                        href={item.href}
                                        className={`flex items-center gap-2 px-3 py-2 text-xs font-medium rounded-md transition-colors ${active
                                            ? 'bg-orange-50 text-orange-600'
                                            : 'text-slate-600 hover:bg-slate-100'
                                            }`}
                                    >
                                        <item.icon className="w-4 h-4" />
                                        {item.label}
                                    </Link>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>
        </nav>
    );
}
