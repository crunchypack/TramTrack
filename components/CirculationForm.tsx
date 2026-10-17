"use client";

import { useEffect, useState } from "react";

interface ITramStop {
  _id: string;
  name: string;
  vasttrafikGid: string;
}

interface ITramLine {
  _id: string;
  number: number;
  direction: string;
  route: ITramStop[];
  searchRoute: ITramStop[];
}

interface SearchTrip {
  startTime: string;
  endTime: string;
  heading: string;
  line?: string | number;
  originName: string;
  originGid: string;
  destinationName: string;
  destinationGid: string;
  detailsReference?: string;
  serviceJourneyGid?: string;
  stops?: any[];
}

const CirculationBuilderForm = () => {
  const [dbTramlines, setDbTramlines] = useState<ITramLine[]>([]);
  const [selectedLine, setSelectedLine] = useState<ITramLine | null>(null);

  // Filters
  const [originGid, setOriginGid] = useState("");
  const [destGid, setDestGid] = useState("");
  const [designation, setDesignation] = useState("");
  const [dayType, setDayType] = useState("weekday");

  const [filteredTrips, setFilteredTrips] = useState<SearchTrip[]>([]);
  const [selectedTrips, setSelectedTrips] = useState<SearchTrip[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const [selectedDate, setSelectedDate] = useState(
    () => new Date().toISOString().split("T")[0],
  );
  const [selectedTime, setSelectedTime] = useState("04:00");

  useEffect(() => {
    fetch("/api/tramline", { cache: "no-store" })
      .then((res) => (res.ok ? res.json() : []))
      .then((data: ITramLine[]) => {
        // Sort numerically by line number, then alphabetically by direction
        const sortedLines = data.sort((a, b) => {
          if (a.number === b.number) {
            return a.direction.localeCompare(b.direction);
          }
          return a.number - b.number;
        });
        
        setDbTramlines(sortedLines);
      })
      .catch((err) => console.error("Error loading lines:", err));
  }, []);

  const handleLineChange = (lineId: string) => {
    const line = dbTramlines.find((l) => l._id === lineId) || null;
    setSelectedLine(line);
    if (line && line.searchRoute?.length > 0) {
      setOriginGid(line.searchRoute[0]?.vasttrafikGid || "");
      setDestGid(
        line.searchRoute[line.searchRoute.length - 1]?.vasttrafikGid || "",
      );
    } else {
      setOriginGid("");
      setDestGid("");
    }
  };

  const searchVasttrafik = async () => {
    if (!originGid || !destGid || !selectedLine) return;
    setIsLoading(true);

    const params = new URLSearchParams({
      line: selectedLine.number.toString(),
      originGid,
      destinationGid: destGid,
      date: selectedDate,
      time: selectedTime,
    });

    try {
      const res = await fetch(`/api/vasttrafik/search-trips?${params}`);
      const data = await res.json();
      setFilteredTrips(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Västtrafik search fetch error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const removeSelectedTrip = (index: number) => {
    setSelectedTrips((prev) => prev.filter((_, idx) => idx !== index));
  };

  const handleSave = async () => {
    if (!designation.trim()) {
      alert("Designation is required.");
      return;
    }

    const invalidTrip = selectedTrips.find(
      (t) => !t.originGid || !t.destinationGid,
    );
    if (invalidTrip) {
      alert(
        "One or more selected trips are missing origin or destination GID.",
      );
      return;
    }
    // Validate continuous sequence
    for (let i = 1; i < selectedTrips.length; i++) {
      const prevTrip = selectedTrips[i - 1];
      const currTrip = selectedTrips[i];

      // Check for time overlap
      if (currTrip.startTime < prevTrip.endTime) {
        alert(
          `Sequence Error: Leg ${i + 1} (${currTrip.startTime}) starts before Leg ${i} (${prevTrip.endTime}) finishes.`,
        );
        return;
      }

      // Check for spatial continuity (teleportation)
      if (currTrip.originGid !== prevTrip.destinationGid) {
        alert(
          `Sequence Error: Leg ${i} ends at ${prevTrip.destinationName}, but Leg ${i + 1} starts at ${currTrip.originName}.`,
        );
        return;
      }
    }
    setIsSaving(true);

    const payload = {
      designation: Number(designation),
      dayType,
      season: "standard",
      trips: selectedTrips.map((t) => ({
        startTime: t.startTime,
        endTime: t.endTime,
        line: t.line,
        heading: t.heading,
        originName: t.originName,
        originGid: t.originGid,
        destinationName: t.destinationName,
        destinationGid: t.destinationGid,
        detailsReference: t.detailsReference,
        serviceJourneyGid: t.serviceJourneyGid,
        stops: t.stops,
      })),
    };

    try {
      const res = await fetch("/api/circulationTemplate/new", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.error || "Failed to save template");
        return;
      }

      alert("Circulation template saved successfully!");
      setSelectedTrips([]);
      setDesignation("");
    } catch (err: any) {
      console.error("Save error:", err);
      alert("Failed to save template.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-8">
      <header className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-black italic tracking-tight">
            CIRCULATION BUILDER v2
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Build repeatable duty blocks from live Västtrafik schedules
          </p>
        </div>
        <div className="flex gap-4">
          <input
            placeholder="Designation (e.g. 101)"
            className="border p-3.5 rounded-xl font-bold bg-white"
            value={designation}
            onChange={(e) => setDesignation(e.target.value)}
          />
          <select
            className="border p-3.5 rounded-xl font-bold bg-white"
            value={dayType}
            onChange={(e) => setDayType(e.target.value)}
          >
            <option value="weekday">Weekday</option>
            <option value="saturday">Saturday</option>
            <option value="sunday">Sunday</option>
          </select>
        </div>
      </header>

      {/* Query Bar */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-white p-6 rounded-3xl shadow-sm border">
        <div>
          <label className="block text-xs font-bold text-slate-400 uppercase mb-1">
            Line & Direction
          </label>
          <select
            onChange={(e) => handleLineChange(e.target.value)}
            className="w-full p-3.5 border rounded-xl font-bold"
            value={selectedLine?._id || ""}
          >
            <option value="">Select Line & Direction</option>
            {dbTramlines.map((l) => (
              <option key={l._id} value={l._id}>
                Line {l.number} to {l.direction}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-400 uppercase mb-1">
            Origin Stop
          </label>
          <select
            value={originGid}
            onChange={(e) => setOriginGid(e.target.value)}
            className="w-full p-3.5 border rounded-xl"
            disabled={!selectedLine}
          >
            <option value="">Select Origin</option>
            {selectedLine?.searchRoute?.map((stop) => (
              <option key={stop._id} value={stop.vasttrafikGid}>
                {stop.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-400 uppercase mb-1">
            Destination Stop
          </label>
          <select
            value={destGid}
            onChange={(e) => setDestGid(e.target.value)}
            className="w-full p-3.5 border rounded-xl"
            disabled={!selectedLine}
          >
            <option value="">Select Destination</option>
            {selectedLine?.searchRoute?.map((stop) => (
              <option key={stop._id} value={stop.vasttrafikGid}>
                {stop.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-400 uppercase mb-1">
            Timetable Date
          </label>
          <input
            type="date"
            className="w-full border p-3.5 rounded-xl font-medium"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
          />
        </div>

        <div>
          <label className="block text-xs font-bold uppercase text-slate-400 mb-1">
            Start Time
          </label>
          <input
            type="time"
            className="w-full border p-3.5 rounded-xl font-mono text-base"
            value={selectedTime}
            onChange={(e) => setSelectedTime(e.target.value)}
          />
        </div>

        <div className="flex items-end">
          <button
            onClick={searchVasttrafik}
            disabled={isLoading || !selectedLine || !originGid || !destGid}
            className="w-full bg-blue-600 text-white p-3.5 rounded-xl font-black uppercase tracking-wider hover:bg-blue-700 disabled:opacity-50 transition-colors"
          >
            {isLoading ? "Searching..." : "Search Journeys"}
          </button>
        </div>
      </div>

      {/* Two-Column Search & Sequence Area */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <section className="bg-slate-100 p-5 rounded-2xl h-[520px] overflow-y-auto border">
          <div className="flex justify-between items-center mb-4">
            <h2 className="font-bold text-slate-800">Search Results</h2>
            <span className="text-xs font-semibold text-slate-500">
              {filteredTrips.length} found
            </span>
          </div>

          {filteredTrips.length === 0 ? (
            <p className="text-sm text-slate-400 text-center py-12">
              Run a search to display matching tram trips.
            </p>
          ) : (
            filteredTrips.map((trip, i) => (
              <div
                key={i}
                className="bg-white p-3.5 mb-2.5 rounded-xl flex justify-between items-center shadow-sm border border-slate-200 hover:border-blue-300 transition-all"
              >
                <div>
                  <div className="font-mono font-bold text-slate-900 text-sm">
                    {trip.startTime} → {trip.endTime}
                  </div>
                  <div className="text-xs text-slate-600">
                    Line {selectedLine?.number || trip.line} mot {trip.heading}
                  </div>
                  <div className="text-[11px] text-slate-400">
                    {trip.originName} → {trip.destinationName}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() =>
                    setSelectedTrips((prev) => {
                      // 1. Prevent exact duplicates
                      const exists = prev.some(
                        (t) =>
                          t.startTime === trip.startTime &&
                          t.endTime === trip.endTime &&
                          t.originGid === trip.originGid,
                      );
                      if (exists) return prev;

                      // 2. Lock state and add the trip
                      const updatedTrips = [
                        ...prev,
                        { ...trip, line: selectedLine?.number || trip.line },
                      ];

                      // 3. Auto-sort chronologically by start time
                      return updatedTrips.sort((a, b) =>
                        a.startTime.localeCompare(b.startTime),
                      );
                    })
                  }
                  className="bg-blue-50 text-blue-700 hover:bg-blue-600 hover:text-white px-3.5 py-1.5 rounded-lg text-xs font-bold transition-colors"
                >
                  ADD
                </button>
              </div>
            ))
          )}
        </section>

        <section className="bg-blue-50/50 p-5 rounded-2xl h-[520px] overflow-y-auto border-2 border-blue-100">
          <div className="flex justify-between items-center mb-4">
            <h2 className="font-bold text-blue-950">Current Sequence</h2>
            <span className="text-xs font-semibold text-blue-700">
              {selectedTrips.length} legs
            </span>
          </div>

          {selectedTrips.length === 0 ? (
            <p className="text-sm text-slate-400 text-center py-12">
              Click &quot;ADD&quot; on trips to chain them into this circulation
              template.
            </p>
          ) : (
            selectedTrips.map((trip, i) => (
              <div
                key={i}
                className="bg-white p-3.5 mb-2.5 rounded-xl border border-blue-200 shadow-sm relative group"
              >
                <button
                  type="button"
                  onClick={() => removeSelectedTrip(i)}
                  className="absolute top-2.5 right-2.5 text-slate-300 hover:text-red-500 font-bold text-sm transition-colors"
                  title="Remove leg"
                >
                  ✕
                </button>

                <div className="text-xs text-blue-600 font-bold uppercase tracking-wider mb-0.5">
                  Leg #{i + 1}
                </div>
                <div className="font-bold text-slate-900 font-mono">
                  {trip.startTime} → {trip.endTime}
                </div>
                <div className="text-xs text-slate-600">
                  {trip.originName} to {trip.destinationName}
                </div>
                {trip.heading && (
                  <div className="text-[10px] text-slate-400 italic">
                    Heading: {trip.heading}
                  </div>
                )}
              </div>
            ))
          )}
        </section>
      </div>

      <footer className="flex justify-center pt-2">
        <button
          onClick={handleSave}
          disabled={selectedTrips.length === 0 || isSaving}
          className="bg-slate-950 text-white px-12 py-4 rounded-2xl font-bold shadow-xl hover:bg-slate-800 active:scale-95 disabled:opacity-30 transition-all"
        >
          {isSaving ? "SAVING..." : "SAVE CIRCULATION TEMPLATE"}
        </button>
      </footer>
    </div>
  );
};

export default CirculationBuilderForm;
