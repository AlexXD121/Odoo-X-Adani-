import { z } from "zod";

export const SignupSchema = z
    .object({
        name: z.string().min(1, { message: "Name is required" }),
        email: z.string().email({ message: "Invalid email address" }),
        password: z
            .string()
            .min(8, { message: "Password must be at least 8 characters" })
            .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[\W_]).{8,}$/, {
                message: "Password must contain at least 1 uppercase, 1 lowercase, and 1 special character",
            }),
        confirmPassword: z.string(),
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: "Passwords do not match",
        path: ["confirmPassword"],
    });

export const LoginSchema = z.object({
    email: z.string().min(1, { message: "Email is required" }),
    password: z.string().min(1, { message: "Password is required" }),
});
