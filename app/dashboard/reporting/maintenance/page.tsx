import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Hammer, CheckCircle, AlertTriangle } from "lucide-react";

export default function MaintenanceReportingPage() {
    return (
        <div className="p-8 max-w-7xl mx-auto space-y-8">
            <div>
                <h1 className="text-3xl font-bold text-slate-900">Maintenance Reports</h1>
                <p className="text-slate-500 mt-2">Analytical insights into maintenance operations.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="border-slate-200">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-slate-500 uppercase tracking-wider">Total Requests</CardTitle>
                        <Hammer className="w-5 h-5 text-blue-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold text-slate-900">12</div>
                        <p className="text-xs text-slate-500 mt-1">+2 from last week</p>
                    </CardContent>
                </Card>

                <Card className="border-slate-200">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-slate-500 uppercase tracking-wider">Completed</CardTitle>
                        <CheckCircle className="w-5 h-5 text-green-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold text-slate-900">8</div>
                        <p className="text-xs text-slate-500 mt-1">67% completion rate</p>
                    </CardContent>
                </Card>

                <Card className="border-slate-200">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-slate-500 uppercase tracking-wider">High Priority</CardTitle>
                        <AlertTriangle className="w-5 h-5 text-red-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold text-slate-900">3</div>
                        <p className="text-xs text-slate-500 mt-1">Requires attention</p>
                    </CardContent>
                </Card>
            </div>

            <Card className="border-slate-200 bg-slate-50 border-dashed min-h-[400px] flex items-center justify-center">
                <div className="text-center">
                    <h3 className="text-lg font-semibold text-slate-700">Detailed Analytics Coming Soon</h3>
                    <p className="text-slate-500">Charts and graphs will be available in the next update.</p>
                </div>
            </Card>
        </div>
    );
}
