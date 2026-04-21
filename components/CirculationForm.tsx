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
}

const CirculationBuilderForm = () => {
  const [dbTramlines, setDbTramlines] = useState<ITramLine[]>([]);
  const [selectedLine, setSelectedLine] = useState<ITramLine | null>(null);

  // Filters
  const [originGid, setOriginGid] = useState("");
  const [destGid, setDestGid] = useState("");
  const [designation, setDesignation] = useState("");
  const [dayType, setDayType] = useState("weekday");

  const [filteredTrips, setFilteredTrips] = useState<any[]>([]);
  const [selectedTrips, setSelectedTrips] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // 1. Load Lines from your new API
  useEffect(() => {
    fetch("/api/tramline")
      .then((res) => res.json())
      .then((data) => setDbTramlines(data));
  }, []);

  // 2. Handle Line Selection
  const handleLineChange = (lineId: string) => {
    const line = dbTramlines.find((l) => l._id === lineId) || null;
    setSelectedLine(line);
    if (line) {
      // Default to the full route, but user can change via dropdowns
      setOriginGid(line.route[0]?.vasttrafikGid || "");
      setDestGid(line.route[line.route.length - 1]?.vasttrafikGid || "");
    }
  };
  const [selectedDate, setSelectedDate] = useState("2026-04-21");
  const [selectedTime, setSelectedTime] = useState("04:00");

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
      console.error("Fetch error", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    const payload = {
      designation: Number(designation),
      dayType,
      season: "standard",
      trips: selectedTrips.map((t) => ({
        startTime: t.startTime,
        endTime: t.endTime,
        line: selectedLine?.number,
        heading: t.heading,
        originName: t.originName,
        originGid: t.originGid,
        destinationName: t.destinationName,
      })),
    };

    const res = await fetch("/api/circulationTemplate/new", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (res.ok) alert("Template Saved!");
  };

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-8">
      <header className="flex justify-between items-end">
        <h1 className="text-3xl font-black italic">CIRCULATION BUILDER v2</h1>
        <div className="flex gap-4">
          <input
            placeholder="Designation (e.g. 101)"
            className="border p-4 rounded-xl font-bold"
            value={designation}
            onChange={(e) => setDesignation(e.target.value)}
          />
          <select
            className="border p-4 rounded-xl font-bold"
            value={dayType}
            onChange={(e) => setDayType(e.target.value)}
          >
            <option value="weekday">Weekday</option>
            <option value="saturday">Saturday</option>
            <option value="sunday">Sunday</option>
          </select>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-white p-6 rounded-3xl shadow-sm border">
        {/* Line Selection */}
        <select
          onChange={(e) => handleLineChange(e.target.value)}
          className="p-4 border rounded-xl font-bold"
        >
          <option value="">Select Line & Direction</option>
          {dbTramlines.map((l) => (
            <option key={l._id} value={l._id}>
              Line {l.number} to {l.direction}
            </option>
          ))}
        </select>

        {/* Origin Selection - Includes all 28 stops + Depot options if in route */}
        <select
          value={originGid}
          onChange={(e) => setOriginGid(e.target.value)}
          className="p-4 border rounded-xl"
          disabled={!selectedLine}
        >
          {selectedLine?.route.map((stop) => (
            <option key={stop._id} value={stop.vasttrafikGid}>
              {stop.name}
            </option>
          ))}
        </select>

        {/* Destination Selection */}
        <select
          value={destGid}
          onChange={(e) => setDestGid(e.target.value)}
          className="p-4 border rounded-xl"
          disabled={!selectedLine}
        >
          {selectedLine?.route.map((stop) => (
            <option key={stop._id} value={stop.vasttrafikGid}>
              {stop.name}
            </option>
          ))}
        </select>
        <input
          type="date"
          className="border p-4 rounded-xl"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
        />
        <div className="flex flex-col gap-1">
          <label className="text-xs font-bold uppercase text-slate-400">
            Start Time
          </label>
          <input
            type="time"
            className="border p-4 rounded-xl font-mono text-lg"
            value={selectedTime}
            onChange={(e) => setSelectedTime(e.target.value)}
          />
        </div>

        <button
          onClick={searchVasttrafik}
          className="md:col-span-3 bg-blue-600 text-white p-4 rounded-xl font-black uppercase tracking-widest"
        >
          {isLoading ? "Searching..." : "Search Journeys"}
        </button>
      </div>

      {/* Results and Sequence UI follows similar logic to your previous version... */}
      <div className="grid grid-cols-2 gap-8">
        <section className="bg-slate-100 p-4 rounded-2xl h-[500px] overflow-y-auto">
          <h2 className="font-bold mb-4">Search Results</h2>
          {filteredTrips.map((trip, i) => (
            <div
              key={i}
              className="bg-white p-4 mb-2 rounded-lg flex justify-between items-center shadow-sm"
            >
              <span>
                {trip.startTime} - {trip.endTime}
              </span>
              <button
                onClick={() => setSelectedTrips([...selectedTrips, trip])}
                className="bg-blue-100 text-blue-700 px-3 py-1 rounded-md text-xs font-bold"
              >
                ADD
              </button>
            </div>
          ))}
        </section>

        <section className="bg-blue-50 p-4 rounded-2xl h-[500px] overflow-y-auto border-2 border-blue-100">
          <h2 className="font-bold mb-4">Current Sequence</h2>
          {selectedTrips.map((trip, i) => (
            <div
              key={i}
              className="bg-white p-4 mb-2 rounded-lg border border-blue-200"
            >
              <div className="text-xs text-blue-500 font-bold">
                LEG #{i + 1}
              </div>
              <div className="font-bold">
                {trip.startTime} → {trip.endTime}
              </div>
              <div className="text-[10px] text-slate-400">
                {trip.originName} to {trip.destinationName}
              </div>
            </div>
          ))}
        </section>
      </div>

      <footer className="flex justify-center">
        <button
          onClick={handleSave}
          disabled={selectedTrips.length === 0}
          className="bg-black text-white px-12 py-5 rounded-2xl font-bold shadow-xl active:scale-95 disabled:opacity-30"
        >
          SAVE CIRCULATION TEMPLATE
        </button>
      </footer>
    </div>
  );
};

export default CirculationBuilderForm;
