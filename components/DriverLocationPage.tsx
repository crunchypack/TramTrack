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

interface VasttrafikStop {
  gid: string | null;
  name: string;
  index: number;
  plannedArrivalTime: string | null;
  plannedDepartureTime: string | null;
  estimatedArrivalTime: string | null;
  estimatedDepartureTime: string | null;
  isCancelled: boolean;
}

interface ScheduleTrip {
  startTime: string;
  endTime: string;
  heading: string;
  line: string;
  startStop: StopInfo;
  endStop: StopInfo;
  routeStops?: RouteStop[];
  vasttrafikStops?: VasttrafikStop[];
  serviceJourneyGid?: string | null;
  detailsReference?: string;
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

const formatIsoTime = (iso?: string | null) => {
  if (!iso) return "--:--";
  const match = iso.match(/T(\d{2}:\d{2})/);
  return match?.[1] || "--:--";
};

const getEstimatedCurrentPosition = (
  vasttrafikStops: VasttrafikStop[],
  now: Date,
): EstimatedPosition | null => {
  if (!vasttrafikStops || vasttrafikStops.length === 0) {
    return null;
  }

  const stops = vasttrafikStops
    .filter((stop) => !stop.isCancelled)
    .sort((a, b) => a.index - b.index);

  if (stops.length === 0) {
    return null;
  }

  const getArrival = (stop: VasttrafikStop) =>
    stop.estimatedArrivalTime ??
    stop.plannedArrivalTime ??
    stop.estimatedDepartureTime ??
    stop.plannedDepartureTime;

  const getDeparture = (stop: VasttrafikStop) =>
    stop.estimatedDepartureTime ??
    stop.plannedDepartureTime ??
    stop.estimatedArrivalTime ??
    stop.plannedArrivalTime;

  const firstStop = stops[0];
  const lastStop = stops[stops.length - 1];

  const firstDeparture = getDeparture(firstStop);
  const lastArrival = getArrival(lastStop);

  if (!firstDeparture || !lastArrival) {
    return null;
  }

  const firstDepartureDate = new Date(firstDeparture);
  const lastArrivalDate = new Date(lastArrival);

  if (now < firstDepartureDate) {
    return {
      lastStop: null,
      nextStop: firstStop.name,
      status: `Waiting to depart from ${firstStop.name}`,
    };
  }

  if (now >= lastArrivalDate) {
    return {
      lastStop: lastStop.name,
      nextStop: null,
      status: `Arrived at ${lastStop.name}`,
    };
  }

  for (let i = 0; i < stops.length - 1; i++) {
    const currentStop = stops[i];
    const nextStop = stops[i + 1];

    const currentArrival = getArrival(currentStop);
    const currentDeparture = getDeparture(currentStop);
    const nextArrival = getArrival(nextStop);

    if (!currentDeparture || !nextArrival) continue;

    const currentDepartureDate = new Date(currentDeparture);
    const nextArrivalDate = new Date(nextArrival);

    if (
      currentArrival &&
      now >= new Date(currentArrival) &&
      now < currentDepartureDate
    ) {
      return {
        lastStop: currentStop.name,
        nextStop: nextStop.name,
        status: `At ${currentStop.name}`,
      };
    }

    if (now >= currentDepartureDate && now < nextArrivalDate) {
      return {
        lastStop: currentStop.name,
        nextStop: nextStop.name,
        status: `Between ${currentStop.name} and ${nextStop.name}`,
      };
    }
  }

  let lastPassedStop: VasttrafikStop | null = null;
  let nextUpcomingStop: VasttrafikStop | null = null;

  for (const stop of stops) {
    const departure = getDeparture(stop);
    const arrival = getArrival(stop);

    if (departure && now >= new Date(departure)) {
      lastPassedStop = stop;
    }

    if (arrival && now < new Date(arrival) && !nextUpcomingStop) {
      nextUpcomingStop = stop;
    }
  }

  if (lastPassedStop || nextUpcomingStop) {
    return {
      lastStop: lastPassedStop?.name ?? null,
      nextStop: nextUpcomingStop?.name ?? null,
      status:
        lastPassedStop && nextUpcomingStop
          ? `Between ${lastPassedStop.name} and ${nextUpcomingStop.name}`
          : nextUpcomingStop
            ? `Approaching ${nextUpcomingStop.name}`
            : `Departed ${lastPassedStop?.name ?? ""}`,
    };
  }

  return null;
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
  const [expandedTripIndex, setExpandedTripIndex] = useState<string | null>(null);

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
        <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded font-semibold">
          Live Data Active
        </span>
      </div>

      {loading ? (
        <p className="text-gray-500">Loading schedules...</p>
      ) : (
        <div className="space-y-6">
          {drivers.map((driver) => (
            <div
              key={driver._id}
              className="border rounded-lg p-4 shadow-sm bg-white"
            >
              <h2 className="text-xl font-bold border-b pb-2 mb-4 text-gray-900">
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
                              ? "border-orange-500 bg-orange-50/50"
                              : "border-blue-500 bg-blue-50/40"
                          }`}
                        >
                          <div className="flex justify-between items-start">
                            <div>
                              <div className="flex items-center gap-2 flex-wrap">
                                <span className="font-black text-lg text-gray-900">
                                  #{c.circulationTemplate.designation}
                                </span>
                                <span className="text-sm font-medium text-gray-700">
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

                          <div className="mt-4 space-y-3">
                            {filteredTrips.map((trip, k) => {
                              const active = isCurrentTrip(
                                schedule.date,
                                trip.startTime,
                                trip.endTime,
                                now,
                                delay,
                              );

                              const vastStops = trip.vasttrafikStops ?? [];
                              const estimatedPosition = active
                                ? getEstimatedCurrentPosition(vastStops, now)
                                : null;

                              const tripKey = `${i}-${j}-${k}`;
                              const isExpanded =
                                expandedTripIndex === tripKey ||
                                (active && expandedTripIndex === null);

                              return (
                                <div
                                  key={k}
                                  className={`text-sm rounded-lg border transition-all ${
                                    active
                                      ? "bg-white shadow border-blue-300 ring-1 ring-blue-100"
                                      : "bg-gray-50/60 border-gray-200"
                                  }`}
                                >
                                  {/* Trip Header */}
                                  <div className="p-3">
                                    <div className="flex justify-between items-center gap-4">
                                      <div className="flex items-center gap-2">
                                        <span>{active ? "🟢" : "⚪"}</span>
                                        <strong className="text-gray-900">
                                          Line {trip.line}
                                        </strong>
                                        <span className="text-gray-500">
                                          mot
                                        </span>
                                        <span className="font-semibold text-gray-800">
                                          {trip.heading}
                                        </span>
                                      </div>

                                      <div className="flex items-center gap-3">
                                        <span className="font-mono text-xs font-semibold text-gray-600 bg-gray-100 px-2 py-1 rounded">
                                          {trip.startTime} – {trip.endTime}
                                        </span>

                                        {vastStops.length > 0 && (
                                          <button
                                            type="button"
                                            onClick={() =>
                                              setExpandedTripIndex(
                                                isExpanded ? "" : tripKey,
                                              )
                                            }
                                            className="text-xs text-blue-600 hover:text-blue-800 font-medium underline"
                                          >
                                            {isExpanded
                                              ? "Hide stops"
                                              : `Stops (${vastStops.length})`}
                                          </button>
                                        )}
                                      </div>
                                    </div>

                                    {/* Realtime Status Indicator */}
                                    {active && (
                                      <div className="mt-2 text-xs text-blue-700 font-medium bg-blue-50/80 p-2 rounded flex flex-wrap items-center justify-between gap-2 border border-blue-100">
                                        <div className="flex items-center gap-2">
                                          <span className="relative flex h-2 w-2">
                                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                                            <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
                                          </span>
                                          <span>
                                            {estimatedPosition?.status ||
                                              "Currently in service"}
                                          </span>
                                        </div>

                                        {delay > 0 && (
                                          <span className="text-orange-700 font-bold">
                                            Running {delay} min late
                                          </span>
                                        )}
                                      </div>
                                    )}
                                  </div>

                                  {/* Stop-by-Stop Schedule Timeline */}
                                  {isExpanded && vastStops.length > 0 && (
                                    <div className="border-t border-gray-100 px-4 py-3 bg-white/70">
                                      <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">
                                        Västtrafik Journey Stops
                                      </h4>

                                      <div className="space-y-1.5 max-h-56 overflow-y-auto pr-1">
                                        {vastStops.map((stop) => {
                                          const isCurrentOrNext =
                                            estimatedPosition?.nextStop ===
                                              stop.name ||
                                            estimatedPosition?.lastStop ===
                                              stop.name;

                                          const departureIso =
                                            stop.estimatedDepartureTime ??
                                            stop.plannedDepartureTime;
                                          const arrivalIso =
                                            stop.estimatedArrivalTime ??
                                            stop.plannedArrivalTime;

                                          const stopTime = formatIsoTime(
                                            departureIso || arrivalIso,
                                          );

                                          const isPassed =
                                            departureIso &&
                                            now >= new Date(departureIso);

                                          return (
                                            <div
                                              key={stop.index}
                                              className={`flex items-center justify-between text-xs py-1 px-2 rounded ${
                                                stop.isCancelled
                                                  ? "bg-red-50 text-red-500 line-through"
                                                  : isCurrentOrNext && active
                                                    ? "bg-blue-100 text-blue-900 font-semibold border-l-2 border-blue-600"
                                                    : isPassed && active
                                                      ? "text-gray-400"
                                                      : "text-gray-700"
                                              }`}
                                            >
                                              <div className="flex items-center gap-2">
                                                <span className="text-[10px] text-gray-400 w-4">
                                                  {stop.index + 1}
                                                </span>
                                                <span>{stop.name}</span>
                                                {stop.isCancelled && (
                                                  <span className="text-[10px] bg-red-100 text-red-700 px-1 rounded">
                                                    Cancelled
                                                  </span>
                                                )}
                                              </div>

                                              <div className="font-mono text-[11px] flex items-center gap-2">
                                                {stop.estimatedArrivalTime &&
                                                  stop.plannedArrivalTime &&
                                                  stop.estimatedArrivalTime !==
                                                    stop.plannedArrivalTime && (
                                                    <span className="line-through text-gray-400">
                                                      {formatIsoTime(
                                                        stop.plannedArrivalTime,
                                                      )}
                                                    </span>
                                                  )}
                                                <span>{stopTime}</span>
                                              </div>
                                            </div>
                                          );
                                        })}
                                      </div>
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
                <p className="text-sm text-gray-500">No schedule found.</p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DriverLocationPage;