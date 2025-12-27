'use server';

import { db } from "@/lib/db";
import { LoginSchema, SignupSchema } from "@/lib/validations/auth";
import bcrypt from "bcryptjs";
import { redirect } from "next/navigation";
import { z } from "zod";

export async function signup(formData: z.infer<typeof SignupSchema>) {
    const validatedFields = SignupSchema.safeParse(formData);

    if (!validatedFields.success) {
        return { error: "Invalid fields" };
    }

    const { name, email, password } = validatedFields.data;

    // Check if user exists
    const existingUser = await db.user.findUnique({
        where: { email },
    });

    if (existingUser) {
        return { error: "Email already in use" };
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    await db.user.create({
        data: {
            name,
            email,
            password: hashedPassword,
            role: "portal_user",
        },
    });

    redirect("/auth/login");
}

export async function login(formData: z.infer<typeof LoginSchema>) {
    const validatedFields = LoginSchema.safeParse(formData);

    if (!validatedFields.success) {
        return { error: "Invalid fields" };
    }

    const { email, password } = validatedFields.data;

    // Find User
    const user = await db.user.findUnique({
        where: { email },
    });

    // Strict Error: Account not exist
    if (!user) {
        return { error: "Account not exist" };
    }

    // Verify Password
    const passwordMatch = await bcrypt.compare(password, user.password);

    // Strict Error: Invalid Password
    if (!passwordMatch) {
        return { error: "Invalid Password" };
    }

    // Create session (placeholder)
    // await createSession(user.id);

    redirect("/dashboard");
}
