import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useNavigate, Link } from "react-router-dom";
import {
  Mail,
  Lock,
  User,
  Loader2,
  GraduationCap,
  Phone,
  FileDigit,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import useAuthStore from "@/store/authStore";
import { cn } from "@/lib/utils";

const registerSchema = z
  .object({
    name: z.string().min(2, { message: "Name must be at least 2 characters" }),
    email: z.string().email({ message: "Invalid email address" }),
    password: z
      .string()
      .min(6, { message: "Password must be at least 6 characters" }),
    phone: z
      .string()
      .min(10, { message: "Phone number must be at least 10 digits" }),
    role: z.enum(["STUDENT", "FACULTY"], { message: "Please select a role" }),
    rollNumber: z.string().optional(),
  })
  .refine(
    (data) => {
      if (data.role === "STUDENT" && !data.rollNumber) {
        return false;
      }
      return true;
    },
    {
      message: "Roll Number is required for Students",
      path: ["rollNumber"],
    },
  );

export default function Register() {
  const navigate = useNavigate();
  const { register: registerUser, isLoading, error } = useAuthStore();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      role: "STUDENT",
    },
  });

  const selectedRole = watch("role");

  const onSubmit = async (data) => {
    try {
      const userData = await registerUser(data);
      if (userData.role === "FACULTY") {
        navigate("/dashboard");
      } else {
        navigate("/");
      }
    } catch (err) {
      // Error is handled in store
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center p-4 bg-gray-50">

      <div className="w-full max-w-md space-y-8 rounded-xl border border-gray-100 bg-white p-8 shadow-xl animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="text-center">
          <h2 className="text-3xl font-bold font-heading tracking-tight text-gray-900">
            Create Account
          </h2>
          <p className="mt-2 text-sm text-gray-500">
            Join Gdecfest to handle your events
          </p>
        </div>

        {error && (
          <div className="p-3 rounded-md bg-destructive/10 border border-destructive/20 text-sm text-destructive text-center flex items-center justify-center gap-2">
            <AlertCircle className="h-4 w-4" />
            {error}
          </div>
        )}

        <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-700">
                Full Name
              </label>
              <div className="relative mt-1">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <User
                    className={cn(
                      "h-5 w-5",
                      errors.name ? "text-destructive" : "text-gray-400",
                    )}
                  />
                </div>
                <input
                  type="text"
                  placeholder="John Doe"
                  className={cn(
                    "block w-full rounded-md border bg-white pl-10 pr-3 py-2 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-1 transition-colors sm:text-sm shadow-sm",
                    errors.name
                      ? "border-destructive focus:border-destructive focus:ring-destructive"
                      : "border-gray-300 focus:border-primary focus:ring-primary",
                  )}
                  {...register("name")}
                />
              </div>
              {errors.name && (
                <p className="mt-1 text-xs text-destructive flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" />
                  {errors.name.message}
                </p>
              )}
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700">
                Email Address
              </label>
              <div className="relative mt-1">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <Mail
                    className={cn(
                      "h-5 w-5",
                      errors.email ? "text-destructive" : "text-gray-400",
                    )}
                  />
                </div>
                <input
                  type="email"
                  placeholder="you@example.com"
                  className={cn(
                    "block w-full rounded-md border bg-white pl-10 pr-3 py-2 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-1 transition-colors sm:text-sm shadow-sm",
                    errors.email
                      ? "border-destructive focus:border-destructive focus:ring-destructive"
                      : "border-gray-300 focus:border-primary focus:ring-primary",
                  )}
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
              <label className="text-sm font-medium text-gray-700">
                Phone Number
              </label>
              <div className="relative mt-1">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <Phone
                    className={cn(
                      "h-5 w-5",
                      errors.phone ? "text-destructive" : "text-gray-400",
                    )}
                  />
                </div>
                <input
                  type="tel"
                  placeholder="1234567890"
                  className={cn(
                    "block w-full rounded-md border bg-white pl-10 pr-3 py-2 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-1 transition-colors sm:text-sm shadow-sm",
                    errors.phone
                      ? "border-destructive focus:border-destructive focus:ring-destructive"
                      : "border-gray-300 focus:border-primary focus:ring-primary",
                  )}
                  {...register("phone")}
                />
              </div>
              {errors.phone && (
                <p className="mt-1 text-xs text-destructive flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" />
                  {errors.phone.message}
                </p>
              )}
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700">Role</label>
              <div className="relative mt-1">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <GraduationCap
                    className={cn(
                      "h-5 w-5",
                      errors.role ? "text-destructive" : "text-gray-400",
                    )}
                  />
                </div>
                <select
                  className={cn(
                    "block w-full rounded-md border bg-white pl-10 pr-3 py-2 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-1 transition-colors sm:text-sm appearance-none shadow-sm",
                    errors.role
                      ? "border-destructive focus:border-destructive focus:ring-destructive"
                      : "border-gray-300 focus:border-primary focus:ring-primary",
                  )}
                  {...register("role")}
                >
                  <option
                    value="STUDENT"
                    className="bg-white text-gray-900"
                  >
                    Student
                  </option>
                  <option
                    value="FACULTY"
                    className="bg-white text-gray-900"
                  >
                    Faculty Coordinator
                  </option>
                </select>
              </div>
              {errors.role && (
                <p className="mt-1 text-xs text-destructive flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" />
                  {errors.role.message}
                </p>
              )}
            </div>

            {selectedRole === "STUDENT" && (
              <div className="animate-in fade-in slide-in-from-top-2 duration-300">
                <label className="text-sm font-medium text-gray-700">
                  Roll Number
                </label>
                <div className="relative mt-1">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                    <FileDigit
                      className={cn(
                        "h-5 w-5",
                        errors.rollNumber
                          ? "text-destructive"
                          : "text-gray-400",
                      )}
                    />
                  </div>
                  <input
                    type="text"
                    placeholder="e.g. 2023CS101"
                    className={cn(
                      "block w-full rounded-md border bg-white pl-10 pr-3 py-2 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-1 transition-colors sm:text-sm shadow-sm",
                      errors.rollNumber
                        ? "border-destructive focus:border-destructive focus:ring-destructive"
                        : "border-gray-300 focus:border-primary focus:ring-primary",
                    )}
                    {...register("rollNumber")}
                  />
                </div>
                {errors.rollNumber && (
                  <p className="mt-1 text-xs text-destructive flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" />
                    {errors.rollNumber.message}
                  </p>
                )}
              </div>
            )}

            <div>
              <label className="text-sm font-medium text-gray-700">
                Password
              </label>
              <div className="relative mt-1">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <Lock
                    className={cn(
                      "h-5 w-5",
                      errors.password ? "text-destructive" : "text-gray-400",
                    )}
                  />
                </div>
                <input
                  type="password"
                  placeholder="••••••••"
                  className={cn(
                    "block w-full rounded-md border bg-white pl-10 pr-3 py-2 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-1 transition-colors sm:text-sm shadow-sm",
                    errors.password
                      ? "border-destructive focus:border-destructive focus:ring-destructive"
                      : "border-gray-300 focus:border-primary focus:ring-primary",
                  )}
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
                  Creating account...
                </>
              ) : (
                "Sign up"
              )}
            </Button>
          </div>
        </form>

        <div className="text-center">
          <p className="text-sm text-gray-500">
            Already have an account?{" "}
            <Link
              to="/login"
              className="font-medium text-primary hover:text-primary/80 transition-colors"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
