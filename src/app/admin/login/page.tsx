"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Input from "@/components/common/Input";

export default function AdminLoginPage() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setIsLoading(true);

        try {
            const res = await signIn("credentials", {
                username,
                password,
                redirect: false,
            });

            if (res?.error) {
                setError("Invalid credentials");
            } else if (res?.ok) {
                router.push("/admin");
            }
        } catch (err) {
            setError("An error occurred. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex min-h-[60vh] flex-col items-center justify-center py-12">
            <div className="w-full max-w-md rounded-lg border border-zinc-200 bg-white p-8 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
                <h1 className="mb-6 text-center text-2xl font-bold text-zinc-900 dark:text-zinc-100">
                    Admin Login
                </h1>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <Input
                        label="Username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        disabled={isLoading}
                    />
                    <Input
                        label="Password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        disabled={isLoading}
                    />
                    {error && <p className="text-sm text-red-500">{error}</p>}
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full rounded-md bg-zinc-900 px-4 py-2 font-medium text-white hover:bg-zinc-800 disabled:opacity-50 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200"
                    >
                        {isLoading ? "Signing in..." : "Sign In"}
                    </button>
                </form>
            </div>
        </div>
    );
}
