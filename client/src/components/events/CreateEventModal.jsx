import { useForm } from "react-hook-form";
import { X, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import api from "@/lib/api";
import { useState } from "react";

export default function CreateEventModal({ isOpen, onClose, onEventCreated }) {
  const [isLoading, setIsLoading] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      await api.post("/events", data);
      reset();
      onEventCreated(); // Call the callback to refresh list
      onClose();
    } catch (error) {
      console.error("Failed to create event", error);
      // Could add toast error here
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="relative w-full max-w-lg overflow-hidden rounded-xl border border-white/10 bg-background/95 p-6 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold font-heading text-white">
            Create New Event
          </h2>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="h-8 w-8 text-gray-400 hover:text-white"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-300">
              Event Name
            </label>
            <input
              className="mt-1 block w-full rounded-md border border-white/10 bg-secondary/50 px-3 py-2 text-sm text-white focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              {...register("name", { required: "Event name is required" })}
            />
            {errors.name && (
              <p className="mt-1 text-xs text-destructive">
                {errors.name.message}
              </p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-300">Date</label>
              <input
                type="datetime-local"
                className="mt-1 block w-full rounded-md border border-white/10 bg-secondary/50 px-3 py-2 text-sm text-white focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                {...register("date", { required: "Date is required" })}
              />
              {errors.date && (
                <p className="mt-1 text-xs text-destructive">
                  {errors.date.message}
                </p>
              )}
            </div>
            <div>
              <label className="text-sm font-medium text-gray-300">
                Fees (₹)
              </label>
              <input
                type="number"
                min="0"
                className="mt-1 block w-full rounded-md border border-white/10 bg-secondary/50 px-3 py-2 text-sm text-white focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                {...register("fees", { required: "Fees is required", min: 0 })}
              />
              {errors.fees && (
                <p className="mt-1 text-xs text-destructive">
                  {errors.fees.message}
                </p>
              )}
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-300">
              Category
            </label>
            <select
              className="mt-1 block w-full rounded-md border border-white/10 bg-secondary/50 px-3 py-2 text-sm text-white focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              {...register("category", { required: "Category is required" })}
            >
              <option value="TECH" className="bg-background">
                Technical
              </option>
              <option value="CULTURAL" className="bg-background">
                Cultural
              </option>
              <option value="SPORTS" className="bg-background">
                Sports
              </option>
            </select>
            {errors.category && (
              <p className="mt-1 text-xs text-destructive">
                {errors.category.message}
              </p>
            )}
          </div>

          <div>
            <label className="text-sm font-medium text-gray-300">
              Venue / Location
            </label>
            <input
              className="mt-1 block w-full rounded-md border border-white/10 bg-secondary/50 px-3 py-2 text-sm text-white focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              {...register("location", { required: "Location is required" })}
            />
            {errors.location && (
              <p className="mt-1 text-xs text-destructive">
                {errors.location.message}
              </p>
            )}
          </div>

          <div>
            <label className="text-sm font-medium text-gray-300">
              Description
            </label>
            <textarea
              rows="3"
              className="mt-1 block w-full rounded-md border border-white/10 bg-secondary/50 px-3 py-2 text-sm text-white focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              {...register("description")}
            />
          </div>

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
                  Creating...
                </>
              ) : (
                "Create Event"
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
