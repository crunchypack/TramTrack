"use client";
import { useState, useEffect } from "react";

interface Field {
  name: string;
  label: string;
  type: string;
  options?: { value: string; label: string }[]; // Optional property for select options
}

interface TripFormProps {
  fields: Field[];
  endpoint: string;
}

interface Tramline {
  value: string;
  label: string;
  route: string[];
}

const TripForm: React.FC<TripFormProps> = ({ fields, endpoint }) => {
  const [formData, setFormData] = useState<{ [key: string]: string }>({});
  const [message, setMessage] = useState("");
  const [tramlines, setTramlines] = useState<Tramline[]>([]);
  const [routeOptions, setRouteOptions] = useState<string[]>([]); // State for route options based on selected tramline

  // Fetch tramline data when the component mounts
  useEffect(() => {
    const fetchTramlines = async () => {
      try {
        const response = await fetch("/api/tramline"); // Adjust the endpoint as needed
        if (response.ok) {
          const data = await response.json();
          const tramlineOptions = data.map(
            (tramline: { _id: string; number: string; route: string[] }) => ({
              value: tramline._id,
              label: tramline.number,
              route: [
                tramline.route[0],
                tramline.route[tramline.route.length - 1],
              ], // Only keep the first and last stops
            })
          );
          setTramlines(tramlineOptions);
        } else {
          setMessage("Failed to load tramlines");
        }
      } catch (error) {
        setMessage("Error fetching tramlines");
      }
    };

    fetchTramlines();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    // When tramline is selected, update the route options with first and last stops
    if (name === "tramline") {
      const selectedTramline = tramlines.find(
        (tramline) => tramline.value === value
      );
      if (selectedTramline) {
        setRouteOptions(selectedTramline.route);
        setFormData({
          ...formData,
          tramline: value,
          tramlineName: selectedTramline.label, // Set the tramlineName based on the selected tramline
        });
      }
    } else {
      setFormData({ ...formData, [name]: value });
    }
    console.log(formData);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });

    const data = await response.json();

    if (response.ok) {
      setMessage("Success!");
      setFormData({});
    } else {
      setMessage(data.message || "Error");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-md mx-auto mt-10 p-5 border rounded shadow-md"
    >
      <h1 className="text-2xl font-bold mb-5">Create trip</h1>

      {fields.map((field) => (
        <div key={field.name} className="mb-4">
          <label className="block text-gray-700">{field.label}</label>
          {field.name === "tramline" && tramlines.length > 0 ? (
            <>
              {/* Tramline Select Dropdown */}
              <select
                name="tramline"
                value={formData.tramline || ""}
                onChange={handleChange}
                className="w-full p-2 border rounded"
                required
              >
                <option value="" disabled>
                  Select a Tramline
                </option>
                {tramlines.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>

              {/* Second dropdown for route options based on selected tramline */}
              {routeOptions.length > 0 && (
                <div className="mt-4">
                  <label className="block text-gray-700">Heading</label>
                  <select
                    name="heading"
                    value={formData.heading || ""}
                    onChange={handleChange}
                    className="w-full p-2 border rounded"
                    required
                  >
                    <option value="" disabled>
                      Select a Heading
                    </option>
                    {routeOptions.map((route, index) => (
                      <option key={index} value={route}>
                        {route}
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </>
          ) : (
            <input
              type={field.type}
              name={field.name}
              value={formData[field.name] || ""}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              required
            />
          )}
        </div>
      ))}

      <button
        type="submit"
        className="w-full bg-blue-500 text-white p-2 rounded"
      >
        Submit
      </button>

      {message && <p className="mt-4 text-center">{message}</p>}
    </form>
  );
};

export default TripForm;
