"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { redirect, useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";

export default function LoginPage() {
  const { isAuthenticated } = useAuth();
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  if (isAuthenticated) {
    redirect("/");
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const response = await signIn("credentials", {
      email: formData.get("email"),
      password: formData.get("password"),
      redirect: false,
    });

    setLoading(false);

    if (response?.error) {
      setError("Invalid credentials");
      return;
    }

    router.push("/chat");
    router.refresh();
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="w-full max-w-md space-y-8 p-8 border border-border rounded-lg shadow-sm">
        <div className="space-y-2 text-center">
          <h1 className="text-3xl font-bold tracking-tight">Welcome back</h1>
          <p className="text-muted-foreground">
            Enter your credentials to access your account
          </p>
        </div>

        <form className="space-y-4" onSubmit={handleSubmit}>
          {error && (
            <div className="p-3 text-sm text-destructive-foreground bg-destructive/10 rounded-md">
              {error}
            </div>
          )}

          <div className="space-y-2">
            <label htmlFor="email" className="text-sm font-medium leading-none">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              className="w-full p-2 text-sm border border-input rounded-md bg-background"
              placeholder="name@example.com"
            />
          </div>

          <div className="space-y-2">
            <label
              htmlFor="password"
              className="text-sm font-medium leading-none"
            >
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              className="w-full p-2 text-sm border border-input rounded-md bg-background"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 px-4 flex items-center justify-center gap-2 rounded-md bg-primary text-primary-foreground hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Signing in...
              </>
            ) : (
              "Sign in"
            )}
          </button>
          <p className="text-sm">
            <Link
              href="/password-reset"
              className="text-primary hover:underline"
            >
              Forgot your password?
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
