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
} from "lucide-react";
import { Button } from "@/components/ui/button";
import useAuthStore from "@/store/authStore";

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
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center p-4">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/20 via-background to-background"></div>

      <div className="w-full max-w-md space-y-8 rounded-xl border border-white/10 bg-background/60 p-8 shadow-2xl backdrop-blur-xl animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="text-center">
          <h2 className="text-3xl font-bold font-heading tracking-tight text-white">
            Create Account
          </h2>
          <p className="mt-2 text-sm text-gray-400">
            Join UniFest to handle your events
          </p>
        </div>

        {error && (
          <div className="p-3 rounded-md bg-destructive/10 border border-destructive/20 text-sm text-destructive text-center">
            {error}
          </div>
        )}

        <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-300">
                Full Name
              </label>
              <div className="relative mt-1">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <User className="h-5 w-5 text-gray-500" />
                </div>
                <input
                  type="text"
                  placeholder="John Doe"
                  className="block w-full rounded-md border border-white/10 bg-secondary/50 pl-10 pr-3 py-2 text-white placeholder:text-gray-500 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary sm:text-sm transition-colors"
                  {...register("name")}
                />
              </div>
              {errors.name && (
                <p className="mt-1 text-xs text-destructive">
                  {errors.name.message}
                </p>
              )}
            </div>

            <div>
              <label className="text-sm font-medium text-gray-300">
                Email Address
              </label>
              <div className="relative mt-1">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <Mail className="h-5 w-5 text-gray-500" />
                </div>
                <input
                  type="email"
                  placeholder="you@example.com"
                  className="block w-full rounded-md border border-white/10 bg-secondary/50 pl-10 pr-3 py-2 text-white placeholder:text-gray-500 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary sm:text-sm transition-colors"
                  {...register("email")}
                />
              </div>
              {errors.email && (
                <p className="mt-1 text-xs text-destructive">
                  {errors.email.message}
                </p>
              )}
            </div>

            <div>
              <label className="text-sm font-medium text-gray-300">
                Phone Number
              </label>
              <div className="relative mt-1">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <Phone className="h-5 w-5 text-gray-500" />
                </div>
                <input
                  type="tel"
                  placeholder="1234567890"
                  className="block w-full rounded-md border border-white/10 bg-secondary/50 pl-10 pr-3 py-2 text-white placeholder:text-gray-500 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary sm:text-sm transition-colors"
                  {...register("phone")}
                />
              </div>
              {errors.phone && (
                <p className="mt-1 text-xs text-destructive">
                  {errors.phone.message}
                </p>
              )}
            </div>

            <div>
              <label className="text-sm font-medium text-gray-300">Role</label>
              <div className="relative mt-1">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <GraduationCap className="h-5 w-5 text-gray-500" />
                </div>
                <select
                  className="block w-full rounded-md border border-white/10 bg-secondary/50 pl-10 pr-3 py-2 text-white placeholder:text-gray-500 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary sm:text-sm transition-colors appearance-none"
                  {...register("role")}
                >
                  <option
                    value="STUDENT"
                    className="bg-background text-foreground"
                  >
                    Student
                  </option>
                  <option
                    value="FACULTY"
                    className="bg-background text-foreground"
                  >
                    Faculty Coordinator
                  </option>
                </select>
              </div>
              {errors.role && (
                <p className="mt-1 text-xs text-destructive">
                  {errors.role.message}
                </p>
              )}
            </div>

            {selectedRole === "STUDENT" && (
              <div className="animate-in fade-in slide-in-from-top-2 duration-300">
                <label className="text-sm font-medium text-gray-300">
                  Roll Number
                </label>
                <div className="relative mt-1">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                    <FileDigit className="h-5 w-5 text-gray-500" />
                  </div>
                  <input
                    type="text"
                    placeholder="e.g. 2023CS101"
                    className="block w-full rounded-md border border-white/10 bg-secondary/50 pl-10 pr-3 py-2 text-white placeholder:text-gray-500 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary sm:text-sm transition-colors"
                    {...register("rollNumber")}
                  />
                </div>
                {errors.rollNumber && (
                  <p className="mt-1 text-xs text-destructive">
                    {errors.rollNumber.message}
                  </p>
                )}
              </div>
            )}

            <div>
              <label className="text-sm font-medium text-gray-300">
                Password
              </label>
              <div className="relative mt-1">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <Lock className="h-5 w-5 text-gray-500" />
                </div>
                <input
                  type="password"
                  placeholder="••••••••"
                  className="block w-full rounded-md border border-white/10 bg-secondary/50 pl-10 pr-3 py-2 text-white placeholder:text-gray-500 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary sm:text-sm transition-colors"
                  {...register("password")}
                />
              </div>
              {errors.password && (
                <p className="mt-1 text-xs text-destructive">
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
          <p className="text-sm text-gray-400">
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
