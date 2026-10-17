"use client";

import { useState, useEffect } from "react";

/**
 * Represents a driver fetched from the backend API.
 */
interface Driver {
  _id: string;
  name: string;
  employeeId: string;
}
/**
 * Detailed stop information along a trip, enriched from Västtrafik API v4.
 */
interface RouteStopDetail {
  index: number;
  name: string;
  gid: string | null;
  arrivalTime: string;
  departureTime: string;
  isReliefPoint: boolean;
}

/**
 * Trip enriched with all intermediate stops from Västtrafik.
 */
interface TripWithStops {
  tripIndex: number;
  line: string;
  heading: string;
  startTime: string;
  endTime: string;
  originName: string;
  destinationName: string;
  source: "vasttrafik" | "fallback";
  stops: RouteStopDetail[];
}

/**
 * Represents an individual trip leg contained within a circulation template.
 */
interface Trip {
  startTime: string;
  endTime: string;
  line?: string | number;
  heading?: string;
  originName: string;
  originGid?: string;
  destinationName: string;
  destinationGid?: string;
  stops?: RouteStopDetail[];
}

/**
 * Predefined tram circulation (shift) template that contains scheduled trips.
 */
interface CirculationTemplate {
  _id: string;
  designation: number;
  trips: Trip[];
}

/**
 * Represents a single work segment / relief assignment configured by the dispatcher.
 */
interface ScheduleCirculation {
  circulationTemplate: string;
  startTime: string;
  endTime: string;
  startStop: string;
  endStop: string;
}

/**
 * Configurable API endpoints for data fetching and form submission.
 */
interface EndpointsProp {
  drivers?: string;
  circulations?: string;
  save?: string;
}

/**
 * Form component for assigning a tram driver to one or more circulation templates
 * (work segments) for a specific duty date.
 */
