"use client";

import { useEffect, useState } from "react";

interface Trip {
  _id: string;
  tramline: {
    number: number;
    direction: string;
  };
  startTime: string;
  endTime: string;
  heading: string;
}

const CirculationBuilderForm = () => {
  const [trips, setTrips] = useState<Trip[]>([]);
  const [filteredTrips, setFilteredTrips] = useState<Trip[]>([]);
  const [selectedTrips, setSelectedTrips] = useState<Trip[]>([]);

  const [filters, setFilters] = useState({
    tramline: "",
    heading: "",
    dayType: "weekday",
    season: "standard",
  });

  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");

  const applyFilters = async () => {
    const { tramline, heading, dayType, season } = filters;
    const params = new URLSearchParams();

    if (tramline) params.append("tramline", tramline);
    if (heading) params.append("heading", heading);
    params.append("dayType", dayType);
    params.append("season", season);

    setIsLoading(true);
    try {
      const res = await fetch(`/api/tripTemplate?${params.toString()}`);
      const data = await res.json();
      const sorted = data.sort((a: Trip, b: Trip) =>
        a.startTime.localeCompare(b.startTime)
      );
      setFilteredTrips(sorted);
      setMessage("");
    } catch (error) {
      setMessage("Error fetching trips");
    } finally {
      setIsLoading(false);
    }
  };

  const addTrip = (trip: Trip) => {
    if (!selectedTrips.find((t) => t._id === trip._id)) {
      const updated = [...selectedTrips, trip];
      updated.sort((a, b) => a.startTime.localeCompare(b.startTime));
      setSelectedTrips(updated);
    }
  };

  const removeTrip = (id: string) => {
    const updated = selectedTrips.filter((t) => t._id !== id);
    updated.sort((a, b) => a.startTime.localeCompare(b.startTime));
    setSelectedTrips(updated);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedTrips.length === 0) return;

    const payload = {
      trips: selectedTrips.map((t) => t._id),
      dayType: filters.dayType,
      season: filters.season,
    };

    const res = await fetch("/api/circulationTemplate/new", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (res.ok) {
      setMessage("✅ Circulation created.");
      setSelectedTrips([]);
    } else {
      const err = await res.json();
      setMessage(err.message || "❌ Failed to create circulation.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Create Circulation</h1>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <input
          className="p-2 border rounded"
          placeholder="Tramline Number"
          value={filters.tramline}
          onChange={(e) => setFilters({ ...filters, tramline: e.target.value })}
        />
        <input
          className="p-2 border rounded"
          placeholder="Heading"
          value={filters.heading}
          onChange={(e) => setFilters({ ...filters, heading: e.target.value })}
        />
        <select
          className="p-2 border rounded"
          value={filters.dayType}
          onChange={(e) => setFilters({ ...filters, dayType: e.target.value })}
        >
          <option value="weekday">Weekday</option>
          <option value="saturday">Saturday</option>
          <option value="sunday">Sunday</option>
        </select>
        <select
          className="p-2 border rounded"
          value={filters.season}
          onChange={(e) => setFilters({ ...filters, season: e.target.value })}
        >
          <option value="standard">Standard</option>
          <option value="summer">Summer</option>
        </select>
      </div>

      <button
        type="button"
        onClick={applyFilters}
        className="mb-4 bg-blue-500 text-white py-2 px-4 rounded"
      >
        Filter Trips
      </button>

      {isLoading && <p className="text-gray-500 mb-2">Loading trips...</p>}

      <div className="mb-4">
        <h2 className="font-semibold mb-2">Available Trips</h2>
        <ul className="max-h-64 overflow-y-auto border rounded p-2">
          {filteredTrips.map((trip) => (
            <li
              key={trip._id}
              className="flex justify-between items-center mb-1"
            >
              <span>
                Line {trip.tramline.number} ({trip.heading}): {trip.startTime} →{" "}
                {trip.endTime}
              </span>
              <button
                type="button"
                className="text-sm bg-green-500 text-white px-2 py-1 rounded"
                onClick={() => addTrip(trip)}
              >
                Add
              </button>
            </li>
          ))}
        </ul>
      </div>

      <div className="mb-4">
        <h2 className="font-semibold mb-2">Selected Trips</h2>
        <ul className="border rounded p-2">
          {selectedTrips.map((trip) => (
            <li
              key={trip._id}
              className="flex justify-between items-center mb-1"
            >
              <span>
                Line {trip.tramline.number} ({trip.heading}): {trip.startTime} →{" "}
                {trip.endTime}
              </span>
              <button
                type="button"
                className="text-sm text-red-500"
                onClick={() => removeTrip(trip._id)}
              >
                Remove
              </button>
            </li>
          ))}
        </ul>
      </div>

      <button
        type="submit"
        className="bg-green-600 text-white py-2 px-6 rounded"
      >
        Save Circulation
      </button>

      {message && <p className="mt-4 text-center text-blue-700">{message}</p>}
    </form>
  );
};

export default CirculationBuilderForm;
