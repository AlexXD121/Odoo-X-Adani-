import Link from 'next/link';
import { FaChartBar, FaCalendarAlt, FaTools, FaColumns, FaUsers } from 'react-icons/fa';

const navItems = [
    { href: '/dashboard', label: 'Dashboard', icon: FaColumns },
    { href: '/dashboard/calendar', label: 'Maintenance Calendar', icon: FaCalendarAlt },
    { href: '/dashboard/equipment', label: 'Equipment', icon: FaTools },
    { href: '/dashboard/reporting', label: 'Reporting', icon: FaChartBar },
    { href: '/dashboard/teams', label: 'Teams', icon: FaUsers },
];

export function Navbar() {
    return (
        <nav className="bg-slate-900/50 backdrop-blur-md border-b border-white/10 text-slate-200 sticky top-0 z-50 shadow-sm">
            <div className="container mx-auto px-4">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <div className="flex items-center gap-2">
                        <h1 className="text-xl font-bold tracking-tight text-emerald-400">Maintenance</h1>
                        <span className="text-xs text-slate-400 hidden sm:inline-block">Operations</span>
                    </div>

                    {/* Navigation Links */}
                    <div className="hidden md:flex items-center space-x-4">
                        {navItems.map((item) => (
                            <Link
                                key={item.href}
                                href={item.href}
                                className="flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-md hover:bg-slate-800 hover:text-emerald-400 transition-colors"
                            >
                                <item.icon className="w-4 h-4" />
                                {item.label}
                            </Link>
                        ))}
                    </div>

                    {/* Auth Buttons */}
                    <div className="flex items-center gap-3">
                        <Link
                            href="/auth/login"
                            className="text-sm font-medium text-slate-300 hover:text-white transition-colors"
                        >
                            Login
                        </Link>
                        <Link
                            href="/auth/signup"
                            className="px-4 py-2 text-sm font-medium bg-emerald-500 text-white rounded-md hover:bg-emerald-600 transition-colors shadow-sm"
                        >
                            Sign Up
                        </Link>
                    </div>
                </div>
            </div>

            {/* Mobile Menu (Simplified for prototype) */}
            <div className="md:hidden border-t border-slate-800 overflow-x-auto">
                <div className="flex items-center p-2 space-x-2">
                    {navItems.map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            className="flex-shrink-0 flex items-center gap-2 px-3 py-2 text-xs font-medium rounded-md hover:bg-slate-800 transition-colors"
                        >
                            <item.icon className="w-4 h-4 text-emerald-400" />
                            {item.label}
                        </Link>
                    ))}
                </div>
            </div>
        </nav>
    );
}
