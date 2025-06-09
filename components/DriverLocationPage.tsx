"use client";

import { useEffect, useState } from "react";

interface DriverLocation {
  name: string;
  employeeId: string;
  currentStop: string;
  tramlineNumber: number;
  heading: string;
  scheduledEndTime: string;
}

const DriverLocationPage = () => {
  const [driverLocations, setDriverLocations] = useState<DriverLocation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const res = await fetch("/api/driver");
        const drivers = await res.json();

        const locations = await Promise.all(
          drivers.map(async (driver: any) => {
            const response = await fetch(`/api/driver/location/${driver._id}`);
            if (!response.ok) return null;
            const schedule = await response.json();

            const latestTripInfo = schedule?.circulations?.[0]?.trips?.[0]
              ?.tramline?.number
              ? schedule
              : null;

            if (!latestTripInfo) return null;

            const now = new Date();
            const trip = schedule.circulations
              .flatMap((c: any) => c.trips)
              .find(
                (t: any) =>
                  new Date(t.startTime) <= now && new Date(t.endTime) >= now
              );

            return {
              name: driver.name,
              employeeId: driver.employeeId,
              currentStop: trip?.tramline?.route?.[0] || "Unknown",
              tramlineNumber: trip?.tramline?.number || 0,
              heading: trip?.heading || "",
              scheduledEndTime: trip?.endTime || "",
            };
          })
        );

        setDriverLocations(locations.filter(Boolean));
      } catch (err) {
        console.error("Error fetching driver locations:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchLocations();
  }, []);

  return (
    <div className="max-w-4xl mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold mb-6">Driver Location Overview</h1>

      {loading ? (
        <p>Loading driver locations...</p>
      ) : (
        <div className="space-y-4">
          {driverLocations.map((driver) => (
            <div key={driver.employeeId} className="border rounded p-4 shadow">
              <h2 className="text-xl font-semibold">{driver.name}</h2>
              <p>
                Tramline: {driver.tramlineNumber} ({driver.heading})
              </p>
              <p>Current Stop: {driver.currentStop}</p>
              <p>
                Scheduled to end at:{" "}
                {new Date(driver.scheduledEndTime).toLocaleTimeString()}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DriverLocationPage;
