"use client";
import { useEffect, useState } from "react";

interface TramStop {
  _id: string;
  name: string;
}

export default function AddTramlinePage() {
  const [tramStops, setTramStops] = useState<TramStop[]>([]);
  const [selectedStopId, setSelectedStopId] = useState("");
  const [route, setRoute] = useState<string[]>([]);
  const [timeBetweenStops, setTimeBetweenStops] = useState<number[]>([]);
  const [number, setNumber] = useState<number | "">("");
  const [direction, setdirection] = useState("");
  const [reversedirection, setReversedirection] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetch("/api/tramstop")
      .then((res) => res.json())
      .then((data) => setTramStops(data))
      .catch(() => setMessage("❌ Failed to load tram stops"));
  }, []);

  const addStopToRoute = () => {
    if (!selectedStopId || route.includes(selectedStopId)) return;
    setRoute([...route, selectedStopId]);
    if (route.length > 0) {
      setTimeBetweenStops([...timeBetweenStops, 0]); // default 0
    }
  };

  const updateTime = (index: number, value: number) => {
    const updated = [...timeBetweenStops];
    updated[index] = value;
    setTimeBetweenStops(updated);
  };

  const handleSubmit = async () => {
    if (
      !number ||
      !direction ||
      route.length < 2 ||
      timeBetweenStops.length !== route.length - 1
    ) {
      setMessage("❌ Fill all fields correctly.");
      return;
    }

    const data = {
      number,
      direction,
      route,
      timeBetweenStops,
    };

    const res = await fetch("/api/tramline", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify([data]), // send as array
    });

    if (res.ok && reversedirection) {
      // Send reverse version too
      const reversed = {
        number,
        direction: reversedirection,
        route: [...route].reverse(),
        timeBetweenStops: [...timeBetweenStops].reverse(),
      };
      await fetch("/api/tramline", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify([reversed]),
      });
    }

    setMessage(res.ok ? "✅ Tramline saved!" : "❌ Failed to save.");
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-xl font-bold mb-4">Add Tramline</h1>

      <input
        type="number"
        placeholder="Line Number"
        className="w-full border p-2 mb-2"
        value={number}
        onChange={(e) => setNumber(Number(e.target.value))}
      />

      <input
        type="text"
        placeholder="direction"
        className="w-full border p-2 mb-2"
        value={direction}
        onChange={(e) => setdirection(e.target.value)}
      />

      <input
        type="text"
        placeholder="Reverse direction (optional)"
        className="w-full border p-2 mb-4"
        value={reversedirection}
        onChange={(e) => setReversedirection(e.target.value)}
      />

      <div className="flex gap-2 mb-2">
        <select
          className="flex-1 border p-2"
          value={selectedStopId}
          onChange={(e) => setSelectedStopId(e.target.value)}
        >
          <option value="">Select stop</option>
          {tramStops.map((stop) => (
            <option key={stop._id} value={stop._id}>
              {stop.name}
            </option>
          ))}
        </select>
        <button
          onClick={addStopToRoute}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Add Stop
        </button>
      </div>

      <h2 className="font-semibold mt-4 mb-1">Route Preview:</h2>
      <ol className="mb-4 space-y-1">
        {route.map((stopId, i) => {
          const stopName = tramStops.find((s) => s._id === stopId)?.name || "";
          return (
            <li key={i}>
              {i + 1}. {stopName}
              {i < route.length - 1 && (
                <input
                  type="number"
                  min="0"
                  className="ml-4 w-20 border px-1 py-0.5"
                  placeholder="min"
                  value={timeBetweenStops[i]}
                  onChange={(e) => updateTime(i, Number(e.target.value))}
                />
              )}
            </li>
          );
        })}
      </ol>

      <button
        onClick={handleSubmit}
        className="bg-green-600 text-white px-6 py-2 rounded"
      >
        Save Tramline
      </button>

      {message && <p className="mt-4 text-blue-700">{message}</p>}
    </div>
  );
}
