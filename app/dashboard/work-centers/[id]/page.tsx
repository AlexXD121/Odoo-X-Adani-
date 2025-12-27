"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Save, Tag, Settings, Activity } from "lucide-react";
import Link from "next/link";
import { getWorkCenters } from "@/actions/work-centers";
import { useEffect, useState } from "react";
// Since getWorkCenterById logic isn't fully connected to UI in original, we'll fetch all and filter or ideally use server component.
// But the external code was "use client". To strictly mimic it but with data, I should probably switch this to server component too
// OR use useParams and useEffect. Let's make it Server Component for consistency.

import { getWorkCenterById } from "@/actions/work-centers";
import { notFound } from "next/navigation";

// Switching to Server Component (removing "use client" implies I can't use useState instantly, but the external was client.. 
// actually the external was just mock data display. Let's make it server component for better data fetching.)

export default async function WorkCenterFormPage({ params }: { params: Promise<{ id: string }> }) {
    const resolvedParams = await params;
    const { success, data: workCenterData } = await getWorkCenterById(resolvedParams.id);

    if (!success || !workCenterData) {
        notFound();
    }

    return (
        <div className="min-h-screen bg-slate-50 -m-4 md:-m-8 p-4 md:p-8">
            <div className="max-w-5xl mx-auto space-y-6">
                {/* Top Action Bar */}
                <div className="flex items-center justify-between bg-white border border-slate-200 p-2 rounded-lg shadow-sm">
                    <div className="flex items-center gap-2">
                        <Link href="/dashboard/equipment">
                            <Button variant="ghost" size="sm" className="text-slate-500 hover:text-slate-900">
                                <ArrowLeft className="w-4 h-4 mr-1" /> Back
                            </Button>
                        </Link>
                        <div className="h-4 w-[1px] bg-slate-200 mx-1"></div>
                        <Button variant="ghost" size="sm" className="text-blue-600 hover:bg-blue-50 font-medium">Save</Button>
                        <Button variant="ghost" size="sm" className="text-slate-600">Discard</Button>
                    </div>
                </div>

                {/* Main Form Page */}
                <Card className="bg-white border-slate-200 rounded-xl shadow-sm overflow-hidden">
                    <CardHeader className="bg-slate-50/50 border-b border-slate-100 pb-8 pt-8 px-8">
                        <div className="space-y-1">
                            <Label className="text-slate-500 text-xs uppercase font-bold tracking-widest">Work Center</Label>
                            <div className="flex items-center justify-between">
                                <h1 className="text-3xl font-bold text-slate-900">{workCenterData.name}</h1>
                                <Badge className="bg-slate-100 text-slate-700 border-none font-medium px-4 py-1 shadow-none">Code: {workCenterData.code}</Badge>
                            </div>
                        </div>
                    </CardHeader>

                    <CardContent className="p-8 space-y-10">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">

                            {/* General Details (Left 2 columns) */}
                            <div className="md:col-span-2 space-y-8">
                                <div className="space-y-6">
                                    <h3 className="text-slate-800 font-semibold text-lg border-b border-slate-100 pb-2 flex items-center gap-2">
                                        <Settings className="w-5 h-5 text-slate-400" />
                                        Work Place Configuration
                                    </h3>

                                    <div className="space-y-4">
                                        <div className="grid grid-cols-3 items-center">
                                            <Label className="text-slate-600 text-sm">Name</Label>
                                            <div className="col-span-2">
                                                <Input defaultValue={workCenterData.name} className="border-slate-200" />
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-3 items-center">
                                            <Label className="text-slate-600 text-sm">Tags</Label>
                                            <div className="col-span-2 flex flex-wrap gap-2 p-2 bg-slate-50 border border-slate-200 rounded-md">
                                                {workCenterData.tags.map((tag: string) => (
                                                    <Badge key={tag} className="bg-white border-slate-200 text-slate-600 font-normal shadow-none">
                                                        <Tag className="w-3 h-3 mr-1 text-orange-400" /> {tag}
                                                    </Badge>
                                                ))}
                                                <input className="bg-transparent border-none text-xs focus:outline-none ml-2" placeholder="Add..." />
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-3 items-center">
                                            <Label className="text-slate-600 text-sm">Alt. Work Place</Label>
                                            <div className="col-span-2">
                                                <Input defaultValue={workCenterData.alternative || ""} className="border-slate-200" />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Metrics & Performance (Right column) */}
                            <div className="space-y-8">
                                <div className="space-y-6">
                                    <h3 className="text-slate-800 font-semibold text-lg border-b border-slate-100 pb-2 flex items-center gap-2">
                                        <Activity className="w-5 h-5 text-slate-400" />
                                        Performance Metrics
                                    </h3>

                                    <div className="space-y-4 bg-slate-50/50 p-6 rounded-xl border border-slate-100">
                                        <div className="flex justify-between items-center">
                                            <Label className="text-slate-500">Time Efficiency</Label>
                                            <span className="text-slate-900 font-medium">{workCenterData.timeEfficiency.toFixed(0)}%</span>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <Label className="text-slate-500">Capacity</Label>
                                            <span className="text-slate-900 font-medium">{workCenterData.capacity.toFixed(0)}%</span>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <Label className="text-slate-500">OEE Target</Label>
                                            <span className="text-slate-900 font-medium">{workCenterData.oeeTarget.toFixed(0)}%</span>
                                        </div>
                                        <div className="h-[1px] bg-slate-200 w-full my-2"></div>
                                        <div className="flex justify-between items-center">
                                            <Label className="text-slate-500">Cost / Hour</Label>
                                            <span className="text-slate-900 font-bold text-lg">${workCenterData.costPerHour.toFixed(2)}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
