"use client";

import { useState, useEffect } from "react";
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
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, CalendarIcon } from "lucide-react";
import { createEquipment, getMaintenanceTeams, getEmployees } from "@/actions/equipment";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { format } from "date-fns";

const formSchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters."),
    serialNumber: z.string().min(1, "Serial Number is required."),
    category: z.string().min(1, "Category is required."),
    location: z.string().min(1, "Location is required."),
    purchaseDate: z.date(),
    maintenanceTeamId: z.string().min(1, "Please select a maintenance team."),
    technicianId: z.string().optional(),
    assignType: z.enum(["department", "employee"]),
    department: z.string().optional(),
    assignedEmployeeId: z.string().optional(),
}).refine((data) => {
    if (data.assignType === "department" && !data.department) {
        return false;
    }
    if (data.assignType === "employee" && !data.assignedEmployeeId) {
        return false;
    }
    return true;
}, {
    message: "Please specify the assigned department or employee.",
    path: ["department"],
});

export function CreateEquipmentModal() {
    const [open, setOpen] = useState(false);
    const [teams, setTeams] = useState<{ id: string; name: string }[]>([]);
    const [employees, setEmployees] = useState<{ id: string; name: string }[]>([]);
    const [technicians, setTechnicians] = useState<{ id: string; name: string }[]>([]);

    useEffect(() => {
        if (open) {
            getMaintenanceTeams().then((res) => setTeams(res.data || []));
            getEmployees().then((res) => setEmployees(res.data || []));
            // Assuming technicians are also employees for now, but keeping state separate as requested
            getEmployees().then((res) => setTechnicians(res.data || []));
        }
    }, [open]);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            serialNumber: "",
            category: "",
            location: "",
            assignType: "department",
            department: "",
        },
    });

    const assignType = form.watch("assignType");

    async function onSubmit(values: z.infer<typeof formSchema>) {
        const formData = new FormData();
        formData.append("name", values.name);
        formData.append("serialNumber", values.serialNumber);
        formData.append("category", values.category);
        formData.append("location", values.location);
        formData.append("purchaseDate", values.purchaseDate.toISOString());
        formData.append("maintenanceTeamId", values.maintenanceTeamId);
        if (values.technicianId) formData.append("technicianId", values.technicianId);

        formData.append("assignType", values.assignType);
        if (values.department) formData.append("department", values.department);
        if (values.assignedEmployeeId) formData.append("assignedEmployeeId", values.assignedEmployeeId);

        const res = await createEquipment(formData);
        if (res.success) {
            setOpen(false);
            form.reset();
        } else {
            console.error(res.error);
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button className="bg-orange-600 hover:bg-orange-700 text-white gap-2 shadow-sm border-none">
                    <Plus className="w-4 h-4" /> New Equipment
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px] bg-white text-slate-900 border-slate-200">
                <DialogHeader>
                    <DialogTitle className="text-xl font-bold text-slate-900">Add New Equipment</DialogTitle>
                    <DialogDescription className="text-slate-500">
                        Register a new asset into the system. Fill in all required details.
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
                                        <FormLabel className="text-slate-700">Equipment Name</FormLabel>
                                        <FormControl>
                                            <Input placeholder="e.g. CNC Machine X1" {...field} className="border-slate-300 focus:border-orange-500" />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="serialNumber"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-slate-700">Serial Number</FormLabel>
                                        <FormControl>
                                            <Input placeholder="SN-123456" {...field} className="border-slate-300 focus:border-orange-500" />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="category"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-slate-700">Category</FormLabel>
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <FormControl>
                                                <SelectTrigger className="border-slate-300">
                                                    <SelectValue placeholder="Select category" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent className="bg-white border-slate-200">
                                                <SelectItem value="Machinery">Heavy Machinery</SelectItem>
                                                <SelectItem value="Electronics">Electronics</SelectItem>
                                                <SelectItem value="Vehicle">Vehicle</SelectItem>
                                                <SelectItem value="Tools">Tools</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="location"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-slate-700">Location</FormLabel>
                                        <FormControl>
                                            <Input placeholder="e.g. Zone A, Floor 2" {...field} className="border-slate-300 focus:border-orange-500" />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="purchaseDate"
                                render={({ field }) => (
                                    <FormItem className="flex flex-col">
                                        <FormLabel className="text-slate-700">Purchase Date</FormLabel>
                                        <Popover>
                                            <PopoverTrigger asChild>
                                                <FormControl>
                                                    <Button
                                                        variant={"outline"}
                                                        className={cn(
                                                            "w-full pl-3 text-left font-normal border-slate-300",
                                                            !field.value && "text-muted-foreground"
                                                        )}
                                                    >
                                                        {field.value ? (
                                                            format(field.value, "PPP")
                                                        ) : (
                                                            <span>Pick a date</span>
                                                        )}
                                                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                                    </Button>
                                                </FormControl>
                                            </PopoverTrigger>
                                            <PopoverContent className="w-auto p-0 bg-white border-slate-200" align="start">
                                                <Calendar
                                                    mode="single"
                                                    selected={field.value}
                                                    onSelect={field.onChange}
                                                    disabled={(date) =>
                                                        date > new Date() || date < new Date("1900-01-01")
                                                    }
                                                    initialFocus
                                                    className="bg-white text-slate-900"
                                                />
                                            </PopoverContent>
                                        </Popover>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="maintenanceTeamId"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-slate-700">Maintenance Team</FormLabel>
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <FormControl>
                                                <SelectTrigger className="border-slate-300">
                                                    <SelectValue placeholder="Select team" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent className="bg-white border-slate-200">
                                                {teams.map((team) => (
                                                    <SelectItem key={team.id} value={team.id}>
                                                        {team.name}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="technicianId"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-slate-700">Default Technician (Optional)</FormLabel>
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <FormControl>
                                                <SelectTrigger className="border-slate-300">
                                                    <SelectValue placeholder="Select default technician" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent className="bg-white border-slate-200">
                                                {technicians.map((tech) => (
                                                    <SelectItem key={tech.id} value={tech.id}>
                                                        {tech.name}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 space-y-4">
                            <FormField
                                control={form.control}
                                name="assignType"
                                render={({ field }) => (
                                    <FormItem className="space-y-3">
                                        <FormLabel className="text-slate-700 font-semibold">Assignment</FormLabel>
                                        <FormControl>
                                            <div className="flex items-center space-x-4">
                                                <div className="flex items-center space-x-2">
                                                    <input
                                                        type="radio"
                                                        id="dept"
                                                        value="department"
                                                        checked={field.value === "department"}
                                                        onChange={() => field.onChange("department")}
                                                        className="accent-orange-600"
                                                    />
                                                    <label htmlFor="dept" className="text-sm text-slate-700 cursor-pointer">Department</label>
                                                </div>
                                                <div className="flex items-center space-x-2">
                                                    <input
                                                        type="radio"
                                                        id="emp"
                                                        value="employee"
                                                        checked={field.value === "employee"}
                                                        onChange={() => field.onChange("employee")}
                                                        className="accent-orange-600"
                                                    />
                                                    <label htmlFor="emp" className="text-sm text-slate-700 cursor-pointer">Employee</label>
                                                </div>
                                            </div>
                                        </FormControl>
                                    </FormItem>
                                )}
                            />

                            {assignType === "department" ? (
                                <FormField
                                    control={form.control}
                                    name="department"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormControl>
                                                <Input placeholder="Department Name (e.g. Production)" {...field} className="bg-white border-slate-300" />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            ) : (
                                <FormField
                                    control={form.control}
                                    name="assignedEmployeeId"
                                    render={({ field }) => (
                                        <FormItem>
                                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                <FormControl>
                                                    <SelectTrigger className="bg-white border-slate-300">
                                                        <SelectValue placeholder="Select employee" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent className="bg-white border-slate-200">
                                                    {employees.map((emp) => (
                                                        <SelectItem key={emp.id} value={emp.id}>
                                                            {emp.name}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            )}
                        </div>

                        <DialogFooter>
                            <Button type="button" variant="outline" onClick={() => setOpen(false)} className="border-slate-300 text-slate-700">Cancel</Button>
                            <Button type="submit" className="bg-orange-600 hover:bg-orange-700 text-white">Create Equipment</Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}
