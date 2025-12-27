import Link from 'next/link';
import { LayoutDashboard, PenTool, Calendar, ListTodo, Users } from 'lucide-react';

const navItems = [
    { href: '/dashboard/equipment', label: 'Equipment', icon: PenTool },
    { href: '/dashboard/requests', label: 'Requests', icon: ListTodo },
    { href: '/dashboard/kanban', label: 'Kanban', icon: LayoutDashboard },
    { href: '/dashboard/calendar', label: 'Schedule', icon: Calendar },
    { href: '/dashboard/teams', label: 'Teams', icon: Users },
];

export function Navbar() {
    return (
        <nav className="bg-slate-900 text-slate-50 sticky top-0 z-50 shadow-md">
            <div className="container mx-auto px-4">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <div className="flex items-center gap-2">
                        <h1 className="text-xl font-bold tracking-tight text-emerald-400">GearGuard</h1>
                        <span className="text-xs text-slate-400 hidden sm:inline-block">Maintenance Ops</span>
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
