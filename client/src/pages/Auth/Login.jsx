import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Link, useNavigate } from "react-router-dom";
import { Mail, Lock, Loader2, AlertCircle } from "lucide-react";
import useAuthStore from "@/store/authStore";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const loginSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters" }),
});

export default function Login() {
  const navigate = useNavigate();
  const { login, isLoading, error, user } = useAuthStore();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data) => {
    try {
      const userData = await login(data.email, data.password);
      if (userData.role === "FACULTY") {
        navigate("/dashboard");
      } else {
        navigate("/");
      }
    } catch (err) {
      // Error is handled in store and displayed via state
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center p-4 bg-gray-50">
      <div className="w-full max-w-md space-y-8 rounded-xl border border-gray-100 bg-white p-8 shadow-xl">
        <div className="text-center">
          <h2 className="mt-2 text-3xl font-bold tracking-tight text-gray-900 font-heading">
            Welcome back
          </h2>
          <p className="mt-2 text-sm text-gray-500">Sign in to your account</p>
        </div>

        {error && (
          <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive border border-destructive/20 flex items-center gap-2">
            <AlertCircle className="h-4 w-4" />
            {error}
          </div>
        )}

        <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-4">
            <div>
              <label htmlFor="email" className="sr-only">
                Email address
              </label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <Mail
                    className={cn(
                      "h-5 w-5",
                      errors.email ? "text-destructive" : "text-gray-400",
                    )}
                  />
                </div>
                <input
                  id="email"
                  type="email"
                  autoComplete="email"
                  className={cn(
                    "block w-full rounded-md border-0 bg-white py-2 pl-10 text-gray-900 shadow-sm ring-1 ring-inset placeholder:text-gray-400 focus:ring-2 focus:ring-inset sm:text-sm sm:leading-6",
                    errors.email
                      ? "ring-destructive focus:ring-destructive"
                      : "ring-gray-300 focus:ring-primary",
                  )}
                  placeholder="Email address"
                  {...register("email")}
                />
              </div>
              {errors.email && (
                <p className="mt-1 text-xs text-destructive flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" />
                  {errors.email.message}
                </p>
              )}
            </div>

            <div>
              <label htmlFor="password" className="sr-only">
                Password
              </label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <Lock
                    className={cn(
                      "h-5 w-5",
                      errors.password ? "text-destructive" : "text-gray-400",
                    )}
                  />
                </div>
                <input
                  id="password"
                  type="password"
                  autoComplete="current-password"
                  className={cn(
                    "block w-full rounded-md border-0 bg-white py-2 pl-10 text-gray-900 shadow-sm ring-1 ring-inset placeholder:text-gray-400 focus:ring-2 focus:ring-inset sm:text-sm sm:leading-6",
                    errors.password
                      ? "ring-destructive focus:ring-destructive"
                      : "ring-gray-300 focus:ring-primary",
                  )}
                  placeholder="Password"
                  {...register("password")}
                />
              </div>
              {errors.password && (
                <p className="mt-1 text-xs text-destructive flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" />
                  {errors.password.message}
                </p>
              )}
            </div>
          </div>

          <div>
            <Button type="submit" disabled={isLoading} className="w-full">
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Signing in...
                </>
              ) : (
                "Sign in"
              )}
            </Button>
          </div>
        </form>

        <p className="text-center text-sm text-gray-500">
          Not a member?{" "}
          <Link
            to="/register"
            className="font-semibold text-primary hover:text-primary/80"
          >
            Register now
          </Link>
        </p>
      </div>
    </div>
  );
}
