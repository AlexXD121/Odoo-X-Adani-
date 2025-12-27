'use client';
import MaintenanceCalendar from '@/components/calendar/MaintenanceCalendar';

export default function CalendarPage() {
    return (
        <div className="space-y-4">
            <h2 className="text-3xl font-bold tracking-tight">Schedule</h2>
            <MaintenanceCalendar />
        </div>
    );
}
