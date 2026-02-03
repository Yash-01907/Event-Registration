import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Calendar,
  MapPin,
  IndianRupee,
  User,
  Ticket,
  Loader2,
  Share2,
  CheckCircle2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import api from "@/lib/api";
import useAuthStore from "@/store/authStore";
import { formatDate } from "@/lib/utils";

export default function EventDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuthStore();

  const [event, setEvent] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [registering, setRegistering] = useState(false);
  const [isRegistered, setIsRegistered] = useState(false);

  const isSoldOut =
    event?.maxParticipants &&
    event?._count?.registrations >= event.maxParticipants;
  const isClosed =
    event?.registrationDeadline &&
    new Date() > new Date(event.registrationDeadline);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const response = await api.get(`/events/${id}`);
        setEvent(response.data);
      } catch (err) {
        setError(
          err.response?.data?.message || "Failed to fetch event details",
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchEvent();
  }, [id]);

  // Check if already registered
  useEffect(() => {
    // This is a bit tricky since we don't have a direct "am I registered?" endpoint for a specific event
    // without fetching all registrations.
    // However, the prompt says "If logged in -> Call POST /api/registrations. Show success toast and change button to 'Registered'."
    // I can check "my registrations" to see if I'm already there to prevent double booking in UI.
    const checkRegistrationStatus = async () => {
      if (user) {
        try {
          const response = await api.get("/registrations/my");
          const myRegs = response.data;
          const found = myRegs.find((reg) => reg.eventId === id);
          if (found) setIsRegistered(true);
        } catch (err) {
          console.error("Failed to check registration status", err);
        }
      }
    };
    if (user && id) {
      checkRegistrationStatus();
    }
  }, [user, id]);

  const handleRegister = async () => {
    if (!user) {
      navigate("/login");
      return;
    }

    setRegistering(true);
    try {
      await api.post("/registrations", { eventId: id });
      setIsRegistered(true);
      // Ideally show a toast here
      alert("Successfully registered for the event!");
    } catch (err) {
      alert(err.response?.data?.message || "Registration failed");
    } finally {
      setRegistering(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen pt-16">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    );
  }

  if (error || !event) {
    return (
      <div className="container mx-auto px-4 py-8 pt-24 text-center">
        <div className="bg-destructive/10 text-destructive p-4 rounded-lg inline-block">
          {error || "Event not found"}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-16 pb-12">
      {/* Banner/Hero Section */}
      <div className="relative h-[300px] md:h-[400px] w-full overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent z-10" />
        <img
          src={
            event.posterUrl ||
            "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?q=80&w=2070&auto=format&fit=crop"
          }
          alt={event.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute bottom-0 left-0 right-0 z-20 container mx-auto px-4 pb-8">
          <div className="max-w-4xl">
            <span className="inline-block px-3 py-1 rounded-full bg-primary/20 text-primary border border-primary/20 text-xs font-semibold uppercase tracking-wider mb-4">
              {event.category}
            </span>
            {isSoldOut && (
              <span className="inline-block ml-3 px-3 py-1 rounded-full bg-destructive/20 text-destructive border border-destructive/20 text-xs font-semibold uppercase tracking-wider mb-4">
                Sold Out
              </span>
            )}
            {isClosed && !isSoldOut && (
              <span className="inline-block ml-3 px-3 py-1 rounded-full bg-yellow-500/20 text-yellow-500 border border-yellow-500/20 text-xs font-semibold uppercase tracking-wider mb-4">
                Closed
              </span>
            )}
            <h1 className="text-4xl md:text-5xl md:leading-tight font-bold font-heading text-white mb-2 text-shadow-lg">
              {event.name}
            </h1>
            <div className="flex flex-wrap items-center gap-6 text-gray-200 mt-4">
              <div className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-primary" />
                <span>
                  {event.date
                    ? new Date(event.date).toLocaleDateString(undefined, {
                        weekday: "long",
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })
                    : "Date TBA"}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="h-5 w-5 text-primary" />
                <span>{event.location || "Venue TBA"}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-12">
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                About Event
              </h2>
              <div className="prose prose-gray max-w-none text-gray-600">
                <p className="whitespace-pre-wrap leading-relaxed">
                  {event.description || "No description provided."}
                </p>
              </div>
            </section>

            {/* Coordinator Info */}
            <section className="bg-gray-50 rounded-xl p-6 border border-gray-100">
              <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <User className="h-5 w-5 text-primary" />
                Event Coordinator
              </h3>
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-lg">
                  {event.mainCoordinator?.name?.charAt(0) || "F"}
                </div>
                <div>
                  <div className="font-medium text-gray-900">
                    {event.mainCoordinator?.name || "Faculty Coordinator"}
                  </div>
                  <div className="text-sm text-gray-500">
                    {event.mainCoordinator?.email}
                  </div>
                </div>
              </div>
            </section>
          </div>

          {/* Sidebar / Register Action */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-6">
              <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
                <div className="flex justify-between items-center mb-6">
                  <span className="text-gray-500">Registration Fee</span>
                  <div className="flex items-center text-2xl font-bold text-gray-900">
                    {event.fees > 0 ? (
                      <>
                        <IndianRupee className="h-6 w-6" />
                        {event.fees}
                      </>
                    ) : (
                      <span className="text-emerald-600">Free</span>
                    )}
                  </div>
                </div>

                <Button
                  className="w-full h-12 text-lg font-semibold"
                  size="lg"
                  onClick={handleRegister}
                  disabled={
                    registering || isRegistered || isSoldOut || isClosed
                  }
                  variant={
                    isRegistered
                      ? "outline"
                      : isSoldOut || isClosed
                        ? "secondary"
                        : "default"
                  }
                >
                  {isRegistered ? (
                    <>
                      <CheckCircle2 className="mr-2 h-5 w-5 text-emerald-600" />
                      Registered
                    </>
                  ) : isSoldOut ? (
                    "Sold Out"
                  ) : isClosed ? (
                    "Registration Closed"
                  ) : registering ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Registering...
                    </>
                  ) : (
                    <>
                      <Ticket className="mr-2 h-5 w-5" />
                      Register Now
                    </>
                  )}
                </Button>

                <p className="text-xs text-center text-gray-500 mt-4">
                  {isRegistered
                    ? "You are all set! Check your ticket in dashboard."
                    : "Limited seats available. Register soon!"}
                </p>
              </div>

              <div className="text-center">
                <Button
                  variant="ghost"
                  className="text-gray-500 hover:text-gray-900"
                >
                  <Share2 className="mr-2 h-4 w-4" />
                  Share Event
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
