import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { AlertTriangle, CheckCircle, Activity } from "lucide-react";

export default function DashboardPage() {
    return (
        <div className="space-y-6">
            <div className="grid gap-6 md:grid-cols-3">
                {/* Critical Equipment */}
                <Card className="border border-red-200 bg-red-50 text-red-700 shadow-sm">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Critical Equipment</CardTitle>
                        <AlertTriangle className="h-4 w-4 text-red-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">5 Units</div>
                        <p className="text-xs text-red-600/80">(Health &lt; 30%)</p>
                    </CardContent>
                </Card>

                {/* Technician Load */}
                <Card className="border border-blue-200 bg-blue-50 text-blue-700 shadow-sm">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Technician Load</CardTitle>
                        <Activity className="h-4 w-4 text-blue-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">85% Utilized</div>
                        <p className="text-xs text-blue-600/80">(Assign Carefully)</p>
                    </CardContent>
                </Card>

                {/* Open Requests */}
                <Card className="border border-emerald-200 bg-emerald-50 text-emerald-700 shadow-sm">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Open Requests</CardTitle>
                        <CheckCircle className="h-4 w-4 text-emerald-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">12 Pending</div>
                        <p className="text-xs text-emerald-600/80">3 Overdue</p>
                    </CardContent>
                </Card>
            </div>

            <Card className="bg-white border-slate-200 shadow-sm">
                <CardHeader>
                    <CardTitle className="text-slate-800">Recent Activity</CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader className="bg-slate-50">
                            <TableRow className="border-slate-200 hover:bg-slate-50">
                                <TableHead className="text-slate-600">Subject</TableHead>
                                <TableHead className="text-slate-600">Employee</TableHead>
                                <TableHead className="text-slate-600">Technician</TableHead>
                                <TableHead className="text-slate-600">Category</TableHead>
                                <TableHead className="text-slate-600">Stage</TableHead>
                                <TableHead className="text-slate-600">Company</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            <TableRow className="border-slate-200 hover:bg-slate-50">
                                <TableCell className="font-medium text-slate-900">Test activity</TableCell>
                                <TableCell className="text-slate-600">Mitchell Admin</TableCell>
                                <TableCell className="text-slate-600">Aka Foster</TableCell>
                                <TableCell className="text-slate-600">Computer</TableCell>
                                <TableCell>
                                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
                                        New Request
                                    </span>
                                </TableCell>
                                <TableCell className="text-slate-600">My company</TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
}
