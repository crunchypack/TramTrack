"use client";
import { useState, useEffect } from "react";

// Interface for the Trip object
interface Trip {
  _id: string;
  tramlineName: string;
  tramline: string;
  startTime: string;
  endTime: string;
}

interface CirculationFormProps {
  endpoint: string; // Endpoint to submit the new Circulation
  tripEndpoint: string; // Endpoint to fetch available trips
}

const CirculationForm: React.FC<CirculationFormProps> = ({
  endpoint,
  tripEndpoint,
}) => {
  const [circulationData, setCirculationData] = useState({
    startTime: "",
    endTime: "",
    endStop: "",
  });
  const [selectedTripId, setSelectedTripId] = useState(""); // State to hold selected trip ID
  const [trips, setTrips] = useState<Trip[]>([]); // Store available trips fetched from the endpoint
  const [addedTrips, setAddedTrips] = useState<Trip[]>([]); // Trips added to the circulation
  const [message, setMessage] = useState("");

  // Fetch available trips when the component mounts
  useEffect(() => {
    const fetchTrips = async () => {
      try {
        const response = await fetch(tripEndpoint);
        if (response.ok) {
          const data = await response.json();
          setTrips(data);
        } else {
          setMessage("Failed to load trips");
        }
      } catch (error) {
        setMessage("Error fetching trips");
      }
    };

    fetchTrips();
  }, [tripEndpoint]);

  // Update circulation form data
  const handleCirculationChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setCirculationData({ ...circulationData, [name]: value });
  };

  // Handle adding a selected trip to the list
  const handleAddTrip = () => {
    const selectedTrip = trips.find((trip) => trip._id === selectedTripId);
    if (selectedTrip) {
      setAddedTrips([...addedTrips, selectedTrip]);
      setSelectedTripId(""); // Reset selected trip
    }
  };

  // Handle removing a trip from the list
  const handleRemoveTrip = (tripId: string) => {
    setAddedTrips(addedTrips.filter((trip) => trip._id !== tripId));
  };

  // Submit the circulation with selected trips
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const circulationPayload = {
      ...circulationData,
      trips: addedTrips.map((trip) => trip._id), // Include only the trip IDs
    };

    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(circulationPayload),
    });

    const data = await response.json();

    if (response.ok) {
      setMessage("Circulation created successfully!");
      setCirculationData({ startTime: "", endTime: "", endStop: "" });
      setAddedTrips([]);
    } else {
      setMessage(data.message || "Failed to create circulation.");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-2xl mx-auto mt-10 p-5 border rounded shadow-md"
    >
      <h1 className="text-2xl font-bold mb-5">Create Circulation</h1>

      {/* Circulation Fields */}
      <div className="mb-4">
        <label className="block text-gray-700">Start Time</label>
        <input
          type="datetime-local"
          name="startTime"
          value={circulationData.startTime}
          onChange={handleCirculationChange}
          className="w-full p-2 border rounded"
          required
        />
      </div>

      <div className="mb-4">
        <label className="block text-gray-700">End Time</label>
        <input
          type="datetime-local"
          name="endTime"
          value={circulationData.endTime}
          onChange={handleCirculationChange}
          className="w-full p-2 border rounded"
          required
        />
      </div>

      <div className="mb-4">
        <label className="block text-gray-700">End Stop</label>
        <input
          type="text"
          name="endStop"
          value={circulationData.endStop}
          onChange={handleCirculationChange}
          className="w-full p-2 border rounded"
          required
        />
      </div>

      {/* Trip Selection Dropdown */}
      <div className="mb-4">
        <label className="block text-gray-700">Select Trip</label>
        <select
          name="selectedTrip"
          value={selectedTripId}
          onChange={(e) => setSelectedTripId(e.target.value)}
          className="w-full p-2 border rounded"
          required
        >
          <option value="" disabled>
            Select an existing trip
          </option>
          {trips.map((trip) => (
            <option key={trip._id} value={trip._id}>
              {`Tramline: ${trip.tramlineName}, Start Time: ${new Date(
                trip.startTime
              ).toLocaleString()}, End Time: ${new Date(
                trip.endTime
              ).toLocaleString()}`}
            </option>
          ))}
        </select>

        {/* Add Trip Button */}
        <button
          type="button"
          onClick={handleAddTrip}
          className="mt-3 bg-blue-500 text-white p-2 rounded"
        >
          Add Trip
        </button>
      </div>

      {/* Display Selected Trips */}
      {addedTrips.length > 0 && (
        <div className="mb-4">
          <h3 className="text-lg font-bold mb-2">Trips in Circulation</h3>
          <ul className="list-disc pl-5">
            {addedTrips.map((trip) => (
              <li key={trip._id} className="mb-2">
                <span className="text-gray-700">
                  {`Tramline: ${trip.tramlineName}, Start Time: ${new Date(
                    trip.startTime
                  ).toLocaleString()}, End Time: ${new Date(
                    trip.endTime
                  ).toLocaleString()}`}
                </span>
                <button
                  type="button"
                  onClick={() => handleRemoveTrip(trip._id)}
                  className="ml-4 text-red-500"
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Submit Button */}
      <button
        type="submit"
        className="w-full bg-green-500 text-white p-2 rounded"
      >
        Create Circulation
      </button>

      {message && <p className="mt-4 text-center text-red-500">{message}</p>}
    </form>
  );
};

export default CirculationForm;
