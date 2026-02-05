import { useState, useEffect } from "react";
import {
  Loader2,
  Calendar,
  MapPin,
  QrCode,
  Ticket,
  Cpu,
  Zap,
} from "lucide-react";
import api from "@/lib/api";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

export default function StudentDashboard() {
  const [registrations, setRegistrations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRegistrations = async () => {
      try {
        const response = await api.get("/registrations/my");
        setRegistrations(response.data);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to fetch tickets");
      } finally {
        setIsLoading(false);
      }
    };

    fetchRegistrations();
  }, []);

  return (
    <div className="min-h-screen gradient-mesh pt-20 pb-12">
      <div className="absolute inset-0 grid-pattern opacity-30 pointer-events-none" />

      <div className="container mx-auto px-4 relative z-10">
        {/* Header */}
        <div className="mb-10">
          <h1 className="text-3xl md:text-4xl font-bold font-heading text-white tracking-wide flex items-center gap-3">
            <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-cyan-500 to-purple-600 flex items-center justify-center pulse-ring">
              <Ticket className="h-6 w-6 text-white" />
            </div>
            <span className="text-cyan-400">MY</span>
            <span className="text-white">TICKETS</span>
          </h1>
          <p className="text-gray-500 mt-2 font-mono text-sm">// Events you have registered for</p>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="flex flex-col items-center gap-4">
              <Loader2 className="h-10 w-10 animate-spin text-cyan-400" />
              <p className="text-gray-500 font-mono text-sm animate-pulse">LOADING TICKETS...</p>
            </div>
          </div>
        ) : error ? (
          <div className="glass-card rounded-xl p-6 border-red-500/30 text-red-400 font-mono text-center">
            ERROR: {error}
          </div>
        ) : registrations.length === 0 ? (
          <div className="text-center py-20 glass-card rounded-2xl border-gray-800 border-dashed">
            <Ticket className="h-16 w-16 mx-auto text-gray-700 mb-4" />
            <h3 className="text-xl font-bold text-white mb-2 font-heading">
              NO TICKETS FOUND
            </h3>
            <p className="text-gray-500 mb-6 font-mono text-sm">
              // You haven't registered for any events yet
            </p>
            <Link to="/events">
              <Button className="btn-neon bg-gradient-to-r from-cyan-500 to-purple-600 text-white font-bold px-8 py-3 rounded-xl">
                <Zap className="mr-2 h-4 w-4" />
                EXPLORE EVENTS
              </Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {registrations.map((reg) => (
              <div
                key={reg.id}
                className="glass-card rounded-2xl overflow-hidden card-hover group relative flex flex-col"
              >
                {/* Event Image Top Stripe */}
                <div className="h-28 relative overflow-hidden">
                  {reg.event.posterUrl ? (
                    <img
                      src={reg.event.posterUrl}
                      alt=""
                      className="w-full h-full object-cover opacity-60 group-hover:opacity-80 transition-opacity"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
                      <Cpu className="h-10 w-10 text-gray-700" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />

                  {/* Date Badge */}
                  <div className="absolute top-3 right-3 px-3 py-1 rounded-lg bg-black/50 backdrop-blur-sm border border-cyan-500/30 text-cyan-400 text-xs font-mono">
                    {new Date(reg.event.date).toLocaleDateString()}
                  </div>
                </div>

                <div className="p-5 flex-grow flex flex-col">
                  <h3 className="text-lg font-bold text-white font-heading mb-3 line-clamp-1 group-hover:text-cyan-400 transition-colors">
                    {reg.event.name}
                  </h3>

                  <div className="space-y-2 text-sm text-gray-500 mb-5 flex-grow font-mono">
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-purple-400" />
                      <span className="truncate">{reg.event.location || "Venue TBA"}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="h-4 w-4 flex items-center justify-center text-emerald-400 font-bold text-xs">₹</span>
                      <span>{reg.event.fees > 0 ? `₹${reg.event.fees}` : "Free"}</span>
                    </div>
                  </div>

                  {/* QR Section */}
                  <div className="border-t border-dashed border-gray-800 pt-4 flex items-center justify-between">
                    <div className="text-xs">
                      <div className="uppercase tracking-wider font-semibold text-gray-600 mb-1">
                        Ticket ID
                      </div>
                      <div className="font-mono text-cyan-400 bg-cyan-500/10 px-2 py-1 rounded">
                        {reg.id.substring(0, 8)}...
                      </div>
                    </div>
                    <div className="p-2 rounded-lg bg-white/5 border border-gray-800">
                      <QrCode className="h-10 w-10 text-gray-400" />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
