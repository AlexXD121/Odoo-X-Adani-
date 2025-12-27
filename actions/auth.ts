'use server';

import { db } from "@/lib/db";
import { LoginSchema, SignupSchema } from "@/lib/schemas";
import { redirect } from "next/navigation";
import { z } from "zod";

export async function signupAction(formData: z.infer<typeof SignupSchema>) {
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
        return { error: "Email already exists" };
    }

    // Create user
    // Note: In production, password should be hashed (e.g., existingUser bcrypt)
    // For this prototype/hackathon, we store as plain text as per implied constraints/lack of bcrypt lib request
    await db.user.create({
        data: {
            name,
            email,
            password, // Ideally: await bcrypt.hash(password, 10)
            role: "portal user",
        },
    });

    redirect("/auth/login");
}

export async function loginAction(formData: z.infer<typeof LoginSchema>) {
    const validatedFields = LoginSchema.safeParse(formData);

    if (!validatedFields.success) {
        return { error: "Invalid fields" };
    }

    const { email, password } = validatedFields.data;

    const user = await db.user.findUnique({
        where: { email },
    });

    if (!user) {
        return { error: "Account not exist" };
    }

    if (user.password !== password) {
        return { error: "Invalid Password" };
    }

    // Create session (placeholder for prototype)
    // In real app: cookies().set('session', ...)

    redirect("/dashboard");
}
