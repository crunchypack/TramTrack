"use client";

import { FC, useState } from "react";
import { CalendarIcon, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";

interface ExportOption {
  label: string;
  start: Date;
  end: Date;
  title: string;
  description: string;
  location: string;
}

interface CalendarExportDropdownProps {
  options: ExportOption[];
}

const isValidDate = (date: Date) => {
  return date instanceof Date && !isNaN(date.getTime());
};

const formatGoogleCalendarDate = (date: Date) => {
  if (!isValidDate(date)) {
    throw new Error("Invalid date provided");
  }
  return date.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";
};

const createGoogleCalendarLink = (opt: ExportOption) => {
  try {
    if (!isValidDate(opt.start) || !isValidDate(opt.end)) {
      console.error("Invalid date in option:", opt);
      return "#";
    }

    const params = new URLSearchParams({
      text: opt.title || "",
      dates: `${formatGoogleCalendarDate(opt.start)}/${formatGoogleCalendarDate(
        opt.end
      )}`,
      details: opt.description || "",
      location: opt.location || "",
    });

    return `https://www.google.com/calendar/render?action=TEMPLATE&${params.toString()}`;
  } catch (error) {
    console.error("Error creating calendar link:", error);
    return "#";
  }
};

const GoogleCalendarExportDropdown: FC<CalendarExportDropdownProps> = ({
  options,
}) => {
  const [open, setOpen] = useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm" className="flex items-center gap-1">
          <CalendarIcon size={16} />
          Export to Calendar
          <ChevronDown size={16} />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-64 p-2 space-y-1">
        {options.map((opt, idx) => {
          const link = createGoogleCalendarLink(opt);
          return (
            <a
              key={idx}
              href={link}
              target="_blank"
              rel="noopener noreferrer"
              className={`block px-2 py-1 text-sm hover:bg-gray-100 rounded ${
                link === "#" ? "text-gray-400 cursor-not-allowed" : ""
              }`}
              onClick={(e) => link === "#" && e.preventDefault()}
            >
              {opt.label}
            </a>
          );
        })}
      </PopoverContent>
    </Popover>
  );
};

export default GoogleCalendarExportDropdown;
