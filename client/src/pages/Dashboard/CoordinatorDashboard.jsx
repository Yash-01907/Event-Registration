import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Calendar, MapPin, IndianRupee, Loader2, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import api from "@/lib/api";
import { cn } from "@/lib/utils";

export default function CoordinatorDashboard() {
  const [events, setEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await api.get("/events/coordinated-events");
        setEvents(response.data);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to fetch events");
      } finally {
        setIsLoading(false);
      }
    };

    fetchEvents();
  }, []);

  return (
    <div className="container mx-auto px-4 py-8 pt-24 min-h-screen">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold font-heading text-gray-900">
            Coordinator Dashboard
          </h1>
          <p className="text-gray-500 mt-1">Events assigned to you</p>
        </div>
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
        <div className="text-center py-20 bg-gray-50 rounded-lg border border-gray-100 border-dashed">
          <Calendar className="h-12 w-12 mx-auto text-gray-400 mb-4" />
          <h3 className="text-xl font-bold text-gray-900 mb-2">
            No assigned events
          </h3>
          <p className="text-gray-500">
            You haven't been assigned to any events yet.
          </p>
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
                    <th className="px-6 py-4">Main Coordinator</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {events.map((event) => (
                    <tr
                      key={event.id}
                      className="hover:bg-gray-50 transition-colors"
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
                              "text-indigo-700 bg-indigo-50 border-indigo-100",
                            event.category === "CULTURAL" &&
                              "text-amber-700 bg-amber-50 border-amber-100",
                            event.category === "SPORTS" &&
                              "text-emerald-700 bg-emerald-50 border-emerald-100",
                          )}
                        >
                          {event.category}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-700">
                        {event.date
                          ? new Date(event.date).toLocaleDateString()
                          : "TBA"}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-700">
                        <div className="flex items-center gap-2">
                          <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center text-primary text-[10px] font-bold">
                            {event.mainCoordinator?.name?.charAt(0) || "F"}
                          </div>
                          <span>{event.mainCoordinator?.name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end gap-2">
                          <Link to={`/dashboard/event/${event.id}`}>
                            <Button variant="outline" size="sm">
                              Edit Event
                            </Button>
                          </Link>
                          <Link
                            to={`/dashboard/event/${event.id}/registrations`}
                          >
                            <Button variant="outline" size="sm">
                              Registrations
                            </Button>
                          </Link>
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
    </div>
  );
}
