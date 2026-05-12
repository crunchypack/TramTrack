"use client";

import { useEffect, useState } from "react";
import GoogleCalendarExportDropdown from "@/components/GoogleCalendarExport";

// --- Interfaces ---

interface LiveStatus {
  delayMinutes: number;
  estimatedTime: string;
  isCancelled: boolean;
}

interface StopInfo {
  name: string;
  vasttrafikGid?: string;
}

interface RouteStop {
  name: string;
  minutesFromStart: number;
  vasttrafikGid?: string;
}

interface ScheduleTrip {
  startTime: string;
  endTime: string;
  heading: string;
  line: string;
  startStop: StopInfo;
  endStop: StopInfo;
  routeStops?: RouteStop[];
}

interface AdjustedTrip extends ScheduleTrip {
  isAdjusted: boolean;
  assignedStartStop?: StopInfo;
  assignedEndStop?: StopInfo;
}

interface ScheduleCirculation {
  startTime: string;
  endTime: string;
  startStop: string;
  endStop: string;
  circulationTemplate: {
    designation: number;
    trips: ScheduleTrip[];
  };
  liveStatus?: LiveStatus | null;
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

interface EstimatedPosition {
  lastStop: string | null;
  nextStop: string | null;
  status: string;
}

// --- Helper Functions ---

const createDate = (dateStr: string, timeStr: string): Date => {
  const normalizedDate = dateStr.split("T")[0];
  const normalizedTime = timeStr.padStart(5, "0");
  return new Date(`${normalizedDate}T${normalizedTime}:00`);
};

const timeToMinutes = (time: string) => {
  const [hours, minutes] = time.split(":").map(Number);
  return hours * 60 + minutes;
};

const formatTime = (minutes: number) => {
  const hrs = Math.floor(minutes / 60)
    .toString()
    .padStart(2, "0");
  const mins = (minutes % 60).toString().padStart(2, "0");
  return `${hrs}:${mins}`;
};

const clamp = (value: number, min: number, max: number) =>
  Math.max(min, Math.min(max, value));

const getMinutesBetween = (start: Date, end: Date) =>
  Math.floor((end.getTime() - start.getTime()) / 60000);

const getEstimatedCurrentPosition = (
  date: string,
  tripStartTime: string,
  tripEndTime: string,
  stops: RouteStop[],
  now: Date,
  delayMinutes: number = 0,
): EstimatedPosition | null => {
  if (!stops || stops.length === 0) return null;

  const start = createDate(date, tripStartTime);
  const end = createDate(date, tripEndTime);
  const adjustedEnd = new Date(end.getTime() + delayMinutes * 60000);

  if (now < start) {
    return {
      lastStop: null,
      nextStop: stops[0]?.name ?? null,
      status: `Waiting to depart from ${stops[0]?.name ?? "start stop"}`,
    };
  }

  if (now >= adjustedEnd) {
    const last = stops[stops.length - 1]?.name ?? null;
    return {
      lastStop: last,
      nextStop: null,
      status: `Arrived at ${last ?? "destination"}`,
    };
  }

  const scheduledDuration = Math.max(1, getMinutesBetween(start, end));
  const adjustedDuration = Math.max(1, scheduledDuration + delayMinutes);
  const elapsedMinutes = clamp(
    getMinutesBetween(start, now),
    0,
    adjustedDuration,
  );

  const equivalentScheduledMinutes =
    (elapsedMinutes / adjustedDuration) * scheduledDuration;

  for (let i = 0; i < stops.length - 1; i++) {
    const currentStop = stops[i];
    const nextStop = stops[i + 1];

    if (
      equivalentScheduledMinutes >= currentStop.minutesFromStart &&
      equivalentScheduledMinutes < nextStop.minutesFromStart
    ) {
      return {
        lastStop: currentStop.name,
        nextStop: nextStop.name,
        status: `Between ${currentStop.name} and ${nextStop.name}`,
      };
    }
  }

  return {
    lastStop: stops[stops.length - 2]?.name ?? null,
    nextStop: stops[stops.length - 1]?.name ?? null,
    status: `Approaching ${stops[stops.length - 1]?.name ?? "destination"}`,
  };
};

const getStopsForTrip = (trip: AdjustedTrip): RouteStop[] => {
  if (trip.routeStops && trip.routeStops.length > 0) {
    return trip.routeStops;
  }

  const totalMinutes = Math.max(
    1,
    timeToMinutes(trip.endTime) - timeToMinutes(trip.startTime),
  );

  return [
    { name: trip.startStop.name, minutesFromStart: 0 },
    { name: trip.endStop.name, minutesFromStart: totalMinutes },
  ];
};

const getFilteredTrips = (circulation: ScheduleCirculation): AdjustedTrip[] => {
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
      const isEndAdjusted = adjustedEnd !== tripEnd;

      const formatStop = (
        assignedStop: string,
        originalStop: StopInfo | undefined,
        isAdjusted: boolean,
      ): StopInfo => {
        if (isAdjusted || !originalStop) {
          return { name: assignedStop, vasttrafikGid: "" };
        }

        return {
          name: originalStop.name || assignedStop || "Unknown stop",
          vasttrafikGid: originalStop.vasttrafikGid || "",
        };
      };

      return {
        ...trip,
        startTime: formatTime(adjustedStart),
        endTime: formatTime(adjustedEnd),
        assignedStartStop: formatStop(
          circulation.startStop,
          trip.startStop,
          isStartAdjusted,
        ),
        assignedEndStop: formatStop(
          circulation.endStop,
          trip.endStop,
          isEndAdjusted,
        ),
        isAdjusted: isStartAdjusted || isEndAdjusted,
      };
    });
};

