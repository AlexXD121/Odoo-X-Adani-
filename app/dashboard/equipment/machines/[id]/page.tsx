import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Wrench, ChevronDown, Plus, Info, Users, MapPin, ClipboardList } from "lucide-react";
import Link from "next/link";
import { getEquipmentById } from "@/actions/getEquipment";
import { notFound } from "next/navigation";

export default async function MachineFormPage({ params }: { params: Promise<{ id: string }> }) {
    const resolvedParams = await params;
    const { success, data: equipmentData } = await getEquipmentById(resolvedParams.id);

    if (!success || !equipmentData) {
        notFound();
    }

    // Default empty strings to prevent controlled/uncontrolled warnings if using as inputs, 
    // though here we are using them essentially as display fields or readonly for now.

    return (
        <div className="min-h-screen bg-slate-50 -m-4 md:-m-8 p-4 md:p-8 font-sans">
            <div className="max-w-6xl mx-auto space-y-8">

                {/* --- NAVIGATION & ACTIONS --- */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link href="/dashboard/equipment">
                            <Button variant="ghost" size="sm" className="text-slate-500 hover:text-orange-600 flex items-center gap-1 transition-colors px-0">
                                <ArrowLeft className="w-4 h-4" /> <span className="text-sm font-medium">Back to List</span>
                            </Button>
                        </Link>
                        <div className="h-4 w-[1px] bg-slate-300"></div>
                        <Button className="bg-orange-600 hover:bg-orange-700 text-white h-8 px-4 font-semibold text-xs uppercase tracking-wider rounded-md transition-all shadow-sm">
                            <Plus className="w-3.5 h-3.5 mr-1" /> New Equipment
                        </Button>
                    </div>

                    {/* Centered Smart Button Area */}
                    <div className="hidden md:flex bg-white border border-slate-200 rounded-xl p-1 gap-3 items-center shadow-sm h-12 min-w-[160px] group cursor-pointer hover:border-orange-200 hover:bg-orange-50/30 transition-all">
                        <div className="bg-orange-100 p-2 rounded-lg group-hover:bg-orange-200 transition-colors">
                            <Wrench className="w-5 h-5 text-orange-600" />
                        </div>
                        <div className="flex flex-col text-left pr-4">
                            <span className="text-[10px] font-bold text-slate-500 uppercase leading-tight tracking-widest">Maintenance</span>
                            {/* TODO: Add count logic */}
                            <span className="text-base font-bold text-slate-900 leading-tight">0</span>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <Button variant="outline" className="h-8 border-slate-200 text-slate-600 font-semibold px-4 rounded-md hover:bg-slate-100">Discard</Button>
                        <Button className="h-8 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 rounded-md">Save</Button>
                    </div>
                </div>

                {/* --- MAIN PAGE CONTENT --- */}
                <div className="space-y-8">

                    {/* SECTION 1: PRIMARY IDENTITY */}
                    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                        <div className="bg-slate-50/50 px-8 py-3 border-b border-slate-100 flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <Info className="w-4 h-4 text-slate-400" />
                                <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Equipment Identity</span>
                            </div>
                            <div className={`flex items-center gap-2 px-3 py-1 rounded-full border ${equipmentData.status === 'operational' ? 'bg-emerald-50 border-emerald-100' :
                                equipmentData.status === 'maintenance' ? 'bg-yellow-50 border-yellow-100' :
                                    'bg-red-50 border-red-100'
                                }`}>
                                <span className="relative flex h-2 w-2">
                                    <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${equipmentData.status === 'operational' ? 'bg-emerald-400' :
                                        equipmentData.status === 'maintenance' ? 'bg-yellow-400' :
                                            'bg-red-400'
                                        }`}></span>
                                    <span className={`relative inline-flex rounded-full h-2 w-2 ${equipmentData.status === 'operational' ? 'bg-emerald-500' :
                                        equipmentData.status === 'maintenance' ? 'bg-yellow-500' :
                                            'bg-red-500'
                                        }`}></span>
                                </span>
                                <span className={`text-[10px] font-bold uppercase tracking-tight ${equipmentData.status === 'operational' ? 'text-emerald-600' :
                                    equipmentData.status === 'maintenance' ? 'text-yellow-600' :
                                        'text-red-600'
                                    }`}>{equipmentData.status}</span>
                            </div>
                        </div>

                        <div className="p-8">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-20 gap-y-10">
                                <div className="space-y-1">
                                    <Label className="text-slate-600 font-semibold text-sm">Equipment Name</Label>
                                    <Input
                                        defaultValue={equipmentData.name}
                                        className="border-0 border-b border-slate-200 rounded-none shadow-none focus-visible:ring-0 focus-visible:border-orange-500 px-0 h-10 text-xl font-bold text-slate-900 bg-transparent transition-all"
                                    />
                                </div>
                                <div className="grid grid-cols-1 gap-8">
                                    <div className="space-y-1">
                                        <Label className="text-slate-600 font-semibold text-sm">Category</Label>
                                        <div className="flex items-center justify-between border-b border-slate-200 h-10 group cursor-pointer hover:border-slate-400 transition-all">
                                            <span className="text-slate-900 font-medium">{equipmentData.category}</span>
                                            <ChevronDown className="w-4 h-4 text-slate-400 group-hover:text-slate-600" />
                                        </div>
                                    </div>
                                    <div className="space-y-1">
                                        <Label className="text-slate-600 font-semibold text-sm">Company</Label>
                                        <Input
                                            defaultValue={equipmentData.company}
                                            className="border-0 border-b border-slate-200 rounded-none shadow-none focus-visible:ring-0 focus-visible:border-orange-500 px-0 h-10 text-slate-800 bg-transparent transition-all"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* SECTION 2: PERSONNEL & LOGISTICS (Two Column Structure) */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

                        {/* MANAGEMENT CARD */}
                        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
                            <div className="bg-slate-50/50 px-8 py-3 border-b border-slate-100 flex items-center gap-2">
                                <Users className="w-4 h-4 text-slate-400" />
                                <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Ownership & Management</span>
                            </div>
                            <div className="p-8 space-y-8 flex-1">
                                <div className="grid grid-cols-2 gap-x-8 gap-y-8">
                                    <div className="space-y-1">
                                        <Label className="text-slate-500 font-medium text-xs tracking-tight">Technician</Label>
                                        <Input defaultValue={equipmentData.technician?.name || ""} className="border-0 border-b border-slate-100 rounded-none shadow-none focus-visible:ring-0 focus-visible:border-orange-500 px-0 h-8 text-sm font-semibold text-slate-900 transition-all bg-transparent" />
                                    </div>
                                    <div className="space-y-1">
                                        <Label className="text-slate-500 font-medium text-xs tracking-tight">Assigned Employee</Label>
                                        <Input defaultValue={equipmentData.assignedEmployee?.name || "Unassigned"} className="border-0 border-b border-slate-100 rounded-none shadow-none focus-visible:ring-0 focus-visible:border-orange-500 px-0 h-8 text-sm font-semibold text-slate-900 transition-all bg-transparent" />
                                    </div>
                                    <div className="space-y-1">
                                        <Label className="text-slate-500 font-medium text-xs tracking-tight">Department</Label>
                                        <Input defaultValue={equipmentData.department || "Unassigned"} className="border-0 border-b border-slate-100 rounded-none shadow-none focus-visible:ring-0 focus-visible:border-orange-500 px-0 h-8 text-sm font-semibold text-slate-900 transition-all bg-transparent" />
                                    </div>
                                    <div className="space-y-1">
                                        <Label className="text-slate-500 font-medium text-xs tracking-tight">Maint. Team</Label>
                                        <Input defaultValue={equipmentData.maintenanceTeam?.name || ""} className="border-0 border-b border-slate-100 rounded-none shadow-none focus-visible:ring-0 focus-visible:border-orange-500 px-0 h-8 text-sm font-semibold text-slate-900 transition-all bg-transparent" />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* INDUSTRIAL LOGISTICS CARD */}
                        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
                            <div className="bg-slate-50/50 px-8 py-3 border-b border-slate-100 flex items-center gap-2">
                                <MapPin className="w-4 h-4 text-slate-400" />
                                <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Industrial Logistics</span>
                            </div>
                            <div className="p-8 space-y-8 flex-1">
                                <div className="grid grid-cols-2 gap-x-8 gap-y-8">
                                    <div className="space-y-1">
                                        <Label className="text-slate-500 font-medium text-xs tracking-tight">Purchase Date</Label>
                                        <Input defaultValue={equipmentData.purchaseDate ? new Date(equipmentData.purchaseDate).toLocaleDateString() : ""} className="border-0 border-b border-slate-100 rounded-none shadow-none focus-visible:ring-0 focus-visible:border-orange-500 px-0 h-8 text-sm font-semibold text-slate-900 transition-all bg-transparent" />
                                    </div>
                                    <div className="space-y-1">
                                        <Label className="text-slate-500 font-medium text-xs tracking-tight">Warranty End</Label>
                                        <Input defaultValue={equipmentData.warrantyEnd ? new Date(equipmentData.warrantyEnd).toLocaleDateString() : ""} placeholder="Not Specified" className="border-0 border-b border-slate-100 rounded-none shadow-none focus-visible:ring-0 focus-visible:border-orange-500 px-0 h-8 text-sm font-medium text-slate-400 transition-all bg-transparent italic" />
                                    </div>
                                    <div className="space-y-1">
                                        <Label className="text-slate-500 font-medium text-xs tracking-tight">Location</Label>
                                        <Input defaultValue={equipmentData.location || ""} placeholder="Enter Zone..." className="border-0 border-b border-slate-100 rounded-none shadow-none focus-visible:ring-0 focus-visible:border-orange-500 px-0 h-8 text-sm font-medium text-slate-400 transition-all bg-transparent italic" />
                                    </div>
                                    <div className="space-y-1">
                                        <Label className="text-slate-500 font-medium text-xs tracking-tight">Work Center</Label>
                                        <div className="flex items-center justify-between border-b border-slate-100 h-8 group cursor-pointer hover:border-slate-300 transition-all">
                                            <span className="text-slate-900 text-sm font-semibold">{equipmentData.workCenter?.name || "-"}</span>
                                            <ChevronDown className="w-3.5 h-3.5 text-slate-300 group-hover:text-slate-500" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* SECTION 4: INTERNAL NOTES */}
                    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                        <div className="bg-slate-50/50 px-8 py-3 border-b border-slate-100 flex items-center gap-2">
                            <ClipboardList className="w-4 h-4 text-slate-400" />
                            <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Internal Maintenance Notes</span>
                        </div>
                        <div className="p-8">
                            <textarea
                                className="w-full min-h-[120px] rounded-xl border border-slate-200 p-5 text-sm text-slate-800 bg-slate-50/20 focus:outline-none focus:ring-2 focus:ring-orange-500/10 focus:border-orange-200 focus:bg-white transition-all placeholder:text-slate-400 placeholder:italic leading-relaxed"
                                placeholder="Describe handling procedures, common maintenance glitches, or specific technician instructions for this hardware asset..."
                                defaultValue={equipmentData.description || ""}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
