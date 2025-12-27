import Link from 'next/link';
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
    return (
        <nav className="bg-white border-b border-slate-200 sticky top-0 z-50 shadow-sm">
            <div className="container mx-auto px-4">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <div className="flex items-center gap-2">
                        <h1 className="text-xl font-bold tracking-tight text-orange-600">Maintenance</h1>
                        <span className="text-xs text-slate-500 hidden sm:inline-block">Operations</span>
                    </div>

                    {/* Navigation Links */}
                    <div className="hidden md:flex items-center space-x-4">
                        {navItems.map((item) => (
                            <div key={item.label} className="relative group">
                                {item.subItems ? (
                                    <button
                                        className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-slate-600 rounded-md hover:bg-orange-50 hover:text-orange-600 transition-colors focus:outline-none"
                                    >
                                        <item.icon className="w-4 h-4" />
                                        {item.label}
                                    </button>
                                ) : (
                                    <Link
                                        href={item.href}
                                        className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-slate-600 rounded-md hover:bg-orange-50 hover:text-orange-600 transition-colors"
                                    >
                                        <item.icon className="w-4 h-4" />
                                        {item.label}
                                    </Link>
                                )}

                                {/* Dropdown Menu */}
                                {item.subItems && (
                                    <div className="absolute left-0 top-full pt-2 w-48 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 ease-in-out z-50">
                                        <div className="bg-white border border-slate-200 rounded-md shadow-lg overflow-hidden py-1">
                                            {item.subItems.map((subItem) => (
                                                <Link
                                                    key={subItem.href + subItem.label}
                                                    href={subItem.href}
                                                    className="flex items-center gap-2 px-4 py-2 text-sm text-slate-600 hover:bg-orange-50 hover:text-orange-600 transition-colors"
                                                >
                                                    <subItem.icon className="w-3 h-3" />
                                                    {subItem.label}
                                                </Link>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>

                    {/* Auth Buttons */}
                    <div className="flex items-center gap-3">
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
                    </div>
                </div>
            </div>

            {/* Mobile Menu (Simplified for prototype) */}
            <div className="md:hidden border-t border-slate-200 overflow-x-auto">
                <div className="flex items-center p-2 space-x-2">
                    {navItems.map((item) => (
                        <div key={item.label} className="shrink-0">
                            {item.subItems ? (
                                <span className="flex items-center gap-2 px-3 py-2 text-xs font-medium text-slate-500 cursor-default">
                                    <item.icon className="w-4 h-4" />
                                    {item.label}
                                </span>
                            ) : (
                                <Link
                                    href={item.href}
                                    className="flex items-center gap-2 px-3 py-2 text-xs font-medium text-slate-600 rounded-md hover:bg-slate-100 transition-colors"
                                >
                                    <item.icon className="w-4 h-4" />
                                    {item.label}
                                </Link>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </nav>
    );
}
