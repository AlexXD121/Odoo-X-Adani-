import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Hammer, CheckCircle, AlertTriangle } from "lucide-react";
import { getAnalyticsData } from "@/actions/analytics";
import { Charts } from "@/components/reporting/Charts";

export default async function MaintenanceReportingPage() {
    const analytics = await getAnalyticsData();

    // Calculate completion rate
    const completionRate = analytics.total > 0
        ? Math.round((analytics.completed / analytics.total) * 100)
        : 0;

    // Get high priority count
    const highPriorityCount = analytics.byPriority
        .filter(p => p.name === 'High' || p.name === 'Critical')
        .reduce((sum, p) => sum + p.count, 0);

    return (
        <div className="p-8 max-w-7xl mx-auto space-y-8">
            <div>
                <h1 className="text-3xl font-bold text-slate-900">Maintenance Reports</h1>
                <p className="text-slate-500 mt-2">Analytical insights into maintenance operations.</p>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="border-slate-200">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-slate-500 uppercase tracking-wider">Total Requests</CardTitle>
                        <Hammer className="w-5 h-5 text-blue-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold text-slate-900">{analytics.total}</div>
                        <p className="text-xs text-slate-500 mt-1">All maintenance requests</p>
                    </CardContent>
                </Card>

                <Card className="border-slate-200">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-slate-500 uppercase tracking-wider">Completed</CardTitle>
                        <CheckCircle className="w-5 h-5 text-green-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold text-slate-900">{analytics.completed}</div>
                        <p className="text-xs text-slate-500 mt-1">{completionRate}% completion rate</p>
                    </CardContent>
                </Card>

                <Card className="border-slate-200">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-slate-500 uppercase tracking-wider">High Priority</CardTitle>
                        <AlertTriangle className="w-5 h-5 text-red-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold text-slate-900">{highPriorityCount}</div>
                        <p className="text-xs text-slate-500 mt-1">Requires attention</p>
                    </CardContent>
                </Card>
            </div>

            {/* Charts */}
            <Charts
                byStatus={analytics.byStatus}
                byPriority={analytics.byPriority}
                byType={analytics.byType}
                byTeam={analytics.byTeam}
            />
        </div>
    );
}
