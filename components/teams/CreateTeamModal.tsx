"use client";

import { useState } from "react";
import { Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createTeam } from "@/actions/teams";

export function CreateTeamModal() {
    const [isOpen, setIsOpen] = useState(false);
    const [name, setName] = useState("");
    const [companyName, setCompanyName] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            const result = await createTeam(name, companyName);
            if (result.success) {
                setIsOpen(false);
                setName("");
                setCompanyName("");
            } else {
                alert("Failed to create team");
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
                onClick={() => setIsOpen(true)}
                className="bg-orange-500 hover:bg-orange-600 text-white shadow-sm"
            >
                <Plus className="mr-2 h-4 w-4" />
                Create Team
            </Button>
        );
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <div className="w-full max-w-md bg-white p-6 rounded-xl shadow-lg border border-slate-200">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-bold text-slate-900">Create Maintenance Team</h3>
                    <button
                        onClick={() => setIsOpen(false)}
                        className="text-slate-500 hover:text-slate-700"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="name" className="text-slate-700">Team Name</Label>
                        <Input
                            id="name"
                            placeholder="e.g. Mechanics"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                            className="bg-white border-slate-300 focus:ring-orange-500"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="companyName" className="text-slate-700">Company Name</Label>
                        <Input
                            id="companyName"
                            placeholder="e.g. GearGuard Inc."
                            value={companyName}
                            onChange={(e) => setCompanyName(e.target.value)}
                            required
                            className="bg-white border-slate-300 focus:ring-orange-500"
                        />
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
                            disabled={isLoading}
                            className="bg-orange-500 hover:bg-orange-600 text-white"
                        >
                            {isLoading ? "Creating..." : "Create Team"}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}
