import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { AlertTriangle, CheckCircle, Activity, Plus } from "lucide-react";
import { getDashboardStats } from "@/actions/dashboard";
import { Button } from "@/components/ui/button";

export default async function DashboardPage() {
    const { success, data } = await getDashboardStats();

    if (!success || !data) {
        return (
            <div className="p-6 text-red-500">
                Failed to load dashboard data.
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold tracking-tight text-slate-900">Dashboard</h2>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
                {/* Critical Equipment */}
                <Card className="border border-red-200 bg-red-50 text-red-900 shadow-sm">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-red-900">Critical Equipment</CardTitle>
                        <AlertTriangle className="h-4 w-4 text-red-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{data.criticalEquipment} Units</div>
                        <p className="text-xs text-red-700 font-medium">(Breakdown or Maintenance)</p>
                    </CardContent>
                </Card>

                {/* Technician Load */}
                <Card className="border border-blue-200 bg-blue-50 text-blue-900 shadow-sm">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-blue-900">Technician Load</CardTitle>
                        <Activity className="h-4 w-4 text-blue-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{data.technicianLoad} Active</div>
                        <p className="text-xs text-blue-700 font-medium">(In Progress Requests)</p>
                    </CardContent>
                </Card>

                {/* Open Requests */}
                <Card className="border border-emerald-200 bg-emerald-50 text-emerald-900 shadow-sm">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-emerald-900">Open Requests</CardTitle>
                        <CheckCircle className="h-4 w-4 text-emerald-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{data.openRequests} Pending</div>
                        <p className="text-xs text-emerald-700 font-medium">{data.overdueRequests} Overdue</p>
                    </CardContent>
                </Card>
            </div>

            <Card className="bg-white border-slate-200 shadow-sm">
                <CardHeader>
                    <CardTitle className="text-slate-900">Recent Activity</CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader className="bg-slate-50">
                            <TableRow className="border-slate-200 hover:bg-slate-100">
                                <TableHead className="text-slate-600">Subject</TableHead>
                                <TableHead className="text-slate-600">Equipment</TableHead>
                                <TableHead className="text-slate-600">Technician</TableHead>
                                <TableHead className="text-slate-600">Priority</TableHead>
                                <TableHead className="text-slate-600">Status</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {data.recentActivity.length > 0 ? (
                                data.recentActivity.map((request: any) => (
                                    <TableRow key={request.id} className="border-slate-200 hover:bg-slate-50">
                                        <TableCell className="font-medium text-slate-900">
                                            <Link href={`/dashboard/requests/${request.id}`} className="hover:underline hover:text-orange-600 block">
                                                {request.title}
                                            </Link>
                                        </TableCell>
                                        <TableCell className="text-slate-600">{request.equipment?.name || "Unknown"}</TableCell>
                                        <TableCell className="text-slate-600">{request.assignedTo?.name || "Unassigned"}</TableCell>
                                        <TableCell>
                                            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium capitalize 
                        ${request.priority === 'critical' ? 'bg-red-100 text-red-700' :
                                                    request.priority === 'high' ? 'bg-orange-100 text-orange-700' :
                                                        'bg-slate-100 text-slate-700'}`}>
                                                {request.priority}
                                            </span>
                                        </TableCell>
                                        <TableCell>
                                            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium capitalize 
                        ${request.status === 'completed' ? 'bg-emerald-100 text-emerald-700' :
                                                    request.status === 'in-progress' ? 'bg-blue-100 text-blue-700' :
                                                        'bg-slate-100 text-slate-700'}`}>
                                                {request.status.replace('-', ' ')}
                                            </span>
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={5} className="text-center text-slate-500 h-24">
                                        No recent activity found.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
}
