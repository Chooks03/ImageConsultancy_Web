"use client";

import React, { useEffect, useState } from "react";
import { format } from "date-fns";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";

type BlockedSlot = { date: string; time: string };

const DEFAULT_TIME_SLOTS = [
  "09:00", "10:00", "11:00", "12:00", "13:00",
  "14:00", "15:00", "16:00", "17:00", "18:00"
];

export default function AdminAvailabilityManager(): React.ReactElement {
  const [blocked, setBlocked] = useState<BlockedSlot[]>([]);
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [selectedTime, setSelectedTime] = useState<string>(DEFAULT_TIME_SLOTS[0]);

  useEffect(() => {
    const raw = localStorage.getItem("adminBlockedSlots");
    setBlocked(raw ? JSON.parse(raw) : []);
  }, []);

  const addBlocked = () => {
    if (!selectedDate || !selectedTime) return;
    if (blocked.some(b => b.date === selectedDate && b.time === selectedTime)) {
      toast({ title: "Already blocked", description: "This slot is already blocked." });
      return;
    }
    const updated = [...blocked, { date: selectedDate, time: selectedTime }];
    setBlocked(updated);
    localStorage.setItem("adminBlockedSlots", JSON.stringify(updated));
    toast({ title: "Blocked", description: "Slot blocked for booking." });
  };

  const removeBlocked = (slot: BlockedSlot) => {
    const updated = blocked.filter(b => !(b.date === slot.date && b.time === slot.time));
    setBlocked(updated);
    localStorage.setItem("adminBlockedSlots", JSON.stringify(updated));
    toast({ title: "Unblocked", description: "Slot is now available." });
  };

  return (
    <div>
      <div className="flex gap-4 mb-4 items-end">
        <div>
          <label className="block mb-1 font-medium">Date</label>
          <Input
            type="date"
            value={selectedDate}
            onChange={e => setSelectedDate(e.target.value)}
          />
        </div>
        <div>
          <label className="block mb-1 font-medium">Time Slot</label>
          <select
            className="border rounded px-2 py-1"
            value={selectedTime}
            onChange={e => setSelectedTime(e.target.value)}
          >
            {DEFAULT_TIME_SLOTS.map(t => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>
        <Button onClick={addBlocked}>Block Slot</Button>
      </div>
      <h4 className="font-semibold mb-2">Blocked Slots</h4>
      <ul className="space-y-2">
        {blocked.length ? blocked.map((slot, i) => (
          <li key={i} className="flex items-center gap-4 bg-gray-50 p-2 rounded">
            <span>{slot.date} at {slot.time}</span>
            <Button size="sm" variant="outline" onClick={() => removeBlocked(slot)}>Remove</Button>
          </li>
        )) : <li className="text-gray-400">No blocked slots</li>}
      </ul>
    </div>
  );
}