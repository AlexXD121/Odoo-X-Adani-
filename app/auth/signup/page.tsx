'use client';

import { signup } from "@/actions/auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SignupSchema } from "@/lib/validations/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

export default function SignupPage() {
    const [error, setError] = useState<string | null>(null);
    const [isPending, startTransition] = useTransition();

    const form = useForm<z.infer<typeof SignupSchema>>({
        resolver: zodResolver(SignupSchema),
        defaultValues: {
            name: "",
            email: "",
            password: "",
            confirmPassword: "",
        },
    });

    const onSubmit = (values: z.infer<typeof SignupSchema>) => {
        setError(null);
        startTransition(async () => {
            const result = await signup(values);
            if (result?.error) {
                setError(result.error);
            }
        });
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-slate-100">
            <Card className="w-full max-w-md">
                <CardHeader className="text-center">
                    <CardTitle>Sign up page</CardTitle>
                    <CardDescription>Create a new account</CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="name">Name</Label>
                            <Input
                                id="name"
                                placeholder="John Doe"
                                {...form.register("name")}
                                disabled={isPending}
                            />
                            {form.formState.errors.name && (
                                <p className="text-sm text-red-500">{form.formState.errors.name.message}</p>
                            )}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="email">Email id</Label>
                            <Input
                                id="email"
                                placeholder="m@example.com"
                                type="email"
                                {...form.register("email")}
                                disabled={isPending}
                            />
                            {form.formState.errors.email && (
                                <p className="text-sm text-red-500">{form.formState.errors.email.message}</p>
                            )}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="password">Password</Label>
                            <Input
                                id="password"
                                type="password"
                                {...form.register("password")}
                                disabled={isPending}
                            />
                            {form.formState.errors.password && (
                                <p className="text-sm text-red-500">{form.formState.errors.password.message}</p>
                            )}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="confirmPassword">Re-Enter password</Label>
                            <Input
                                id="confirmPassword"
                                type="password"
                                {...form.register("confirmPassword")}
                                disabled={isPending}
                            />
                            {form.formState.errors.confirmPassword && (
                                <p className="text-sm text-red-500">{form.formState.errors.confirmPassword.message}</p>
                            )}
                        </div>
                        {error && (
                            <div className="p-3 text-sm text-red-500 bg-red-100 rounded-md">
                                {error}
                            </div>
                        )}
                        <Button type="submit" className="w-full" disabled={isPending}>
                            {isPending ? "Creating account..." : "Sign Up"}
                        </Button>
                        <div className="text-center text-sm">
                            Already have an account? <Link href="/auth/login" className="underline">Login</Link>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
