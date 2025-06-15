"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import {
  format,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameDay,
  parseISO,
} from "date-fns";
import { CalendarDayModal } from "@/components/CalendarDayModal";

interface DayStatus {
  date: Date;
  isPlanned: boolean;
  isScheduled: boolean;
  schedule?: any;
}

const CalendarPage = () => {
  const { employeeId } = useParams<{ employeeId: string }>();
  const [days, setDays] = useState<DayStatus[]>([]);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [selectedDay, setSelectedDay] = useState<DayStatus | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const fetchPlannedWorkdays = async () => {
    const response = await fetch(
      `/api/driver/planned?employeeId=${employeeId}`
    );
    if (!response.ok) throw new Error("Failed to fetch planned workdays");
    return await response.json();
  };

  const fetchSchedules = async () => {
    const response = await fetch(`/api/driver/location/${employeeId}`);
    if (!response.ok) throw new Error("Failed to fetch schedules");
    return await response.json();
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const monthStart = startOfMonth(currentMonth);
        const monthEnd = endOfMonth(currentMonth);

        const [schedules, plannedWorkdays] = await Promise.all([
          fetchSchedules(),
          fetchPlannedWorkdays(),
        ]);

        const monthDays = eachDayOfInterval({
          start: monthStart,
          end: monthEnd,
        });

        const daysWithStatus = monthDays.map((day) => ({
          date: day,
          isPlanned: plannedWorkdays.some((p: any) =>
            isSameDay(parseISO(p.date), day)
          ),
          isScheduled: schedules.some((s: any) =>
            isSameDay(parseISO(s.date), day)
          ),
          schedule: schedules.find((s: any) =>
            isSameDay(parseISO(s.date), day)
          ),
        }));

        setDays(daysWithStatus);
      } catch (error) {
        console.error(error);
        setMessage("❌ Could not load data");
      } finally {
        setIsLoading(false);
      }
    };

    if (employeeId) fetchData();
  }, [employeeId, currentMonth]);

  const getDayClassName = (day: DayStatus) => {
    if (day.isScheduled)
      return "bg-green-100 border-green-300 hover:bg-green-200 cursor-pointer";
    if (day.isPlanned)
      return "bg-yellow-100 border-yellow-300 hover:bg-yellow-200 cursor-pointer";
    return "bg-gray-100 border-gray-300 hover:bg-gray-200 cursor-pointer";
  };

  const getDayStatusText = (day: DayStatus) => {
    if (day.isScheduled) return "Scheduled";
    if (day.isPlanned) return "Planned";
    return "Off";
  };

  const handleDayClick = (day: DayStatus) => {
    setSelectedDay(day);
    setIsModalOpen(true);
  };

  const handleAddPlannedWorkday = async (date: Date) => {
    try {
      const response = await fetch("/api/driver/planned", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          employeeId,
          date: date.toISOString(),
        }),
      });

      if (response.ok) {
        setDays((prevDays) =>
          prevDays.map((d) => {
            if (isSameDay(d.date, date)) {
              return { ...d, isPlanned: true };
            }
            return d;
          })
        );
      }
    } catch (error) {
      console.error("Failed to add planned workday:", error);
    }
  };

  const handleRemovePlannedWorkday = async (date: Date) => {
    try {
      const response = await fetch("/api/driver/planned", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          employeeId,
          date: date.toISOString(),
        }),
      });

      if (response.ok) {
        setDays((prevDays) =>
          prevDays.map((d) => {
            if (isSameDay(d.date, date)) {
              return { ...d, isPlanned: false };
            }
            return d;
          })
        );
      }
    } catch (error) {
      console.error("Failed to remove planned workday:", error);
    }
  };

  const prevMonth = () => {
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1)
    );
  };

  const nextMonth = () => {
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1)
    );
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Driver Schedule Calendar</h1>

      <div className="flex justify-between items-center mb-6">
        <button
          onClick={prevMonth}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Previous
        </button>
        <h2 className="text-xl font-semibold">
          {format(currentMonth, "MMMM yyyy")}
        </h2>
        <button
          onClick={nextMonth}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Next
        </button>
      </div>

      {message && <p className="text-red-600">{message}</p>}

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-7 gap-2 mb-4">
            {/* Weekday headers */}
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
              <div key={day} className="text-center font-semibold py-2">
                {day}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-2">
            {/* Calendar days */}
            {days.map((day) => {
              const dateStr = format(day.date, "d");
              const isCurrentMonth =
                day.date.getMonth() === currentMonth.getMonth();

              return (
                <div
                  key={day.date.toString()}
                  onClick={() => handleDayClick(day)}
                  className={`p-2 border rounded min-h-24 ${getDayClassName(
                    day
                  )} ${!isCurrentMonth ? "opacity-50" : ""}`}
                >
                  <div className="flex justify-between">
                    <span className="font-semibold">{dateStr}</span>
                    <span className="text-xs">{getDayStatusText(day)}</span>
                  </div>

                  {day.isScheduled && day.schedule?.circulations && (
                    <ul className="text-xs mt-1 space-y-1">
                      {day.schedule.circulations
                        .slice(0, 2)
                        .map((circulation: any, i: number) => (
                          <li key={i} className="truncate">
                            {circulation.startTime}–{circulation.endTime}
                          </li>
                        ))}
                      {day.schedule.circulations.length > 2 && (
                        <li className="text-gray-500">
                          +{day.schedule.circulations.length - 2} more
                        </li>
                      )}
                    </ul>
                  )}
                </div>
              );
            })}
          </div>
        </>
      )}

      {isModalOpen && selectedDay && (
        <CalendarDayModal
          day={selectedDay}
          onClose={() => setIsModalOpen(false)}
          onAddPlannedWorkday={handleAddPlannedWorkday}
          onRemovePlannedWorkday={handleRemovePlannedWorkday}
        />
      )}
    </div>
  );
};

export default CalendarPage;
