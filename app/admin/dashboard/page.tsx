"use client";

import React, { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { format, startOfDay, endOfDay, addDays } from "date-fns";
import { useAuth } from "@/components/auth-provider";
import Footer from "@/components/footer";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "@/components/ui/tabs";
import { Download, IndianRupee } from "lucide-react";
import { toast } from "@/hooks/use-toast";

// --- Types omitted for brevity, keep existing ---

// Instagram Manager (existing)
function InstagramManager() {
  const [posts, setPosts] = useState<{ id: string; url: string }[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const raw = window.localStorage.getItem("instagramPosts");
    if (raw) {
      try {
        setPosts(JSON.parse(raw));
      } catch {
        setPosts([]);
      }
    }
  }, []);

  const add = () => {
    if (!inputRef.current) return;
    const url = inputRef.current.value.trim();
    if (!url) {
      toast({ title: "Validation Error", description: "URL required", variant: "destructive" });
      return;
    }
    setPosts((prev) => {
      const updated = [...prev, { id: Date.now().toString(), url }];
      window.localStorage.setItem("instagramPosts", JSON.stringify(updated));
      return updated;
    });
    if (inputRef.current) inputRef.current.value = "";
    toast({ title: "Success", description: "Post added." });
  };

  const del = (id: string) => {
    setPosts((posts) => {
      const updated = posts.filter((p) => p.id !== id);
      window.localStorage.setItem("instagramPosts", JSON.stringify(updated));
      return updated;
    });
    toast({ title: "Deleted", description: "Post removed." });
  };

  return (
    <div>
      <div className="mb-4 flex gap-2">
        <Input ref={inputRef} placeholder="Add Instagram post/reel URL" className="flex-1" />
        <Button onClick={add}>Add</Button>
      </div>
      <ul className="space-y-2">
        {posts.length ? (
          posts.map((p) => (
            <li key={p.id} className="flex justify-between items-center bg-gray-50 p-2 rounded">
              <span className="truncate">{p.url}</span>
              <Button size="sm" variant="outline" onClick={() => del(p.id)}>
                Delete
              </Button>
            </li>
          ))
        ) : (
          <li className="text-center text-gray-400">No posts added yet</li>
        )}
      </ul>
    </div>
  );
}

// --- New Availability Manager Section ---

type BlockedSlot = { date: string; time: string };

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

function AvailabilityManager() {
  const [blocked, setBlocked] = useState<BlockedSlot[]>([]);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState(DEFAULT_TIME_SLOTS[0]);

  useEffect(() => {
    const raw = window.localStorage.getItem("adminBlockedSlots");
    setBlocked(raw ? JSON.parse(raw) : []);
  }, []);

  const add = () => {
    if (!selectedDate || !selectedTime) {
      toast({ title: "Invalid input", description: "Please select date and time", variant: "destructive" });
      return;
    }
    if (blocked.some(b => b.date === selectedDate && b.time === selectedTime)) {
      toast({ title: "Already blocked", description: "The slot is already blocked.", variant: "destructive" });
      return;
    }
    const updated = [...blocked, { date: selectedDate, time: selectedTime }];
    setBlocked(updated);
    window.localStorage.setItem("adminBlockedSlots", JSON.stringify(updated));
    toast({ title: "Blocked", description: "Slot blocked for booking." });
  };

  const remove = (slot: BlockedSlot) => {
    const updated = blocked.filter(b => !(b.date === slot.date && b.time === slot.time));
    setBlocked(updated);
    window.localStorage.setItem("adminBlockedSlots", JSON.stringify(updated));
    toast({ title: "Unblocked", description: "Slot is now available." });
  };

  return (
    <div className="max-w-xl mx-auto p-6 bg-white rounded-lg shadow-md font-sans text-gray-800">
      <h2 className="text-2xl font-semibold mb-6 text-green-800">Manage Availability</h2>

      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="flex flex-col flex-1">
          <label htmlFor="date" className="mb-1 font-medium text-green-700">Select Date</label>
          <Input
            id="date"
            type="date"
            min={format(new Date(), "yyyy-MM-dd")}
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="border-green-600 focus:ring-2 focus:ring-green-500"
          />
        </div>

        <div className="flex flex-col flex-1">
          <label htmlFor="time" className="mb-1 font-medium text-green-700">Select Time</label>
          <select
            id="time"
            value={selectedTime}
            onChange={(e) => setSelectedTime(e.target.value)}
            className="border-green-600 rounded-md px-3 py-2 focus:ring-2 focus:ring-green-500"
          >
            {DEFAULT_TIME_SLOTS.map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
        </div>

        <div className="flex items-end">
          <Button className="min-w-[120px]" onClick={add}>Block Slot</Button>
        </div>
      </div>

      <h3 className="text-xl font-semibold mb-4 text-green-800">Blocked Slots</h3>

      <ul className="space-y-2 max-h-64 overflow-y-auto">
        {blocked.length === 0 && <li className="text-center text-gray-400 italic">No blocked slots</li>}
        {blocked.map((slot, idx) => (
          <li key={idx} className="flex justify-between p-2 bg-green-50 rounded border border-green-200">
            <span>{slot.date} at {slot.time}</span>
            <Button variant="outline" size="sm" onClick={() => remove(slot)} className="text-red-600 border-red-600 hover:bg-red-100">
              Remove
            </Button>
          </li>
        ))}
      </ul>
    </div>
  );
}


export default function AdminDashboard() {
  // (All previous state, handlers, fetches and UI code remains unchanged)
  // ...

  return (
    <div className="min-h-screen bg-gray-100">
      {/* ...existing header and tabs code */}
      <main className="max-w-7xl mx-auto p-6">
        <Tabs defaultValue="users">
          <TabsList className="mb-6">
            <TabsTrigger value="users">User Management</TabsTrigger>
            <TabsTrigger value="appointments">Appointment Management</TabsTrigger>
            <TabsTrigger value="instagram">Instagram Manager</TabsTrigger>
            <TabsTrigger value="availability">Availability Manager</TabsTrigger>
          </TabsList>
          
          <TabsContent value="users">
            {/* User Management UI */}
          </TabsContent>
          
          <TabsContent value="appointments">
            {/* Appointment Management UI */}
          </TabsContent>

          <TabsContent value="instagram">
            <InstagramManager />
          </TabsContent>

          <TabsContent value="availability">
            <AvailabilityManager />
          </TabsContent>
        </Tabs>
      </main>

      <Footer />
    </div>
  );
}
