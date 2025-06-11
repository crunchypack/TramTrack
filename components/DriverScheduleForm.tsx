"use client";

import { useState, useEffect } from "react";

interface Driver {
  _id: string;
  name: string;
  employeeId: string;
}

interface Trip {
  startTime: string;
  endTime: string;
  heading: string;
  tramline: {
    number: number;
    direction: string;
  };
  startStop: {
    name: string;
  };
  endStop: {
    name: string;
  };
}

interface CirculationTemplate {
  _id: string;
  designation: number;
  trips: Trip[];
}

interface ScheduleCirculation {
  circulationTemplate: string;
  startTime: string;
  endTime: string;
  startStop: string;
  endStop: string;
}

interface DriverScheduleFormProps {
  driverEndpoint: string;
  circulationEndpoint: string;
  tramStopEndpoint: string;
  endpoint: string;
}

const DriverScheduleForm: React.FC<DriverScheduleFormProps> = ({
  driverEndpoint,
  circulationEndpoint,
  tramStopEndpoint,
  endpoint,
}) => {
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [circulations, setCirculations] = useState<CirculationTemplate[]>([]);
  const [tramStops, setTramStops] = useState<{ _id: string; name: string }[]>(
    []
  );
  const [selectedCirculations, setSelectedCirculations] = useState<
    ScheduleCirculation[]
  >([]);
  const [employeeId, setEmployeeId] = useState("");
  const [date, setDate] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetch(driverEndpoint)
      .then((res) => res.json())
      .then(setDrivers);
    fetch(circulationEndpoint)
      .then((res) => res.json())
      .then(setCirculations);
    fetch(tramStopEndpoint)
      .then((res) => res.json())
      .then(setTramStops);
  }, [driverEndpoint, circulationEndpoint, tramStopEndpoint]);

  const addCirculation = () => {
    setSelectedCirculations((prev) => [
      ...prev,
      {
        circulationTemplate: "",
        startTime: "",
        endTime: "",
        startStop: "",
        endStop: "",
      },
    ]);
  };

  const updateCirculation = (
    index: number,
    field: keyof ScheduleCirculation,
    value: string
  ) => {
    const updated = [...selectedCirculations];
    updated[index][field] = value;
    setSelectedCirculations(updated);
  };

  const removeCirculation = (index: number) => {
    setSelectedCirculations(selectedCirculations.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        employeeId,
        date,
        circulations: selectedCirculations,
      }),
    });
    const data = await res.json();
    setMessage(data.message || "Failed to create schedule");
  };

  const formatTrip = (trip: Trip | undefined) => {
    if (!trip) return "";
    return `Line ${trip.tramline.number} (${trip.heading}) ${trip.startStop.name} → ${trip.endStop.name} at ${trip.startTime}`;
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-3xl mx-auto p-6 space-y-4">
      <h2 className="text-2xl font-bold">Create Driver Schedule</h2>

      <select
        value={employeeId}
        onChange={(e) => setEmployeeId(e.target.value)}
        required
        className="w-full p-2 border rounded"
      >
        <option value="" disabled>
          Select Driver
        </option>
        {drivers.map((d) => (
          <option key={d._id} value={d.employeeId}>
            {d.name} (ID: {d.employeeId})
          </option>
        ))}
      </select>

      <input
        type="date"
        value={date}
        onChange={(e) => setDate(e.target.value)}
        required
        className="w-full p-2 border rounded"
      />

      {selectedCirculations.map((c, i) => (
        <div key={i} className="border p-4 rounded space-y-2">
          <select
            value={c.circulationTemplate}
            onChange={(e) =>
              updateCirculation(i, "circulationTemplate", e.target.value)
            }
            required
            className="w-full p-2 border rounded"
          >
            <option value="" disabled>
              Select Circulation
            </option>
            {circulations.map((circ) => {
              const first = circ.trips?.[0];
              const last = circ.trips?.[circ.trips.length - 1];
              const label = `#${circ.designation} | ${formatTrip(first)} → ${
                last?.endStop?.name
              } at ${last?.endTime}`;
              return (
                <option key={circ._id} value={circ._id}>
                  {label}
                </option>
              );
            })}
          </select>

          <input
            type="time"
            value={c.startTime}
            onChange={(e) => updateCirculation(i, "startTime", e.target.value)}
            required
            className="w-full p-2 border rounded"
          />

          <input
            type="time"
            value={c.endTime}
            onChange={(e) => updateCirculation(i, "endTime", e.target.value)}
            required
            className="w-full p-2 border rounded"
          />

          <select
            value={c.startStop}
            onChange={(e) => updateCirculation(i, "startStop", e.target.value)}
            required
            className="w-full p-2 border rounded"
          >
            <option value="" disabled>
              Start Stop
            </option>
            {tramStops.map((s) => (
              <option key={s._id} value={s._id}>
                {s.name}
              </option>
            ))}
          </select>

          <select
            value={c.endStop}
            onChange={(e) => updateCirculation(i, "endStop", e.target.value)}
            required
            className="w-full p-2 border rounded"
          >
            <option value="" disabled>
              End Stop
            </option>
            {tramStops.map((s) => (
              <option key={s._id} value={s._id}>
                {s.name}
              </option>
            ))}
          </select>

          <button
            type="button"
            onClick={() => removeCirculation(i)}
            className="text-red-500"
          >
            Remove
          </button>
        </div>
      ))}

      <button
        type="button"
        onClick={addCirculation}
        className="bg-blue-500 text-white py-2 px-4 rounded"
      >
        Add Circulation
      </button>

      <button
        type="submit"
        className="bg-green-600 text-white py-2 px-6 rounded"
      >
        Save Schedule
      </button>

      {message && <p className="text-center text-blue-700">{message}</p>}
    </form>
  );
};

export default DriverScheduleForm;
