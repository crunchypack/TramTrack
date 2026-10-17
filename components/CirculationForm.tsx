"use client";

import { useState, useEffect } from "react";

interface Driver { _id: string; name: string; employeeId: string; }
interface Trip { startTime: string; endTime: string; line?: string | number; heading?: string; originName: string; originGid?: string; destinationName: string; destinationGid?: string; }
interface CirculationTemplate { _id: string; designation: number; trips: Trip[]; }
interface ScheduleCirculation { circulationTemplate: string; startTime: string; endTime: string; startStop: string; endStop: string; }
interface EndpointsProp { drivers?: string; circulations?: string; save?: string; }

const DriverScheduleForm = ({
  endpoints = {
    drivers: "/api/driver",
    circulations: "/api/circulationTemplate",
    save: "/api/driverSchedule/new",
  },
}: {
  endpoints?: EndpointsProp;
}) => {
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [circulations, setCirculations] = useState<CirculationTemplate[]>([]);
  const [employeeId, setEmployeeId] = useState("");
  
  // FIXED: Prevents UTC rollover bugs by forcing local timezone calculation
  const [date, setDate] = useState(() => {
    const d = new Date();
    return new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().split("T")[0];
  });
  
  // FIXED: Automatically initialize with one blank segment
  const [selectedCircs, setSelectedCircs] = useState<ScheduleCirculation[]>([{ circulationTemplate: "", startTime: "", endTime: "", startStop: "", endStop: "" }]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<{ text: string; isError: boolean } | null>(null);

  useEffect(() => {
    // FIXED: Enforce no-store on client cache to ensure fresh DB data
    fetch(endpoints.drivers!, { cache: "no-store" })
      .then((res) => res.json())
      .then((data) => setDrivers(data))
      .catch(() => setMessage({ text: "Failed to load drivers", isError: true }));

    fetch(endpoints.circulations!, { cache: "no-store" })
      .then((res) => res.json())
      .then((data) => setCirculations(data))
      .catch(() => setMessage({ text: "Failed to load circulations", isError: true }));
  }, [endpoints]);

  const addCirc = () => setSelectedCircs([...selectedCircs, { circulationTemplate: "", startTime: "", endTime: "", startStop: "", endStop: "" }]);
  const removeCirc = (index: number) => setSelectedCircs(selectedCircs.filter((_, i) => i !== index));
  
  const updateCirc = (index: number, field: keyof ScheduleCirculation, value: string) => {
    const newSelectedCircs = [...selectedCircs];
    newSelectedCircs[index][field] = value;
    setSelectedCircs(newSelectedCircs);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (selectedCircs.length === 0) {
      setMessage({ text: "Please add at least one work segment.", isError: true });
      return;
    }

    setIsSubmitting(true);
    setMessage(null);

    // FIXED: Changed 'segments' to 'circulations' to match POST endpoint requirements
    const payload = { employeeId, date, circulations: selectedCircs };

    fetch(endpoints.save!, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    })
      .then(async (response) => {
        if (!response.ok) {
           const errData = await response.json().catch(() => ({}));
           throw new Error(errData.error || "Server error");
        }
        return response.json();
      })
      .then(() => setMessage({ text: "Schedule saved successfully!", isError: false }))
      .catch((err) => setMessage({ text: `Failed to save schedule: ${err.message}`, isError: true }))
      .finally(() => setIsSubmitting(false));
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col space-y-6 pb-4">
      
      <div className="flex justify-between items-center border-b pb-4">
        <h2 className="text-2xl font-bold text-slate-800">Manual Shift Assignment</h2>
        <span className="text-xs text-slate-500 font-mono">TramTrack Dispatch</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Driver</label>
          <select value={employeeId} onChange={(e) => setEmployeeId(e.target.value)} required className="w-full p-3 bg-white border rounded-xl font-medium">
            <option value="">Select Driver</option>
            {drivers.map((d) => (
              <option key={d._id} value={d.employeeId}>{d.name} ({d.employeeId})</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Duty Date</label>
          <input type="date" value={date} onChange={(e) => setDate(e.target.value)} required className="w-full p-3 bg-white border rounded-xl font-medium" />
        </div>
      </div>

      <div className="space-y-4">
        {selectedCircs.map((c, i) => {
          const activeTemplate = circulations.find((temp) => temp._id === c.circulationTemplate);

          return (
            <div key={i} className="p-6 bg-white border rounded-2xl shadow-sm space-y-5 relative">
              <button type="button" onClick={() => removeCirc(i)} className="absolute top-4 right-4 text-red-400 font-bold hover:text-red-600 transition-colors" title="Remove Segment">✕</button>

              <div>
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">1. Select Circulation Template</label>
                <select value={c.circulationTemplate} onChange={(e) => updateCirc(i, "circulationTemplate", e.target.value)} className="w-full mt-1.5 p-3 bg-slate-50 border rounded-lg font-semibold" required>
                  <option value="">Choose a tram plan...</option>
                  {circulations.map((temp) => {
                    const firstTrip = temp.trips[0];
                    const lastTrip = temp.trips[temp.trips.length - 1];
                    const span = firstTrip && lastTrip ? `${firstTrip.startTime} – ${lastTrip.endTime}` : "No trips";
                    return <option key={temp._id} value={temp._id}>#{temp.designation} ({span})</option>;
                  })}
                </select>

                {activeTemplate && activeTemplate.trips.length > 0 && (
                  <div className="mt-2 p-2 bg-slate-50 rounded border text-xs text-slate-600 flex flex-wrap gap-2">
                    <span className="font-semibold text-slate-800">Template Trips ({activeTemplate.trips.length}):</span>
                    {activeTemplate.trips.map((t, idx) => (
                      <span key={idx} className="bg-white px-2 py-0.5 rounded border border-slate-200">
                        {t.startTime}–{t.endTime} ({t.originName} → {t.destinationName})
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-blue-600 uppercase">2. Relief Take-over</label>
                  <input type="time" value={c.startTime} onChange={(e) => updateCirc(i, "startTime", e.target.value)} required className="w-full p-2.5 border rounded-lg shadow-sm font-mono text-base" />
                  <input type="text" placeholder="Take-over Stop Name" value={c.startStop} onChange={(e) => updateCirc(i, "startStop", e.target.value)} required className="w-full p-2.5 border rounded-lg shadow-sm text-sm" />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-orange-600 uppercase">3. Relief Hand-over</label>
                  <input type="time" value={c.endTime} onChange={(e) => updateCirc(i, "endTime", e.target.value)} required className="w-full p-2.5 border rounded-lg shadow-sm font-mono text-base" />
                  <input type="text" placeholder="Hand-over Stop Name" value={c.endStop} onChange={(e) => updateCirc(i, "endStop", e.target.value)} required className="w-full p-2.5 border rounded-lg shadow-sm text-sm" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="flex flex-col sm:flex-row gap-4 pt-2">
        <button type="button" onClick={addCirc} className="flex-1 py-3.5 border-2 border-dashed border-slate-300 rounded-xl text-slate-600 font-bold hover:bg-white hover:text-blue-600 hover:border-blue-400 transition-all">
          + Add Work Segment
        </button>
        {/* FIXED: Submit is automatically disabled if no work segments exist */}
        <button type="submit" disabled={isSubmitting || selectedCircs.length === 0} className="flex-1 py-3.5 bg-blue-600 text-white font-bold rounded-xl shadow-lg hover:bg-blue-700 transition-colors disabled:opacity-50">
          {isSubmitting ? "Saving..." : "Save Schedule"}
        </button>
      </div>

      {message && (
        <div className={`p-4 rounded-md ${message.isError ? "bg-red-100 text-red-800" : "bg-green-100 text-green-800"}`}>
          {message.text}
        </div>
      )}
    </form>
  );
};

export default DriverScheduleForm;