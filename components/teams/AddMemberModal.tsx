"use client";

import { useState } from "react";
import { UserPlus, X, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { assignUserToTeam } from "@/actions/teams";

interface User {
    id: string;
    name: string;
    email: string;
}

interface AddMemberModalProps {
    teamId: string;
    unassignedUsers: User[];
}

export function AddMemberModal({ teamId, unassignedUsers }: AddMemberModalProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedUserId, setSelectedUserId] = useState<string>("");
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedUserId) return;

        setIsLoading(true);
        try {
            const result = await assignUserToTeam(selectedUserId, teamId);
            if (result.success) {
                setIsOpen(false);
                setSelectedUserId("");
            } else {
                alert("Failed to assign user");
            }
        } catch (err) {
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    if (!isOpen) {
        return (
            <Button
                variant="outline"
                onClick={() => setIsOpen(true)}
                className="w-full border-orange-200 text-orange-600 hover:bg-orange-50 hover:text-orange-700 bg-white"
            >
                <UserPlus className="mr-2 h-4 w-4" />
                Add Member
            </Button>
        );
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <div className="w-full max-w-md bg-white p-6 rounded-xl shadow-lg border border-slate-200">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-bold text-slate-900">Add Team Member</h3>
                    <button
                        onClick={() => setIsOpen(false)}
                        className="text-slate-500 hover:text-slate-700 transition-colors"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-700">Select Technician</label>
                        {unassignedUsers.length > 0 ? (
                            <div className="grid gap-2 max-h-60 overflow-y-auto p-1">
                                {unassignedUsers.map((user) => (
                                    <div
                                        key={user.id}
                                        onClick={() => setSelectedUserId(user.id)}
                                        className={`flex items-center justify-between p-3 rounded-md border cursor-pointer transition-all ${selectedUserId === user.id
                                                ? "border-orange-500 bg-orange-50 text-orange-700"
                                                : "border-slate-200 hover:border-orange-200 hover:bg-slate-50"
                                            }`}
                                    >
                                        <div className="flex flex-col">
                                            <span className="font-medium text-sm">{user.name}</span>
                                            <span className="text-xs text-slate-500">{user.email}</span>
                                        </div>
                                        {selectedUserId === user.id && (
                                            <Check className="h-4 w-4 text-orange-600" />
                                        )}
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="p-4 text-center border border-dashed border-slate-200 rounded-md bg-slate-50 text-slate-500 text-sm">
                                No unassigned technicians available.
                            </div>
                        )}
                    </div>

                    <div className="flex justify-end gap-3 pt-2">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => setIsOpen(false)}
                            className="border-slate-300 text-slate-700 hover:bg-slate-50"
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            disabled={isLoading || !selectedUserId}
                            className="bg-orange-500 hover:bg-orange-600 text-white shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isLoading ? "Assigning..." : "Assign User"}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}
