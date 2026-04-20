"use client";
import { useState, useEffect } from "react";
import { 
  getCurrentStopAndDetails, 
  getLastStop, 
  getNextTripStartTime 
} from "@/utils/driverUtils";

// --- Interfaces ---

interface LiveStatus {
  delayMinutes: number;
  estimatedTime: string;
  isCancelled: boolean;
}

interface CurrentStopInfo {
  currentStop: string;
  tramlineNumber: number;
  scheduledEndTime: Date;
  heading: string;
  liveStatus?: LiveStatus | null; // Added live support
}

interface NextTripInfo {
  nextStartTime: string;
  lastCirculationEndTime: string;
}

interface LastStopInfo {
  stop: string;
  date: string;
  tramline: number;
}

const DriverSchedulePage = ({ params }: { params: { employeeId: number } }) => {
  const id = params.employeeId;
  const [schedule, setSchedule] = useState(null);
  const [currentStop, setCurrentStop] = useState<CurrentStopInfo | null>(null);
  const [nextTrip, setNextTrip] = useState<NextTripInfo | null>(null);
  const [lastStopInfo, setLastStopInfo] = useState<LastStopInfo | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchDriverSchedule = async () => {
    try {
      const today = new Date().toISOString().split("T")[0];
      // Updated to point to your new live-enriched API endpoint
      const response = await fetch(`/api/driverSchedule/${id}?date=${today}`);
      const data = await response.json();

      if (response.ok) {
        setSchedule(data);
        const currentTime = new Date();

        // 1. Get static schedule calculations
        const current = getCurrentStopAndDetails(data, currentTime);
        const next = getNextTripStartTime(data, currentTime);
        const last = getLastStop(data);

        // 2. Map Live Data from the enriched API back into our state
        // We find the circulation the driver is currently on to get the liveStatus
        const currentCirc = data.circulations.find((c: any) => 
          c.circulationTemplate.trips.some((t: any) => t.tramline.number === current?.tramlineNumber)
        );

        if (current) {
          current.liveStatus = currentCirc?.liveStatus;
        }

        setCurrentStop(current);
        setNextTrip(next);
        setLastStopInfo(last);
      }
    } catch (error) {
      console.error("Failed to fetch driver schedule:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchDriverSchedule();
      // Poll every 30 seconds for live updates
      const interval = setInterval(fetchDriverSchedule, 30000);
      return () => clearInterval(interval);
    }
  }, [id]);

  if (loading) return <div className="p-10 text-center">Loading Driver Schedule...</div>;
  if (!schedule) return <div className="p-10 text-center text-red-500">No schedule found for this date.</div>;

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-8">
      <header className="border-b pb-4">
        <h1 className="text-3xl font-bold text-gray-800">Driver Dashboard</h1>
        <p className="text-gray-500 font-medium">Employee ID: {id}</p>
      </header>

      {/* --- SECTION 1: ACTIVE TRIP --- */}
      {currentStop && currentStop.tramlineNumber !== 0 ? (
        <section className="bg-blue-50 border-2 border-blue-200 rounded-xl p-6 shadow-sm">
          <div className="flex justify-between items-start mb-4">
            <h2 className="text-blue-800 font-bold uppercase tracking-wider text-sm">Active Trip</h2>
            <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-xs font-bold animate-pulse">
              LIVE
            </span>
          </div>

          <div className="space-y-4">
            <div>
              <p className="text-gray-500 text-sm">Current Stop (Estimated)</p>
              <p className="text-2xl font-black text-gray-900">{currentStop.currentStop}</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-gray-500 text-sm">Tramline</p>
                <p className="text-xl font-bold">Line {currentStop.tramlineNumber}</p>
              </div>
              <div>
                <p className="text-gray-500 text-sm">Heading</p>
                <p className="text-xl font-bold">{currentStop.heading}</p>
              </div>
            </div>

            <div className="border-t border-blue-200 pt-4 mt-4">
              <p className="text-gray-500 text-sm">Scheduled Arrival:</p>
              <p className="text-lg font-semibold">
                {new Date(currentStop.scheduledEndTime).toLocaleTimeString("sv-SE", { hour: '2-digit', minute: '2-digit' })}
              </p>
              
              {/* --- LIVE DELAY INDICATOR --- */}
              {currentStop.liveStatus && (
                <div className={`mt-2 p-2 rounded-md font-bold text-center ${
                  currentStop.liveStatus.delayMinutes > 0 
                    ? "bg-red-100 text-red-700" 
                    : "bg-green-100 text-green-700"
                }`}>
                  {currentStop.liveStatus.delayMinutes > 0 
                    ? `⚠️ Running +${currentStop.liveStatus.delayMinutes} min late` 
                    : "✅ On Schedule"}
                </div>
              )}
            </div>
          </div>
        </section>
      ) : (
        /* --- SECTION 2: BREAK / NEXT TRIP --- */
        <section className="bg-gray-50 border border-gray-200 rounded-xl p-6">
          <h2 className="text-gray-600 font-bold uppercase tracking-wider text-sm mb-4">Status: Off-Trip / Break</h2>
          
          {nextTrip ? (
            <div className="space-y-4">
              <div>
                <p className="text-gray-500 text-sm">Next Trip Starts At:</p>
                <p className="text-3xl font-black text-gray-900">{nextTrip.nextStartTime}</p>
              </div>
              <p className="text-gray-600 italic">
                You are scheduled to finish your shift at {nextTrip.lastCirculationEndTime}
              </p>
            </div>
          ) : (
            lastStopInfo && (
              <div className="space-y-2">
                <p className="text-gray-500 text-sm">Shift completed at:</p>
                <p className="text-xl font-bold">{lastStopInfo.stop}</p>
                <p className="text-sm text-gray-400">
                  {new Date(lastStopInfo.date).toLocaleTimeString("sv-SE")} (Line {lastStopInfo.tramline})
                </p>
              </div>
            )
          )}
        </section>
      )}

      <footer className="text-center text-xs text-gray-400 pt-10">
        System synced with Västtrafik GID infrastructure.
      </footer>
    </div>
  );
};

export default DriverSchedulePage;