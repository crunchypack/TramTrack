"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface Driver {
  _id: string;
  name: string;
  employeeId: string;
}

export default function CalendarDriverList() {
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchDrivers = async () => {
      try {
        const response = await fetch("/api/driver");
        if (!response.ok) throw new Error("Failed to fetch drivers");
        const data = await response.json();
        setDrivers(data);
      } catch (err) {
        setError("❌ Could not load drivers");
        console.error(err);
      }
    };

    fetchDrivers();
  }, []);

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">
        Driver Schedules
      </h1>

      {error && <p className="text-red-600 text-center mb-4">{error}</p>}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {drivers.map((driver) => (
          <Link
            key={driver._id}
            href={`/calendar/${driver.employeeId}`}
            className="block p-4 rounded-lg shadow-md bg-white hover:shadow-lg transition duration-200 border border-gray-200 hover:border-blue-400"
          >
            <h2 className="text-lg font-semibold text-blue-700">
              {driver.name}
            </h2>
            <p className="text-sm text-gray-600">ID: {driver.employeeId}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
