"use client";

import { useState, useEffect } from "react";

interface Driver { _id: string; name: string; employeeId: string; }

interface Trip {
  startTime: string;
  endTime: string;
  originName: string;
  destinationName: string;
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

const DriverScheduleForm = ({ endpoints }: { endpoints: any }) => {
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [circulations, setCirculations] = useState<CirculationTemplate[]>([]);
  const [employeeId, setEmployeeId] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedCircs, setSelectedCircs] = useState<ScheduleCirculation[]>([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetch(endpoints.drivers).then(res => res.json()).then(setDrivers);
    fetch(endpoints.circulations).then(res => res.json()).then(setCirculations);
  }, [endpoints]);

  const addCirc = () => {
    setSelectedCircs([...selectedCircs, {
      circulationTemplate: "", startTime: "", endTime: "", startStop: "", endStop: ""
    }]);
  };

  const updateCirc = (index: number, field: keyof ScheduleCirculation, value: string) => {
    const updated = [...selectedCircs];
    updated[index][field] = value;
    
    if (field === "circulationTemplate") {
      const temp = circulations.find(c => c._id === value);
      if (temp && temp.trips.length > 0) {
        updated[index].startTime = temp.trips[0].startTime;
        updated[index].startStop = temp.trips[0].originName;
        updated[index].endTime = temp.trips[temp.trips.length - 1].endTime;
        updated[index].endStop = temp.trips[temp.trips.length - 1].destinationName;
      }
    }
    setSelectedCircs(updated);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch(endpoints.save, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ employeeId, date, circulations: selectedCircs }),
    });
    const data = await res.json();
    setMessage(data.message || "Schedule processed");
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-4xl mx-auto p-6 space-y-6 bg-slate-50 rounded-2xl border">
      <h2 className="text-2xl font-bold text-slate-800">Manual Shift Assignment</h2>
      
      <div className="grid grid-cols-2 gap-4">
        <select value={employeeId} onChange={e => setEmployeeId(e.target.value)} required className="p-3 border rounded-xl">
          <option value="">Select Driver</option>
          {drivers.map(d => <option key={d._id} value={d.employeeId}>{d.name}</option>)}
        </select>
        <input type="date" value={date} onChange={e => setDate(e.target.value)} required className="p-3 border rounded-xl" />
      </div>

      {selectedCircs.map((c, i) => (
        <div key={i} className="p-6 bg-white border rounded-2xl shadow-sm space-y-6 relative">
          <button type="button" onClick={() => setSelectedCircs(selectedCircs.filter((_, idx) => idx !== i))} className="absolute top-4 right-4 text-red-400 font-bold hover:text-red-600">✕</button>
          
          <div>
            <label className="text-xs font-bold text-slate-400 uppercase">1. Select Circulation</label>
            <select 
              value={c.circulationTemplate} 
              onChange={e => updateCirc(i, "circulationTemplate", e.target.value)} 
              className="w-full mt-1 p-3 bg-slate-50 border rounded-lg"
            >
              <option value="">Choose a tram plan...</option>
              {circulations.map(temp => (
                <option key={temp._id} value={temp._id}>
                  #{temp.designation} (Full Span: {temp.trips[0]?.startTime} - {temp.trips[temp.trips.length-1]?.endTime})
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t">
            {/* Manual Take-over */}
            <div className="space-y-3">
              <label className="text-xs font-bold text-blue-600 uppercase">2. Relief Take-over</label>
              <input 
                type="time" 
                value={c.startTime} 
                onChange={e => updateCirc(i, "startTime", e.target.value)}
                className="w-full p-2 border rounded shadow-sm font-mono text-lg"
              />
              <input 
                type="text" 
                placeholder="Start Stop Name"
                value={c.startStop} 
                onChange={e => updateCirc(i, "startStop", e.target.value)}
                className="w-full p-2 border rounded shadow-sm text-sm"
              />
            </div>

            {/* Manual Hand-over */}
            <div className="space-y-3">
              <label className="text-xs font-bold text-orange-600 uppercase">3. Relief Hand-over</label>
              <input 
                type="time" 
                value={c.endTime} 
                onChange={e => updateCirc(i, "endTime", e.target.value)}
                className="w-full p-2 border rounded shadow-sm font-mono text-lg"
              />
              <input 
                type="text" 
                placeholder="End Stop Name"
                value={c.endStop} 
                onChange={e => updateCirc(i, "endStop", e.target.value)}
                className="w-full p-2 border rounded shadow-sm text-sm"
              />
            </div>
          </div>
        </div>
      ))}

      <div className="flex gap-4">
        <button type="button" onClick={addCirc} className="flex-1 py-3 border-2 border-dashed rounded-xl text-slate-500 font-bold hover:bg-white hover:text-blue-500 transition-all">+ Add Work Segment</button>
        <button type="submit" className="flex-1 py-3 bg-blue-600 text-white font-bold rounded-xl shadow-lg hover:bg-blue-700 transition-colors">Save Schedule</button>
      </div>

      {message && <div className="p-4 bg-blue-50 text-blue-700 rounded-xl text-center border border-blue-100 font-medium">{message}</div>}
    </form>
  );
};

export default DriverScheduleForm;