"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { getEquipmentList } from "@/actions/equipment";
import { createRequest, getEquipmentDetails } from "@/actions/requests";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

// Schema for the form
const formSchema = z.object({
    title: z.string().min(2, "Subject is required"),
    equipmentId: z.string().min(1, "Please select equipment"),
    type: z.enum(["corrective", "preventive"]),
    priority: z.enum(["low", "medium", "high"]),
    description: z.string().optional(),
    // Hidden fields for submission
    assignedTeamId: z.string().optional(),
    assignedToId: z.string().optional(),
});

export default function NewRequestPage() {
    const router = useRouter();
    const [equipmentList, setEquipmentList] = useState<{ id: string; name: string; serialNumber: string }[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    // Auto-fill states for display
    const [assignedTeamName, setAssignedTeamName] = useState("Auto-assigned based on equipment");
    const [assignedTechName, setAssignedTechName] = useState("Auto-assigned based on equipment");

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            title: "",
            equipmentId: "",
            type: "corrective",
            priority: "medium",
            description: "",
            assignedTeamId: "",
            assignedToId: "",
        },
    });

    // 1. Fetch Equipment List on Mount
    useEffect(() => {
        getEquipmentList().then((res) => {
            if (res.success && res.data) {
                setEquipmentList(res.data);
            }
        });
    }, []);

    // 2. MAGIC LOGIC: Watch equipment selection
    const selectedEquipmentId = form.watch("equipmentId");

    useEffect(() => {
        async function fetchDetails() {
            if (!selectedEquipmentId) return;

            // Visual feedback
            setAssignedTeamName("Fetching...");
            setAssignedTechName("Fetching...");

            const res = await getEquipmentDetails(selectedEquipmentId);
            if (res.success && res.data) {
                const eq = res.data;

                // Update display names
                setAssignedTeamName(eq.maintenanceTeam?.name || "No Team Assigned");
                setAssignedTechName(eq.technician?.name || "No Default Technician");

                // Update hidden form fields for submission
                form.setValue("assignedTeamId", eq.maintenanceTeam?.id || "");
                form.setValue("assignedToId", eq.technician?.id || "");
            } else {
                setAssignedTeamName("Error fetching details");
            }
        }

        fetchDetails();
    }, [selectedEquipmentId, form]);

    async function onSubmit(values: z.infer<typeof formSchema>) {
        setIsLoading(true);
        const formData = new FormData();
        Object.keys(values).forEach((key) => {
            const val = values[key as keyof typeof values];
            if (val) formData.append(key, val);
        });

        const res = await createRequest(formData);

        if (res.success) {
            router.push("/dashboard/requests");
        } else {
            console.error(res.error);
            setIsLoading(false);
        }
    }

    return (
        <div className="min-h-screen bg-slate-50 py-10 px-4 flex justify-center items-start">
            <Card className="w-full max-w-2xl bg-white border-slate-200">
                <CardHeader className="space-y-1">
                    <CardTitle className="text-2xl font-bold text-slate-900">New Maintenance Request</CardTitle>
                    <CardDescription className="text-slate-500">
                        Report a breakdown or schedule preventive maintenance.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">

                            {/* Subject */}
                            <FormField
                                control={form.control}
                                name="title"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-slate-700">Subject</FormLabel>
                                        <FormControl>
                                            <Input placeholder="e.g. Oil Leakage in Engine" {...field} className="border-slate-300 focus:border-orange-500" />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* Equipment + Magic Display */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4 bg-slate-50 rounded-lg border border-slate-100">
                                <FormField
                                    control={form.control}
                                    name="equipmentId"
                                    render={({ field }) => (
                                        <FormItem className="col-span-1 md:col-span-2">
                                            <FormLabel className="text-slate-700 font-semibold">Equipment (Auto-fills Team)</FormLabel>
                                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                <FormControl>
                                                    <SelectTrigger className="bg-white border-slate-300">
                                                        <SelectValue placeholder="Select Equipment" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent className="bg-white border-slate-200">
                                                    {equipmentList.map((eq) => (
                                                        <SelectItem key={eq.id} value={eq.id}>
                                                            {eq.name} <span className="text-slate-400">({eq.serialNumber})</span>
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                {/* Read-only Magic Fields */}
                                <div className="space-y-2">
                                    <label className="text-xs font-semibold uppercase text-slate-400 tracking-wider">Assigned Team</label>
                                    <div className="text-sm font-medium text-slate-700 h-10 flex items-center px-3 bg-white border border-slate-200 rounded-md">
                                        {assignedTeamName}
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-semibold uppercase text-slate-400 tracking-wider">Assigned Technician</label>
                                    <div className="text-sm font-medium text-slate-700 h-10 flex items-center px-3 bg-white border border-slate-200 rounded-md">
                                        {assignedTechName}
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-6">
                                <FormField
                                    control={form.control}
                                    name="type"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-slate-700">Type</FormLabel>
                                            <FormControl>
                                                <div className="flex items-center space-x-4 mt-2">
                                                    <label className="flex items-center space-x-2 cursor-pointer">
                                                        <input
                                                            type="radio"
                                                            value="corrective"
                                                            checked={field.value === 'corrective'}
                                                            onChange={() => field.onChange('corrective')}
                                                            className="accent-orange-600"
                                                        />
                                                        <span className="text-slate-700 text-sm">Corrective</span>
                                                    </label>
                                                    <label className="flex items-center space-x-2 cursor-pointer">
                                                        <input
                                                            type="radio"
                                                            value="preventive"
                                                            checked={field.value === 'preventive'}
                                                            onChange={() => field.onChange('preventive')}
                                                            className="accent-orange-600"
                                                        />
                                                        <span className="text-slate-700 text-sm">Preventive</span>
                                                    </label>
                                                </div>
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="priority"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-slate-700">Priority</FormLabel>
                                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                <FormControl>
                                                    <SelectTrigger className="bg-white border-slate-300">
                                                        <SelectValue placeholder="Select Priority" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent className="bg-white border-slate-200">
                                                    <SelectItem value="low">Low</SelectItem>
                                                    <SelectItem value="medium">Medium</SelectItem>
                                                    <SelectItem value="high">High</SelectItem>
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            <FormField
                                control={form.control}
                                name="description"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-slate-700">Description</FormLabel>
                                        <FormControl>
                                            <Textarea
                                                placeholder="Describe the issue in detail..."
                                                className="min-h-[100px] border-slate-300 focus:border-orange-500"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <div className="flex justify-end pt-4">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => router.back()}
                                    className="mr-3 border-slate-300 text-slate-700"
                                >
                                    Cancel
                                </Button>
                                <Button
                                    type="submit"
                                    disabled={isLoading}
                                    className="bg-orange-600 hover:bg-orange-700 text-white min-w-[120px]"
                                >
                                    {isLoading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                                    Create Request
                                </Button>
                            </div>
                        </form>
                    </Form>
                </CardContent>
            </Card>
        </div>
    );
}
