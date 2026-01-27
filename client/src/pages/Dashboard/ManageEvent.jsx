import { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import {
  ArrowLeft,
  Save,
  MapPin,
  Calendar,
  IndianRupee,
  Users,
  Mail,
  Plus,
  Loader2,
  Trash,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import api from "@/lib/api";
import { cn } from "@/lib/utils";

export default function ManageEvent() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [addingCoord, setAddingCoord] = useState(false);
  const [coordEmail, setCoordEmail] = useState("");
  const [message, setMessage] = useState({ type: "", text: "" });

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm();

  const fetchEvent = useCallback(async () => {
    try {
      const response = await api.get(`/events/${id}`);
      setEvent(response.data);
      // Populate form
      setValue("name", response.data.name);
      setValue("category", response.data.category);
      if (response.data.date) {
        // Format for datetime-local: YYYY-MM-DDTHH:mm
        const dateObj = new Date(response.data.date);
        const formattedDate = dateObj.toISOString().slice(0, 16);
        setValue("date", formattedDate);
      }
      setValue("fees", response.data.fees);
      setValue("location", response.data.location);
      setValue("description", response.data.description);
      setLoading(false);
    } catch (error) {
      console.error("Failed to fetch event", error);
      setMessage({ type: "error", text: "Failed to load event details" });
      setLoading(false);
    }
  }, [id, setValue]);

  useEffect(() => {
    fetchEvent();
  }, [fetchEvent]);

  const onUpdateEvent = async (data) => {
    setSaving(true);
    setMessage({ type: "", text: "" });
    try {
      await api.put(`/events/${id}`, data);
      setMessage({ type: "success", text: "Event updated successfully" });
      fetchEvent(); // Refresh data
    } catch (error) {
      setMessage({
        type: "error",
        text: error.response?.data?.message || "Failed to update event",
      });
    } finally {
      setSaving(false);
    }
  };

  const onAddCoordinator = async (e) => {
    e.preventDefault();
    if (!coordEmail) return;

    setAddingCoord(true);
    setMessage({ type: "", text: "" });
    try {
      await api.post(`/events/${id}/coordinator`, { email: coordEmail });
      setCoordEmail("");
      setMessage({ type: "success", text: "Coordinator added successfully" });
      fetchEvent(); // Refresh list
    } catch (error) {
      setMessage({
        type: "error",
        text: error.response?.data?.message || "Failed to add coordinator",
      });
    } finally {
      setAddingCoord(false);
    }
  };

  if (loading)
    return (
      <div className="flex justify-center pt-20">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  if (!event) return <div className="text-center pt-20">Event not found</div>;

  return (
    <div className="container mx-auto px-4 py-8 pt-24 min-h-screen">
      <Button
        variant="ghost"
        onClick={() => navigate("/dashboard")}
        className="mb-6 gap-2 text-gray-400 hover:text-white"
      >
        <ArrowLeft className="h-4 w-4" /> Back to Dashboard
      </Button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Event Details */}
        <div className="lg:col-span-2 space-y-6">
          <div className="rounded-xl border border-white/10 bg-background/50 backdrop-blur-sm p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold font-heading text-white">
                Edit Event Details
              </h2>
              <span
                className={cn(
                  "px-2.5 py-1 rounded-full text-xs font-medium border",
                  event.isPublished
                    ? "bg-green-400/10 text-green-400 ring-green-400/20"
                    : "bg-yellow-400/10 text-yellow-400 ring-yellow-400/20",
                )}
              >
                {event.isPublished ? "Published" : "Draft"}
              </span>
            </div>

            {message.text && (
              <div
                className={cn(
                  "mb-4 p-3 rounded-md text-sm border",
                  message.type === "error"
                    ? "bg-destructive/10 border-destructive/20 text-destructive"
                    : "bg-green-500/10 border-green-500/20 text-green-500",
                )}
              >
                {message.text}
              </div>
            )}

            <form onSubmit={handleSubmit(onUpdateEvent)} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-300">
                    Event Name
                  </label>
                  <input
                    className="mt-1 block w-full rounded-md border border-white/10 bg-secondary/50 px-3 py-2 text-sm text-white focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                    {...register("name", { required: "Required" })}
                  />
                  {errors.name && (
                    <p className="mt-1 text-xs text-destructive">
                      {errors.name.message}
                    </p>
                  )}
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-300">
                    Category
                  </label>
                  <select
                    className="mt-1 block w-full rounded-md border border-white/10 bg-secondary/50 px-3 py-2 text-sm text-white focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                    {...register("category")}
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
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-300">
                    Date & Time
                  </label>
                  <div className="relative mt-1">
                    <Calendar className="absolute left-3 top-2.5 h-4 w-4 text-gray-500" />
                    <input
                      type="datetime-local"
                      className="block w-full rounded-md border border-white/10 bg-secondary/50 pl-10 pr-3 py-2 text-sm text-white focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                      {...register("date")}
                    />
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-300">
                    Fees (₹)
                  </label>
                  <div className="relative mt-1">
                    <IndianRupee className="absolute left-3 top-2.5 h-4 w-4 text-gray-500" />
                    <input
                      type="number"
                      className="block w-full rounded-md border border-white/10 bg-secondary/50 pl-10 pr-3 py-2 text-sm text-white focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                      {...register("fees")}
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-300">
                  Venue
                </label>
                <div className="relative mt-1">
                  <MapPin className="absolute left-3 top-2.5 h-4 w-4 text-gray-500" />
                  <input
                    className="block w-full rounded-md border border-white/10 bg-secondary/50 pl-10 pr-3 py-2 text-sm text-white focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                    {...register("location")}
                  />
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-300">
                  Description
                </label>
                <textarea
                  rows="4"
                  className="mt-1 block w-full rounded-md border border-white/10 bg-secondary/50 px-3 py-2 text-sm text-white focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                  {...register("description")}
                />
              </div>

              <div className="flex justify-end pt-4">
                <Button type="submit" disabled={saving}>
                  {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Save Changes
                </Button>
              </div>
            </form>
          </div>
        </div>

        {/* Right Column: Coordinators */}
        <div className="space-y-6">
          <div className="rounded-xl border border-white/10 bg-background/50 backdrop-blur-sm p-6">
            <div className="flex items-center gap-2 mb-6">
              <Users className="h-5 w-5 text-primary" />
              <h2 className="text-lg font-bold font-heading text-white">
                Coordinators
              </h2>
            </div>

            <form onSubmit={onAddCoordinator} className="mb-6">
              <label className="text-xs font-medium text-gray-400 mb-1.5 block">
                Add Student Coordinator
              </label>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Mail className="absolute left-3 top-2.5 h-4 w-4 text-gray-500" />
                  <input
                    type="email"
                    placeholder="student@example.com"
                    value={coordEmail}
                    onChange={(e) => setCoordEmail(e.target.value)}
                    className="block w-full rounded-md border border-white/10 bg-secondary/50 pl-9 pr-3 py-2 text-sm text-white placeholder:text-gray-500 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>
                <Button
                  type="submit"
                  size="sm"
                  disabled={addingCoord || !coordEmail}
                >
                  {addingCoord ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Plus className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </form>

            <div className="space-y-3">
              <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Current Team
              </h3>

              {/* Main Coordinator */}
              <div className="flex items-center gap-3 p-3 rounded-lg bg-white/5 border border-white/10">
                <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center text-primary text-xs font-bold">
                  {event.mainCoordinator?.name?.charAt(0) || "F"}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-white truncate">
                    {event.mainCoordinator?.name}
                  </p>
                  <p className="text-xs text-gray-400 truncate">
                    Faculty (Owner)
                  </p>
                </div>
              </div>

              {/* Student Coordinators */}
              {event.coordinators?.map((coord) => (
                <div
                  key={coord.id}
                  className="flex items-center gap-3 p-3 rounded-lg bg-white/5 border border-white/10"
                >
                  <div className="h-8 w-8 rounded-full bg-secondary flex items-center justify-center text-gray-300 text-xs font-bold">
                    {coord.name?.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-white truncate">
                      {coord.name}
                    </p>
                    <p className="text-xs text-gray-400 truncate">
                      {coord.email}
                    </p>
                  </div>
                </div>
              ))}

              {(!event.coordinators || event.coordinators.length === 0) && (
                <p className="text-sm text-gray-500 italic text-center py-4">
                  No student coordinators assigned yet.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
