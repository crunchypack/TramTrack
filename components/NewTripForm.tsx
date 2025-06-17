"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import TimePicker from "react-time-picker";
import "react-time-picker/dist/TimePicker.css";
import "react-clock/dist/Clock.css";

interface TramStop {
  _id: string;
  name: string;
}

interface TramLine {
  _id: string;
  number: number;
  direction: string;
  route: TramStop[];
}

export default function NewTripForm() {
  const [tramlines, setTramlines] = useState<TramLine[]>([]);
  const [selectedTramlineId, setSelectedTramlineId] = useState<string>("");
  const [selectedTramline, setSelectedTramline] = useState<TramLine | null>(
    null
  );
  const [startTime, setStartTime] = useState<string | null>("08:00");
  const [endTime, setEndTime] = useState<string | null>("09:00");
  const [startStop, setStartStop] = useState<string>("");
  const [endStop, setEndStop] = useState<string>("");
  const [dayType, setDayType] = useState<"weekday" | "saturday" | "sunday">(
    "weekday"
  );
  const [season, setSeason] = useState<"standard" | "summer">("standard");
  const [isWeekend, setIsWeekend] = useState<boolean>(false);
  const router = useRouter();

  useEffect(() => {
    fetch("/api/tramline")
      .then((res) => res.json())
      .then((data) => setTramlines(data));
  }, []);

  useEffect(() => {
    const found = tramlines.find((line) => line._id === selectedTramlineId);
    setSelectedTramline(found || null);
    if (found) {
      setStartStop(found.route[0]?._id || "");
      setEndStop(found.route[found.route.length - 1]?._id || "");
    }
  }, [selectedTramlineId]);

  useEffect(() => {
    setIsWeekend(dayType === "saturday" || dayType === "sunday");
  }, [dayType]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const response = await fetch("/api/tripTemplate/new", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        tramline: selectedTramlineId,
        startTime,
        endTime,
        heading: selectedTramline?.direction,
        startStop,
        endStop,
        dayType,
        isWeekend,
        season,
      }),
    });

    if (response.ok) {
      router.push("/new-trip");
    } else {
      alert("Failed to create trip template");
    }
  };

  return (
    <div className="max-w-xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Add Trip Template</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-1 font-semibold">Tramline</label>
          <select
            required
            className="w-full p-2 border rounded"
            value={selectedTramlineId}
            onChange={(e) => setSelectedTramlineId(e.target.value)}
          >
            <option value="">Select tramline</option>
            {tramlines.map((line) => (
              <option key={line._id} value={line._id}>
                {line.number} - {line.direction}
              </option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block mb-1 font-semibold">Start Stop</label>
            <select
              required
              className="w-full p-2 border rounded"
              value={startStop}
              onChange={(e) => setStartStop(e.target.value)}
            >
              {selectedTramline?.route.map((stop) => (
                <option key={stop._id} value={stop._id}>
                  {stop.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block mb-1 font-semibold">End Stop</label>
            <select
              required
              className="w-full p-2 border rounded"
              value={endStop}
              onChange={(e) => setEndStop(e.target.value)}
            >
              {selectedTramline?.route.map((stop) => (
                <option key={stop._id} value={stop._id}>
                  {stop.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block mb-1 font-semibold">Start Time</label>
            <TimePicker
              onChange={setStartTime}
              value={startTime}
              format="HH:mm"
              className="w-full"
              disableClock
              required
            />
          </div>
          <div>
            <label className="block mb-1 font-semibold">End Time</label>
            <TimePicker
              onChange={setEndTime}
              value={endTime}
              format="HH:mm"
              className="w-full"
              disableClock
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block mb-1 font-semibold">Day Type</label>
            <select
              required
              className="w-full p-2 border rounded"
              value={dayType}
              onChange={(e) =>
                setDayType(e.target.value as "weekday" | "saturday" | "sunday")
              }
            >
              <option value="weekday">Weekday</option>
              <option value="saturday">Saturday</option>
              <option value="sunday">Sunday</option>
            </select>
          </div>

          <div>
            <label className="block mb-1 font-semibold">Season</label>
            <select
              required
              className="w-full p-2 border rounded"
              value={season}
              onChange={(e) =>
                setSeason(e.target.value as "standard" | "summer")
              }
            >
              <option value="standard">Standard</option>
              <option value="summer">Summer</option>
            </select>
          </div>
        </div>

        <div className="text-sm text-gray-600">
          Weekend automatically set to:{" "}
          <strong>{isWeekend ? "Yes" : "No"}</strong>
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded"
        >
          Create Trip
        </button>
      </form>
    </div>
  );
}
