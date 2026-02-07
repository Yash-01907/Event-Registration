import { useForm } from "react-hook-form";
import useAuthStore from "@/store/authStore";
import { X, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import api from "@/lib/api";
import { useState } from "react";

export default function CreateEventModal({ isOpen, onClose, onEventCreated }) {
  const [isLoading, setIsLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(null);
  const { user } = useAuthStore();
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm();

  const isTeamEvent = watch("isTeamEvent");

  console.log("Current User in Modal:", user);

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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className="relative w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-xl border border-cyan-500/20 bg-gray-950 p-6 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold font-heading text-white">
            Create New<span className="text-cyan-400">Event</span>
          </h2>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="h-8 w-8 text-gray-400 hover:text-white hover:bg-white/10"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-400">
              Event Name
            </label>
            <input
              className="mt-1 block w-full rounded-lg border border-gray-700 bg-gray-900 px-3 py-2.5 text-sm text-white placeholder:text-gray-500 focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500"
              placeholder="Enter event name"
              {...register("name", { required: "Event name is required" })}
            />
            {errors.name && (
              <p className="mt-1 text-xs text-red-400">{errors.name.message}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-400">Date</label>
              <input
                type="datetime-local"
                className="mt-1 block w-full rounded-lg border border-gray-700 bg-gray-900 px-3 py-2.5 text-sm text-white focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500 [color-scheme:dark]"
                {...register("date", {
                  required: user?.role === "ADMIN" ? false : "Date is required",
                })}
              />
              {errors.date && (
                <p className="mt-1 text-xs text-red-400">
                  {errors.date.message}
                </p>
              )}
            </div>
            <div>
              <label className="text-sm font-medium text-gray-400">
                Fees (₹)
              </label>
              <input
                type="number"
                min="0"
                placeholder="0"
                className="mt-1 block w-full rounded-lg border border-gray-700 bg-gray-900 px-3 py-2.5 text-sm text-white placeholder:text-gray-500 focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500"
                {...register("fees", {
                  required: user?.role === "ADMIN" ? false : "Fees is required",
                  min: 0,
                })}
              />
              {errors.fees && (
                <p className="mt-1 text-xs text-red-400">
                  {errors.fees.message}
                </p>
              )}
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-400">
              Category
            </label>
            <select
              className="mt-1 block w-full rounded-lg border border-gray-700 bg-gray-900 px-3 py-2.5 text-sm text-white focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500"
              {...register("category", {
                required:
                  user?.role === "ADMIN" ? false : "Category is required",
              })}
            >
              <option value="TECH" className="bg-gray-900">
                Technical
              </option>
              <option value="CULTURAL" className="bg-gray-900">
                Cultural
              </option>
              <option value="SPORTS" className="bg-gray-900">
                Sports
              </option>
            </select>
            {errors.category && (
              <p className="mt-1 text-xs text-red-400">
                {errors.category.message}
              </p>
            )}
          </div>

          <div>
            <label className="text-sm font-medium text-gray-400">
              Venue / Location
            </label>
            <input
              placeholder="Enter venue"
              className="mt-1 block w-full rounded-lg border border-gray-700 bg-gray-900 px-3 py-2.5 text-sm text-white placeholder:text-gray-500 focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500"
              {...register("location", {
                required:
                  user?.role === "ADMIN" ? false : "Location is required",
              })}
            />
            {errors.location && (
              <p className="mt-1 text-xs text-red-400">
                {errors.location.message}
              </p>
            )}
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="isTeamEvent"
              className="h-4 w-4 rounded border-gray-600 bg-gray-900 text-cyan-500 focus:ring-cyan-500 focus:ring-offset-gray-900"
              {...register("isTeamEvent")}
            />
            <label
              htmlFor="isTeamEvent"
              className="text-sm font-medium text-gray-300"
            >
              This is a Team Event
            </label>
          </div>

          {isTeamEvent && (
            <div className="grid grid-cols-2 gap-4 animate-in fade-in slide-in-from-top-2">
              <div>
                <label className="text-sm font-medium text-gray-400">
                  Min Team Size
                </label>
                <input
                  type="number"
                  min="1"
                  placeholder="2"
                  className="mt-1 block w-full rounded-lg border border-gray-700 bg-gray-900 px-3 py-2.5 text-sm text-white placeholder:text-gray-500 focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500"
                  {...register("minTeamSize", {
                    required: "Min team size is required",
                    min: { value: 1, message: "Min size must be at least 1" },
                  })}
                />
                {errors.minTeamSize && (
                  <p className="mt-1 text-xs text-red-400">
                    {errors.minTeamSize.message}
                  </p>
                )}
              </div>
              <div>
                <label className="text-sm font-medium text-gray-400">
                  Max Team Size
                </label>
                <input
                  type="number"
                  min="1"
                  placeholder="5"
                  className="mt-1 block w-full rounded-lg border border-gray-700 bg-gray-900 px-3 py-2.5 text-sm text-white placeholder:text-gray-500 focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500"
                  {...register("maxTeamSize", {
                    required: "Max team size is required",
                    min: { value: 1, message: "Max size must be at least 1" },
                  })}
                />
                {errors.maxTeamSize && (
                  <p className="mt-1 text-xs text-red-400">
                    {errors.maxTeamSize.message}
                  </p>
                )}
              </div>
            </div>
          )}

          <div>
            <textarea
              rows="3"
              placeholder="Event Description (optional)"
              className="mt-1 block w-full rounded-lg border border-gray-700 bg-gray-900 px-3 py-2.5 text-sm text-white placeholder:text-gray-500 focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500"
              {...register("description")}
            />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-400 block mb-2">
              Event Poster
            </label>

            <div className="flex items-start gap-4">
              {previewUrl ? (
                <div className="relative h-20 w-20 rounded-lg overflow-hidden border border-gray-700 group">
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
                <div className="h-20 w-20 rounded-lg border border-dashed border-gray-700 bg-gray-900 flex items-center justify-center text-gray-600">
                  <span className="text-xs">No Image</span>
                </div>
              )}

              <div className="flex-1">
                <input
                  type="file"
                  accept="image/*"
                  disabled={uploading}
                  className="block w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-cyan-500 file:text-black hover:file:bg-cyan-400 disabled:opacity-50 disabled:cursor-not-allowed"
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

          <div className="flex justify-end gap-3 pt-4 border-t border-gray-800">
            <Button
              type="button"
              variant="ghost"
              onClick={onClose}
              disabled={isLoading}
              className="text-gray-400 hover:text-white hover:bg-white/10"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isLoading}
              className="bg-gradient-to-r from-cyan-500 to-cyan-600 text-black font-bold hover:from-cyan-400 hover:to-cyan-500"
            >
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
