"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
    FormDescription,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Plus, Loader2 } from "lucide-react";
import { createWorkCenter } from "@/actions/work-centers";
import { toast } from "sonner";

const formSchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters."),
    code: z.string().min(1, "Code is required."),
    tags: z.string().optional(),
    alternative: z.string().optional(),
    costPerHour: z.coerce.number().min(0, "Cost must be positive"),
    capacity: z.coerce.number().min(0, "Capacity must be positive").max(100, "Max capacity is 100"),
    timeEfficiency: z.coerce.number().min(0).max(100),
    oeeTarget: z.coerce.number().min(0).max(100),
});

export function CreateWorkCenterModal() {
    const [open, setOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            code: "",
            tags: "",
            alternative: "",
            costPerHour: 0,
            capacity: 100,
            timeEfficiency: 100,
            oeeTarget: 90,
        },
    });

    async function onSubmit(values: z.infer<typeof formSchema>) {
        setIsLoading(true);
        // Convert comma-separated tags to array
        const tagsArray = values.tags
            ? values.tags.split(",").map(t => t.trim()).filter(Boolean)
            : [];

        const res = await createWorkCenter({
            ...values,
            tags: tagsArray,
        });

        if (res.success) {
            toast.success("Work Center created successfully");
            setOpen(false);
            form.reset();
        } else {
            toast.error(res.error || "Failed to create Work Center");
        }
        setIsLoading(false);
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button className="bg-orange-600 hover:bg-orange-700 text-white gap-2 shadow-sm border-none">
                    <Plus className="w-4 h-4" /> New Work Center
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px] bg-white text-slate-900 border-slate-200">
                <DialogHeader>
                    <DialogTitle className="text-xl font-bold text-slate-900">Add New Work Center</DialogTitle>
                    <DialogDescription className="text-slate-500">
                        Create a new production unit or work station.
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
                        <div className="grid grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-slate-700">Work Center Name</FormLabel>
                                        <FormControl>
                                            <Input placeholder="e.g. Assembly Line 1" {...field} className="border-slate-300 focus:border-orange-500" />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="code"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-slate-700">Code</FormLabel>
                                        <FormControl>
                                            <Input placeholder="e.g. WC-001" {...field} className="border-slate-300 focus:border-orange-500" />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="tags"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-slate-700">Tags</FormLabel>
                                        <FormControl>
                                            <Input placeholder="assembly, manual, line1" {...field} className="border-slate-300 focus:border-orange-500" />
                                        </FormControl>
                                        <FormDescription className="text-xs text-slate-400">
                                            Comma separated values
                                        </FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="alternative"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-slate-700">Alternative To</FormLabel>
                                        <FormControl>
                                            <Input placeholder="e.g. Assembly Line 2" {...field} className="border-slate-300 focus:border-orange-500" />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="costPerHour"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-slate-700">Cost per Hour ($)</FormLabel>
                                        <FormControl>
                                            <Input type="number" step="0.01" {...field} className="border-slate-300 focus:border-orange-500" />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="capacity"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-slate-700">Capacity</FormLabel>
                                        <FormControl>
                                            <Input type="number" {...field} className="border-slate-300 focus:border-orange-500" />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="timeEfficiency"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-slate-700">Time Efficiency (%)</FormLabel>
                                        <FormControl>
                                            <Input type="number" {...field} className="border-slate-300 focus:border-orange-500" />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="oeeTarget"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-slate-700">OEE Target (%)</FormLabel>
                                        <FormControl>
                                            <Input type="number" {...field} className="border-slate-300 focus:border-orange-500" />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <DialogFooter>
                            <Button type="button" variant="outline" onClick={() => setOpen(false)} className="border-slate-300 text-slate-700">Cancel</Button>
                            <Button type="submit" disabled={isLoading} className="bg-orange-600 hover:bg-orange-700 text-white">
                                {isLoading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                                Create Work Center
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}
