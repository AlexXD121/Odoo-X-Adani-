'use client';

import { login } from "@/actions/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LoginSchema } from "@/lib/validations/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Lock, Mail } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

export default function LoginPage() {
    const [error, setError] = useState<string | null>(null);
    const [isPending, startTransition] = useTransition();

    const form = useForm<z.infer<typeof LoginSchema>>({
        resolver: zodResolver(LoginSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    });

    const onSubmit = (values: z.infer<typeof LoginSchema>) => {
        setError(null);
        startTransition(async () => {
            const result = await login(values);
            if (result?.error) {
                setError(result.error);
            }
        });
    };

    return (
        <div className="min-h-screen w-full lg:grid lg:grid-cols-2">
            {/* Left Side - Form */}
            <div className="flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-background">
                <div className="mx-auto w-full max-w-[400px] space-y-6">
                    <div className="flex flex-col space-y-2 text-center">
                        <div className="mx-auto mb-4 relative h-12 w-12">
                            <Image
                                src="/logo.png"
                                alt="MaintFlow Logo"
                                fill
                                className="object-contain"
                            />
                        </div>
                        <h1 className="text-3xl font-semibold tracking-tight text-foreground">
                            Welcome back
                        </h1>
                        <p className="text-sm text-muted-foreground">
                            Enter your credentials to access your account
                        </p>
                    </div>

                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                                <Input
                                    id="email"
                                    placeholder="name@example.com"
                                    type="email"
                                    className="pl-9"
                                    {...form.register("email")}
                                    disabled={isPending}
                                />
                            </div>
                            {form.formState.errors.email && (
                                <p className="text-xs text-destructive">{form.formState.errors.email.message}</p>
                            )}
                        </div>
                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <Label htmlFor="password">Password</Label>
                                <Link
                                    href="#"
                                    className="text-xs text-primary hover:underline hover:text-primary/80"
                                >
                                    Forgot password?
                                </Link>
                            </div>
                            <div className="relative">
                                <Lock className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                                <Input
                                    id="password"
                                    type="password"
                                    className="pl-9"
                                    {...form.register("password")}
                                    disabled={isPending}
                                />
                            </div>
                            {form.formState.errors.password && (
                                <p className="text-xs text-destructive">{form.formState.errors.password.message}</p>
                            )}
                        </div>

                        {error && (
                            <div className="p-3 text-sm text-destructive bg-destructive/10 rounded-md border border-destructive/20">
                                {error}
                            </div>
                        )}

                        <Button type="submit" className="w-full" disabled={isPending}>
                            {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            {isPending ? "Signing in..." : "Sign In"}
                        </Button>
                    </form>

                    <div className="text-center text-sm">
                        Don&apos;t have an account?{" "}
                        <Link href="/auth/signup" className="font-medium text-primary hover:underline hover:text-primary/80">
                            Sign up
                        </Link>
                    </div>
                </div>
            </div>

            {/* Right Side - Brand/Testimonial */}
            <div className="hidden bg-primary lg:block relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-orange-400 to-orange-600">
                    {/* Abstract decorative elements */}
                    <div className="absolute top-0 right-0 -mr-20 -mt-20 h-[500px] w-[500px] rounded-full bg-white/10 blur-3xl"></div>
                    <div className="absolute bottom-0 left-0 -ml-20 -mb-20 h-[500px] w-[500px] rounded-full bg-white/10 blur-3xl"></div>
                </div>

                <div className="relative h-full flex flex-col justify-between p-12 text-white z-10">
                    <div className="flex items-center space-x-2">
                        {/* Brand Name or small logo if needed */}
                        <span className="text-xl font-bold tracking-tight">MaintFlow</span>
                    </div>

                    <div className="space-y-6 max-w-lg">
                        <blockquote className="space-y-2">
                            <p className="text-2xl font-medium leading-relaxed">
                                &ldquo;This platform has completely transformed how we manage our equipment maintenance. The predictive analytics are a game changer.&rdquo;
                            </p>
                            <footer className="text-sm text-orange-100">
                                <div className="font-semibold text-white">Alex Chen</div>
                                <div>Operations Director, TechManufacturing Inc.</div>
                            </footer>
                        </blockquote>
                    </div>

                    <div className="flex items-center space-x-4">
                        {/* Optional footer links or copyright */}
                        <p className="text-xs text-orange-100">© 2024 MaintFlow Inc.</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
