import { useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { X, Loader2, Plus, Trash } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import api from "@/lib/api";

export default function EventRegistrationModal({
  isOpen,
  onClose,
  event,
  onRegistrationSuccess,
}) {
  const [isLoading, setIsLoading] = useState(false);
  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      teamMembers: [{ name: "" }], // Start with one empty slot if needed, or empty
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "teamMembers",
  });

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      // Prepare payload
      const payload = {
        eventId: event.id,
        teamName: data.teamName,
        teamMembers: data.teamMembers?.map((m) => m.name).filter(Boolean), // Extract names
        formData: data.formData,
      };

      await api.post("/registrations", payload);
      toast.success("Successfully registered!");
      onRegistrationSuccess();
      onClose();
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Registration failed");
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="relative w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-xl border border-white/10 bg-background/95 p-6 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold font-heading text-foreground">
            Register for {event.name}
          </h2>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="h-8 w-8 text-muted-foreground hover:text-foreground"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Team Registration Section */}
          {event.isTeamEvent && (
            <div className="space-y-4 border-b border-border pb-6">
              <h3 className="font-semibold text-foreground">Team Details</h3>
              <p className="text-xs text-muted-foreground">
                Team Size: {event.minTeamSize} - {event.maxTeamSize} members
                (including you)
              </p>

              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">
                  Team Name <span className="text-destructive">*</span>
                </label>
                <input
                  className="block w-full rounded-md border border-input bg-secondary/50 px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                  {...register("teamName", {
                    required: "Team name is required",
                  })}
                />
                {errors.teamName && (
                  <p className="text-xs text-destructive">
                    {errors.teamName.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground block">
                  Team Members
                </label>
                <div className="space-y-2">
                  {fields.map((field, index) => (
                    <div key={field.id} className="flex gap-2">
                      <input
                        placeholder={`Member ${index + 1} Name/Email`}
                        className="block w-full rounded-md border border-input bg-secondary/50 px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                        {...register(`teamMembers.${index}.name`, {
                          required: "Member name is required",
                        })}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => remove(index)}
                        className="text-muted-foreground hover:text-destructive"
                      >
                        <Trash className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
                {/* Logic to limit adding based on maxTeamSize */}
                {/* Note: User is implicitly a member, so fields.length should be < maxTeamSize - 1 ideally if "members" are "other members" */}
                {/* If we treat "teamMembers" as "other members", then fields.length < event.maxTeamSize - 1 */}
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => append({ name: "" })}
                  disabled={fields.length >= event.maxTeamSize - 1}
                  className="w-full mt-2"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Team Member
                </Button>
                {errors.teamMembers && (
                  <p className="text-xs text-destructive">
                    {errors.teamMembers.message || "Please check team members"}
                  </p>
                )}
                {/* Explicit validation on submit could catch min size */}
              </div>
            </div>
          )}

          {/* Custom Questions Section */}
          {event.formConfig && event.formConfig.length > 0 && (
            <div className="space-y-4">
              <h3 className="font-semibold text-foreground">
                Additional Questions
              </h3>
              {event.formConfig.map((field, index) => (
                <div key={index} className="space-y-2">
                  <label className="text-sm font-medium text-foreground">
                    {field.label}{" "}
                    {field.required && (
                      <span className="text-destructive">*</span>
                    )}
                  </label>
                  <input
                    className="block w-full rounded-md border border-input bg-secondary/50 px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                    {...register(`formData.${field.label}`, {
                      required: field.required
                        ? "This field is required"
                        : false,
                    })}
                  />
                  {errors.formData?.[field.label] && (
                    <p className="text-xs text-destructive">
                      {errors.formData[field.label].message}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}

          {!event.isTeamEvent &&
            (!event.formConfig || event.formConfig.length === 0) && (
              <p className="text-center text-muted-foreground">
                Are you sure you want to register for this event?
              </p>
            )}

          <div className="flex justify-end gap-3 pt-2">
            <Button
              type="button"
              variant="ghost"
              onClick={onClose}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Registering...
                </>
              ) : (
                "Confirm Registration"
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
