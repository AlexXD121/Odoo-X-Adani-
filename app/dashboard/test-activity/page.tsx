'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { ChevronRight } from 'lucide-react';

export default function Page() {
    const [activeTab, setActiveTab] = useState<'notes' | 'instructions'>('notes');

    // Mock Data - Replace with API call: const activity = await fetchActivity(id)
    const activity = {
        id: "REQ-2024-001",
        subject: "Test activity",
        status: "In Progress", // Options: New, In Progress, Repaired, Scrap
        created_by: "Mitchell Admin",
        maintenance_for: "Equipment",
        equipment_name: "Acer Laptop/LP/203/19281028",
        category: "Computers",
        request_date: "12/18/2025",
        maintenance_type: "Corrective", // Static: Corrective or Preventive
        team: "Technician",
        technician_name: "Aka Foster",
        scheduled_date: "12/28/2025 14:30:00",
        duration: "00:00 hours",
        priority: "Medium", // Low, Medium, High
        company: "My Company (San Francisco)",
        notes: "This laptop requires immediate attention due to overheating issues during peak usage hours.",
        instructions: "1. Check thermal paste application\n2. Clean cooling fans\n3. Test under load for 30 minutes\n4. Replace thermal pads if necessary"
    };

    const statusSteps = ['New', 'In Progress', 'Repaired', 'Scrap'];

    return (
        <div className="min-h-screen bg-white">
            {/* Top Header */}
            <div className="border-b border-slate-200 bg-white">
                <div className="max-w-6xl mx-auto px-8 py-5">
                    <div className="flex items-center justify-between">
                        {/* Breadcrumb */}
                        <div className="flex items-center gap-2 text-sm text-slate-500">
                            <Link href="/dashboard" className="hover:text-orange-500 font-medium transition-colors">
                                Maintenance Requests
                            </Link>
                            <ChevronRight className="w-4 h-4" />
                            <span className="text-slate-900 font-semibold">Test activity</span>
                        </div>

                        {/* Status Pipeline */}
                        <div className="flex items-center">
                            {statusSteps.map((step, index) => (
                                <React.Fragment key={step}>
                                    <div className={`px-4 py-2 rounded-md text-sm font-semibold transition-all ${activity.status === step
                                        ? 'bg-orange-500 text-white shadow-sm'
                                        : 'bg-slate-100 text-slate-600'
                                        }`}>
                                        {step}
                                    </div>
                                    {index < statusSteps.length - 1 && (
                                        <ChevronRight className="w-4 h-4 text-slate-300 mx-2" />
                                    )}
                                </React.Fragment>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-6xl mx-auto px-8 py-8">
                <Card className="border-slate-200 shadow-sm">
                    <CardContent className="p-10">
                        {/* Subject */}
                        <div className="mb-10">
                            <label className="block text-sm font-semibold text-slate-500 mb-2 uppercase tracking-wide">Subject</label>
                            <h1 className="text-4xl font-semibold text-slate-900">{activity.subject}</h1>
                        </div>

                        <div className="grid grid-cols-2 gap-x-20 gap-y-8">
                            {/* Left Column */}
                            <div className="space-y-7">
                                <div>
                                    <label className="block text-sm font-semibold text-slate-500 mb-2 uppercase tracking-wide">Created By</label>
                                    <div className="text-base text-slate-900 font-medium">{activity.created_by}</div>
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-slate-500 mb-2 uppercase tracking-wide">Maintenance For</label>
                                    <div className="text-base text-slate-900 font-medium">{activity.maintenance_for}</div>
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-slate-500 mb-2 uppercase tracking-wide">Equipment</label>
                                    <div className="text-base text-slate-900 font-medium flex items-center gap-2">
                                        {activity.equipment_name}
                                        <span className="text-slate-400 text-sm">▼</span>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-slate-500 mb-2 uppercase tracking-wide">Category</label>
                                    <div className="text-base text-slate-900 font-medium">{activity.category}</div>
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-slate-500 mb-2 uppercase tracking-wide">Request Date</label>
                                    <div className="text-base text-slate-900 font-medium">{activity.request_date}</div>
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-slate-500 mb-3 uppercase tracking-wide">Maintenance Type</label>
                                    <div className="space-y-3">
                                        <label className="flex items-center gap-3 cursor-pointer">
                                            <input
                                                type="radio"
                                                name="type"
                                                checked={activity.maintenance_type === 'Corrective'}
                                                readOnly
                                                className="w-4 h-4 text-orange-500 focus:ring-orange-500"
                                            />
                                            <span className="text-base text-slate-900 font-medium">Corrective</span>
                                        </label>
                                        <label className="flex items-center gap-3 cursor-pointer">
                                            <input
                                                type="radio"
                                                name="type"
                                                checked={activity.maintenance_type === 'Preventive'}
                                                readOnly
                                                className="w-4 h-4 text-orange-500 focus:ring-orange-500"
                                            />
                                            <span className="text-base text-slate-900 font-medium">Preventive</span>
                                        </label>
                                    </div>
                                </div>
                            </div>

                            {/* Right Column */}
                            <div className="space-y-7">
                                <div>
                                    <label className="block text-sm font-semibold text-slate-500 mb-2 uppercase tracking-wide">Team</label>
                                    <div className="text-base text-slate-900 font-medium">{activity.team}</div>
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-slate-500 mb-2 uppercase tracking-wide">Technician</label>
                                    <div className="text-base text-slate-900 font-medium">{activity.technician_name}</div>
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-slate-500 mb-2 uppercase tracking-wide">Scheduled Date</label>
                                    <div className="text-base text-slate-900 font-medium">{activity.scheduled_date}</div>
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-slate-500 mb-2 uppercase tracking-wide">Duration</label>
                                    <div className="text-base text-slate-900 font-medium">{activity.duration}</div>
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-slate-500 mb-2 uppercase tracking-wide">Priority</label>
                                    <div className="flex gap-2">
                                        <div className="w-7 h-7 bg-slate-300 rounded transform rotate-45"></div>
                                        <div className="w-7 h-7 bg-slate-300 rounded transform rotate-45"></div>
                                        <div className="w-7 h-7 bg-slate-200 rounded transform rotate-45"></div>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-slate-500 mb-2 uppercase tracking-wide">Company</label>
                                    <div className="text-base text-slate-900 font-medium">{activity.company}</div>
                                </div>
                            </div>
                        </div>

                        {/* Tabs Section */}
                        <div className="mt-10 border-t border-slate-200 pt-8">
                            <div className="flex gap-6 border-b border-slate-200">
                                <button
                                    onClick={() => setActiveTab('notes')}
                                    className={`px-1 pb-3 text-base font-semibold transition-all ${activeTab === 'notes'
                                        ? 'text-slate-900 border-b-2 border-slate-900'
                                        : 'text-slate-500 hover:text-slate-700'
                                        }`}
                                >
                                    Notes
                                </button>
                                <button
                                    onClick={() => setActiveTab('instructions')}
                                    className={`px-1 pb-3 text-base font-semibold transition-all ${activeTab === 'instructions'
                                        ? 'text-slate-900 border-b-2 border-slate-900'
                                        : 'text-slate-500 hover:text-slate-700'
                                        }`}
                                >
                                    Instructions
                                </button>
                            </div>
                            <div className="mt-6 min-h-[120px] text-base text-slate-700 leading-relaxed whitespace-pre-line">
                                {activeTab === 'notes' ? activity.notes : activity.instructions}
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}