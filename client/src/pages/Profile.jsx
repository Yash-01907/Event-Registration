import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import useAuthStore from "@/store/authStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { User, Lock, Mail, Phone, Hash, BookOpen } from "lucide-react";

export default function Profile() {
  const { user, updateProfile, changePassword } = useAuthStore();

  // Profile Update Form
  const {
    register: registerProfile,
    handleSubmit: handleSubmitProfile,
    reset: resetProfile,
    formState: { errors: profileErrors, isSubmitting: isProfileSubmitting },
  } = useForm({
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      rollNumber: "",
      branch: "",
    },
  });

  // Password Change Form
  const {
    register: registerPassword,
    handleSubmit: handleSubmitPassword,
    reset: resetPassword,
    formState: { errors: passwordErrors, isSubmitting: isPasswordSubmitting },
  } = useForm();

  // Initialize profile form with user data
  useEffect(() => {
    if (user) {
      resetProfile({
        name: user.name || "",
        email: user.email || "",
        phone: user.phone || "",
        rollNumber: user.rollNumber || "",
        branch: user.branch || "",
      });
    }
  }, [user, resetProfile]);

  const onProfileSubmit = async (data) => {
    try {
      await updateProfile(data);
      toast.success("Profile updated successfully");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update profile");
    }
  };

  const onPasswordSubmit = async (data) => {
    if (data.newPassword !== data.confirmPassword) {
      toast.error("New passwords do not match");
      return;
    }
    try {
      await changePassword({
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
      });
      toast.success("Password changed successfully");
      resetPassword();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to change password");
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-3xl font-bold mb-8 text-foreground">
        Account Settings
      </h1>

      <div className="grid gap-8 md:grid-cols-2">
        {/* Profile Details Section */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Profile Information
              </CardTitle>
              <CardDescription>
                Update your personal details here.
              </CardDescription>
            </CardHeader>
            <form onSubmit={handleSubmitProfile(onProfileSubmit)}>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="name"
                      placeholder="John Doe"
                      className="pl-9"
                      {...registerProfile("name", {
                        required: "Name is required",
                      })}
                    />
                  </div>
                  {profileErrors.name && (
                    <p className="text-sm text-red-500">
                      {profileErrors.name.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="john@example.com"
                      className="pl-9"
                      {...registerProfile("email", {
                        required: "Email is required",
                        pattern: {
                          value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                          message: "Invalid email address",
                        },
                      })}
                    />
                  </div>
                  {profileErrors.email && (
                    <p className="text-sm text-red-500">
                      {profileErrors.email.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="phone"
                      placeholder="1234567890"
                      className="pl-9"
                      {...registerProfile("phone", {
                        minLength: {
                          value: 10,
                          message: "Must be at least 10 digits",
                        },
                      })}
                    />
                  </div>
                  {profileErrors.phone && (
                    <p className="text-sm text-red-500">
                      {profileErrors.phone.message}
                    </p>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="rollNumber">Roll Number</Label>
                    <div className="relative">
                      <Hash className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="rollNumber"
                        placeholder="123"
                        className="pl-9"
                        {...registerProfile("rollNumber")}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="branch">Branch</Label>
                    <div className="relative">
                      <BookOpen className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="branch"
                        placeholder="CSE"
                        className="pl-9"
                        {...registerProfile("branch")}
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button type="submit" disabled={isProfileSubmitting}>
                  {isProfileSubmitting ? "Saving..." : "Save Changes"}
                </Button>
              </CardFooter>
            </form>
          </Card>
        </div>

        {/* Security Section */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lock className="h-5 w-5" />
                Security
              </CardTitle>
              <CardDescription>
                Change your password to keep your account secure.
              </CardDescription>
            </CardHeader>
            <form onSubmit={handleSubmitPassword(onPasswordSubmit)}>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="currentPassword">Current Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="currentPassword"
                      type="password"
                      placeholder="••••••••"
                      className="pl-9"
                      {...registerPassword("currentPassword", {
                        required: "Current password is required",
                      })}
                    />
                  </div>
                  {passwordErrors.currentPassword && (
                    <p className="text-sm text-red-500">
                      {passwordErrors.currentPassword.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="newPassword">New Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="newPassword"
                      type="password"
                      placeholder="••••••••"
                      className="pl-9"
                      {...registerPassword("newPassword", {
                        required: "New password is required",
                        minLength: {
                          value: 6,
                          message: "Must be at least 6 characters",
                        },
                      })}
                    />
                  </div>
                  {passwordErrors.newPassword && (
                    <p className="text-sm text-red-500">
                      {passwordErrors.newPassword.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm New Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="confirmPassword"
                      type="password"
                      placeholder="••••••••"
                      className="pl-9"
                      {...registerPassword("confirmPassword", {
                        required: "Please confirm your new password",
                        validate: (val, formValues) => {
                          return (
                            val === formValues.newPassword ||
                            "Passwords do not match"
                          );
                        },
                      })}
                    />
                  </div>
                  {passwordErrors.confirmPassword && (
                    <p className="text-sm text-red-500">
                      {passwordErrors.confirmPassword.message}
                    </p>
                  )}
                </div>
              </CardContent>
              <CardFooter>
                <Button
                  type="submit"
                  variant="destructive"
                  disabled={isPasswordSubmitting}
                >
                  {isPasswordSubmitting ? "Changing..." : "Change Password"}
                </Button>
              </CardFooter>
            </form>
          </Card>
        </div>
      </div>
    </div>
  );
}
