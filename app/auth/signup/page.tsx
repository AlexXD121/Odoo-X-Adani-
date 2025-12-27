'use client';

import { signup } from "@/actions/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SignupSchema } from "@/lib/validations/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Lock, Mail, User } from "lucide-react";
import Image from "next/image";
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
                            Create an account
                        </h1>
                        <p className="text-sm text-muted-foreground">
                            Join the next-gen maintenance platform
                        </p>
                    </div>

                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="name">Full Name</Label>
                            <div className="relative">
                                <User className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                                <Input
                                    id="name"
                                    placeholder="John Doe"
                                    className="pl-9"
                                    {...form.register("name")}
                                    disabled={isPending}
                                />
                            </div>
                            {form.formState.errors.name && (
                                <p className="text-xs text-destructive">{form.formState.errors.name.message}</p>
                            )}
                        </div>

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
                            <Label htmlFor="password">Password</Label>
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

                        <div className="space-y-2">
                            <Label htmlFor="confirmPassword">Confirm Password</Label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                                <Input
                                    id="confirmPassword"
                                    type="password"
                                    className="pl-9"
                                    {...form.register("confirmPassword")}
                                    disabled={isPending}
                                />
                            </div>
                            {form.formState.errors.confirmPassword && (
                                <p className="text-xs text-destructive">{form.formState.errors.confirmPassword.message}</p>
                            )}
                        </div>

                        {error && (
                            <div className="p-3 text-sm text-destructive bg-destructive/10 rounded-md border border-destructive/20">
                                {error}
                            </div>
                        )}

                        <Button type="submit" className="w-full" disabled={isPending}>
                            {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            {isPending ? "Creating account..." : "Sign Up"}
                        </Button>
                    </form>

                    <div className="text-center text-sm">
                        Already have an account?{" "}
                        <Link href="/auth/login" className="font-medium text-primary hover:underline hover:text-primary/80">
                            Log in
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
                        <span className="text-xl font-bold tracking-tight">MaintFlow</span>
                    </div>

                    <div className="space-y-6 max-w-lg">
                        <blockquote className="space-y-2">
                            <p className="text-2xl font-medium leading-relaxed">
                                &ldquo;MaintFlow gave us the visibility we needed to reduce downtime by 40%. It's an essential tool for our daily operations.&rdquo;
                            </p>
                            <footer className="text-sm text-orange-100">
                                <div className="font-semibold text-white">Sarah Jenkins</div>
                                <div>Plant Manager, Industrial Solutions Ltd.</div>
                            </footer>
                        </blockquote>
                    </div>
                    <div className="flex items-center space-x-4">
                        <p className="text-xs text-orange-100">© 2024 MaintFlow Inc.</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
