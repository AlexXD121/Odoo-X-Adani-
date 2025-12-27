import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { getRequests } from "@/actions/requests";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Search } from "@/components/ui/search";

export default async function RequestsPage({
    searchParams,
}: {
    searchParams?: Promise<{ query?: string }>;
}) {
    const params = await searchParams;
    const query = params?.query || "";
    const { data: requests } = await getRequests(query);

    const getStatusColor = (status: string) => {
        switch (status.toLowerCase()) {
            case "new": return "bg-blue-100 text-blue-700 hover:bg-blue-200";
            case "in progress": return "bg-orange-100 text-orange-700 hover:bg-orange-200";
            case "repaired": return "bg-green-100 text-green-700 hover:bg-green-200";
            default: return "bg-slate-100 text-slate-700 hover:bg-slate-200";
        }
    };

    const getPriorityColor = (priority: string) => {
        switch (priority.toLowerCase()) {
            case "high": return "text-red-600 font-semibold";
            case "medium": return "text-orange-600 font-medium";
            default: return "text-slate-500";
        }
    };

    return (
        <div className="p-8 max-w-7xl mx-auto space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Maintenance Requests</h1>
                    <p className="text-slate-500">Manage and track equipment maintenance</p>
                </div>
                <Link href="/dashboard/requests/new">
                    <Button className="bg-orange-600 hover:bg-orange-700 text-white gap-2">
                        <Plus className="w-4 h-4" /> New Request
                    </Button>
                </Link>
            </div>

            {/* Search Bar */}
            <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-4">
                <div className="max-w-md">
                    <Search placeholder="Search requests by title, ID, equipment, or technician..." />
                </div>
            </div>

            <Card className="border-slate-200 shadow-sm bg-white">
                <CardContent className="p-0">
                    <table className="w-full">
                        <thead className="bg-slate-50 border-b border-slate-200">
                            <tr>
                                <th className="text-left py-3 px-4 font-semibold text-slate-700 text-sm">Reference</th>
                                <th className="text-left py-3 px-4 font-semibold text-slate-700 text-sm">Equipment</th>
                                <th className="text-left py-3 px-4 font-semibold text-slate-700 text-sm">Team</th>
                                <th className="text-left py-3 px-4 font-semibold text-slate-700 text-sm">Technician</th>
                                <th className="text-left py-3 px-4 font-semibold text-slate-700 text-sm">Status</th>
                                <th className="text-left py-3 px-4 font-semibold text-slate-700 text-sm">Priority</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {requests?.map((req: any) => (
                                <tr key={req.id} className="hover:bg-slate-50 transition-colors">
                                    <td className="py-3 px-4">
                                        <Link href={`/dashboard/requests/${req.id}`} className="block group">
                                            <div className="font-medium text-slate-900 group-hover:text-orange-600 transition-colors">{req.title}</div>
                                            <div className="text-xs text-slate-400 font-mono">{req.id.substring(0, 8)}</div>
                                        </Link>
                                    </td>
                                    <td className="py-3 px-4">
                                        <div className="text-slate-900">{req.equipment?.name}</div>
                                        <div className="text-xs text-slate-500">{req.equipment?.serialNumber}</div>
                                    </td>
                                    <td className="py-3 px-4">
                                        {req.assignedTeam ? (
                                            <Badge variant="outline" className="font-normal text-slate-600 border-slate-300">
                                                {req.assignedTeam.name}
                                            </Badge>
                                        ) : (
                                            <span className="text-slate-400 text-sm">-</span>
                                        )}
                                    </td>
                                    <td className="py-3 px-4">
                                        {req.assignedTo ? (
                                            <div className="flex items-center gap-2">
                                                <Avatar className="w-6 h-6 border border-slate-200">
                                                    <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${req.assignedTo.name}`} />
                                                    <AvatarFallback>{req.assignedTo.name[0]}</AvatarFallback>
                                                </Avatar>
                                                <span className="text-sm text-slate-700">{req.assignedTo.name}</span>
                                            </div>
                                        ) : (
                                            <span className="text-slate-400 text-sm">Unassigned</span>
                                        )}
                                    </td>
                                    <td className="py-3 px-4">
                                        <Badge className={`${getStatusColor(req.status)} border-none shadow-none`}>
                                            {req.status}
                                        </Badge>
                                    </td>
                                    <td className="py-3 px-4">
                                        <div className={`text-sm capitalize ${getPriorityColor(req.priority)}`}>
                                            {req.priority}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {(!requests || requests.length === 0) && (
                                <tr>
                                    <td colSpan={6} className="py-8 text-center text-slate-500">
                                        <div className="flex flex-col items-center justify-center gap-2">
                                            <p className="text-slate-900 font-medium">No maintenance requests found.</p>
                                            <p className="text-sm text-slate-400">Try adjusting your search terms.</p>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </CardContent>
            </Card>
        </div>
    );
}
