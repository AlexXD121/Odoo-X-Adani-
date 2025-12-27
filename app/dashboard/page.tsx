import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { AlertTriangle, CheckCircle, Activity } from "lucide-react";

export default function DashboardPage() {
    return (
        <div className="space-y-6">
            <div className="grid gap-6 md:grid-cols-3">
                {/* Critical Equipment */}
                <Card className="border-none shadow-[0_0_15px_rgba(248,113,113,0.15)] text-red-400">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Critical Equipment</CardTitle>
                        <AlertTriangle className="h-4 w-4 text-red-400" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">5 Units</div>
                        <p className="text-xs text-red-400/70">(Health &lt; 30%)</p>
                    </CardContent>
                </Card>

                {/* Technician Load */}
                <Card className="border-none shadow-[0_0_15px_rgba(96,165,250,0.15)] text-blue-400">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Technician Load</CardTitle>
                        <Activity className="h-4 w-4 text-blue-400" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">85% Utilized</div>
                        <p className="text-xs text-blue-400/70">(Assign Carefully)</p>
                    </CardContent>
                </Card>

                {/* Open Requests */}
                <Card className="border-none shadow-[0_0_15px_rgba(52,211,153,0.15)] text-emerald-400">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Open Requests</CardTitle>
                        <CheckCircle className="h-4 w-4 text-emerald-400" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">12 Pending</div>
                        <p className="text-xs text-emerald-400/70">3 Overdue</p>
                    </CardContent>
                </Card>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Recent Activity</CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader className="bg-white/5">
                            <TableRow className="border-white/10 hover:bg-white/5">
                                <TableHead className="text-slate-400">Subject</TableHead>
                                <TableHead className="text-slate-400">Employee</TableHead>
                                <TableHead className="text-slate-400">Technician</TableHead>
                                <TableHead className="text-slate-400">Category</TableHead>
                                <TableHead className="text-slate-400">Stage</TableHead>
                                <TableHead className="text-slate-400">Company</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            <TableRow className="border-white/10 hover:bg-white/5">
                                <TableCell className="font-medium">Test activity</TableCell>
                                <TableCell>Mitchell Admin</TableCell>
                                <TableCell>Aka Foster</TableCell>
                                <TableCell>Computer</TableCell>
                                <TableCell>
                                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-500/10 text-blue-400">
                                        New Request
                                    </span>
                                </TableCell>
                                <TableCell>My company</TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
}
