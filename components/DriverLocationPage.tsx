"use client";

import { useEffect, useState } from "react";
import GoogleCalendarExportDropdown from "@/components/GoogleCalendarExport";

// --- Interfaces ---

interface LiveStatus {
  delayMinutes: number;
  estimatedTime: string;
  isCancelled: boolean;
}

interface ScheduleTrip {
  startTime: string;
  endTime: string;
  heading: string;
  tramline: {
    number: number;
    direction: string;
    route?: { name: string }[];
    timeBetweenStops?: number[];
  };
  startStop: {
    name: string;
    vasttrafikGid: string;
  };
  endStop: {
    name: string;
    vasttrafikGid: string;
  };
}

interface AdjustedTrip extends ScheduleTrip {
  isAdjusted: boolean;
}

interface ScheduleCirculation {
  startTime: string;
  endTime: string;
  startStop: {
    name: string;
    vasttrafikGid: string;
  };
  endStop: {
    name: string;
    vasttrafikGid: string;
  };
  circulationTemplate: {
    designation: number;
    trips: ScheduleTrip[];
  };
  liveStatus?: LiveStatus | null; // New field from our enriched API
}

interface Schedule {
  date: string;
  circulations: ScheduleCirculation[];
}

interface Driver {
  _id: string;
  name: string;
  employeeId: string;
}

// --- Helper Functions ---

const createDate = (dateStr: string, timeStr: string): Date => {
  const normalizedDate = dateStr.split("T")[0];
  const normalizedTime = timeStr.padStart(5, "0");
  return new Date(`${normalizedDate}T${normalizedTime}:00`);
};

