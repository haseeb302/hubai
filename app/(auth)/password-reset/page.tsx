"use client";

import { useState } from "react";
import { redirect, useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

export default function ResetPasswordPage() {
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  if (isAuthenticated) {
    redirect("/");
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    const newPassword = formData.get("newPassword") as string;

    try {
      const response = await fetch("/api/auth/password-reset", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, newPassword }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Something went wrong");
      }

      setSuccess(true);
      setTimeout(() => {
        router.push("/login");
      }, 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to reset password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="w-full max-w-md space-y-8 p-8 border border-border rounded-lg shadow-sm">
        <div className="space-y-2 text-center">
          <h1 className="text-3xl font-bold tracking-tight">Reset Password</h1>
          <p className="text-muted-foreground">
            Enter your email and new password
          </p>
        </div>

        <form className="space-y-4" onSubmit={handleSubmit}>
          {error && (
            <div className="p-3 text-sm text-destructive-foreground bg-destructive/10 rounded-md">
              {error}
            </div>
          )}
          {success && (
            <div className="p-3 text-sm text-green-600 bg-green-50 rounded-md">
              Password reset successful! Redirecting to login...
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
              htmlFor="newPassword"
              className="text-sm font-medium leading-none"
            >
              New Password
            </label>
            <input
              id="newPassword"
              name="newPassword"
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
                Resetting...
              </>
            ) : (
              "Reset Password"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
