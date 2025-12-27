import Link from 'next/link';
import { PenTool, Users, ChevronRight, Calendar } from 'lucide-react';
import { cn } from '@/lib/utils';;

const navItems = [
    {
        href: '/dashboard/equipment', label: 'Equipment', icon: PenTool, isGroup: true, subItems: [
            { href: '/dashboard/equipment', label: 'Machines' },
            { href: '/dashboard/work-centers', label: 'Work Centers' }
        ]
    },
    { href: '/dashboard/teams', label: 'Teams', icon: Users },
    { href: '/dashboard/calendar', label: 'Schedule', icon: Calendar },
];

export function Sidebar() {
    return (
        <aside className="w-64 bg-sidebar border-r border-sidebar-border text-sidebar-foreground flex flex-col h-screen fixed left-0 top-0">
            <div className="p-6">
                <h1 className="text-2xl font-bold tracking-tight text-primary">MaintFlow</h1>
                <p className="text-xs text-muted-foreground">Maintenance Ops</p>
            </div>

            <nav className="flex-1 px-4 space-y-2">
                {navItems.map((item) => (
                    item.isGroup ? (
                        <div key={item.label} className="group relative">
                            {/* Parent Item */}
                            <div className="flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-md hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-colors text-muted-foreground cursor-pointer group-hover:bg-sidebar-accent group-hover:text-sidebar-accent-foreground">
                                <item.icon className="w-5 h-5 text-primary" />
                                {item.label}
                                <ChevronRight className="w-3 h-3 ml-auto transition-transform group-hover:rotate-90" />
                            </div>

                            {/* Hover Dropdown / Expansion */}
                            <div className="hidden group-hover:block pl-11 pr-2 pb-2 space-y-1">
                                {item.subItems?.map(sub => (
                                    <Link
                                        key={sub.href}
                                        href={sub.href}
                                        className="block px-3 py-2 text-xs font-medium text-muted-foreground hover:text-sidebar-foreground hover:bg-sidebar-accent/50 rounded-md transition-colors"
                                    >
                                        {sub.label}
                                    </Link>
                                ))}
                            </div>
                        </div>
                    ) : (
                        <Link
                            key={item.href}
                            href={item.href}
                            className="flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-md hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-colors text-muted-foreground data-[active=true]:bg-sidebar-accent data-[active=true]:text-sidebar-accent-foreground"
                        >
                            <item.icon className="w-5 h-5 text-primary" />
                            {item.label}
                        </Link>
                    )
                ))}
            </nav>


            <div className="p-4 border-t border-sidebar-border space-y-2">
                <form action={async () => {
                    "use server"
                    const { logout } = await import("@/actions/auth")
                    await logout()
                }}>
                    <button type="submit" className="flex items-center gap-3 px-4 py-2 text-sm text-sidebar-foreground hover:bg-orange-50 hover:text-primary w-full rounded-md transition-colors font-medium">
                        <span className="w-5 h-5 flex items-center justify-center text-xl">🚪</span>
                        Logout
                    </button>
                </form>
            </div>
        </aside>
    );
}
