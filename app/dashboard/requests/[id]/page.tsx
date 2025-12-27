import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Card, CardContent } from '@/components/ui/card';
import { ChevronRight } from 'lucide-react';
import { getRequestById } from '@/actions/requests';
import { StatusUpdater } from '@/components/requests/StatusUpdater';
import { format } from 'date-fns';

export default async function RequestDetailsPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const { data: request } = await getRequestById(id);

    if (!request) {
        notFound();
    }

    return (
        <div className="min-h-screen bg-white">
            {/* Top Header */}
            <div className="border-b border-slate-200 bg-white">
                <div className="max-w-6xl mx-auto px-8 py-5">
                    <div className="flex items-center justify-between">
                        {/* Breadcrumb */}
                        <div className="flex items-center gap-2 text-sm text-slate-500">
                            <Link href="/dashboard/requests" className="hover:text-orange-500 font-medium transition-colors">
                                Maintenance Requests
                            </Link>
                            <ChevronRight className="w-4 h-4" />
                            <span className="text-slate-900 font-semibold truncate max-w-[200px]">{request.title}</span>
                        </div>

                        {/* Status Pipeline */}
                        <StatusUpdater requestId={request.id} currentStatus={request.status} />
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
                            <h1 className="text-4xl font-semibold text-slate-900">{request.title}</h1>
                            <div className="text-sm text-slate-400 font-mono mt-1">{request.id}</div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-20 gap-y-8">
                            {/* Left Column */}
                            <div className="space-y-7">
                                <div>
                                    <label className="block text-sm font-semibold text-slate-500 mb-2 uppercase tracking-wide">Created By</label>
                                    <div className="text-base text-slate-900 font-medium">
                                        {/* Assuming 'Assigned To' is effectively the primary contact, or we'd need a reporter field. Using assignedTo since schema limited */}
                                        {request.assignedTo?.name || "System"}
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-slate-500 mb-2 uppercase tracking-wide">Maintenance For</label>
                                    <div className="text-base text-slate-900 font-medium">Equipment</div>
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-slate-500 mb-2 uppercase tracking-wide">Equipment</label>
                                    <div className="text-base text-slate-900 font-medium flex items-center gap-2">
                                        {request.equipment?.name}
                                        <span className="text-slate-400 text-sm">({request.equipment?.serialNumber})</span>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-slate-500 mb-2 uppercase tracking-wide">Category</label>
                                    <div className="text-base text-slate-900 font-medium">{request.equipment?.category}</div>
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-slate-500 mb-2 uppercase tracking-wide">Request Date</label>
                                    <div className="text-base text-slate-900 font-medium">
                                        {format(new Date(request.createdAt), 'MM/dd/yyyy')}
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-slate-500 mb-3 uppercase tracking-wide">Maintenance Type</label>
                                    <div className="space-y-3">
                                        <label className="flex items-center gap-3">
                                            <input
                                                type="radio"
                                                checked={request.type === 'corrective'}
                                                readOnly
                                                className="w-4 h-4 text-orange-500 focus:ring-orange-500 accent-orange-500"
                                            />
                                            <span className="text-base text-slate-900 font-medium">Corrective</span>
                                        </label>
                                        <label className="flex items-center gap-3">
                                            <input
                                                type="radio"
                                                checked={request.type === 'preventive'}
                                                readOnly
                                                className="w-4 h-4 text-orange-500 focus:ring-orange-500 accent-orange-500"
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
                                    <div className="text-base text-slate-900 font-medium">{request.assignedTeam?.name || "Unassigned"}</div>
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-slate-500 mb-2 uppercase tracking-wide">Technician</label>
                                    <div className="text-base text-slate-900 font-medium">{request.assignedTo?.name || "Unassigned"}</div>
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-slate-500 mb-2 uppercase tracking-wide">Scheduled Date</label>
                                    <div className="text-base text-slate-900 font-medium">
                                        {request.scheduledDate ? format(new Date(request.scheduledDate), 'MM/dd/yyyy HH:mm') : 'Not Scheduled'}
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-slate-500 mb-2 uppercase tracking-wide">Duration</label>
                                    <div className="text-base text-slate-900 font-medium">{request.duration} hours</div>
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-slate-500 mb-2 uppercase tracking-wide">Priority</label>
                                    <div className="flex gap-2">
                                        {/* Simple visualization of priority */}
                                        {['low', 'medium', 'high', 'critical'].map((p, i) => {
                                            // Crude logic: low=1, medium=2, high=3, critical=4
                                            const currentP = request.priority.toLowerCase();
                                            let level = 1;
                                            if (currentP === 'medium') level = 2;
                                            if (currentP === 'high') level = 3;
                                            if (currentP === 'critical') level = 4;

                                            if (i < level) {
                                                return <div key={p} className="w-7 h-7 bg-orange-400 rounded transform rotate-45"></div>
                                            }
                                            return <div key={p} className="w-7 h-7 bg-slate-200 rounded transform rotate-45"></div>
                                        })}
                                    </div>
                                    <div className="text-sm text-slate-500 mt-2 capitalize">{request.priority} Priority</div>
                                </div>

                            </div>
                        </div>

                        {/* Tabs Section */}
                        <div className="mt-10 border-t border-slate-200 pt-8">
                            <div className="flex gap-6 border-b border-slate-200 mb-6">
                                <button className="px-1 pb-3 text-base font-semibold text-slate-900 border-b-2 border-slate-900 transition-all">
                                    Notes
                                </button>
                                {/* Instructions tab hidden as per instruction if not needed, sticking to notes for now */}
                            </div>
                            <div className="min-h-[120px] text-base text-slate-700 leading-relaxed whitespace-pre-line">
                                {request.description || "No notes provided."}
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
