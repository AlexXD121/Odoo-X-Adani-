import { getTeams, getUnassignedUsers } from "@/actions/teams";
import { CreateTeamModal } from "@/components/teams/CreateTeamModal";
import { AddMemberModal } from "@/components/teams/AddMemberModal";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users } from "lucide-react";

// Define types locally since we are using specific select in the action
interface TeamMember {
    id: string;
    name: string;
    email: string;
    role: string;
}

interface TeamWithMembers {
    id: string;
    name: string;
    companyName: string;
    members: TeamMember[];
}

interface UnassignedUser {
    id: string;
    name: string;
    email: string;
}

export default async function TeamsPage() {
    const { data } = await getTeams();
    const teams = data as TeamWithMembers[] | undefined;

    const { data: usersData } = await getUnassignedUsers();
    const unassignedUsers = (usersData || []) as UnassignedUser[];

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight text-slate-900">Maintenance Teams</h2>
                    <p className="text-slate-500">Manage technical teams and assignments</p>
                </div>
                <CreateTeamModal />
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {teams?.map((team) => (
                    <Card key={team.id} className="bg-white border-slate-200 shadow-sm flex flex-col hover:shadow-md transition-shadow duration-200">
                        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0 border-b border-slate-100">
                            <div>
                                <CardTitle className="text-lg font-bold text-slate-800">{team.name}</CardTitle>
                                <p className="text-xs font-medium text-slate-400 uppercase tracking-wider mt-1">{team.companyName || "GearGuard Inc."}</p>
                            </div>
                            <div className="p-2 bg-orange-50 rounded-lg">
                                <Users className="h-4 w-4 text-orange-500" />
                            </div>
                        </CardHeader>
                        <CardContent className="pt-4 flex-1 flex flex-col">
                            <div className="flex-1 space-y-3">
                                <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400">Members</h4>
                                {team.members.length > 0 ? (
                                    <ul className="space-y-2">
                                        {team.members.map((member) => (
                                            <li key={member.id} className="flex items-center gap-3 text-sm text-slate-700 bg-white p-2 rounded-md border border-slate-100 shadow-sm">
                                                <div className="h-8 w-8 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center text-xs font-bold ring-2 ring-white">
                                                    {member.name.charAt(0)}
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className="font-medium text-slate-900">{member.name}</span>
                                                    <span className="text-xs text-slate-500 capitalize">{member.role.replace('_', ' ')}</span>
                                                </div>
                                            </li>
                                        ))}
                                    </ul>
                                ) : (
                                    <div className="py-4 text-center bg-slate-50/50 rounded-lg border border-dashed border-slate-200">
                                        <p className="text-sm text-slate-400 italic">No technicians assigned</p>
                                    </div>
                                )}
                            </div>

                            <div className="mt-6 pt-4 border-t border-slate-100">
                                <AddMemberModal teamId={team.id} unassignedUsers={unassignedUsers} />
                            </div>
                        </CardContent>
                    </Card>
                ))}

                {(!teams || teams.length === 0) && (
                    <div className="col-span-full py-16 text-center border-2 border-dashed border-slate-200 rounded-xl bg-slate-50/30">
                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-orange-50 mb-4">
                            <Users className="h-8 w-8 text-orange-400" />
                        </div>
                        <h3 className="text-lg font-semibold text-slate-900">No teams created</h3>
                        <p className="mt-1 text-slate-500 max-w-sm mx-auto">Get started by creating a new maintenance team to organize your technicians.</p>
                        <div className="mt-6">
                            <CreateTeamModal />
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
