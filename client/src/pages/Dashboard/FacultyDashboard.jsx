import { useState, useEffect, useCallback } from "react";
import {
  Plus,
  Search,
  Calendar,
  MapPin,
  IndianRupee,
  Loader2,
  Users,
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
            : event,
        ),
      );
    } catch (err) {
      setError(
        err.response?.data?.message || "Failed to update publish status",
      );
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

  return (
    <div className="container mx-auto px-4 py-8 pt-24 min-h-screen">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold font-heading text-gray-900">
            Faculty Dashboard
          </h1>
          <p className="text-gray-500 mt-1">
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
        <div className="text-center py-20 bg-gray-50 rounded-lg border border-gray-200 border-dashed">
          <Calendar className="h-12 w-12 mx-auto text-gray-400 mb-4" />
          <h3 className="text-xl font-bold text-gray-900 mb-2">
            No events found
          </h3>
          <p className="text-gray-500 mb-6">
            You haven't created any events yet.
          </p>
          <Button onClick={() => setIsModalOpen(true)} variant="outline">
            Create Your First Event
          </Button>
        </div>
      ) : (
        <div className="grid gap-6">
          <div className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-gray-50 text-xs uppercase text-gray-500 font-semibold border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-4">Event Name</th>
                    <th className="px-6 py-4">Category</th>
                    <th className="px-6 py-4">Date</th>
                    <th className="px-6 py-4">Location</th>
                    <th className="px-6 py-4 items-center">Fees</th>
                    <th className="px-6 py-4 text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {events.map((event) => (
                    <tr
                      key={event.id}
                      className="hover:bg-gray-50 transition-colors cursor-pointer"
                      onClick={() =>
                        (window.location.href = `/dashboard/event/${event.id}`)
                      }
                    >
                      <td className="px-6 py-4">
                        <div className="font-medium text-gray-900">
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
                              "text-indigo-700 bg-indigo-50 border-indigo-200",
                            event.category === "CULTURAL" &&
                              "text-amber-700 bg-amber-50 border-amber-200",
                            event.category === "SPORTS" &&
                              "text-emerald-700 bg-emerald-50 border-emerald-200",
                          )}
                        >
                          {event.category}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {event.date
                          ? new Date(event.date).toLocaleDateString()
                          : "TBA"}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        <div className="flex items-center gap-1.5">
                          <MapPin className="h-3.5 w-3.5 text-gray-400" />
                          {event.location || "TBA"}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {event.fees > 0 ? `₹${event.fees}` : "Free"}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              window.location.href = `/dashboard/event/${event.id}/registrations`;
                            }}
                            className="p-1.5 rounded-md text-gray-400 hover:text-gray-900 hover:bg-gray-100 transition-colors"
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
                              "inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset transition-colors",
                              event.isPublished
                                ? "bg-green-50 text-green-700 ring-green-600/20 hover:bg-green-100"
                                : "bg-yellow-50 text-yellow-800 ring-yellow-600/20 hover:bg-yellow-100",
                            )}
                            title="Click to toggle status"
                          >
                            {event.isPublished ? "Published" : "Draft"}
                          </button>
                        </div>
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
