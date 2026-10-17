"use client";

import { useState, useEffect } from "react";

// Define the shape of the Driver object
interface Driver {
  _id: string;
  name: string;
  employeeId: string;
}

// Define the shape of the Trip object
interface Trip {
  startTime: string;
  endTime: string;
  line?: string | number;
  heading?: string;
  originName: string;
  originGid?: string;
  destinationName: string;
  destinationGid?: string;
}

// Define the shape of the CirculationTemplate object
interface CirculationTemplate {
  _id: string;
  designation: number;
  trips: Trip[];
}

// Define the shape of the ScheduleCirculation object
interface ScheduleCirculation {
  circulationTemplate: string;
  startTime: string;
  endTime: string;
  startStop: string;
  endStop: string;
}

// Define the shape of the EndpointsProp object
interface EndpointsProp {
  drivers?: string;
  circulations?: string;
  save?: string;
}

// Define the DriverScheduleForm component
const DriverScheduleForm = ({
  endpoints = {
    drivers: "/api/driver",
    circulations: "/api/circulationTemplate",
    save: "/api/driverSchedule/new",
  },
}: {
  endpoints?: EndpointsProp;
}) => {
  // State to hold the list of drivers
  const [drivers, setDrivers] = useState<Driver[]>([]);
  // State to hold the list of circulation templates
  const [circulations, setCirculations] = useState<CirculationTemplate[]>([]);
  // State to hold the selected employee ID
  const [employeeId, setEmployeeId] = useState("");
  // State to hold the selected date
  const [date, setDate] = useState(() => new Date().toISOString().split("T")[0]);
  // State to hold the selected circulation segments
  const [selectedCircs, setSelectedCircs] = useState<ScheduleCirculation[]>([]);
  // State to indicate if the form is currently submitting
  const [isSubmitting, setIsSubmitting] = useState(false);
  // State to hold any messages to display to the user
  const [message, setMessage] = useState<{ text: string; isError: boolean } | null>(null);

  // Effect to fetch drivers and circulations on component mount
  useEffect(() => {
    // Fetch drivers
    fetch(endpoints.drivers!)
      .then((response) => response.json())
      .then((data: Driver[]) => setDrivers(data))
      .catch((error) => setMessage({ text: "Failed to load drivers", isError: true }));

    // Fetch circulations
    fetch(endpoints.circulations!)
      .then((response) => response.json())
      .then((data: CirculationTemplate[]) => setCirculations(data))
      .catch((error) => setMessage({ text: "Failed to load circulations", isError: true }));
  }, [endpoints]);

  // Function to add a new circulation segment
  const addCirc = () => {
    setSelectedCircs([...selectedCircs, { circulationTemplate: "", startTime: "", endTime: "", startStop: "", endStop: "" }]);
  };

  // Function to remove a circulation segment by index
  const removeCirc = (index: number) => {
    const newSelectedCircs = selectedCircs.filter((_, i) => i !== index);
    setSelectedCircs(newSelectedCircs);
  };

  // Function to update a circulation segment's property
  const updateCirc = (index: number, field: keyof ScheduleCirculation, value: string) => {
    const newSelectedCircs = [...selectedCircs];
    newSelectedCircs[index][field] = value;
    setSelectedCircs(newSelectedCircs);
  };

  // Function to handle form submission
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    // Disable form submission and show loading message
    setIsSubmitting(true);
    setMessage(null);

    // Create the payload to send to the server
    const payload = {
      employeeId,
      date,
      circulations: selectedCircs,
    };

    // Send the payload to the server
    fetch(endpoints.save!, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    })
      .then((response) => response.json())
      .then((data) => setMessage({ text: "Schedule saved successfully!", isError: false }))
      .catch((error) => setMessage({ text: "Failed to save schedule", isError: true }))
      .finally(() => setIsSubmitting(false));
  };

  return (
    <form onSubmit={handleSubmit} className="flex justify-between items-center border-b pb-4">
      {/* Title and subtitle */}
      <div className="flex justify-between items-center border-b pb-4">
        <h2 className="text-2xl font-bold text-slate-800">
          Manual Shift Assignment
        </h2>
        <span className="text-xs text-slate-500 font-mono">TramTrack Dispatch</span>
      </div>

      {/* Driver selection and date input */}
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

      {/* Circulation segment inputs */}
      {selectedCircs.map((c, i) => {
        const activeTemplate = circulations.find((temp) => temp._id === c.circulationTemplate);

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

            <div>
              {/* Circulation template selection */}
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                1. Select Circulation Template
              </label>
              <select
                value={c.circulationTemplate}
                onChange={(e) => updateCirc(i, "circulationTemplate", e.target.value)}
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

              {/* Display active template trips */}
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
                      {t.startTime}–{t.endTime} ({t.originName} → {t.destinationName})
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Take-over and Hand-over sections */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t">
              <div className="space-y-2">
                <label className="text-xs font-bold text-blue-600 uppercase">
                  2. Relief Take-over
                </label>
                <input
                  type="time"
                  value={c.startTime}
                  onChange={(e) => updateCirc(i, "startTime", e.target.value)}
                  required
                  className="w-full p-2.5 border rounded-lg shadow-sm font-mono text-base"
                />
                <input
                  type="text"
                  placeholder="Take-over Stop Name"
                  value={c.startStop}
                  onChange={(e) => updateCirc(i, "startStop", e.target.value)}
                  required
                  className="w-full p-2.5 border rounded-lg shadow-sm text-sm"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-orange-600 uppercase">
                  3. Relief Hand-over
                </label>
                <input
                  type="time"
                  value={c.endTime}
                  onChange={(e) => updateCirc(i, "endTime", e.target.value)}
                  required
                  className="w-full p-2.5 border rounded-lg shadow-sm font-mono text-base"
                />
                <input
                  type="text"
                  placeholder="Hand-over Stop Name"
                  value={c.endStop}
                  onChange={(e) => updateCirc(i, "endStop", e.target.value)}
                  required
                  className="w-full p-2.5 border rounded-lg shadow-sm text-sm"
                />
              </div>
            </div>
          </div>
        );
      })}

      {/* Buttons to add a segment and submit the form */}
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
          disabled={isSubmitting}
          className="flex-1 py-3.5 bg-blue-600 text-white font-bold rounded-xl shadow-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
        >
          {isSubmitting ? "Saving..." : "Save Schedule"}
        </button>
      </div>

      {/* Display messages to the user */}
      {message && (
        <div
          className={`p-4 rounded-md ${
            message.isError ? "bg-red-100 text-red-800" : "bg-green-100 text-green-800"
          }`}
        >
          {message.text}
        </div>
      )}
    </form>
  );
};

export default DriverScheduleForm;