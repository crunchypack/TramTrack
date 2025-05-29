"use client";
import { useState, useEffect } from "react";

// Interface for the Driver object
interface Driver {
  _id: string;
  name: string;
  employeeId: string;
}

// Interface for the Circulation object
interface Circulation {
  _id: string;
  startTime: string;
  endTime: string;
}

interface DriverScheduleFormProps {
  driverEndpoint: string; // Endpoint to fetch available drivers
  circulationEndpoint: string; // Endpoint to fetch available circulations
  endpoint: string; // Endpoint to submit the new driver schedule
}

const DriverScheduleForm: React.FC<DriverScheduleFormProps> = ({
  driverEndpoint,
  circulationEndpoint,
  endpoint,
}) => {
  const [scheduleData, setScheduleData] = useState({
    driver: "",
    circulations: [] as string[],
  });
  const [drivers, setDrivers] = useState<Driver[]>([]); // Store available drivers fetched from the endpoint
  const [circulations, setCirculations] = useState<Circulation[]>([]); // Store available circulations fetched from the endpoint
  const [message, setMessage] = useState("");

  // Fetch available drivers when the component mounts
  useEffect(() => {
    const fetchDrivers = async () => {
      try {
        const response = await fetch(driverEndpoint);
        if (response.ok) {
          const data = await response.json();
          setDrivers(data);
        } else {
          setMessage("Failed to load drivers");
        }
      } catch (error) {
        setMessage("Error fetching drivers");
      }
    };

    fetchDrivers();
  }, [driverEndpoint]);

  // Fetch available circulations when the component mounts
  useEffect(() => {
    const fetchCirculations = async () => {
      try {
        const response = await fetch(circulationEndpoint);
        if (response.ok) {
          const data = await response.json();
          setCirculations(data);
        } else {
          setMessage("Failed to load circulations");
        }
      } catch (error) {
        setMessage("Error fetching circulations");
      }
    };

    fetchCirculations();
  }, [circulationEndpoint]);

  // Handle form data changes for driver and circulations
  const handleChange = (
    e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>
  ) => {
    const { name, value } = e.target;
    setScheduleData({ ...scheduleData, [name]: value });
  };

  // Handle adding a selected circulation to the list
  const handleAddCirculation = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedCirculationId = e.target.value;
    if (
      !scheduleData.circulations.includes(selectedCirculationId) &&
      selectedCirculationId !== ""
    ) {
      setScheduleData({
        ...scheduleData,
        circulations: [...scheduleData.circulations, selectedCirculationId],
      });
    }
  };

  // Handle removing a circulation from the list
  const handleRemoveCirculation = (circulationId: string) => {
    setScheduleData({
      ...scheduleData,
      circulations: scheduleData.circulations.filter(
        (id) => id !== circulationId
      ),
    });
  };

  // Submit the driver schedule with selected driver and circulations
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(scheduleData),
    });

    const data = await response.json();

    if (response.ok) {
      setMessage("Driver schedule created successfully!");
      setScheduleData({ driver: "", circulations: [] });
    } else {
      setMessage(data.message || "Failed to create driver schedule.");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-2xl mx-auto mt-10 p-5 border rounded shadow-md"
    >
      <h1 className="text-2xl font-bold mb-5">Create Driver Schedule</h1>

      {/* Driver Selection Dropdown */}
      <div className="mb-4">
        <label className="block text-gray-700">Select Driver</label>
        <select
          name="driver"
          value={scheduleData.driver}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
        >
          <option value="" disabled>
            Select a driver
          </option>
          {drivers.map((driver) => (
            <option key={driver._id} value={driver._id}>
              {`${driver.name} (Employee ID: ${driver.employeeId})`}
            </option>
          ))}
        </select>
      </div>

      {/* Circulation Selection Dropdown */}
      <div className="mb-4">
        <label className="block text-gray-700">Select Circulation</label>
        <select
          name="selectedCirculation"
          onChange={handleAddCirculation}
          className="w-full p-2 border rounded"
        >
          <option value="" disabled>
            Select a circulation to add
          </option>
          {circulations.map((circulation) => (
            <option key={circulation._id} value={circulation._id}>
              {`Circulation Start: ${new Date(
                circulation.startTime
              ).toLocaleString()}, End: ${new Date(
                circulation.endTime
              ).toLocaleString()}`}
            </option>
          ))}
        </select>
      </div>

      {/* Display Selected Circulations */}
      {scheduleData.circulations.length > 0 && (
        <div className="mb-4">
          <h3 className="text-lg font-bold mb-2">Circulations in Schedule</h3>
          <ul className="list-disc pl-5">
            {scheduleData.circulations.map((circulationId) => {
              const circulation = circulations.find(
                (c) => c._id === circulationId
              );
              return (
                circulation && (
                  <li key={circulation._id} className="mb-2">
                    <span className="text-gray-700">
                      {`Start: ${new Date(
                        circulation.startTime
                      ).toLocaleString()}, End: ${new Date(
                        circulation.endTime
                      ).toLocaleString()}`}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleRemoveCirculation(circulation._id)}
                      className="ml-4 text-red-500"
                    >
                      Remove
                    </button>
                  </li>
                )
              );
            })}
          </ul>
        </div>
      )}

      {/* Submit Button */}
      <button
        type="submit"
        className="w-full bg-green-500 text-white p-2 rounded"
      >
        Create Driver Schedule
      </button>

      {message && <p className="mt-4 text-center text-red-500">{message}</p>}
    </form>
  );
};

export default DriverScheduleForm;
