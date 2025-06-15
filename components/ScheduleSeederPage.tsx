// ScheduleSeederPage.tsx
"use client";

import { useState, useEffect } from "react";

interface ScheduleData {
  hour: number;
  minutes: number[];
  inputValue: string; // Add this to track raw input
}

interface TramLine {
  _id: string;
  number: number;
  direction: string;
  route: { _id: string; name: string }[];
}

const ScheduleSeederPage = () => {
  const [tramLines, setTramLines] = useState<TramLine[]>([]);
  const [tramLineId, setTramLineId] = useState("");
  const [startStop, setStartStop] = useState("");
  const [endStop, setEndStop] = useState("");
  const [tripDuration, setTripDuration] = useState(30);
  const [season, setSeason] = useState("standard");
  const [dayType, setDayType] = useState<"weekday" | "saturday" | "sunday">(
    "weekday"
  );
  const [schedule, setSchedule] = useState<ScheduleData[]>(
    Array.from({ length: 24 }, (_, hour) => ({
      hour,
      minutes: [],
      inputValue: "",
    }))
  );
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetch("/api/tramline")
      .then((res) => res.json())
      .then((data) => setTramLines(data))
      .catch(() => setMessage("❌ Failed to load tram lines"));
  }, []);

  const updateMinutes = (hour: number, value: string) => {
    // First update the raw input value
    const updated = schedule.map((entry) =>
      entry.hour === hour ? { ...entry, inputValue: value } : entry
    );
    setSchedule(updated);

    // Then parse the valid minutes when needed
    const minutes = value
      .split(",")
      .map((part) => part.trim())
      .filter((part) => part !== "")
      .map((part) => parseInt(part, 10))
      .filter((num) => !isNaN(num) && num >= 0 && num <= 59);

    // Update the actual minutes array
    const updatedWithMinutes = updated.map((entry) =>
      entry.hour === hour ? { ...entry, minutes } : entry
    );
    setSchedule(updatedWithMinutes);
  };

  const loadExistingSchedule = async () => {
    const selectedLine = tramLines.find((line) => line._id === tramLineId);
    if (!selectedLine || !dayType || !season) return;

    const params = new URLSearchParams({
      tramline: selectedLine.number.toString(),
      heading: selectedLine.direction,
      dayType,
      season,
    });

    try {
      const res = await fetch(`/api/tripTemplate?${params.toString()}`);
      if (!res.ok) throw new Error("Failed to fetch existing schedule");
      const trips = await res.json();

      const hourMap: {
        [hour: number]: { minutes: number[]; inputValue: string };
      } = {};
      for (let h = 0; h < 24; h++) {
        hourMap[h] = { minutes: [], inputValue: "" };
      }

      for (const trip of trips) {
        const [h, m] = trip.startTime.split(":").map(Number);
        if (!isNaN(h) && !isNaN(m)) hourMap[h].minutes.push(m);
      }

      const loadedSchedule = Object.entries(hourMap).map(([hour, data]) => ({
        hour: parseInt(hour, 10),
        minutes: data.minutes.sort((a, b) => a - b),
        inputValue: data.minutes.join(", "),
      }));

      setSchedule(loadedSchedule);
      setMessage("Loaded existing schedule.");
    } catch (error) {
      console.error(error);
      setMessage("❌ Could not load schedule");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const selectedLine = tramLines.find((line) => line._id === tramLineId);
    if (!selectedLine) return;

    const payload = {
      tramLineNumber: selectedLine.number,
      startStopName: startStop,
      endStopName: endStop,
      heading: selectedLine.direction,
      tripDurationMinutes: tripDuration,
      season,
      weekdaySchedule:
        dayType === "weekday"
          ? schedule.map(({ hour, minutes }) => ({ hour, minutes }))
          : [],
      saturdaySchedule:
        dayType === "saturday"
          ? schedule.map(({ hour, minutes }) => ({ hour, minutes }))
          : [],
      sundaySchedule:
        dayType === "sunday"
          ? schedule.map(({ hour, minutes }) => ({ hour, minutes }))
          : [],
    };

    console.log("Payload to seed:", payload);
    setMessage("Trips seeded successfully (simulated).");
  };

  const selectedLine = tramLines.find((line) => line._id === tramLineId);
  const stopOptions = selectedLine?.route.map((stop) => stop.name) ?? [];

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Tram Trip Seeder</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <select
          value={tramLineId}
          onChange={(e) => setTramLineId(e.target.value)}
          className="w-full p-2 border rounded"
        >
          <option value="" disabled>
            Select Tram Line
          </option>
          {tramLines.map((line) => (
            <option key={line._id} value={line._id}>
              Line {line.number} — {line.direction}
            </option>
          ))}
        </select>

        <select
          value={startStop}
          onChange={(e) => setStartStop(e.target.value)}
          required
          className="w-full p-2 border rounded"
        >
          <option value="" disabled>
            Select Start Stop
          </option>
          {stopOptions.map((name) => (
            <option key={name} value={name}>
              {name}
            </option>
          ))}
        </select>

        <select
          value={endStop}
          onChange={(e) => setEndStop(e.target.value)}
          required
          className="w-full p-2 border rounded"
        >
          <option value="" disabled>
            Select End Stop
          </option>
          {stopOptions.map((name) => (
            <option key={name} value={name}>
              {name}
            </option>
          ))}
        </select>

        <input
          type="number"
          placeholder="Trip Duration (minutes)"
          value={tripDuration}
          onChange={(e) => setTripDuration(Number(e.target.value))}
          required
          className="w-full p-2 border rounded"
        />
        <select
          value={dayType}
          onChange={(e) => setDayType(e.target.value as any)}
          className="w-full p-2 border rounded"
        >
          <option value="weekday">Weekday</option>
          <option value="saturday">Saturday</option>
          <option value="sunday">Sunday</option>
        </select>
        <select
          value={season}
          onChange={(e) => setSeason(e.target.value)}
          className="w-full p-2 border rounded"
        >
          <option value="standard">Standard</option>
          <option value="summer">Summer</option>
        </select>

        <button
          type="button"
          onClick={loadExistingSchedule}
          className="bg-blue-500 text-white py-2 px-4 rounded"
        >
          Load Existing Schedule
        </button>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {schedule.map(({ hour, inputValue }) => (
            <div key={hour} className="flex flex-col">
              <label className="font-semibold">Hour {hour}</label>
              <input
                type="text"
                inputMode="numeric"
                placeholder="e.g. 9, 19, 29"
                value={inputValue}
                onChange={(e) => updateMinutes(hour, e.target.value)}
                className="p-1 border rounded"
              />
            </div>
          ))}
        </div>

        <button
          type="submit"
          className="bg-green-600 text-white py-2 px-4 rounded"
        >
          Seed Trips
        </button>

        {message && <p className="mt-4 text-blue-700">{message}</p>}
      </form>
    </div>
  );
};

export default ScheduleSeederPage;
