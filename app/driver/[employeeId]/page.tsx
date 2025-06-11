"use client";
import { useState, useEffect } from "react";

import { format } from "date-fns";
import {
  getCurrentStopAndDetails,
  getLastStop,
  getNextTripStartTime,
} from "@/utils/driverUtils";
interface LastStopInfo {
  stop: string; // The name of the last stop
  date: string; // The date of the last stop (if needed)
  tramline: number; // The tramline number
}
interface currentStopInfo {
  currentStop: string;
  tramlineNumber: number;
  scheduledEndTime: Date;
  heading: String;
}
interface nextTripInfo {
  nextStartTime: String;
  lastCirculationEndTime: String;
}
const DriverSchedulePage = ({ params }: { params: { employeeId: number } }) => {
  const id = params.employeeId;
  const [schedule, setSchedule] = useState(null);
  const [currentStop, setCurrentStop] = useState<currentStopInfo | null>(null);
  const [nextTrip, setNextTrip] = useState<nextTripInfo | null>(null);
  const [lastStopInfo, setLastStopInfo] = useState<LastStopInfo | null>(null);

  useEffect(() => {
    if (id) {
      fetchDriverSchedule();
    }
  }, [id]);

  const fetchDriverSchedule = async () => {
    try {
      const response = await fetch(`/api/driver/location/${id}`);
      const data = await response.json();

      if (response.ok) {
        setSchedule(data);
        const currentTime = new Date();

        // Get current stop, last stop information, and next trip time
        setCurrentStop(getCurrentStopAndDetails(data, currentTime));
        setNextTrip(getNextTripStartTime(data, currentTime));
        setLastStopInfo(getLastStop(data));
      }
    } catch (error) {
      console.error("Failed to fetch driver schedule:", error);
    }
  };
  if (!schedule) return <div>Loading...</div>;

  return (
    <div style={{ padding: "20px" }}>
      <h1>Driver Schedule for ID: {id}</h1>
      {currentStop && currentStop.tramlineNumber != 0 ? (
        <div>
          <h2>Current Location:</h2>
          <p>{currentStop.currentStop}</p>
          <p>
            Scheduled endtime for trip:
            {new Date(currentStop.scheduledEndTime).toLocaleDateString(
              "sv-SE"
            )}{" "}
            {new Date(currentStop.scheduledEndTime).toLocaleTimeString("sv-SE")}
          </p>
          <p>Current tramline: {currentStop.tramlineNumber}</p>
          <p>Current heading: {currentStop.heading}</p>
        </div>
      ) : (
        <div>
          <h2>Driver is not currently on a scheduled trip.</h2>
          {nextTrip ? (
            <div>
              <p>Next Trip Start Time: {nextTrip.nextStartTime}</p>
              <p>
                Driver is Scheduled to end at {nextTrip.lastCirculationEndTime}
              </p>
            </div>
          ) : (
            lastStopInfo && (
              <div>
                <p>Last Stop: {lastStopInfo.stop}</p>
                <p>
                  Date:{new Date(lastStopInfo.date).toLocaleDateString("sv-SE")}{" "}
                  {new Date(lastStopInfo.date).toLocaleTimeString("sv-SE")}
                </p>
                <p>TramLine Number: {lastStopInfo.tramline}</p>
              </div>
            )
          )}
        </div>
      )}
    </div>
  );
};

export default DriverSchedulePage;

// "use client";
// import { useState, useEffect } from "react";
// import { useSearchParams } from "next/navigation";

// interface TripInfo {
//   tramline?: string; // Optional because it may not be present if not in a trip
//   startTime?: string; // Optional for the same reason
//   endTime?: string; // Optional for the same reason
//   message?: string; // New field for messages
// }

// const DriverLocation = ({ params }: { params: { employeeId: number } }) => {
//   const employeeId = params.employeeId;
//   const [tripInfo, setTripInfo] = useState<TripInfo | null>(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");
//   console.log("EMPL:" + employeeId);

//   // Fetch driver's current location using employeeId
//   useEffect(() => {
//     const fetchDriverLocation = async () => {
//       if (employeeId) {
//         try {
//           const response = await fetch(
//             `/api/driver/location?employeeId=${employeeId}`
//           );
//           const data = await response.json();

//           if (response.ok) {
//             setTripInfo(data);
//           } else {
//             setError(data.message || "Failed to fetch driver location");
//           }
//         } catch (error) {
//           setError("Error fetching driver location");
//         } finally {
//           setLoading(false); // Stop loading regardless of success or failure
//         }
//       } else {
//         setLoading(false); // Stop loading if no employeeId is provided
//         setError("Employee ID is required");
//       }
//     };

//     fetchDriverLocation();
//   }, [employeeId]);

//   return (
//     <div className="max-w-lg mx-auto mt-10 p-5 border rounded shadow">
//       <h1 className="text-2xl font-bold mb-4">Driver's Current Location</h1>
//       {loading ? (
//         <p>Loading...</p>
//       ) : error ? (
//         <p className="text-red-500">{error}</p> // Show error message if there is an error
//       ) : (
//         <div>
//           {tripInfo?.message ? (
//             <p>{tripInfo.message}</p> // Show message if it exists
//           ) : (
//             <>
//               <p>TramLine: {tripInfo?.tramline}</p>
//               {tripInfo?.startTime && (
//                 <p>
//                   Start Time:{" "}
//                   {new Date(tripInfo.startTime).toLocaleTimeString()}
//                 </p>
//               )}
//               {tripInfo?.endTime && (
//                 <p>
//                   End Time: {new Date(tripInfo.endTime).toLocaleTimeString()}
//                 </p>
//               )}
//             </>
//           )}
//         </div>
//       )}
//     </div>
//   );
// };

// export default DriverLocation;
