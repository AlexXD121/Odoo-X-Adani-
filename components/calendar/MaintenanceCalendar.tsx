'use client';

import React, { useState } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';

const localizer = momentLocalizer(moment);

const initialEvents = [
    {
        id: 1,
        title: 'Drill Bit Replacement',
        start: new Date(new Date().setHours(10, 0, 0)),
        end: new Date(new Date().setHours(12, 0, 0)),
        resourceId: 'r1',
    },
    {
        id: 2,
        title: 'Conveyor Belt Inspection',
        start: new Date(new Date().setDate(new Date().getDate() + 1)),
        end: new Date(new Date().setDate(new Date().getDate() + 1)),
        allDay: true,
        resourceId: 'r2',
    },
];

export default function MaintenanceCalendar() {
    const [events] = useState(initialEvents);

    return (
        <div className="h-[600px] bg-white p-4 rounded-lg shadow-md">
            <Calendar
                localizer={localizer}
                events={events}
                startAccessor="start"
                endAccessor="end"
                style={{ height: '100%' }}
                views={['month', 'week', 'day']}
                defaultView='month'
            />
        </div>
    );
}
