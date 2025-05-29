import { format, parseISO, isAfter, isBefore, addMinutes } from "date-fns";

// --- Interfaces ---
interface Trip {
  _id: string;
  startTime: string; // ISO string
  endTime: string;
  heading: string;
  tramline: {
    _id: string;
    number: number;
    route: string[];
    timeBetweenStops: number[];
  };
}

interface CirculationTemplate {
  _id: string;
  name: string;
  trips: Trip[];
}

interface DriverSchedule {
  _id: string;
  driver: string;
  date: string;
  circulationTemplate: CirculationTemplate;
}

interface LastStopInfo {
  stop: string;
  date: string;
  tramline: number;
}

interface currentStopInfo {
  currentStop: string;
  tramlineNumber: number;
  scheduledEndTime: Date;
  heading: string;
}

interface nextTripInfo {
  nextStartTime: string;
  lastCirculationEndTime: string;
}

// --- Utils ---

/**
 * Get the current stop based on the schedule and the current time.
 */
export function getCurrentStopAndDetails(
  schedule: DriverSchedule,
  currentTime: Date
): currentStopInfo {
  for (const trip of schedule.circulationTemplate.trips) {
    const tripStartTime = parseISO(trip.startTime);
    const tripEndTime = parseISO(trip.endTime);

    if (
      isBefore(currentTime, tripEndTime) &&
      isAfter(currentTime, tripStartTime)
    ) {
      let cumulativeTime = tripStartTime;

      for (let i = 0; i < trip.tramline.route.length; i++) {
        cumulativeTime = addMinutes(
          cumulativeTime,
          trip.tramline.timeBetweenStops[i]
        );

        if (isAfter(currentTime, cumulativeTime)) {
          if (currentTime.getTime() === cumulativeTime.getTime()) {
            return {
              currentStop: trip.tramline.route[i],
              tramlineNumber: trip.tramline.number,
              scheduledEndTime: tripEndTime,
              heading: trip.heading,
            };
          }

          return {
            currentStop: trip.tramline.route[i - 1],
            tramlineNumber: trip.tramline.number,
            scheduledEndTime: tripEndTime,
            heading: trip.heading,
          };
        }

        if (currentTime.getTime() === cumulativeTime.getTime()) {
          return {
            currentStop: trip.tramline.route[i],
            tramlineNumber: trip.tramline.number,
            scheduledEndTime: tripEndTime,
            heading: trip.heading,
          };
        }
      }
    }
  }

  return {
    currentStop: "null",
    tramlineNumber: 0,
    scheduledEndTime: new Date("0"),
    heading: "null",
  };
}

/**
 * Get the last stop, date, and tramline number of the last completed trip.
 */
export function getLastStop(schedule: DriverSchedule): LastStopInfo {
  const trips = schedule.circulationTemplate.trips;
  const lastTrip = trips[trips.length - 1];
  const formattedDate = format(parseISO(lastTrip.endTime), "yyyy-MM-dd HH:mm");

  return {
    stop: trips[trips.length - 1].tramline.route.at(-1) || "Unknown",
    date: formattedDate,
    tramline: lastTrip.tramline.number,
  };
}

/**
 * Get the next trip start time if there is one.
 */
export function getNextTripStartTime(
  schedule: DriverSchedule,
  currentTime: Date
): nextTripInfo {
  let lastEndTime: Date = new Date("0");
  let nextStartTime: Date = new Date("9999-12-31");

  for (const trip of schedule.circulationTemplate.trips) {
    const tripStart = parseISO(trip.startTime);
    const tripEnd = parseISO(trip.endTime);

    if (isAfter(tripEnd, lastEndTime)) lastEndTime = tripEnd;
    if (isAfter(tripStart, currentTime) && isBefore(tripStart, nextStartTime)) {
      nextStartTime = tripStart;
    }
  }

  return {
    nextStartTime: format(nextStartTime, "PPpp"),
    lastCirculationEndTime: format(lastEndTime, "PPpp"),
  };
}

/**
 * Returns whether the driver is currently in an active trip or on break.
 */
export function isOnBreak(
  schedule: DriverSchedule,
  currentTime: Date
): boolean {
  return !schedule.circulationTemplate.trips.some((trip) => {
    const start = parseISO(trip.startTime);
    const end = parseISO(trip.endTime);
    return isBefore(currentTime, end) && isAfter(currentTime, start);
  });
}

/**
 * Wraps all details into one status object.
 */
interface DriverStatus {
  currentStopInfo: currentStopInfo;
  lastStopInfo: LastStopInfo;
  nextTripInfo: nextTripInfo;
  isOnBreak: boolean;
}

export function getDriverStatus(
  schedule: DriverSchedule,
  currentTime: Date
): DriverStatus {
  return {
    currentStopInfo: getCurrentStopAndDetails(schedule, currentTime),
    lastStopInfo: getLastStop(schedule),
    nextTripInfo: getNextTripStartTime(schedule, currentTime),
    isOnBreak: isOnBreak(schedule, currentTime),
  };
}
