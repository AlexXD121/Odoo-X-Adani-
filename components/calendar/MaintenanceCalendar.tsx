"use client";

import React, { useState } from 'react';
import { Calendar, momentLocalizer, Views } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

// Setup the localizer
const localizer = momentLocalizer(moment);

interface CalendarEvent {
    id: string;
    title: string;
    start: Date;
    end: Date;
    resource?: {
        priority: string;
        status: string;
        type: string;
        technician: string;
    };
}

interface MaintenanceCalendarProps {
    events: CalendarEvent[];
}

export function MaintenanceCalendar({ events }: MaintenanceCalendarProps) {
    const [view, setView] = useState(Views.MONTH);
    const [date, setDate] = useState(new Date());

    // Custom Event Style
    const eventPropGetter = (event: CalendarEvent) => {
        let backgroundColor = '#f97316'; // Default Orange (Preventive)

        if (event.resource?.priority === 'critical') {
            backgroundColor = '#ef4444'; // Red
        } else if (event.resource?.status === 'completed') {
            backgroundColor = '#10b981'; // Green
        }

        return {
            style: {
                backgroundColor,
                borderRadius: '4px',
                opacity: 0.9,
                color: 'white',
                border: '0px',
                display: 'block',
                fontSize: '0.75rem',
            },
        };
    };

    return (
        <Card className="h-[calc(100vh-12rem)] p-4 border-slate-200 shadow-sm bg-white">
            <Calendar
                localizer={localizer}
                events={events}
                startAccessor="start"
                endAccessor="end"
                style={{ height: '100%' }}
                views={[Views.MONTH, Views.WEEK, Views.DAY, Views.AGENDA]}
                view={view}
                onView={(v: any) => setView(v)} // Type casting for ease, often mismatch in types
                date={date}
                onNavigate={(d: Date) => setDate(d)}
                eventPropGetter={eventPropGetter}
                components={{
                    toolbar: CustomToolbar
                }}
            />
        </Card>
    );
}

// Simple Custom Toolbar to match theme
const CustomToolbar = (toolbar: any) => {
    const goToBack = () => {
        toolbar.onNavigate('PREV');
    };

    const goToNext = () => {
        toolbar.onNavigate('NEXT');
    };

    const goToCurrent = () => {
        toolbar.onNavigate('TODAY');
    };

    const label = () => {
        const date = moment(toolbar.date);
        return (
            <span className="text-xl font-bold text-slate-800 capitalize">
                {date.format('MMMM YYYY')}
            </span>
        );
    };

    return (
        <div className="flex justify-between items-center mb-4 p-2">
            <div className="flex items-center gap-4">
                <div className="flex gap-1">
                    <button className="px-3 py-1 text-sm font-medium text-slate-600 bg-white border border-slate-200 hover:bg-slate-50 rounded-l-md" onClick={goToBack}>&#8249;</button>
                    <button className="px-3 py-1 text-sm font-medium text-slate-600 bg-white border border-slate-200 hover:bg-slate-50" onClick={goToCurrent}>Today</button>
                    <button className="px-3 py-1 text-sm font-medium text-slate-600 bg-white border border-slate-200 hover:bg-slate-50 rounded-r-md" onClick={goToNext}>&#8250;</button>
                </div>
                {label()}
            </div>

            <div className="flex bg-slate-100 p-1 rounded-lg">
                {['month', 'week', 'day', 'agenda'].map(view => (
                    <button
                        key={view}
                        onClick={() => toolbar.onView(view)}
                        className={`px-3 py-1 text-xs font-semibold uppercase tracking-wide rounded-md transition-all ${toolbar.view === view
                            ? 'bg-white text-orange-600 shadow-sm'
                            : 'text-slate-500 hover:text-slate-700'
                            }`}
                    >
                        {view}
                    </button>
                ))}
            </div>
        </div>
    );
};
