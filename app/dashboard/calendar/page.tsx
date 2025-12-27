import React from 'react';
import { getCalendarEvents } from '@/actions/calendar';
import { MaintenanceCalendar } from '@/components/calendar/MaintenanceCalendar';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import Link from 'next/link';

export default async function CalendarPage() {
    const { success, data, error } = await getCalendarEvents();

    if (!success) {
        return (
            <div className="p-6 text-red-500 bg-red-50 border border-red-200 rounded-lg">
                Error loading calendar: {error}
            </div>
        );
    }

    const events = data || [];

    return (
        <div className="min-h-screen bg-slate-50 -m-4 md:-m-8 p-4 md:p-8 space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                        Maintenance Schedule
                    </h1>
                    <p className="text-slate-500 text-sm mt-1">Plan and track preventive maintenance activities.</p>
                </div>
                <div>
                    <Link href="/dashboard/requests/new">
                        <Button className="bg-orange-600 hover:bg-orange-700 text-white gap-2">
                            <Plus className="w-4 h-4" /> New Request
                        </Button>
                    </Link>
                </div>
            </div>

            <MaintenanceCalendar events={events} />
        </div>
    );
}
