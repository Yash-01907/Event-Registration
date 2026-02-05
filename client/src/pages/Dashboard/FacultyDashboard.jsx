import { useState, useEffect, useCallback } from "react";
import {
  Plus,
  Calendar,
  MapPin,
  Loader2,
  Users,
  Cpu,
  Settings,
  Eye,
  EyeOff,
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

  const handleTogglePublish = async (eventId, currentStatus) => {
    try {
      const response = await api.patch(`/events/${eventId}/publish`);
      setEvents((prevEvents) =>
        prevEvents.map((event) =>
          event.id === eventId
            ? { ...event, isPublished: response.data.isPublished }
            : event
        )
      );
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update publish status");
    }
  };

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

  const getCategoryColor = (category) => {
    switch (category) {
      case "TECH":
        return "text-cyan-400 border-cyan-500/30 bg-cyan-500/10";
      case "CULTURAL":
        return "text-fuchsia-400 border-fuchsia-500/30 bg-fuchsia-500/10";
      case "SPORTS":
        return "text-emerald-400 border-emerald-500/30 bg-emerald-500/10";
      default:
        return "text-gray-400 border-gray-500/30 bg-gray-500/10";
    }
  };

  return (
    <div className="min-h-screen gradient-mesh pt-20 pb-12">
      <div className="absolute inset-0 grid-pattern opacity-30 pointer-events-none" />

      <div className="container mx-auto px-4 relative z-10">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold font-heading text-white tracking-wide flex items-center gap-3">
              <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-purple-500 to-fuchsia-600 flex items-center justify-center">
                <Settings className="h-6 w-6 text-white" />
              </div>
              <span className="text-purple-400">FACULTY</span>
              <span className="text-white">DASHBOARD</span>
            </h1>
            <p className="text-gray-500 mt-2 font-mono text-sm">// Manage your events and coordinators</p>
          </div>
          <Button
            onClick={() => setIsModalOpen(true)}
            className="btn-neon bg-gradient-to-r from-cyan-500 to-purple-600 text-white font-bold px-6 py-3 rounded-xl flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            CREATE EVENT
          </Button>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="flex flex-col items-center gap-4">
              <Loader2 className="h-10 w-10 animate-spin text-cyan-400" />
              <p className="text-gray-500 font-mono text-sm animate-pulse">LOADING EVENTS...</p>
            </div>
          </div>
        ) : error ? (
          <div className="glass-card rounded-xl p-6 border-red-500/30 text-red-400 font-mono text-center">
            ERROR: {error}
          </div>
        ) : events.length === 0 ? (
          <div className="text-center py-20 glass-card rounded-2xl border-gray-800 border-dashed">
            <Calendar className="h-16 w-16 mx-auto text-gray-700 mb-4" />
            <h3 className="text-xl font-bold text-white mb-2 font-heading">
              NO EVENTS FOUND
            </h3>
            <p className="text-gray-500 mb-6 font-mono text-sm">
              // You haven't created any events yet
            </p>
            <Button
              onClick={() => setIsModalOpen(true)}
              className="btn-neon bg-gradient-to-r from-cyan-500/20 to-purple-500/20 text-cyan-400 border border-cyan-500/30 font-bold px-6 py-3 rounded-xl"
            >
              Create Your First Event
            </Button>
          </div>
        ) : (
          <div className="glass-card rounded-2xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="border-b border-gray-800">
                  <tr className="text-xs uppercase text-gray-500 font-mono tracking-wider">
                    <th className="px-6 py-4">Event Name</th>
                    <th className="px-6 py-4">Category</th>
                    <th className="px-6 py-4">Date</th>
                    <th className="px-6 py-4">Location</th>
                    <th className="px-6 py-4">Fees</th>
                    <th className="px-6 py-4 text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-800">
                  {events.map((event) => (
                    <tr
                      key={event.id}
                      className="hover:bg-white/5 transition-colors cursor-pointer group"
                      onClick={() =>
                        (window.location.href = `/dashboard/event/${event.id}`)
                      }
                    >
                      <td className="px-6 py-4">
                        <div className="font-medium text-white group-hover:text-cyan-400 transition-colors">
                          {event.name}
                        </div>
                        <div className="text-xs text-gray-600 truncate max-w-[200px] font-mono">
                          {event.description}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={cn(
                            "px-3 py-1 rounded-lg text-xs font-bold font-mono uppercase border",
                            getCategoryColor(event.category)
                          )}
                        >
                          {event.category}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-400 font-mono">
                        {event.date
                          ? new Date(event.date).toLocaleDateString()
                          : "TBA"}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-400 font-mono">
                        <div className="flex items-center gap-1.5">
                          <MapPin className="h-3.5 w-3.5 text-purple-400" />
                          {event.location || "TBA"}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-cyan-400 font-mono font-bold">
                        {event.fees > 0 ? `₹${event.fees}` : "Free"}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              window.location.href = `/dashboard/event/${event.id}/registrations`;
                            }}
                            className="p-2 rounded-lg text-gray-500 hover:text-cyan-400 hover:bg-cyan-500/10 transition-colors"
                            title="View Registrations"
                          >
                            <Users className="h-4 w-4" />
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleTogglePublish(event.id, event.isPublished);
                            }}
                            className={cn(
                              "inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-bold font-mono uppercase transition-all",
                              event.isPublished
                                ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/20"
                                : "bg-yellow-500/10 text-yellow-400 border border-yellow-500/30 hover:bg-yellow-500/20"
                            )}
                            title="Click to toggle status"
                          >
                            {event.isPublished ? (
                              <>
                                <Eye className="h-3 w-3" />
                                Published
                              </>
                            ) : (
                              <>
                                <EyeOff className="h-3 w-3" />
                                Draft
                              </>
                            )}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        <CreateEventModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onEventCreated={fetchEvents}
        />
      </div>
    </div>
  );
}