const DriverScheduleForm = ({
  endpoints = {
    drivers: "/api/driver",
    circulations: "/api/circulationTemplate",
    save: "/api/driverSchedule/new",
  },
}: {
  endpoints?: EndpointsProp;
}) => {
  // Available drivers and circulation templates fetched from the server
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [circulations, setCirculations] = useState<CirculationTemplate[]>([]);

  // Selected driver employeeId
  const [employeeId, setEmployeeId] = useState("");

  // Duty date in YYYY-MM-DD format (initialized to local today)
  const [date, setDate] = useState(() => {
    const d = new Date();
    return new Date(d.getTime() - d.getTimezoneOffset() * 60000)
      .toISOString()
      .split("T")[0];
  });

  // Dynamic list of assigned circulation segments
  const [selectedCircs, setSelectedCircs] = useState<ScheduleCirculation[]>([
    {
      circulationTemplate: "",
      startTime: "",
      endTime: "",
      startStop: "",
      endStop: "",
    },
  ]);

  // Intermediate route and relief stops fetched from Västtrafik API (keyed by templateId_date)
  const [templateStopsMap, setTemplateStopsMap] = useState<
    Record<string, TripWithStops[]>
  >({});
  const [loadingStops, setLoadingStops] = useState<Record<string, boolean>>({});

  // Form submission and user notification feedback states
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<{
    text: string;
    isError: boolean;
  } | null>(null);

  /**
   * Fetches stop-by-stop details from Västtrafik for a specific circulation template and date.
   */
  const fetchTemplateStops = async (templateId: string, dutyDate: string) => {
    if (!templateId) return;
    const cacheKey = `${templateId}_${dutyDate}`;
    if (templateStopsMap[cacheKey] || loadingStops[cacheKey]) return;

    setLoadingStops((prev) => ({ ...prev, [cacheKey]: true }));
    try {
      const res = await fetch(
        `/api/circulationTemplate/${templateId}/stops?date=${dutyDate}`,
        { cache: "no-store" }
      );
      if (!res.ok) throw new Error("Failed to fetch stops");
      const data = await res.json();
      setTemplateStopsMap((prev) => ({
        ...prev,
        [cacheKey]: data.trips || [],
      }));
    } catch (err) {
      console.warn("Failed to load Västtrafik stops for template", err);
    } finally {
      setLoadingStops((prev) => ({ ...prev, [cacheKey]: false }));
    }
  };

  // Re-fetch intermediate stops when date changes for any selected templates
  useEffect(() => {
    selectedCircs.forEach((c) => {
      if (c.circulationTemplate) {
        fetchTemplateStops(c.circulationTemplate, date);
      }
    });
  }, [date]);

  // Load available drivers and circulation templates on mount / endpoint change
  useEffect(() => {
    fetch(endpoints.drivers!, { cache: "no-store" })
      .then((res) => res.json())
      .then((data) => setDrivers(data))
      .catch(() =>
        setMessage({ text: "Failed to load drivers", isError: true })
      );

    fetch(endpoints.circulations!, { cache: "no-store" })
      .then((res) => res.json())
      .then((data) => setCirculations(data))
      .catch(() =>
        setMessage({ text: "Failed to load circulations", isError: true })
      );
  }, [endpoints]);

  /**
   * Appends a new blank circulation work segment to the list.
   */
  const addCirc = () => {
    setSelectedCircs([
      ...selectedCircs,
      {
        circulationTemplate: "",
        startTime: "",
        endTime: "",
        startStop: "",
        endStop: "",
      },
    ]);
  };

  /**
   * Removes a work segment at the specified index.
   */
  const removeCirc = (index: number) => {
    setSelectedCircs(selectedCircs.filter((_, i) => i !== index));
  };

  /**
   * Updates a specific field on a work segment at the given index.
   */
  const updateCirc = (
    index: number,
    field: keyof ScheduleCirculation,
    value: string
  ) => {
    const newSelectedCircs = [...selectedCircs];
    newSelectedCircs[index][field] = value;
    setSelectedCircs(newSelectedCircs);
  };

  /**
   * Validates and submits the driver schedule assignment to the backend.
   */
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (selectedCircs.length === 0) {
      setMessage({
        text: "Please add at least one work segment.",
        isError: true,
      });
      return;
    }

    setIsSubmitting(true);
    setMessage(null);

    // Payload containing the driver ID, duty date, and assigned segments
    const payload = { employeeId, date, circulations: selectedCircs };

    fetch(endpoints.save!, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    })
      .then(async (response) => {
        if (!response.ok) {
          const errData = await response.json().catch(() => ({}));
          throw new Error(errData.error || "Server error");
        }
        return response.json();
      })
      .then(() =>
        setMessage({ text: "Schedule saved successfully!", isError: false })
      )
      .catch((err) =>
        setMessage({
          text: `Failed to save schedule: ${err.message}`,
          isError: true,
        })
      )
      .finally(() => setIsSubmitting(false));
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col space-y-6 pb-4">
      {/* Header */}
      <div className="flex justify-between items-center border-b pb-4">
        <h2 className="text-2xl font-bold text-slate-800">
          Manual Shift Assignment
        </h2>
        <span className="text-xs text-slate-500 font-mono">
          TramTrack Dispatch
        </span>
      </div>

      {/* Driver Selection & Duty Date */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-bold text-slate-500 uppercase mb-1">
            Driver
          </label>
          <select
            value={employeeId}
            onChange={(e) => setEmployeeId(e.target.value)}
            required
            className="w-full p-3 bg-white border rounded-xl font-medium"
          >
            <option value="">Select Driver</option>
            {drivers.map((d) => (
              <option key={d._id} value={d.employeeId}>
                {d.name} ({d.employeeId})
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-500 uppercase mb-1">
            Duty Date
          </label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
            className="w-full p-3 bg-white border rounded-xl font-medium"
          />
        </div>
      </div>

      {/* Dynamic List of Work Segments / Circulations */}
      <div className="space-y-4">
        {selectedCircs.map((c, i) => {
          const activeTemplate = circulations.find(
            (temp) => temp._id === c.circulationTemplate
          );

          const cacheKey = `${c.circulationTemplate}_${date}`;
          const intermediateTrips = templateStopsMap[cacheKey];
          const isLoadingStops = Boolean(loadingStops[cacheKey]);

          return (
            <div
              key={i}
              className="p-6 bg-white border rounded-2xl shadow-sm space-y-5 relative"
            >
              {/* Button to remove this segment */}
              <button
                type="button"
                onClick={() => removeCirc(i)}
                className="absolute top-4 right-4 text-red-400 font-bold hover:text-red-600 transition-colors"
                title="Remove Segment"
              >
                ✕
              </button>

              {/* Step 1: Template Selection */}
              <div>
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  1. Select Circulation Template
                </label>
                <select
                  value={c.circulationTemplate}
                  onChange={(e) => {
                    const newTemplateId = e.target.value;
                    updateCirc(i, "circulationTemplate", newTemplateId);
                    // Reset relief times if template changes
                    updateCirc(i, "startTime", "");
                    updateCirc(i, "startStop", "");
                    updateCirc(i, "endTime", "");
                    updateCirc(i, "endStop", "");
                    if (newTemplateId) {
                      fetchTemplateStops(newTemplateId, date);
                    }
                  }}
                  className="w-full mt-1.5 p-3 bg-slate-50 border rounded-lg font-semibold"
                  required
                >
                  <option value="">Choose a tram plan...</option>
                  {circulations.map((temp) => {
                    const firstTrip = temp.trips[0];
                    const lastTrip = temp.trips[temp.trips.length - 1];
                    const span =
                      firstTrip && lastTrip
                        ? `${firstTrip.startTime} – ${lastTrip.endTime}`
                        : "No trips";
                    return (
                      <option key={temp._id} value={temp._id}>
                        #{temp.designation} ({span})
                      </option>
                    );
                  })}
                </select>

                {/* Loading indicator when fetching intermediate stops from Västtrafik */}
                {isLoadingStops && (
                  <p className="mt-2 text-xs text-blue-600 animate-pulse font-medium flex items-center gap-1.5">
                    <span>⏳</span>
                    <span>Fetching intermediate route & relief stops from Västtrafik...</span>
                  </p>
                )}

                {/* Västtrafik route stops summary badge */}
                {!isLoadingStops && intermediateTrips && intermediateTrips.length > 0 && (
                  <div className="mt-2 text-xs text-emerald-800 bg-emerald-50 border border-emerald-200 rounded px-2.5 py-1.5 flex items-center justify-between">
                    <span>
                      ✓ Västtrafik route loaded:{" "}
                      <strong>
                        {intermediateTrips.reduce(
                          (acc, t) => acc + t.stops.length,
                          0
                        )}
                      </strong>{" "}
                      stops (
                      <strong>
                        {intermediateTrips.reduce(
                          (acc, t) =>
                            acc + t.stops.filter((s) => s.isReliefPoint).length,
                          0
                        )}
                      </strong>{" "}
                      relief points)
                    </span>
                    <span className="text-[10px] text-emerald-700 font-mono uppercase bg-emerald-100 px-1.5 py-0.5 rounded">
                      Västtrafik API v4
                    </span>
                  </div>
                )}

                {/* Preview of trips within selected template */}
                {activeTemplate && activeTemplate.trips.length > 0 && (
                  <div className="mt-2 p-2 bg-slate-50 rounded border text-xs text-slate-600 flex flex-wrap gap-2">
                    <span className="font-semibold text-slate-800">
                      Template Trips ({activeTemplate.trips.length}):
                    </span>
                    {activeTemplate.trips.map((t, idx) => (
                      <span
                        key={idx}
                        className="bg-white px-2 py-0.5 rounded border border-slate-200"
                      >
                        {t.startTime}–{t.endTime} ({t.originName} →{" "}
                        {t.destinationName})
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Take-over and Hand-over sections */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t">
                {/* Step 2: Take-over Point */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-blue-600 uppercase">
                    2. Relief Take-over
                  </label>
                  <select
                    value={
                      c.startTime && c.startStop
                        ? `${c.startTime}|${c.startStop}`
                        : ""
                    }
                    onChange={(e) => {
                      const [time, stop] = e.target.value.split("|");
                      updateCirc(i, "startTime", time || "");
                      updateCirc(i, "startStop", stop || "");
                    }}
                    disabled={!activeTemplate || isLoadingStops}
                    required
                    className="w-full p-2.5 border rounded-lg shadow-sm font-semibold text-sm bg-white disabled:bg-slate-100"
                  >
                    <option value="">
                      {isLoadingStops
                        ? "Loading stops from Västtrafik..."
                        : "Select Take-over Point..."}
                    </option>

                    {/* Intermediate stops from Västtrafik */}
                    {intermediateTrips && intermediateTrips.length > 0 ? (
                      intermediateTrips.map((dt) => (
                        <optgroup
                          key={`start-leg-${dt.tripIndex}`}
                          label={`Leg ${dt.tripIndex + 1}: Line ${dt.line} → ${dt.heading} (${dt.startTime}–${dt.endTime})`}
                        >
                          {dt.stops.map((stop, sIdx) => {
                            const time = stop.departureTime || stop.arrivalTime;
                            const badge = stop.isReliefPoint
                              ? " ⭐ [Relief Point]"
                              : "";
                            return (
                              <option
                                key={`start-${dt.tripIndex}-${sIdx}`}
                                value={`${time}|${stop.name}`}
                              >
                                {time} — {stop.name}
                                {badge}
                              </option>
                            );
                          })}
                        </optgroup>
                      ))
                    ) : (
                      /* Fallback for templates before stops are fetched */
                      activeTemplate?.trips.map((trip, idx) => (
                        <optgroup
                          key={`start-group-${idx}`}
                          label={`Leg ${idx + 1}: ${trip.originName} → ${trip.destinationName}`}
                        >
                          <option
                            value={`${trip.startTime}|${trip.originName}`}
                          >
                            {trip.startTime} — {trip.originName}
                          </option>
                          <option value={`${trip.endTime}|${trip.destinationName}`}>
                            {trip.endTime} — {trip.destinationName}
                          </option>
                        </optgroup>
                      ))
                    )}
                  </select>
                </div>

                {/* Step 3: Hand-over Point */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-orange-600 uppercase">
                    3. Relief Hand-over
                  </label>
                  <select
                    value={
                      c.endTime && c.endStop ? `${c.endTime}|${c.endStop}` : ""
                    }
                    onChange={(e) => {
                      const [time, stop] = e.target.value.split("|");
                      updateCirc(i, "endTime", time || "");
                      updateCirc(i, "endStop", stop || "");
                    }}
                    disabled={!activeTemplate || isLoadingStops}
                    required
                    className="w-full p-2.5 border rounded-lg shadow-sm font-semibold text-sm bg-white disabled:bg-slate-100"
                  >
                    <option value="">
                      {isLoadingStops
                        ? "Loading stops from Västtrafik..."
                        : "Select Hand-over Point..."}
                    </option>

                    {/* Intermediate stops from Västtrafik */}
                    {intermediateTrips && intermediateTrips.length > 0 ? (
                      intermediateTrips.map((dt) => (
                        <optgroup
                          key={`end-leg-${dt.tripIndex}`}
                          label={`Leg ${dt.tripIndex + 1}: Line ${dt.line} → ${dt.heading} (${dt.startTime}–${dt.endTime})`}
                        >
                          {dt.stops.map((stop, sIdx) => {
                            const time = stop.arrivalTime || stop.departureTime;
                            const badge = stop.isReliefPoint
                              ? " ⭐ [Relief Point]"
                              : "";
                            return (
                              <option
                                key={`end-${dt.tripIndex}-${sIdx}`}
                                value={`${time}|${stop.name}`}
                              >
                                {time} — {stop.name}
                                {badge}
                              </option>
                            );
                          })}
                        </optgroup>
                      ))
                    ) : (
                      /* Fallback for templates before stops are fetched */
                      activeTemplate?.trips.map((trip, idx) => (
                        <optgroup
                          key={`end-group-${idx}`}
                          label={`Leg ${idx + 1}: ${trip.originName} → ${trip.destinationName}`}
                        >
                          <option
                            value={`${trip.startTime}|${trip.originName}`}
                          >
                            {trip.startTime} — {trip.originName}
                          </option>
                          <option value={`${trip.endTime}|${trip.destinationName}`}>
                            {trip.endTime} — {trip.destinationName}
                          </option>
                        </optgroup>
                      ))
                    )}
                  </select>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Action Buttons: Add Segment & Submit */}
      <div className="flex flex-col sm:flex-row gap-4 pt-2">
        <button
          type="button"
          onClick={addCirc}
          className="flex-1 py-3.5 border-2 border-dashed border-slate-300 rounded-xl text-slate-600 font-bold hover:bg-white hover:text-blue-600 hover:border-blue-400 transition-all"
        >
          + Add Work Segment
        </button>
        <button
          type="submit"
          disabled={isSubmitting || selectedCircs.length === 0}
          className="flex-1 py-3.5 bg-blue-600 text-white font-bold rounded-xl shadow-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
        >
          {isSubmitting ? "Saving..." : "Save Schedule"}
        </button>
      </div>

      {/* Status / Error Notification */}
      {message && (
        <div
          className={`p-4 rounded-md ${
            message.isError
              ? "bg-red-100 text-red-800"
              : "bg-green-100 text-green-800"
          }`}
        >
          {message.text}
        </div>
      )}
    </form>
  );
};

export default DriverScheduleForm;