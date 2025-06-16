"use client";
import { format } from "date-fns";

interface CalendarDayModalProps {
  day: {
    date: Date;
    isPlanned: boolean;
    isScheduled: boolean;
    schedule?: any;
  };
  onClose: () => void;
  onAddPlannedWorkday: (date: Date) => void;
  onRemovePlannedWorkday: (date: Date) => void;
  isLoggedIn: boolean;
}

export const CalendarDayModal = ({
  day,
  onClose,
  onAddPlannedWorkday,
  onRemovePlannedWorkday,
  isLoggedIn,
}: CalendarDayModalProps) => {
  const handleTogglePlannedWorkday = () => {
    if (day.isPlanned) {
      onRemovePlannedWorkday(day.date);
    } else {
      onAddPlannedWorkday(day.date);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full">
        <h2 className="text-xl font-bold mb-4">
          {format(day.date, "EEEE, MMMM d, yyyy")}
        </h2>

        <div className="mb-4">
          <p className="font-semibold">
            Status:{" "}
            {day.isScheduled ? "Scheduled" : day.isPlanned ? "Planned" : "Off"}
          </p>
        </div>

        {day.isScheduled && day.schedule?.circulations && (
          <div className="mb-4">
            <h3 className="font-semibold mb-2">Schedule:</h3>
            <ul className="space-y-2">
              {day.schedule.circulations.map((circulation: any, i: number) => (
                <li key={i} className="border-b pb-2">
                  <p>
                    <strong>Time:</strong> {circulation.startTime} –{" "}
                    {circulation.endTime}
                  </p>
                  {circulation.startStop?.name && (
                    <p>
                      <strong>From:</strong> {circulation.startStop.name}
                    </p>
                  )}
                  {circulation.endStop?.name && (
                    <p>
                      <strong>To:</strong> {circulation.endStop.name}
                    </p>
                  )}
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="flex justify-between mt-6">
          {isLoggedIn && !day.isScheduled && (
            <button
              onClick={handleTogglePlannedWorkday}
              className={`px-4 py-2 rounded ${
                day.isPlanned
                  ? "bg-red-500 hover:bg-red-600 text-white"
                  : "bg-blue-500 hover:bg-blue-600 text-white"
              }`}
            >
              {day.isPlanned ? "Remove Planned Day" : "Add Planned Day"}
            </button>
          )}
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
