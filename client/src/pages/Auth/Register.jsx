import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import useAuthStore from "@/store/authStore";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { Cpu, Loader2, Eye, EyeOff } from "lucide-react";

// Define schema locally to incorporate specific constraints
const registerSchema = z
  .object({
    name: z.string().min(2, { message: "Name must be at least 2 characters" }),
    email: z.string().email({ message: "Invalid email address" }),
    password: z
      .string()
      .min(6, { message: "Password must be at least 6 characters" }),
    confirmPassword: z.string(),
    phone: z
      .string()
      .min(10, { message: "Phone number must be at least 10 digits" }),
    role: z.enum(["STUDENT", "FACULTY"], { message: "Please select a role" }),
    rollNumber: z.string().optional(),
    branch: z
      .enum(["Automobile", "Computer", "Mechanical", "Electrical", "Civil", ""], {
        message: "Please select a valid branch",
      })
      .optional()
      .transform((val) => (val === "" ? undefined : val)),
    semester: z.string().optional(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  })
  .refine(
    (data) => {
      if (data.role === "STUDENT") {
        if (!data.rollNumber) return false;
        if (!data.branch) return false;
        if (!data.semester) return false;
      }
      return true;
    },
    {
      message: "Roll Number, Branch, and Semester are required for Students",
      path: ["rollNumber"],
    }
  );

export default function Register() {
  const navigate = useNavigate();
  const { register: registerUser, isLoading } = useAuthStore();
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      role: "STUDENT",
      rollNumber: "",
      branch: "",
      semester: "",
      phone: "",
    },
  });

  const role = watch("role");
  const branch = watch("branch");
  const semester = watch("semester");

  const onSubmit = async (data) => {
    const { confirmPassword, ...userData } = data;

    try {
      const result = await registerUser(userData);
      if (result) {
        toast.success("Account created successfully!");
        if (result.role === "FACULTY") {
          navigate("/dashboard");
        } else {
          navigate("/");
        }
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="w-full min-h-screen flex items-center justify-center pt-20 pb-8 px-4 gradient-mesh relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute top-20 left-20 w-72 h-72 bg-purple-500/10 rounded-full blur-[100px]" />
      <div className="absolute bottom-20 right-20 w-96 h-96 bg-cyan-500/10 rounded-full blur-[120px]" />
      <div className="absolute inset-0 grid-pattern opacity-30" />

      <div className="w-full max-w-md glass-card rounded-2xl p-8 relative z-10 border-glow">
        {/* Header */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-3 mb-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-500 to-purple-600 glow-cyan">
              <Cpu className="h-6 w-6 text-white" />
            </div>
          </Link>
          <h2 className="text-2xl font-bold tracking-wide text-white font-heading">
            Create an account
          </h2>
          <p className="mt-2 text-sm text-gray-500 font-mono">
            Join TechFest 2026 to discover events
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {/* Name */}
          <div className="space-y-2">
            <Label htmlFor="name" className="text-gray-400 text-sm">
              Full Name
            </Label>
            <Input
              id="name"
              placeholder="John Doe"
              {...register("name")}
              className="bg-white/5 border-gray-800 text-white placeholder:text-gray-600 focus:border-cyan-500/50 rounded-xl"
            />
            {errors.name && (
              <p className="text-xs text-red-400 font-mono">
                {errors.name.message}
              </p>
            )}
          </div>

          {/* Email */}
          <div className="space-y-2">
            <Label htmlFor="email" className="text-gray-400 text-sm">
              Email
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="you@gdec.edu"
              {...register("email")}
              className="bg-white/5 border-gray-800 text-white placeholder:text-gray-600 focus:border-cyan-500/50 rounded-xl"
            />
            {errors.email && (
              <p className="text-xs text-red-400 font-mono">
                {errors.email.message}
              </p>
            )}
          </div>

          {/* Phone */}
          <div className="space-y-2">
            <Label htmlFor="phone" className="text-gray-400 text-sm">
              Phone
            </Label>
            <Input
              id="phone"
              type="tel"
              placeholder="+91 98765 43210"
              {...register("phone")}
              className="bg-white/5 border-gray-800 text-white placeholder:text-gray-600 focus:border-cyan-500/50 rounded-xl"
            />
            {errors.phone && (
              <p className="text-xs text-red-400 font-mono">
                {errors.phone.message}
              </p>
            )}
          </div>

          {/* Role */}
          <div className="space-y-2">
            <Label htmlFor="role" className="text-gray-400 text-sm">
              I am a
            </Label>
            <Select value={role} onValueChange={(value) => setValue("role", value)}>
              <SelectTrigger className="bg-white/5 border-gray-800 text-white focus:border-cyan-500/50 rounded-xl">
                <SelectValue placeholder="Select your role" />
              </SelectTrigger>
              <SelectContent className="bg-gray-900 border-gray-800">
                <SelectItem value="STUDENT" className="text-white hover:bg-cyan-500/20">
                  Student
                </SelectItem>
                <SelectItem value="FACULTY" className="text-white hover:bg-purple-500/20">
                  Faculty
                </SelectItem>
              </SelectContent>
            </Select>
            {errors.role && (
              <p className="text-xs text-red-400 font-mono">
                {errors.role.message}
              </p>
            )}
          </div>

          {/* Student-specific fields */}
          {role === "STUDENT" && (
            <div className="space-y-4 p-4 rounded-xl bg-cyan-500/5 border border-cyan-500/20">
              <div className="space-y-2">
                <Label htmlFor="rollNumber" className="text-gray-400 text-sm">
                  Roll Number
                </Label>
                <Input
                  id="rollNumber"
                  placeholder="CS2024001"
                  {...register("rollNumber")}
                  className="bg-white/5 border-gray-800 text-white placeholder:text-gray-600 focus:border-cyan-500/50 rounded-xl"
                />
                {errors.rollNumber && (
                  <p className="text-xs text-red-400 font-mono">
                    {errors.rollNumber.message}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="branch" className="text-gray-400 text-sm">
                    Branch
                  </Label>
                  <Select
                    value={branch}
                    onValueChange={(value) => setValue("branch", value)}
                  >
                    <SelectTrigger className="bg-white/5 border-gray-800 text-white focus:border-cyan-500/50 rounded-xl">
                      <SelectValue placeholder="Branch" />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-900 border-gray-800">
                      <SelectItem value="Automobile" className="text-white">
                        Automobile
                      </SelectItem>
                      <SelectItem value="Computer" className="text-white">
                        Computer
                      </SelectItem>
                      <SelectItem value="Mechanical" className="text-white">
                        Mechanical
                      </SelectItem>
                      <SelectItem value="Electrical" className="text-white">
                        Electrical
                      </SelectItem>
                      <SelectItem value="Civil" className="text-white">
                        Civil
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.branch && (
                    <p className="text-xs text-red-400 font-mono">
                      {errors.branch.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="semester" className="text-gray-400 text-sm">
                    Semester
                  </Label>
                  <Select
                    value={semester}
                    onValueChange={(value) => setValue("semester", value)}
                  >
                    <SelectTrigger className="bg-white/5 border-gray-800 text-white focus:border-cyan-500/50 rounded-xl">
                      <SelectValue placeholder="Sem" />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-900 border-gray-800">
                      {[1, 2, 3, 4, 5, 6, 7, 8].map((sem) => (
                        <SelectItem key={sem} value={sem.toString()} className="text-white">
                          {sem}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.semester && (
                    <p className="text-xs text-red-400 font-mono">
                      {errors.semester.message}
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Password */}
          <div className="space-y-2">
            <Label htmlFor="password" className="text-gray-400 text-sm">
              Password
            </Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                {...register("password")}
                className="bg-white/5 border-gray-800 text-white placeholder:text-gray-600 focus:border-cyan-500/50 rounded-xl pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-cyan-400 transition-colors"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            {errors.password && (
              <p className="text-xs text-red-400 font-mono">
                {errors.password.message}
              </p>
            )}
          </div>

          {/* Confirm Password */}
          <div className="space-y-2">
            <Label htmlFor="confirmPassword" className="text-gray-400 text-sm">
              Confirm Password
            </Label>
            <Input
              id="confirmPassword"
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              {...register("confirmPassword")}
              className="bg-white/5 border-gray-800 text-white placeholder:text-gray-600 focus:border-cyan-500/50 rounded-xl"
            />
            {errors.confirmPassword && (
              <p className="text-xs text-red-400 font-mono">
                {errors.confirmPassword.message}
              </p>
            )}
          </div>

          {/* Submit */}
          <Button
            type="submit"
            className="w-full bg-gradient-to-r from-cyan-500 to-purple-600 text-white font-bold py-3 rounded-xl btn-glow hover:from-cyan-400 hover:to-purple-500"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating account...
              </>
            ) : (
              "Create account"
            )}
          </Button>

          <p className="text-center text-sm text-gray-500 pt-2">
            Already have an account?{" "}
            <Link
              to="/login"
              className="font-semibold text-cyan-400 hover:text-cyan-300 transition-colors"
            >
              Sign in
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