const DriverLocationPage = () => {
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [schedules, setSchedules] = useState<Record<string, Schedule[]>>({});
  const [loading, setLoading] = useState(true);
  const [now, setNow] = useState(new Date());

  const fetchSchedules = async (driverList: Driver[]) => {
    const allSchedules: Record<string, Schedule[]> = {};
    const today = new Date().toISOString().split("T")[0];

    for (const driver of driverList) {
      // Note: Added date query to the fetch to hit your new enriched API correctly
      const resp = await fetch(`/api/driverSchedule/${driver.employeeId}?date=${today}`);
      if (!resp.ok) continue;
      const driverSchedule = await resp.json();
      // Wrapping in array to maintain your existing state structure
      allSchedules[driver.employeeId] = [driverSchedule];
    }
    setSchedules(allSchedules);
  };

  useEffect(() => {
    const init = async () => {
      try {
        const res = await fetch("/api/driver");
        const driverList: Driver[] = await res.json();
        setDrivers(driverList);
        await fetchSchedules(driverList);
      } catch (error) {
        console.error("Failed to fetch driver schedules", error);
      } finally {
        setLoading(false);
      }
    };
    init();
  }, []);

  // Poll for time and fresh data every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setNow(new Date());
      fetchSchedules(drivers); 
    }, 30000);
    return () => clearInterval(interval);
  }, [drivers]);

  const timeToMinutes = (time: string) => {
    const [hours, minutes] = time.split(":").map(Number);
    return hours * 60 + minutes;
  };

  const formatTime = (minutes: number) => {
    const hrs = Math.floor(minutes / 60).toString().padStart(2, "0");
    const mins = (minutes % 60).toString().padStart(2, "0");
    return `${hrs}:${mins}`;
  };

  const getFilteredTrips = (
    circulation: ScheduleCirculation,
    scheduleDate: string
  ): AdjustedTrip[] => {
    const scheduleStart = timeToMinutes(circulation.startTime);
    const scheduleEnd = timeToMinutes(circulation.endTime);

    return circulation.circulationTemplate.trips
      .filter((trip) => {
        const tripStart = timeToMinutes(trip.startTime);
        const tripEnd = timeToMinutes(trip.endTime);
        return tripEnd > scheduleStart && tripStart < scheduleEnd;
      })
      .map((trip) => {
        const tripStart = timeToMinutes(trip.startTime);
        const tripEnd = timeToMinutes(trip.endTime);
        const adjustedStart = Math.max(tripStart, scheduleStart);
        const adjustedEnd = Math.min(tripEnd, scheduleEnd);
        const isStartAdjusted = adjustedStart !== tripStart;

        return {
          ...trip,
          startTime: formatTime(adjustedStart),
          endTime: formatTime(adjustedEnd),
          startStop: isStartAdjusted ? (circulation.startStop as any) : trip.startStop,
          isAdjusted: adjustedStart !== tripStart || adjustedEnd !== tripEnd,
        };
      });
  };

  const isCurrentTrip = (date: string, startTime: string, endTime: string, delay: number = 0) => {
    try {
      const start = createDate(date, startTime);
      const end = createDate(date, endTime);
      // Adjust end time by the live delay
      const adjustedEnd = new Date(end.getTime() + delay * 60000);
      return now >= start && now <= adjustedEnd;
    } catch (e) {
      return false;
    }
  };

  return (
    <div className="max-w-5xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
      <h1 className="text-2xl sm:text-3xl font-bold mb-4">Driver Live Tracking</h1>
      <div className="flex justify-between items-center mb-6">
        <p className="text-gray-600 text-sm">
          Current time: {now.toLocaleTimeString("sv-SE")}
        </p>
        <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">Live Data Active</span>
      </div>

      {loading ? (
        <p>Loading schedules...</p>
      ) : (
        <div className="space-y-6">
          {drivers.map((driver) => (
            <div key={driver._id} className="border rounded-lg p-4 shadow-sm bg-white">
              <h2 className="text-xl font-bold border-b pb-2 mb-4">{driver.name}</h2>

              {schedules[driver.employeeId]?.map((schedule, i) => (
                <div key={i} className="space-y-4">
                  {schedule.circulations.map((c, j) => {
                    const filteredTrips = getFilteredTrips(c, schedule.date);
                    const delay = c.liveStatus?.delayMinutes || 0;

                    return (
                      <div key={j} className={`p-4 rounded-md border-l-4 ${delay > 0 ? 'border-orange-500 bg-orange-50' : 'border-blue-500 bg-blue-50'}`}>
                        <div className="flex justify-between items-start">
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-black text-lg">#{c.circulationTemplate.designation}</span>
                              <span className="text-sm font-medium">{c.startTime} – {c.endTime}</span>
                              {c.liveStatus && (
                                <span className={`text-xs px-2 py-0.5 rounded-full font-bold ${delay > 0 ? 'bg-orange-200 text-orange-800' : 'bg-green-200 text-green-800'}`}>
                                  {delay > 0 ? `+${delay} min delay` : 'On Time'}
                                </span>
                              )}
                            </div>
                            <p className="text-sm text-gray-700 mt-1">
                              {c.startStop.name} → {c.endStop.name}
                            </p>
                            {c.liveStatus?.isCancelled && (
                              <p className="text-red-600 font-bold text-xs mt-1">⚠️ CIRCULATION CANCELLED</p>
                            )}
                          </div>
                          <GoogleCalendarExportDropdown options={getExportOptions(c, schedule.date)} />
                        </div>

                        <div className="mt-4 space-y-2">
                          {filteredTrips.map((trip, k) => {
                            const isActive = isCurrentTrip(schedule.date, trip.startTime, trip.endTime, delay);
                            return (
                              <div key={k} className={`text-sm p-2 rounded ${isActive ? 'bg-white shadow-sm border-2 border-blue-200' : 'text-gray-500'}`}>
                                <div className="flex justify-between">
                                  <span>
                                    {isActive ? "🟢" : "•"} <strong>Line {trip.tramline.number}</strong> mot {trip.heading}
                                  </span>
                                  <span className="font-mono">{trip.startTime}</span>
                                </div>
                                {isActive && (
                                  <div className="mt-1 text-xs text-blue-600 font-medium italic">
                                    Currently driving towards {trip.endStop.name}
                                    {delay > 0 && <span className="ml-1 text-orange-600">(Running late)</span>}
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// Simplified export helper for this file
const getExportOptions = (c: any, date: string) => [{
  label: "Export",
  start: createDate(date, c.startTime),
  end: createDate(date, c.endTime),
  title: `Drive: ${c.startStop.name}`,
  description: `Shift #${c.circulationTemplate.designation}`,
  location: c.startStop.name
}];

export default DriverLocationPage;