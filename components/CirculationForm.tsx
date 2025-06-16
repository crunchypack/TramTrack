"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

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
  const searchParams = useSearchParams();
  const editId = searchParams.get("edit");

  const [trips, setTrips] = useState<Trip[]>([]);
  const [filteredTrips, setFilteredTrips] = useState<Trip[]>([]);
  const [selectedTrips, setSelectedTrips] = useState<Trip[]>([]);

  const [filters, setFilters] = useState({
    tramline: "",
    heading: "",
    dayType: "weekday",
    season: "standard",
  });

  const [designation, setDesignation] = useState<number | "">("");
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");

  // Load circulation if in edit mode
  useEffect(() => {
    const fetchCirculation = async () => {
      if (!editId) return;

      try {
        const res = await fetch(`/api/circulationTemplate/${editId}`);
        const data = await res.json();

        setDesignation(data.designation);
        setFilters({
          tramline: "",
          heading: "",
          dayType: data.dayType,
          season: data.season,
        });
        setSelectedTrips(
          data.trips.sort((a: Trip, b: Trip) =>
            a.startTime.localeCompare(b.startTime)
          )
        );
      } catch (error) {
        console.error("Error loading circulation:", error);
        setMessage("❌ Failed to load circulation.");
      }
    };

    fetchCirculation();
  }, [editId]);

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
    if (selectedTrips.length === 0 || !designation) return;

    const payload = {
      designation: Number(designation),
      trips: selectedTrips.map((t) => t._id),
      dayType: filters.dayType,
      season: filters.season,
    };

    const method = editId ? "PUT" : "POST";
    const url = editId
      ? `/api/circulationTemplate/${editId}`
      : "/api/circulationTemplate/new";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (res.ok) {
      setMessage(
        editId ? "✅ Circulation updated." : "✅ Circulation created."
      );
      if (!editId) {
        setSelectedTrips([]);
        setDesignation("");
      }
    } else {
      const err = await res.json();
      setMessage(err.message || "❌ Failed to submit circulation.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">
        {editId ? "Edit Circulation" : "Create Circulation"}
      </h1>

      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">Designation</label>
        <input
          type="number"
          min="1"
          className="p-2 border rounded w-full"
          placeholder="Enter designation number"
          value={designation}
          onChange={(e) => setDesignation(Number(e.target.value))}
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <input
          className="p-2 border rounded"
          placeholder="TramLine Number"
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
        {editId ? "Update Circulation" : "Save Circulation"}
      </button>

      {message && <p className="mt-4 text-center text-blue-700">{message}</p>}
    </form>
  );
};

export default CirculationBuilderForm;
