"use client";

import React, { useOptimistic, startTransition } from "react";
import { ChevronRight } from "lucide-react";
import { updateRequestStatus } from "@/actions/requests";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";

interface StatusUpdaterProps {
    requestId: string;
    currentStatus: string;
}

const statusSteps = ['New', 'In Progress', 'Repaired', 'Scrap'];
// Mapping for status values which might be lower case in DB but capitalized in UI
// Assuming DB values are lowercase based on previous code ("pending", "in-progress", "completed" etc?)
// Wait, the new code in `createRequest` set status to "new". Previous `updateRequestStatus` didn't enforce enum.
// Let's assume the UI steps map to strings stored in DB. 
// "New" -> "new"
// "In Progress" -> "in progress"
// "Repaired" -> "repaired"
// "Scrap" -> "scrap"

export function StatusUpdater({ requestId, currentStatus }: StatusUpdaterProps) {
    const router = useRouter();
    const [optimisticStatus, addOptimisticStatus] = useOptimistic(
        currentStatus,
        (state, newStatus: string) => newStatus
    );

    const handleStatusChange = async (step: string) => {
        const dbStatus = step.toLowerCase(); // rudimentary mapping
        startTransition(async () => {
            addOptimisticStatus(dbStatus);
            await updateRequestStatus(requestId, dbStatus);
            router.refresh();
        });
    };

    return (
        <div className="flex items-center">
            {statusSteps.map((step, index) => {
                const dbStatus = step.toLowerCase();
                const isActive = optimisticStatus.toLowerCase() === dbStatus;

                return (
                    <React.Fragment key={step}>
                        <button
                            onClick={() => handleStatusChange(step)}
                            className={cn(
                                "px-4 py-2 rounded-md text-sm font-semibold transition-all focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2",
                                isActive
                                    ? "bg-orange-500 text-white shadow-sm"
                                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                            )}
                        >
                            {step}
                        </button>
                        {index < statusSteps.length - 1 && (
                            <ChevronRight className="w-4 h-4 text-slate-300 mx-2" />
                        )}
                    </React.Fragment>
                );
            })}
        </div>
    );
}
