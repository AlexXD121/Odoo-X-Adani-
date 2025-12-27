import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Plus, Search, Filter, SlidersHorizontal, Wrench, AlertCircle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { getEquipmentList } from "@/actions/equipment";
import { CreateEquipmentModal } from "@/components/equipment/CreateEquipmentModal";
import Link from "next/link";

export default async function EquipmentPage() {
    // Fetch data safely
    const { data: equipmentList } = await getEquipmentList();
    const safeEquipment = equipmentList || [];

    return (
        <div className="min-h-screen bg-slate-50 -m-4 md:-m-8 p-4 md:p-8">
            <div className="space-y-6 max-w-7xl mx-auto">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                            Equipment
                        </h1>
                        <p className="text-slate-500 text-sm mt-1">Efficiently track and manage industrial assets.</p>
                    </div>
                    {/* New Equipment Modal */}
                    <div className="flex gap-3">
                        <CreateEquipmentModal />
                    </div>
                </div>

                <div className="bg-white border border-slate-200 rounded-t-xl shadow-sm p-4 border-b-0 space-y-4 lg:space-y-0">
                    <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
                        <div className="flex flex-wrap items-center gap-2 w-full lg:w-auto">
                            <div className="relative flex-1 lg:w-72">
                                <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                                <Input placeholder="Search equipment..." className="pl-9 h-9 bg-slate-50/50 border-slate-200 focus-visible:ring-orange-500/20" />
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
                            <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
                                <tr>
                                    <th className="px-6 py-4 uppercase tracking-wider text-[11px]">Asset Info</th>
                                    <th className="px-6 py-4 uppercase tracking-wider text-[11px]">Tracking</th>
                                    <th className="px-6 py-4 uppercase tracking-wider text-[11px]">Team</th>
                                    <th className="px-6 py-4 uppercase tracking-wider text-[11px]">Status</th>
                                    <th className="px-6 py-4 uppercase tracking-wider text-[11px] text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {safeEquipment.length > 0 ? safeEquipment.map((machine: any) => (
                                    <tr key={machine.id} className="hover:bg-orange-50/30 transition-colors group">
                                        <td className="px-6 py-4">
                                            <div className="flex flex-col">
                                                <Link href={`/dashboard/equipment/machines/${machine.id}`} className="font-semibold text-slate-900 hover:text-orange-600 transition-colors">
                                                    {machine.name}
                                                </Link>
                                                <span className="text-xs text-slate-400 font-mono">{machine.serialNumber}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            {machine.assignedEmployee ? (
                                                <div className="flex items-center gap-2">
                                                    <div className="w-2 h-2 rounded-full bg-blue-400"></div>
                                                    <span className="text-slate-700 font-medium">User: {machine.assignedEmployee.name}</span>
                                                </div>
                                            ) : machine.department ? (
                                                <div className="flex items-center gap-2">
                                                    <div className="w-2 h-2 rounded-full bg-purple-400"></div>
                                                    <span className="text-slate-700 font-medium">Dept: {machine.department}</span>
                                                </div>
                                            ) : (
                                                <span className="text-slate-400 italic">Unassigned</span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4">
                                            <Badge variant="secondary" className="bg-slate-100 text-slate-600 font-medium border-slate-200 shadow-sm">
                                                {machine.maintenanceTeam?.name || "No Team"}
                                            </Badge>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${machine.status === 'operational' ? 'bg-green-100 text-green-700' :
                                                machine.status === 'scrapped' ? 'bg-red-100 text-red-700' :
                                                    'bg-yellow-100 text-yellow-800'
                                                }`}>
                                                {machine.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <Link href={`/dashboard/requests?equipmentId=${machine.id}`}>
                                                <Button variant="outline" size="sm" className="h-8 gap-2 border-slate-300 text-slate-600 hover:bg-slate-50 relative group/btn">
                                                    <Wrench className="w-3.5 h-3.5" />
                                                    Maintenance
                                                    {machine._count?.requests > 0 && (
                                                        <Badge className="ml-1 h-5 min-w-[20px] px-1 bg-orange-500 hover:bg-orange-600 text-white border-none text-[10px] flex items-center justify-center rounded-full">
                                                            {machine._count.requests}
                                                        </Badge>
                                                    )}
                                                </Button>
                                            </Link>
                                        </td>
                                    </tr>
                                )) : (
                                    <tr>
                                        <td colSpan={5} className="px-6 py-12 text-center">
                                            <div className="flex flex-col items-center justify-center gap-2">
                                                <div className="bg-slate-50 p-3 rounded-full">
                                                    <AlertCircle className="w-6 h-6 text-slate-400" />
                                                </div>
                                                <p className="text-slate-500 font-medium">No equipment found.</p>
                                                <p className="text-slate-400 text-xs">Get started by creating a new asset.</p>
                                            </div>
                                        </td>
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
