"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

// Matches your ITramStop Schema from MongoDB
interface ITramStop {
  _id: string;
  name: string;
  vasttrafikGid: string;
}

// Matches your ITramLine Schema from MongoDB
interface ITramLine {
  _id: string;
  number: number;
  direction: string;
  route: ITramStop[];
}

// Matches the internal format for the Västtrafik proxy response
interface Trip {
  _id: string;
  tramline: { number: string; direction: string };
  startTime: string;
  endTime: string;
  heading: string;
  originName: string;
  destinationName: string;
}

const CirculationBuilderForm = () => {
  const searchParams = useSearchParams();
  const editId = searchParams.get("edit");

  // --- DATA STATE ---
  const [dbTramlines, setDbTramlines] = useState<ITramLine[]>([]);
  const [availableStops, setAvailableStops] = useState<ITramStop[]>([]);
  const [filteredTrips, setFilteredTrips] = useState<Trip[]>([]);
  const [selectedTrips, setSelectedTrips] = useState<Trip[]>([]);

  // --- FORM FILTERS ---
  const [filters, setFilters] = useState({
    tramline: "",
    heading: "",
    originGid: "",
    destinationGid: "",
  });

  const [designation, setDesignation] = useState<number | "">("");
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");

  /**
   * 1. LOAD DATA: Fetch all lines from your MongoDB API on mount
   */
  useEffect(() => {
    const fetchLines = async () => {
      try {
        const res = await fetch("/api/tramline");
        if (!res.ok) throw new Error("Failed to fetch lines");
        const data: ITramLine[] = await res.json();
        setDbTramlines(data);
      } catch (err) {
        console.error("DB Fetch Error:", err);
        setMessage("❌ Failed to load lines from Database.");
      }
    };
    fetchLines();
  }, []);

  /**
   * 2. SYNC DROPDOWNS: Update headings/stops when line selection changes
   */
  useEffect(() => {
    if (!filters.tramline || !filters.heading) {
      setAvailableStops([]);
      return;
    }

    const selectedLineData = dbTramlines.find(
      (l) => l.number.toString() === filters.tramline && l.direction === filters.heading
    );

    if (selectedLineData && selectedLineData.route) {
      setAvailableStops(selectedLineData.route);

      // IMPORTANT: Check if the first and last stops actually have the GID 
      // before updating the filters to avoid "undefined" values.
      const firstStop = selectedLineData.route[0];
      const lastStop = selectedLineData.route[selectedLineData.route.length - 1];

      if (firstStop?.vasttrafikGid && lastStop?.vasttrafikGid) {
        setFilters((prev) => ({
          ...prev,
          originGid: firstStop.vasttrafikGid,
          destinationGid: lastStop.vasttrafikGid,
        }));
      }
    }
  }, [filters.tramline, filters.heading, dbTramlines]);

  /**
   * 3. LIVE SEARCH: Fetch trips from Västtrafik Proxy
   */
  const applyFilters = async () => {
    console.log("Current filters before check:", filters);
    console.log("originGid:", filters.originGid);
    console.log("destinationGid:", filters.destinationGid);
    if (!filters.originGid || !filters.destinationGid) {
      console.log("Missing GIDs!");
      setMessage("Please select both origin and destination stops");
      return;
    }

    setIsLoading(true);
    setMessage("");
    setFilteredTrips([]);

    try {
      const params = new URLSearchParams({
        line: filters.tramline,
        originGid: filters.originGid,
        destinationGid: filters.destinationGid,
      });

      console.log(
        "Fetching URL:",
        `/api/vasttrafik/search-trips?${params.toString()}`,
      );

      const res = await fetch(
        `/api/vasttrafik/search-trips?${params.toString()}`,
      );
      console.log("Response status:", res.status);
      const data = await res.json();
      console.log("Response data:", data);

      if (Array.isArray(data)) {
        setFilteredTrips(
          data.sort((a, b) => a.startTime.localeCompare(b.startTime)),
        );
      }
    } catch (error) {
      console.log("Data is not an array:");
      setMessage("❌ Error connecting to Västtrafik API.");
    } finally {
      setIsLoading(false);
    }
  };

  // --- HELPERS ---
  const uniqueLineNumbers = Array.from(
    new Set(dbTramlines.map((l) => l.number)),
  ).sort((a, b) => a - b);
  const availableDirections = dbTramlines
    .filter((l) => l.number.toString() === filters.tramline)
    .map((l) => l.direction);

  const calculateGap = (start: string, end: string): number => {
    const [sH, sM] = start.split(":").map(Number);
    const [eH, eM] = end.split(":").map(Number);
    return sH * 60 + sM - (eH * 60 + eM);
  };

  const addTrip = (trip: Trip) => {
    if (!selectedTrips.find((t) => t._id === trip._id)) {
      const updated = [...selectedTrips, trip].sort((a, b) =>
        a.startTime.localeCompare(b.startTime),
      );
      setSelectedTrips(updated);
    }
  };

  const removeTrip = (id: string) =>
    setSelectedTrips(selectedTrips.filter((t) => t._id !== id));

  return (
    <div className="p-8 max-w-7xl mx-auto bg-slate-50 min-h-screen">
      <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-200 mb-8">
        <header className="flex justify-between items-center mb-10">
          <div>
            <h1 className="text-4xl font-black text-slate-900 tracking-tighter italic">
              CIRCULATION BUILDER
            </h1>
            <p className="text-slate-400 font-bold uppercase text-[10px] tracking-widest mt-1">
              MongoDB & Västtrafik v4 Sync
            </p>
          </div>
          <div className="bg-blue-600 p-4 rounded-2xl text-white flex flex-col items-center min-w-[140px] shadow-xl shadow-blue-100">
            <span className="text-[10px] font-black opacity-70 mb-1">
              DESIGNATION
            </span>
            <input
              type="number"
              className="bg-transparent text-center text-3xl font-black outline-none w-full placeholder:text-blue-400"
              placeholder="000"
              value={designation}
              onChange={(e) => setDesignation(Number(e.target.value))}
            />
          </div>
        </header>

        {/* Database-Driven Filters */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-end">
          <div className="space-y-2">
            <label className="text-[11px] font-black text-slate-500 uppercase ml-1">
              Tram Line
            </label>
            <select
              className="w-full p-4 rounded-2xl border-2 border-slate-100 font-bold bg-slate-50 focus:bg-white focus:border-blue-500 transition outline-none"
              value={filters.tramline}
              onChange={(e) =>
                setFilters({
                  ...filters,
                  tramline: e.target.value,
                  heading: "",
                })
              }
            >
              <option value="">Select Line</option>
              {uniqueLineNumbers.map((num) => (
                <option key={num} value={num}>
                  Line {num}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-[11px] font-black text-slate-500 uppercase ml-1">
              Heading
            </label>
            <select
              className="w-full p-4 rounded-2xl border-2 border-slate-100 font-bold bg-slate-50 focus:bg-white focus:border-blue-500 transition outline-none disabled:opacity-30"
              value={filters.heading}
              onChange={(e) =>
                setFilters({ ...filters, heading: e.target.value })
              }
              disabled={!filters.tramline}
            >
              <option value="">Direction</option>
              {availableDirections.map((dir) => (
                <option key={dir} value={dir}>
                  {dir}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-[11px] font-black text-slate-500 uppercase ml-1">
              From
            </label>
            <select
              className="w-full p-4 rounded-2xl border-2 border-slate-100 font-bold bg-slate-50"
              value={filters.originGid}
              onChange={(e) =>
                setFilters({ ...filters, originGid: e.target.value })
              }
            >
              {availableStops.map((s) => (
                <option key={s._id} value={s.vasttrafikGid}>
                  {s.name}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-[11px] font-black text-slate-500 uppercase ml-1">
              To
            </label>
            <select
              className="w-full p-4 rounded-2xl border-2 border-slate-100 font-bold bg-slate-50"
              value={filters.destinationGid}
              onChange={(e) =>
                setFilters({ ...filters, destinationGid: e.target.value })
              }
            >
              {availableStops.map((s) => (
                <option key={s._id} value={s.vasttrafikGid}>
                  {s.name}
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={() => {
              console.log("BUTTON CLICKED!");
              applyFilters();
            }}
            className="md:col-span-4 bg-slate-900 hover:bg-black text-white font-black py-5 rounded-2xl transition shadow-xl active:scale-[0.99]"
          >
            {isLoading ? "FETCHING REAL-TIME TIMETABLE..." : "SEARCH JOURNEYS"}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* Left: Available Trips */}
        <section>
          <h2 className="text-xl font-black text-slate-800 mb-5 px-2">
            AVAILABLE TRIPS
          </h2>
          <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm h-[600px] flex flex-col">
            <div className="overflow-y-auto flex-1 divide-y divide-slate-50">
              {filteredTrips.map((trip) => (
                <div
                  key={trip._id}
                  className="p-6 flex justify-between items-center hover:bg-slate-50 transition group"
                >
                  <div>
                    <div className="text-2xl font-mono font-black text-slate-900 tracking-tight">
                      {trip.startTime}{" "}
                      <span className="text-slate-300 mx-1">→</span>{" "}
                      {trip.endTime}
                    </div>
                    <div className="text-[10px] font-black text-blue-500 tracking-widest uppercase">
                      Heading: {trip.heading}
                    </div>
                  </div>
                  <button
                    onClick={() => addTrip(trip)}
                    className="bg-slate-100 group-hover:bg-blue-600 group-hover:text-white text-slate-900 px-6 py-3 rounded-xl text-xs font-black transition"
                  >
                    ADD TRIP
                  </button>
                </div>
              ))}
              {filteredTrips.length === 0 && !isLoading && (
                <div className="h-full flex items-center justify-center text-slate-300 font-bold italic">
                  No results found
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Right: Circulation Sequence */}
        <section>
          <h2 className="text-xl font-black text-slate-800 mb-5 px-2">
            CURRENT SEQUENCE
          </h2>
          <div className="bg-slate-200/40 rounded-3xl border-2 border-dashed border-slate-200 p-6 h-[600px] overflow-y-auto">
            {selectedTrips.length === 0 && (
              <div className="h-full flex flex-col items-center justify-center text-slate-400 space-y-2">
                <span className="text-4xl">🚋</span>
                <span className="font-bold italic">
                  Draft a shift by adding trips
                </span>
              </div>
            )}
            {selectedTrips.map((trip, idx) => {
              const prev = selectedTrips[idx - 1];
              const gap = prev
                ? calculateGap(trip.startTime, prev.endTime)
                : null;

              return (
                <div key={idx}>
                  {gap !== null && (
                    <div
                      className={`flex items-center justify-center gap-2 py-4 text-[10px] font-black tracking-widest ${gap < 5 ? "text-red-500" : "text-slate-400"}`}
                    >
                      <div className="h-[1px] w-10 bg-current opacity-20"></div>
                      {gap < 0
                        ? `⚠️ OVERLAP: ${gap} MIN`
                        : `LAYOVER: ${gap} MIN`}
                      <div className="h-[1px] w-10 bg-current opacity-20"></div>
                    </div>
                  )}
                  <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex justify-between items-center">
                    <div>
                      <div className="text-[10px] font-black text-blue-600 mb-1">
                        LEG #{idx + 1}
                      </div>
                      <div className="text-xl font-mono font-bold text-slate-900">
                        {trip.startTime} — {trip.endTime}
                      </div>
                      <div className="text-xs font-bold text-slate-400 mt-1 uppercase tracking-tight">
                        {trip.originName} to {trip.destinationName}
                      </div>
                    </div>
                    <button
                      onClick={() => removeTrip(trip._id)}
                      className="w-10 h-10 rounded-full hover:bg-red-50 flex items-center justify-center text-red-200 hover:text-red-500 transition"
                    >
                      ✕
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      </div>

      <footer className="mt-12 flex flex-col items-center">
        <button
          className="bg-blue-600 text-white px-20 py-6 rounded-3xl font-black text-xl hover:bg-blue-700 shadow-2xl shadow-blue-200 transition active:scale-95 disabled:opacity-50"
          disabled={selectedTrips.length === 0 || !designation}
        >
          {editId ? "UPDATE CIRCULATION" : "SAVE NEW CIRCULATION"}
        </button>
        {message && <p className="mt-6 text-blue-600 font-bold">{message}</p>}
      </footer>
    </div>
  );
};

export default CirculationBuilderForm;
