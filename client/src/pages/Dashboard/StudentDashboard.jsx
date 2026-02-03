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
        <h1 className="text-3xl font-bold font-heading text-gray-900">
          My Tickets
        </h1>
        <p className="text-gray-500 mt-1">Events you have registered for</p>
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
        <div className="text-center py-20 bg-gray-50 rounded-lg border border-gray-100 border-dashed">
          <Ticket className="h-12 w-12 mx-auto text-gray-400 mb-4" />
          <h3 className="text-xl font-bold text-gray-900 mb-2">
            No tickets found
          </h3>
          <p className="text-gray-500 mb-6">
            You haven't registered for any events yet.
          </p>
          <Link
            to="/events"
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
              className="bg-white border border-gray-100 rounded-xl overflow-hidden hover:shadow-md transition-shadow group relative flex flex-col shadow-sm"
            >
              {/* Event Image Top Stripe */}
              <div className="h-24 bg-gray-100 relative overflow-hidden">
                {reg.event.posterUrl ? (
                  <img
                    src={reg.event.posterUrl}
                    alt=""
                    className="w-full h-full object-cover opacity-90"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-r from-gray-100 to-gray-200" />
                )}
              </div>

              <div className="p-6 pt-2 flex-grow flex flex-col">
                {/* Date Badge */}
                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full text-xs font-mono border border-gray-200 shadow-sm z-20 text-gray-900">
                  {new Date(reg.event.date).toLocaleDateString()}
                </div>

                <h3
                  className="text-xl font-bold text-gray-900 mb-2 line-clamp-1 mt-2"
                  title={reg.event.name}
                >
                  {reg.event.name}
                </h3>

                <div className="space-y-2 text-sm text-gray-500 mb-6 flex-grow">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-gray-400" />
                    <span className="truncate">
                      {reg.event.location || "Venue TBA"}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="h-4 w-4 bg-gray-100 rounded-full flex items-center justify-center text-[10px] text-gray-600">
                      ₹
                    </div>
                    <span>
                      {reg.event.fees > 0 ? `₹${reg.event.fees}` : "Free"}
                    </span>
                  </div>
                </div>

                {/* QR Placeholder */}
                <div className="mt-auto border-t border-dashed border-gray-200 pt-4 flex items-center justify-between">
                  <div className="text-xs text-gray-500">
                    <div className="uppercase tracking-wider font-semibold mb-1 text-gray-400">
                      Ticket ID
                    </div>
                    <div className="font-mono text-gray-700 bg-gray-50 px-1 rounded">
                      {reg.id.substring(0, 8)}...
                    </div>
                  </div>
                  <div className="bg-white p-1 rounded-md border border-gray-100">
                    <QrCode className="h-10 w-10 text-gray-900" />
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