const isCurrentTrip = (
  date: string,
  startTime: string,
  endTime: string,
  now: Date,
  delay: number = 0,
) => {
  try {
    const start = createDate(date, startTime);
    const end = createDate(date, endTime);
    const adjustedEnd = new Date(end.getTime() + delay * 60000);
    return now >= start && now <= adjustedEnd;
  } catch {
    return false;
  }
};

const getExportOptions = (c: ScheduleCirculation, date: string) => [
  {
    label: "Export",
    start: createDate(date, c.startTime),
    end: createDate(date, c.endTime),
    title: `Drive: ${c.startStop}`,
    description: `Shift #${c.circulationTemplate.designation}`,
    location: c.startStop,
  },
];

const DriverLocationPage = () => {
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [schedules, setSchedules] = useState<Record<string, Schedule[]>>({});
  const [loading, setLoading] = useState(true);
  const [now, setNow] = useState(new Date());

  const fetchSchedules = async (driverList: Driver[]) => {
    const today = new Date().toISOString().split("T")[0];

    const results = await Promise.all(
      driverList.map(async (driver) => {
        try {
          const resp = await fetch(
            `/api/driverSchedule/${driver.employeeId}?date=${today}`,
          );

          if (!resp.ok) {
            return [driver.employeeId, []] as const;
          }

          const driverSchedule = await resp.json();
          return [driver.employeeId, [driverSchedule]] as const;
        } catch (error) {
          console.error(
            `Failed to fetch schedule for ${driver.employeeId}`,
            error,
          );
          return [driver.employeeId, []] as const;
        }
      }),
    );

    setSchedules(Object.fromEntries(results));
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

  useEffect(() => {
    if (drivers.length === 0) return;

    const interval = setInterval(() => {
      setNow(new Date());
      fetchSchedules(drivers);
    }, 30000);

    return () => clearInterval(interval);
  }, [drivers]);

  return (
    <div className="max-w-5xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
      <h1 className="text-2xl sm:text-3xl font-bold mb-4">
        Driver Live Tracking
      </h1>

      <div className="flex justify-between items-center mb-6">
        <p className="text-gray-600 text-sm">
          Current time: {now.toLocaleTimeString("sv-SE")}
        </p>
        <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
          Live Data Active
        </span>
      </div>

      {loading ? (
        <p>Loading schedules...</p>
      ) : (
        <div className="space-y-6">
          {drivers.map((driver) => (
            <div
              key={driver._id}
              className="border rounded-lg p-4 shadow-sm bg-white"
            >
              <h2 className="text-xl font-bold border-b pb-2 mb-4">
                {driver.name}
              </h2>

              {schedules[driver.employeeId]?.length ? (
                schedules[driver.employeeId].map((schedule, i) => (
                  <div key={i} className="space-y-4">
                    {schedule.circulations.map((c, j) => {
                      const filteredTrips = getFilteredTrips(c);
                      const delay = c.liveStatus?.delayMinutes || 0;

                      return (
                        <div
                          key={j}
                          className={`p-4 rounded-md border-l-4 ${
                            delay > 0
                              ? "border-orange-500 bg-orange-50"
                              : "border-blue-500 bg-blue-50"
                          }`}
                        >
                          <div className="flex justify-between items-start">
                            <div>
                              <div className="flex items-center gap-2 flex-wrap">
                                <span className="font-black text-lg">
                                  #{c.circulationTemplate.designation}
                                </span>
                                <span className="text-sm font-medium">
                                  {c.startTime} – {c.endTime}
                                </span>

                                {c.liveStatus && (
                                  <span
                                    className={`text-xs px-2 py-0.5 rounded-full font-bold ${
                                      delay > 0
                                        ? "bg-orange-200 text-orange-800"
                                        : "bg-green-200 text-green-800"
                                    }`}
                                  >
                                    {delay > 0
                                      ? `+${delay} min delay`
                                      : "On Time"}
                                  </span>
                                )}
                              </div>

                              <p className="text-sm text-gray-700 mt-1">
                                {c.startStop} → {c.endStop}
                              </p>

                              {c.liveStatus?.isCancelled && (
                                <p className="text-red-600 font-bold text-xs mt-1">
                                  ⚠️ CIRCULATION CANCELLED
                                </p>
                              )}
                            </div>

                            <GoogleCalendarExportDropdown
                              options={getExportOptions(c, schedule.date)}
                            />
                          </div>

                          <div className="mt-4 space-y-2">
                            {filteredTrips.map((trip, k) => {
                              const active = isCurrentTrip(
                                schedule.date,
                                trip.startTime,
                                trip.endTime,
                                now,
                                delay,
                              );

                              const estimatedPosition = active
                                ? getEstimatedCurrentPosition(
                                    schedule.date,
                                    trip.startTime,
                                    trip.endTime,
                                    getStopsForTrip(trip),
                                    now,
                                    delay,
                                  )
                                : null;

                              return (
                                <div
                                  key={k}
                                  className={`text-sm p-2 rounded ${
                                    active
                                      ? "bg-white shadow-sm border-2 border-blue-200"
                                      : "text-gray-500"
                                  }`}
                                >
                                  <div className="flex justify-between gap-4">
                                    <span>
                                      {active ? "🟢" : "•"}{" "}
                                      <strong>Line {trip.line}</strong> mot{" "}
                                      {trip.heading}
                                    </span>
                                    <span className="font-mono">
                                      {trip.startTime} - {trip.endTime} 
                                    </span>
                                    
                                  </div>

                                  {active && (
                                    <div className="mt-1 text-xs text-blue-600 font-medium italic space-y-1">
                                      <div>
                                        {estimatedPosition?.status ||
                                          "Currently in service"}
                                      </div>

                                      {estimatedPosition?.nextStop && (
                                        <div>
                                          Approaching{" "}
                                          <span className="font-semibold">
                                            {estimatedPosition.nextStop}
                                          </span>
                                        </div>
                                      )}

                                      {delay > 0 && (
                                        <div className="text-orange-600">
                                          Running {delay} min late
                                        </div>
                                      )}
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
                ))
              ) : (
                <p className="text-sm text-gray-500">No schedule found...</p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DriverLocationPage;
