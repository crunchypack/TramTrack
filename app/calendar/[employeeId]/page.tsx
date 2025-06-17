"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import {
  format,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameDay,
  parseISO,
  startOfWeek,
  endOfWeek,
  addDays,
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
  const { data: session } = useSession();

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
        const calendarStart = startOfWeek(startOfMonth(currentMonth), {
          weekStartsOn: 1,
        });
        const calendarEnd = endOfWeek(endOfMonth(currentMonth), {
          weekStartsOn: 1,
        });

        const [schedules, plannedWorkdays] = await Promise.all([
          fetchSchedules(),
          fetchPlannedWorkdays(),
        ]);

        const monthDays = eachDayOfInterval({
          start: calendarStart,
          end: calendarEnd,
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
    return "bg-blue-100 border-gray-300 hover:bg-green-200 cursor-pointer";
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
    if (!session)
      return alert("You must be logged in to add a planned workday.");
    try {
      const response = await fetch("/api/driver/planned", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ employeeId, date: date.toISOString() }),
      });

      if (response.ok) {
        setDays((prev) =>
          prev.map((d) =>
            isSameDay(d.date, date) ? { ...d, isPlanned: true } : d
          )
        );
      }
    } catch (error) {
      console.error("Failed to add planned workday:", error);
    }
  };

  const handleRemovePlannedWorkday = async (date: Date) => {
    if (!session) return alert("Please log in to remove planned days");
    try {
      const response = await fetch("/api/driver/planned", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ employeeId, date: date.toISOString() }),
      });

      if (response.ok) {
        setDays((prev) =>
          prev.map((d) =>
            isSameDay(d.date, date) ? { ...d, isPlanned: false } : d
          )
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
    <div className="max-w-6xl mx-auto p-4 sm:p-6">
      <h1 className="text-xl sm:text-2xl font-bold mb-4 text-center sm:text-left">
        Driver Schedule Calendar {employeeId}
      </h1>

      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-2 sm:gap-0">
        <button
          onClick={prevMonth}
          className="w-full sm:w-auto px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Previous
        </button>
        <h2 className="text-lg sm:text-xl font-semibold text-center">
          {format(currentMonth, "MMMM yyyy")}
        </h2>
        <button
          onClick={nextMonth}
          className="w-full sm:w-auto px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
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
          {/* Weekday headers starting on Monday */}
          <div className="grid grid-cols-4 sm:grid-cols-7 gap-2 mb-2 text-sm sm:text-base">
            {Array.from({ length: 7 }).map((_, i) => {
              const day = startOfWeek(new Date(), { weekStartsOn: 1 });
              return (
                <div key={i} className="text-center font-semibold py-1 sm:py-2">
                  {format(addDays(day, i), "EEE")}
                </div>
              );
            })}
          </div>

          {/* Calendar days */}
          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-2">
            {days.map((day) => {
              const isCurrentMonth =
                day.date.getMonth() === currentMonth.getMonth();
              const isToday = isSameDay(day.date, new Date());

              return (
                <div
                  key={day.date.toString()}
                  onClick={() => handleDayClick(day)}
                  className={`p-2 border rounded min-h-24 sm:min-h-28 relative text-sm ${getDayClassName(
                    day
                  )} ${!isCurrentMonth ? "opacity-50" : ""} ${
                    isToday ? "ring-2 ring-orange-400" : ""
                  }`}
                >
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-semibold">
                      {format(day.date, "d")}
                    </span>
                    <span className="text-xs">{getDayStatusText(day)}</span>
                  </div>

                  {day.isScheduled && day.schedule?.circulations && (
                    <ul className="text-xs space-y-0.5">
                      {day.schedule.circulations
                        .slice(0, 2)
                        .map((circ: any, i: number) => (
                          <li key={i} className="truncate">
                            {circ.startTime}–{circ.endTime}
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
          isLoggedIn={!!session}
        />
      )}
    </div>
  );
};

export default CalendarPage;
