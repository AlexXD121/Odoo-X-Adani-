import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Search, Filter, SlidersHorizontal, AlertCircle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { getWorkCenters } from "@/actions/work-centers";
import Link from "next/link";


interface WorkCenter {
    id: string;
    name: string;
    code: string;
    tags: string[];
    alternative?: string | null;
    costPerHour: number;
    capacity: number;
    timeEfficiency: number;
    oeeTarget: number;
}

export default async function WorkCentersPage() {
    const { data: workCentersData } = await getWorkCenters();
    const safeWorkCenters = (workCentersData || []) as WorkCenter[];

    return (
        <div className="min-h-screen bg-slate-50 -m-4 md:-m-8 p-4 md:p-8">
            <div className="space-y-6 max-w-7xl mx-auto">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                            Work Centers
                        </h1>
                        <p className="text-slate-500 text-sm mt-1">Manage production capacity and efficiency targets.</p>
                    </div>
                    {/* Placeholder for Create Modal if needed later */}
                    <div className="flex gap-3">
                        {/* <CreateWorkCenterModal /> */}
                    </div>
                </div>

                <div className="bg-white border border-slate-200 rounded-t-xl shadow-sm p-4 border-b-0 space-y-4 lg:space-y-0">
                    <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
                        <div className="flex flex-wrap items-center gap-2 w-full lg:w-auto">
                            <div className="relative flex-1 lg:w-72">
                                <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                                <Input placeholder="Search work centers..." className="pl-9 h-9 bg-slate-50/50 border-slate-200 focus-visible:ring-orange-500/20" />
                            </div>
                            <div className="flex items-center gap-2">
                                <Button variant="outline" className="h-9 bg-white border-slate-200 text-slate-600 gap-2 text-sm font-medium hover:bg-slate-50">
                                    <Filter className="w-3.5 h-3.5" /> Filter
                                </Button>
                                <Button variant="outline" className="h-9 bg-white border-slate-200 text-slate-600 gap-2 text-sm font-medium hover:bg-slate-50">
                                    <SlidersHorizontal className="w-3.5 h-3.5" /> Group By
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-white border border-slate-200 rounded-b-xl shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm whitespace-nowrap">
                            <thead className="bg-slate-50 text-slate-700 font-bold border-b border-slate-200">
                                <tr>
                                    <th className="px-6 py-4 uppercase tracking-wider text-[11px]">Work Center</th>
                                    <th className="px-6 py-4 uppercase tracking-wider text-[11px]">Code</th>
                                    <th className="px-6 py-4 uppercase tracking-wider text-[11px]">Tag</th>
                                    <th className="px-6 py-4 uppercase tracking-wider text-[11px]">Alternative</th>
                                    <th className="px-6 py-4 uppercase tracking-wider text-[11px]">Cost/Hr</th>
                                    <th className="px-6 py-4 uppercase tracking-wider text-[11px]">Capacity</th>
                                    <th className="px-6 py-4 uppercase tracking-wider text-[11px]">Efficiency</th>
                                    <th className="px-6 py-4 uppercase tracking-wider text-[11px]">OEE Target</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {safeWorkCenters.length > 0 ? safeWorkCenters.map((wc) => (
                                    <tr key={wc.id} className="hover:bg-orange-50/50 transition-colors group cursor-pointer">
                                        <td className="px-6 py-4">
                                            <Link href={`/dashboard/work-centers/${wc.id}`} className="font-semibold text-slate-900 hover:text-orange-600 block">
                                                {wc.name}
                                            </Link>
                                        </td>
                                        <td className="px-6 py-4 font-mono text-[11px] text-slate-400">{wc.code}</td>
                                        <td className="px-6 py-4">
                                            <div className="flex gap-1.5 flex-wrap">
                                                {wc.tags.map((tag) => (
                                                    <Badge key={tag} variant="outline" className="text-[10px] bg-white text-slate-500 border-slate-200 font-semibold px-2 py-0 capitalize">{tag}</Badge>
                                                ))}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-slate-600 font-medium">{wc.alternative || "-"}</td>
                                        <td className="px-6 py-4 text-slate-900 font-bold">${wc.costPerHour.toFixed(2)}</td>
                                        <td className="px-6 py-4 text-slate-900 font-medium">{wc.capacity.toFixed(2)}</td>
                                        <td className="px-6 py-4 text-slate-900 font-medium">{wc.timeEfficiency.toFixed(2)}</td>
                                        <td className="px-6 py-4 text-slate-900 font-bold">{wc.oeeTarget.toFixed(2)}</td>
                                    </tr>
                                )) : (
                                    <tr>
                                        <td colSpan={8} className="px-6 py-8 text-center text-slate-500 italic">No work centers found.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}
