import { useState, useEffect } from "react";
import {
  Loader2,
  Calendar,
  MapPin,
  IndianRupee,
  QrCode,
  Ticket,
} from "lucide-react";
import api from "@/lib/api";
import { Link } from "react-router-dom";

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
    <div className="container mx-auto px-4 py-8 pt-24 min-h-screen">
      <div className="mb-8">
        <h1 className="text-3xl font-bold font-heading text-white">
          My Tickets
        </h1>
        <p className="text-gray-400 mt-1">Events you have registered for</p>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : error ? (
        <div className="text-center py-12 bg-destructive/10 rounded-lg border border-destructive/20 text-destructive">
          Error loading tickets: {error}
        </div>
      ) : registrations.length === 0 ? (
        <div className="text-center py-20 bg-secondary/30 rounded-lg border border-white/5 border-dashed">
          <Ticket className="h-12 w-12 mx-auto text-gray-500 mb-4" />
          <h3 className="text-xl font-bold text-white mb-2">
            No tickets found
          </h3>
          <p className="text-gray-400 mb-6">
            You haven't registered for any events yet.
          </p>
          <Link
            to="/events" // Or "/" if events page isn't ready, user said "Events Page (Coming Soon)" earlier but now asked for "/events/:id".
            // Actually, I can link to Home if Events list page isn't strictly defined, but usually "Events" is safe expectation.
            // Wait, previous file had Events Page Coming Soon. I'll stick to a generic "Explore Events" button to Home for now or just generic.
            className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
          >
            Explore Events
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {registrations.map((reg) => (
            <div
              key={reg.id}
              className="bg-background/60 backdrop-blur-sm border border-white/10 rounded-xl overflow-hidden hover:border-primary/50 transition-colors group relative flex flex-col"
            >
              {/* Event Image Top Stripe */}
              <div className="h-24 bg-secondary/50 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent z-10"></div>
                {reg.event.posterUrl && (
                  <img
                    src={reg.event.posterUrl}
                    alt=""
                    className="w-full h-full object-cover opacity-60"
                  />
                )}
              </div>

              <div className="p-6 pt-2 flex-grow flex flex-col">
                {/* Date Badge */}
                <div className="absolute top-4 right-4 bg-background/80 backdrop-blur-md px-3 py-1 rounded-full text-xs font-mono border border-white/10 z-20">
                  {new Date(reg.event.date).toLocaleDateString()}
                </div>

                <h3
                  className="text-xl font-bold text-white mb-2 line-clamp-1"
                  title={reg.event.name}
                >
                  {reg.event.name}
                </h3>

                <div className="space-y-2 text-sm text-gray-400 mb-6 flex-grow">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-primary/70" />
                    <span className="truncate">
                      {reg.event.location || "Venue TBA"}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="h-4 w-4 bg-primary/20 rounded-full flex items-center justify-center text-[10px] text-primary">
                      ₹
                    </div>
                    <span>
                      {reg.event.fees > 0 ? `₹${reg.event.fees}` : "Free"}
                    </span>
                  </div>
                </div>

                {/* QR Placeholder */}
                <div className="mt-auto border-t border-dashed border-white/10 pt-4 flex items-center justify-between">
                  <div className="text-xs text-gray-500">
                    <div className="uppercase tracking-wider font-semibold mb-1">
                      Ticket ID
                    </div>
                    <div className="font-mono text-white/70">
                      {reg.id.substring(0, 8)}...
                    </div>
                  </div>
                  <div className="bg-white p-1 rounded-md">
                    <QrCode className="h-10 w-10 text-black" />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
