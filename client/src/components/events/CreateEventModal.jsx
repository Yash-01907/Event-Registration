import { useForm } from "react-hook-form";
import { X, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import api from "@/lib/api";
import { useState } from "react";

export default function CreateEventModal({ isOpen, onClose, onEventCreated }) {
  const [isLoading, setIsLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(null);
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      await api.post("/events", data);
      reset();
      setPreviewUrl(null);
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
          <h2 className="text-xl font-bold font-heading text-gray-900">
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
            <label className="text-sm font-medium text-gray-900">
              Event Name
            </label>
            <input
              className="mt-1 block w-full rounded-md border border-white/10 bg-secondary/50 px-3 py-2 text-sm text-gray-900 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
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
              <label className="text-sm font-medium text-gray-900">Date</label>
              <input
                type="datetime-local"
                className="mt-1 block w-full rounded-md border border-white/10 bg-secondary/50 px-3 py-2 text-sm text-gray-900 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                {...register("date", { required: "Date is required" })}
              />
              {errors.date && (
                <p className="mt-1 text-xs text-destructive">
                  {errors.date.message}
                </p>
              )}
            </div>
            <div>
              <label className="text-sm font-medium text-gray-900">
                Fees (₹)
              </label>
              <input
                type="number"
                min="0"
                className="mt-1 block w-full rounded-md border border-white/10 bg-secondary/50 px-3 py-2 text-sm text-gray-900 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
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
            <label className="text-sm font-medium text-gray-900">
              Category
            </label>
            <select
              className="mt-1 block w-full rounded-md border border-white/10 bg-secondary/50 px-3 py-2 text-sm text-gray-900 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
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
            <label className="text-sm font-medium text-gray-900">
              Venue / Location
            </label>
            <input
              className="mt-1 block w-full rounded-md border border-white/10 bg-secondary/50 px-3 py-2 text-sm text-gray-900 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              {...register("location", { required: "Location is required" })}
            />
            {errors.location && (
              <p className="mt-1 text-xs text-destructive">
                {errors.location.message}
              </p>
            )}
          </div>

          <div>
            <textarea
              rows="3"
              placeholder="Event Description (optional)"
              className="mt-1 block w-full rounded-md border border-white/10 bg-secondary/50 px-3 py-2 text-sm text-gray-900 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary placeholder:text-gray-500"
              {...register("description")}
            />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-900 block mb-2">
              Event Poster
            </label>

            <div className="flex items-start gap-4">
              {previewUrl ? (
                <div className="relative h-20 w-20 rounded-md overflow-hidden border border-white/20 group">
                  <img
                    src={previewUrl}
                    alt="Preview"
                    className="h-full w-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      type="button"
                      onClick={() => {
                        setPreviewUrl(null);
                        setValue("posterUrl", "");
                      }}
                      className="text-white hover:text-red-400"
                    >
                      <X className="h-6 w-6" />
                    </button>
                  </div>
                </div>
              ) : (
                <div className="h-20 w-20 rounded-md border border-dashed border-white/20 bg-secondary/30 flex items-center justify-center text-gray-500">
                  <span className="text-xs">No Image</span>
                </div>
              )}

              <div className="flex-1">
                <input
                  type="file"
                  accept="image/*"
                  disabled={uploading}
                  className="block w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-primary-foreground hover:file:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
                  onChange={async (e) => {
                    const file = e.target.files?.[0];
                    if (!file) return;

                    setUploading(true);
                    const formData = new FormData();
                    formData.append("file", file);

                    try {
                      const res = await api.post("/upload", formData, {
                        headers: { "Content-Type": "multipart/form-data" },
                      });
                      if (res.data.url) {
                        setValue("posterUrl", res.data.url);
                        setPreviewUrl(res.data.url);
                      }
                    } catch (error) {
                      console.error("Upload failed", error);
                      // In a real app, I'd show a toast here
                    } finally {
                      setUploading(false);
                    }
                  }}
                />
                <p className="text-xs text-gray-500 mt-1">
                  {uploading
                    ? "Uploading..."
                    : "Upload a poster image (JPG, PNG)"}
                </p>
                {/* Hidden input to store URL */}
                <input type="hidden" {...register("posterUrl")} />
              </div>
            </div>
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
