"use client";

import { useEffect, useState } from "react";
import GoogleCalendarExportDropdown from "@/components/GoogleCalendarExport";

interface AdjustedTrip extends ScheduleTrip {
  isAdjusted: boolean;
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
  };
  endStop: {
    name: string;
  };
}

interface ScheduleCirculation {
  startTime: string;
  endTime: string;
  startStop: {
    name: string;
  };
  endStop: {
    name: string;
  };
  circulationTemplate: {
    designation: number;
    trips: ScheduleTrip[];
  };
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

// Helper function to safely create dates
const createDate = (dateStr: string, timeStr: string): Date => {
  // Normalize the date string (remove timezone if present)
  const normalizedDate = dateStr.split("T")[0];
  // Ensure time is in HH:MM format
  const normalizedTime = timeStr.padStart(5, "0");
  return new Date(`${normalizedDate}T${normalizedTime}:00`);
};

const DriverLocationPage = () => {
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [schedules, setSchedules] = useState<Record<string, Schedule[]>>({});
  const [loading, setLoading] = useState(true);
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const fetchDriversAndSchedules = async () => {
      try {
        const res = await fetch("/api/driver");
        const driverList: Driver[] = await res.json();
        setDrivers(driverList);

        const allSchedules: Record<string, Schedule[]> = {};

        for (const driver of driverList) {
          const resp = await fetch(`/api/driver/location/${driver.employeeId}`);
          if (!resp.ok) continue;
          const driverSchedules = await resp.json();
          allSchedules[driver.employeeId] = driverSchedules;
        }

        setSchedules(allSchedules);
      } catch (error) {
        console.error("Failed to fetch driver schedules", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDriversAndSchedules();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => setNow(new Date()), 10000);
    return () => clearInterval(interval);
  }, []);

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
          startStop: isStartAdjusted ? circulation.startStop : trip.startStop,
          isAdjusted: adjustedStart !== tripStart || adjustedEnd !== tripEnd,
        };
      });
  };

  const isCurrentTrip = (date: string, startTime: string, endTime: string) => {
    try {
      const start = createDate(date, startTime);
      const end = createDate(date, endTime);
      return now >= start && now <= end;
    } catch (e) {
      console.error("Error in date comparison:", e);
      return false;
    }
  };

  const getEstimatedCurrentStop = (
    startTime: string,
    route: string[],
    startStop: string,
    timeBetweenStops: number[]
  ): string | null => {
    const [startH, startM] = startTime.split(":").map(Number);
    const startMinutes = startH * 60 + startM;

    const nowMinutes = now.getHours() * 60 + now.getMinutes();
    let elapsed = nowMinutes - startMinutes;

    if (elapsed < 0) return null;

    let startStopIndex = route.indexOf(startStop);

    let cumulative = startStopIndex;
    for (let i = startStopIndex; i < timeBetweenStops.length; i++) {
      cumulative += timeBetweenStops[i];
      if (elapsed < cumulative) return route[i];
    }

    return route[route.length - 1];
  };

  const isBetweenTrips = (
    currentTripIndex: number,
    trips: AdjustedTrip[],
    scheduleDate: string
  ) => {
    if (trips.length === 0 || currentTripIndex >= trips.length - 1)
      return false;

    const currentTrip = trips[currentTripIndex];
    const nextTrip = trips[currentTripIndex + 1];

    try {
      const currentEnd = createDate(scheduleDate, currentTrip.endTime);
      const nextStart = createDate(scheduleDate, nextTrip.startTime);
      return now > currentEnd && now < nextStart;
    } catch (e) {
      console.error("Error in between trips check:", e);
      return false;
    }
  };

  const getExportOptions = (circulation: ScheduleCirculation, date: string) => {
    try {
      const start = createDate(date, circulation.startTime);
      const end = createDate(date, circulation.endTime);

      return [
        {
          label: "Export Circulation",
          start,
          end,
          title: `Driver Circulation ${circulation.startStop.name} to ${circulation.endStop.name}`,
          description: `Circulation from ${circulation.startStop.name} to ${circulation.endStop.name}`,
          location: "",
        },
      ];
    } catch (e) {
      console.error("Error creating export options:", e);
      return [];
    }
  };

  return (
    <div className="max-w-5xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
      <h1 className="text-2xl sm:text-3xl font-bold mb-4">
        Driver Upcoming Schedules
      </h1>
      <p className="text-gray-600 text-sm sm:text-base mb-4">
        Current time: {now.toLocaleTimeString("sv-SE")}
      </p>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="space-y-6">
          {drivers.map((driver) => (
            <div
              key={driver._id}
              className="border rounded-md p-4 sm:p-5 shadow-sm space-y-2"
            >
              <h2 className="text-lg sm:text-xl font-semibold">
                {driver.name}
              </h2>

              {schedules[driver.employeeId]?.length ? (
                schedules[driver.employeeId].map((schedule, i) => (
                  <div key={i} className="mb-4">
                    <h3 className="font-semibold">
                      Date: {new Date(schedule.date).toLocaleDateString()}
                    </h3>
                    <ul className="list-disc pl-5">
                      {schedule.circulations.map((c, j) => {
                        const filteredTrips = getFilteredTrips(
                          c,
                          schedule.date
                        );
                        const exportOptions = getExportOptions(
                          c,
                          schedule.date
                        );

                        return (
                          <li key={j} className="mt-1">
                            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2 sm:gap-4">
                              <div className="text-sm sm:text-base">
                                #{c.circulationTemplate.designation} 🕒{" "}
                                {c.startTime}–{c.endTime} — {c.startStop.name} →{" "}
                                {c.endStop.name}
                              </div>
                              {exportOptions.length > 0 && (
                                <div className="self-start sm:self-auto">
                                  <GoogleCalendarExportDropdown
                                    options={exportOptions}
                                  />
                                </div>
                              )}
                            </div>

                            <br />

                            {filteredTrips.length > 0 ? (
                              filteredTrips.map((trip, k) => {
                                const isActive = isCurrentTrip(
                                  schedule.date,
                                  trip.startTime,
                                  trip.endTime
                                );
                                const routeNames =
                                  trip.tramline.route?.map(
                                    (stop) => stop.name
                                  ) ?? [];
                                const isBetween = isBetweenTrips(
                                  k,
                                  filteredTrips,
                                  schedule.date
                                );
                                const isLastTrip =
                                  k === filteredTrips.length - 1;

                                return (
                                  <div
                                    key={k}
                                    className={`text-sm sm:text-base ml-2 mt-1 ${
                                      isActive
                                        ? "bg-yellow-100 font-semibold p-1 rounded-md"
                                        : ""
                                    }`}
                                  >
                                    • Line {trip.tramline.number} mot{" "}
                                    {trip.heading}: {trip.startStop.name} →{" "}
                                    {trip.endStop.name} at {trip.startTime}
                                    {isLastTrip && (
                                      <span className="text-xs text-gray-500 ml-1">
                                        → {trip.endTime}
                                      </span>
                                    )}
                                    {isActive && (
                                      <span className="block sm:inline text-xs text-green-600 ml-1">
                                        (current – est. stop:{" "}
                                        {getEstimatedCurrentStop(
                                          trip.startTime,
                                          routeNames,
                                          trip.startStop.name,
                                          trip.tramline.timeBetweenStops ?? []
                                        ) || "N/A"}
                                        )
                                      </span>
                                    )}
                                    {isBetween && (
                                      <div className="text-xs bg-blue-100 text-blue-800 p-1 rounded mt-1">
                                        Awaiting trip start at{" "}
                                        {filteredTrips[k + 1].startTime}
                                      </div>
                                    )}
                                  </div>
                                );
                              })
                            ) : (
                              <div className="text-sm ml-2 text-gray-500">
                                No trips during this schedule period
                              </div>
                            )}
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                ))
              ) : (
                <p className="text-gray-500">No upcoming schedules</p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DriverLocationPage;
