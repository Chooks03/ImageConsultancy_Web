"use client";

import React, { useEffect, useState } from "react";
import { format, addDays } from "date-fns";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";

type BlockedSlot = { date: string; time: string };

// Updated default time slots from 11 AM to 7 PM (evening)
const DEFAULT_TIME_SLOTS = [
  "11:00",
  "12:00",
  "13:00",
  "14:00",
  "15:00",
  "16:00",
  "17:00",
  "18:00",
  "19:00",
];

export default function AdminAvailabilityManager(): React.ReactElement {
  const [blocked, setBlocked] = useState<BlockedSlot[]>([]);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState(DEFAULT_TIME_SLOTS[0]);

  // minDate is today + 2 days; dates before this are disabled
  const minDate = format(addDays(new Date(), 2), "yyyy-MM-dd");

  useEffect(() => {
    const raw = localStorage.getItem("adminBlockedSlots");
    setBlocked(raw ? JSON.parse(raw) : []);
  }, []);

  const addBlocked = () => {
    if (!selectedDate || !selectedTime) {
      toast({ title: "Invalid input", description: "Please select both date and time slot." });
      return;
    }
    if (selectedDate < minDate) {
      toast({ title: "Invalid date", description: `Date must be ${minDate} or later.` });
      return;
    }
    if (blocked.some((b) => b.date === selectedDate && b.time === selectedTime)) {
      toast({ title: "Already blocked", description: "This slot is already blocked." });
      return;
    }
    const updated = [...blocked, { date: selectedDate, time: selectedTime }];
    setBlocked(updated);
    localStorage.setItem("adminBlockedSlots", JSON.stringify(updated));
    toast({ title: "Blocked", description: "Slot blocked for booking." });
  };

  const removeBlocked = (slot: BlockedSlot) => {
    const updated = blocked.filter(
      (b) => !(b.date === slot.date && b.time === slot.time)
    );
    setBlocked(updated);
    localStorage.setItem("adminBlockedSlots", JSON.stringify(updated));
    toast({ title: "Unblocked", description: "Slot is now available." });
  };

  return (
    <div className="max-w-xl mx-auto p-6 bg-white rounded-lg shadow-md font-sans text-gray-800">
      <h2 className="text-2xl font-semibold mb-6 text-green-800">Manage Availability</h2>

      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="flex flex-col flex-1">
          <label htmlFor="date" className="mb-1 font-medium text-green-700">
            Select Date
          </label>
          <Input
            id="date"
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            min={minDate}
            className="border-green-600 focus:ring-2 focus:ring-green-500"
          />
        </div>

        <div className="flex flex-col flex-1">
          <label htmlFor="time" className="mb-1 font-medium text-green-700">
            Select Time
          </label>
          <select
            id="time"
            value={selectedTime}
            onChange={(e) => setSelectedTime(e.target.value)}
            className="border border-green-600 rounded-md px-3 py-2 focus:ring-2 focus:ring-green-500"
          >
            {DEFAULT_TIME_SLOTS.map((time) => (
              <option key={time} value={time}>
                {time}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-end">
          <Button className="min-w-[120px]" onClick={addBlocked}>
            Block Slot
          </Button>
        </div>
      </div>

      <h3 className="text-xl font-semibold mb-4 text-green-800">Blocked Slots</h3>

      <ul className="space-y-3 max-h-64 overflow-y-auto">
        {blocked.length === 0 && (
          <li className="text-center italic text-gray-400">No blocked slots</li>
        )}
        {blocked.map((slot, idx) => (
          <li
            key={idx}
            className="flex justify-between items-center bg-green-50 border border-green-200 rounded p-3"
          >
            <span>
              {slot.date} at {slot.time}
            </span>
            <Button
              size="sm"
              variant="outline"
              onClick={() => removeBlocked(slot)}
              className="text-red-600 border-red-600 hover:bg-red-100"
            >
              Remove
            </Button>
          </li>
        ))}
      </ul>
    </div>
  );
}
