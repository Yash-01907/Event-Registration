import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Loader2, ArrowLeft, Search, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import api from "@/lib/api";
import { formatDate } from "@/lib/utils";
import ManualEntryModal from "@/components/dashboard/ManualEntryModal";

export default function EventRegistrations() {
  const { id } = useParams();
  const [registrations, setRegistrations] = useState([]);
  const [event, setEvent] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchData = async () => {
    try {
      // Parallel fetch for event details and registrations
      const [regsRes, eventRes] = await Promise.all([
        api.get(`/registrations/event/${id}`),
        api.get(`/events/${id}`),
      ]);
      setRegistrations(regsRes.data);
      setEvent(eventRes.data);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Failed to fetch registration data. Ensure you are authorized.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [id]);

  const filteredRegistrations = registrations.filter(
    (reg) =>
      reg.student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      reg.student.rollNumber
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      reg.student.email.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <div className="container mx-auto px-4 py-8 pt-24 min-h-screen">
      <div className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <Link
            to="/coordinator-dashboard"
            className="flex items-center text-sm text-gray-400 hover:text-white transition-colors mb-2"
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back to Dashboard
          </Link>
          <h1 className="text-3xl font-bold font-heading text-white">
            Registrations
          </h1>
          {event && (
            <p className="text-gray-400 mt-1">
              Managing entries for{" "}
              <span className="text-primary">{event.name}</span>
            </p>
          )}
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" onClick={() => window.print()}>
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
          <ManualEntryModal eventId={id} onSuccess={fetchData} />
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : error ? (
        <div className="text-center py-12 bg-destructive/10 rounded-lg border border-destructive/20 text-destructive">
          {error}
        </div>
      ) : (
        <div className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name, roll number, or email..."
              className="w-full pl-10 pr-4 py-2 rounded-lg bg-background/50 border border-white/10 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="rounded-xl border border-white/10 bg-background/50 backdrop-blur-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-secondary/50 text-xs uppercase text-gray-400 font-semibold border-b border-white/10">
                  <tr>
                    <th className="px-6 py-4">Student Name</th>
                    <th className="px-6 py-4">Roll Number</th>
                    <th className="px-6 py-4">Email & Phone</th>
                    <th className="px-6 py-4">Registration Type</th>
                    <th className="px-6 py-4 text-right">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {filteredRegistrations.length === 0 ? (
                    <tr>
                      <td
                        colSpan="5"
                        className="px-6 py-8 text-center text-gray-500"
                      >
                        No registrations found matching your search.
                      </td>
                    </tr>
                  ) : (
                    filteredRegistrations.map((reg) => (
                      <tr
                        key={reg.id}
                        className="hover:bg-white/5 transition-colors"
                      >
                        <td className="px-6 py-4">
                          <div className="font-medium text-white">
                            {reg.student.name}
                          </div>
                        </td>
                        <td className="px-6 py-4 text-gray-300 font-mono text-sm">
                          {reg.student.rollNumber || "N/A"}
                        </td>
                        <td className="px-6 py-4 text-sm">
                          <div className="text-white">{reg.student.email}</div>
                          <div className="text-gray-500 text-xs">
                            {reg.student.phone || "N/A"}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
                              reg.type === "MANUAL"
                                ? "bg-amber-500/10 text-amber-500 border-amber-500/20"
                                : "bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
                            }`}
                          >
                            {reg.type}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right text-sm text-gray-400">
                          {formatDate(reg.createdAt)}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
            <div className="px-6 py-4 border-t border-white/10 text-xs text-gray-500 bg-secondary/30">
              Total Registrations: {filteredRegistrations.length}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
