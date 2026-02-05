import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Calendar, MapPin, Loader2, Users, Cpu, Edit, ClipboardList } from "lucide-react";
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
        <div className="mb-10">
          <h1 className="text-3xl md:text-4xl font-bold font-heading text-white tracking-wide flex items-center gap-3">
            <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-cyan-500 to-purple-600 flex items-center justify-center">
              <ClipboardList className="h-6 w-6 text-white" />
            </div>
            <span className="text-cyan-400">COORDINATOR</span>
            <span className="text-white">DASHBOARD</span>
          </h1>
          <p className="text-gray-500 mt-2 font-mono text-sm">// Events assigned to you</p>
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
              NO ASSIGNED EVENTS
            </h3>
            <p className="text-gray-500 font-mono text-sm">
              // You haven't been assigned to any events yet
            </p>
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
                    <th className="px-6 py-4">Main Coordinator</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-800">
                  {events.map((event) => (
                    <tr
                      key={event.id}
                      className="hover:bg-white/5 transition-colors group"
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
                      <td className="px-6 py-4 text-sm">
                        <div className="flex items-center gap-2">
                          <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-cyan-500 to-purple-600 flex items-center justify-center text-white text-xs font-bold">
                            {event.mainCoordinator?.name?.charAt(0) || "F"}
                          </div>
                          <span className="text-gray-300">{event.mainCoordinator?.name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end gap-2">
                          <Link to={`/dashboard/event/${event.id}`}>
                            <Button
                              variant="outline"
                              size="sm"
                              className="bg-transparent border-gray-700 text-gray-400 hover:text-cyan-400 hover:border-cyan-500/30 hover:bg-cyan-500/10 font-mono text-xs"
                            >
                              <Edit className="h-3 w-3 mr-1" />
                              Edit
                            </Button>
                          </Link>
                          <Link to={`/dashboard/event/${event.id}/registrations`}>
                            <Button
                              variant="outline"
                              size="sm"
                              className="bg-transparent border-gray-700 text-gray-400 hover:text-purple-400 hover:border-purple-500/30 hover:bg-purple-500/10 font-mono text-xs"
                            >
                              <Users className="h-3 w-3 mr-1" />
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
        )}
      </div>
    </div>
  );
}
