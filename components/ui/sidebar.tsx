import Link from 'next/link';
import { LayoutDashboard, PenTool, Calendar, ListTodo, Users, LogOut } from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
    { href: '/dashboard/equipment', label: 'Equipment', icon: PenTool },
    { href: '/dashboard/requests', label: 'Requests', icon: ListTodo },
    { href: '/dashboard/kanban', label: 'Kanban Board', icon: LayoutDashboard },
    { href: '/dashboard/calendar', label: 'Schedule', icon: Calendar },
    { href: '/dashboard/teams', label: 'Teams', icon: Users },
];

export function Sidebar() {
    return (
        <aside className="w-64 bg-slate-900 text-slate-50 flex flex-col h-screen fixed left-0 top-0">
            <div className="p-6">
                <h1 className="text-2xl font-bold tracking-tight text-emerald-400">GearGuard</h1>
                <p className="text-xs text-slate-400">Maintenance Ops</p>
            </div>

            <nav className="flex-1 px-4 space-y-2">
                {navItems.map((item) => (
                    <Link
                        key={item.href}
                        href={item.href}
                        className="flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-md hover:bg-slate-800 transition-colors"
                    >
                        <item.icon className="w-5 h-5 text-emerald-400" />
                        {item.label}
                    </Link>
                ))}
            </nav>


            <div className="p-4 border-t border-slate-800 space-y-2">
                <Link href="/auth/login" className="flex items-center gap-3 px-4 py-2 text-sm text-slate-400 hover:text-white w-full hover:bg-slate-800 rounded-md transition-colors">
                    <span className="w-5 h-5 flex items-center justify-center">🔐</span>
                    Login
                </Link>
                <Link href="/auth/signup" className="flex items-center gap-3 px-4 py-2 text-sm text-slate-400 hover:text-white w-full hover:bg-slate-800 rounded-md transition-colors">
                    <span className="w-5 h-5 flex items-center justify-center">✨</span>
                    Sign Up
                </Link>
                {/* 
                <button className="flex items-center gap-3 px-4 py-2 text-sm text-slate-400 hover:text-white w-full">
                    <LogOut className="w-5 h-5" />
                    Logout
                </button>
                */}
            </div>
        </aside>
    );
}
