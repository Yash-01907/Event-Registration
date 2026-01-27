import { useState, useEffect, useCallback } from "react";
import {
  Plus,
  Search,
  Calendar,
  MapPin,
  IndianRupee,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import api from "@/lib/api";
import CreateEventModal from "@/components/events/CreateEventModal";
import { cn } from "@/lib/utils";

export default function FacultyDashboard() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [events, setEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchEvents = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await api.get("/events/my-events");
      setEvents(response.data);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch events");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  return (
    <div className="container mx-auto px-4 py-8 pt-24 min-h-screen">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold font-heading text-white">
            Faculty Dashboard
          </h1>
          <p className="text-gray-400 mt-1">
            Manage your events and coordinators
          </p>
        </div>
        <Button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          Create New Event
        </Button>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : error ? (
        <div className="text-center py-12 bg-destructive/10 rounded-lg border border-destructive/20 text-destructive">
          Error loading events: {error}
        </div>
      ) : events.length === 0 ? (
        <div className="text-center py-20 bg-secondary/30 rounded-lg border border-white/5 border-dashed">
          <Calendar className="h-12 w-12 mx-auto text-gray-500 mb-4" />
          <h3 className="text-xl font-bold text-white mb-2">No events found</h3>
          <p className="text-gray-400 mb-6">
            You haven't created any events yet.
          </p>
          <Button onClick={() => setIsModalOpen(true)} variant="outline">
            Create Your First Event
          </Button>
        </div>
      ) : (
        <div className="grid gap-6">
          <div className="rounded-xl border border-white/10 bg-background/50 backdrop-blur-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-secondary/50 text-xs uppercase text-gray-400 font-semibold border-b border-white/10">
                  <tr>
                    <th className="px-6 py-4">Event Name</th>
                    <th className="px-6 py-4">Category</th>
                    <th className="px-6 py-4">Date</th>
                    <th className="px-6 py-4">Location</th>
                    <th className="px-6 py-4 items-center">Fees</th>
                    <th className="px-6 py-4 text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {events.map((event) => (
                    <tr
                      key={event.id}
                      className="hover:bg-white/5 transition-colors cursor-pointer"
                      onClick={() =>
                        (window.location.href = `/dashboard/event/${event.id}`)
                      }
                    >
                      <td className="px-6 py-4">
                        <div className="font-medium text-white">
                          {event.name}
                        </div>
                        <div className="text-xs text-gray-500 truncate max-w-[200px]">
                          {event.description}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={cn(
                            "px-2.5 py-1 rounded-full text-xs font-medium border",
                            event.category === "TECH" &&
                              "text-indigo-400 bg-indigo-950/30 border-indigo-800",
                            event.category === "CULTURAL" &&
                              "text-amber-400 bg-amber-950/30 border-amber-800",
                            event.category === "SPORTS" &&
                              "text-emerald-400 bg-emerald-950/30 border-emerald-800",
                          )}
                        >
                          {event.category}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-300">
                        {event.date
                          ? new Date(event.date).toLocaleDateString()
                          : "TBA"}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-300">
                        <div className="flex items-center gap-1.5">
                          <MapPin className="h-3.5 w-3.5 text-gray-500" />
                          {event.location || "TBA"}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-300">
                        {event.fees > 0 ? `₹${event.fees}` : "Free"}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <span
                          className={cn(
                            "inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset",
                            event.isPublished
                              ? "bg-green-400/10 text-green-400 ring-green-400/20"
                              : "bg-yellow-400/10 text-yellow-400 ring-yellow-400/20",
                          )}
                        >
                          {event.isPublished ? "Published" : "Draft"}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      <CreateEventModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onEventCreated={fetchEvents}
      />
    </div>
  );
}
