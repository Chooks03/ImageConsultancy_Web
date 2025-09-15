"use client";

import React, { useState, useEffect, useMemo, useRef } from "react";
import { format, addDays, parseISO, isAfter, isBefore } from "date-fns";
import Footer from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { toast } from "@/hooks/use-toast";

const DEFAULT_TIME_SLOTS: string[] = [
  "11:00", "12:00", "13:00", "14:00", "15:00",
  "16:00", "17:00", "18:00", "19:00",
];

// ---------- Types ----------
type User = {
  id: string;
  username: string;
  email: string;
  role: "user" | "admin";
};

type Service = {
  id: string;
  name: string;
  duration: string;
  price: number;
  description: string;
};

type Booking = {
  id: string;
  username: string;
  userEmail: string;
  service: Service;
  date: string;
  time: string;
  cancelled?: boolean;
};

// ---------- User Management ----------
function UserManager() {
  const [users, setUsers] = useState<User[]>([]);
  const [search, setSearch] = useState<string>("");
  const [adminOnly, setAdminOnly] = useState<boolean>(false);

  useEffect(() => {
    const raw = window.localStorage.getItem("users");
    if (raw) {
      try { setUsers(JSON.parse(raw)); } catch { setUsers([]); }
    }
  }, []);

  const filteredUsers = useMemo(() => {
    let filtered = users;
    if (adminOnly) filtered = filtered.filter(u => u.role === "admin");
    if (!search.trim()) return filtered;
    const lowerSearch = search.toLowerCase();
    return filtered.filter(
      u => u.username.toLowerCase().includes(lowerSearch) ||
           u.email.toLowerCase().includes(lowerSearch)
    );
  }, [search, users, adminOnly]);

  const toggleRole = (id: string) => {
    setUsers(prev =>
      prev.map(u =>
        u.id === id ? { ...u, role: u.role === "admin" ? "user" : "admin" } : u
      )
    );
    setTimeout(() => {
      const updated = users.map(u =>
        u.id === id ? { ...u, role: u.role === "admin" ? "user" : "admin" } : u
      );
      window.localStorage.setItem("users", JSON.stringify(updated));
      toast({ title: "User role changed" });
    }, 0);
  };

  return (
    <div className="bg-white rounded-md shadow p-6">
      <h2 className="text-2xl font-semibold mb-4 text-green-800 flex items-center justify-between">
        User Management
        <div className="flex items-center space-x-2">
          <span className={`text-sm font-medium ${adminOnly ? "text-green-700" : "text-gray-600"}`}>Show Admins Only</span>
          <Switch checked={adminOnly} onCheckedChange={setAdminOnly} aria-label="Filter admins" />
        </div>
      </h2>
      <Input
        placeholder="Search users by username or email"
        value={search}
        onChange={e => setSearch(e.target.value)}
        className="mb-5"
      />
      <div className="grid gap-3 sm:grid-cols-2 max-h-[600px] overflow-y-auto">
        {filteredUsers.length ? (
          filteredUsers.map(user => (
            <div key={user.id} className="bg-gray-50 rounded shadow-sm p-4 flex flex-col gap-2">
              <div className="flex justify-between items-center">
                <span className="font-bold text-green-900">{user.username}</span>
                <span className="text-xs text-gray-400">ID: {user.id}</span>
              </div>
              <div className="text-gray-700">{user.email}</div>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1">
                  <span>Role:</span>
                  <span className={`capitalize font-medium ${user.role === "admin" ? "text-green-600" : "text-gray-600"}`}>
                    {user.role}
                  </span>
                </div>
                <Switch
                  checked={user.role === "admin"}
                  onCheckedChange={() => toggleRole(user.id)}
                  aria-label="Toggle admin"
                />
                <span className="text-xs">{user.role === "admin" ? "Admin" : "User"}</span>
              </div>
            </div>
          ))
        ) : (
          <p className="col-span-2 text-center text-gray-400 italic">No users found.</p>
        )}
      </div>
    </div>
  );
}

// ---------- Appointment Management ----------
function AppointmentManager() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [search, setSearch] = useState<string>("");
  const [tab, setTab] = useState<"upcoming" | "past">("upcoming");
  const [cancelling, setCancelling] = useState<string | null>(null);

  useEffect(() => {
    const raw = window.localStorage.getItem("bookings");
    if (raw) {
      try { setBookings(JSON.parse(raw)); } catch { setBookings([]); }
    }
  }, []);

  const now = new Date();

  // >>>> exclude cancelled appointments from ALL tabs <<<<
  const filteredBookings = useMemo(() => {
    let filtered = bookings.filter(b => {
      if (b.cancelled) return false;
      const bookedDate = parseISO(b.date);
      if (tab === "upcoming") return isAfter(bookedDate, now);
      else return isBefore(bookedDate, now);
    });

    if (!search.trim()) return filtered;
    const lowerSearch = search.toLowerCase();
    return filtered.filter(
      b => b.username.toLowerCase().includes(lowerSearch) ||
           b.userEmail.toLowerCase().includes(lowerSearch) ||
           b.service.name.toLowerCase().includes(lowerSearch)
    );
  }, [bookings, tab, search, now]);

  const handleCancel = (id: string) => {
    setCancelling(id);
    setTimeout(() => {
      setBookings(curr => {
        const updated = curr.map(b => (b.id === id ? { ...b, cancelled: true } : b));
        window.localStorage.setItem("bookings", JSON.stringify(updated));
        toast({ title: "Appointment cancelled" });
        return updated;
      });
      setCancelling(null);
    }, 800);
  };

  return (
    <div className="bg-white rounded-md shadow p-6">
      <h2 className="text-2xl font-semibold mb-4 text-green-800 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
        Appointment Management
        <div className="flex gap-2">
          <button
            className={`px-4 py-2 rounded ${tab === "upcoming" ? "bg-green-700 text-white" : "border border-green-700 text-green-700 hover:bg-green-100"}`}
            onClick={() => setTab("upcoming")}
          >
            Upcoming
          </button>
          <button
            className={`px-4 py-2 rounded ${tab === "past" ? "bg-green-700 text-white" : "border border-green-700 text-green-700 hover:bg-green-100"}`}
            onClick={() => setTab("past")}
          >
            Past
          </button>
        </div>
      </h2>
      <Input
        placeholder="Search by username, email or service"
        value={search}
        onChange={e => setSearch(e.target.value)}
        className="mb-5 max-w-sm"
      />
      <div className="grid gap-3 sm:grid-cols-2 max-h-[600px] overflow-y-auto">
        {filteredBookings.length ? (
          filteredBookings.map(booking => (
            <div
              key={booking.id}
              className="bg-gray-50 rounded shadow-sm p-4 relative flex flex-col gap-2"
            >
              <div className="flex justify-between items-center">
                <span className="font-bold text-green-900">{booking.username}</span>
                <span className="text-xs text-gray-400">ID: {booking.id}</span>
              </div>
              <div className="text-gray-700">{booking.userEmail}</div>
              <div className="flex flex-col">
                <span><b>Service:</b> {booking.service.name}</span>
                <span><b>Duration:</b> {booking.service.duration}</span>
                <span><b>Price:</b> ₹{booking.service.price}</span>
                <span><b>Date:</b> {format(parseISO(booking.date), "yyyy-MM-dd")}</span>
                <span><b>Time:</b> {booking.time || "--:--"}</span>
              </div>
              <div className="mt-3 flex justify-end">
                <Button
                  variant="destructive"
                  size="sm"
                  disabled={cancelling === booking.id}
                  onClick={() => handleCancel(booking.id)}
                >
                  {cancelling === booking.id ? "Cancelling..." : "Cancel"}
                </Button>
              </div>
            </div>
          ))
        ) : (
          <p className="col-span-2 text-center text-gray-400 italic">
            No {tab} appointments found.
          </p>
        )}
      </div>
    </div>
  );
}

// ---------- Instagram Manager ----------
function InstagramManager() {
  const [posts, setPosts] = useState<{ id: string; url: string }[]>([]);
  const [search, setSearch] = useState<string>("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const raw = window.localStorage.getItem("instagramPosts");
    if (raw) {
      try { setPosts(JSON.parse(raw)); } catch { setPosts([]); }
    }
  }, []);

  const filteredPosts = useMemo(() => {
    if (!search.trim()) return posts;
    const lq = search.toLowerCase();
    return posts.filter(p => p.url.toLowerCase().includes(lq));
  }, [posts, search]);

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
    inputRef.current.value = "";
    toast({ title: "Success", description: "Post added." });
  };

  const remove = (id: string) => {
    setPosts((prev) => {
      const updated = prev.filter((p) => p.id !== id);
      window.localStorage.setItem("instagramPosts", JSON.stringify(updated));
      return updated;
    });
    toast({ title: "Deleted", description: "Post removed." });
  };

  return (
    <div className="bg-white rounded-md shadow p-6 max-w-2xl mx-auto">
      <h2 className="text-2xl font-semibold mb-4 text-green-800">Instagram Manager</h2>
      <div className="flex flex-col sm:flex-row gap-3 mb-3">
        <Input ref={inputRef} placeholder="Add Instagram post/reel URL" className="flex-grow" />
        <Button onClick={add} className="sm:w-auto w-full">Add</Button>
      </div>
      <Input
        placeholder="Search Instagram posts"
        value={search}
        onChange={e => setSearch(e.target.value)}
        className="mb-4"
      />
      <ul className="space-y-2 max-h-72 overflow-auto">
        {filteredPosts.length ? (
          filteredPosts.map((post) => (
            <li key={post.id} className="flex justify-between items-center bg-gray-50 rounded p-3 shadow-sm">
              <a href={post.url} target="_blank" className="truncate text-blue-900 hover:underline">{post.url}</a>
              <Button size="sm" variant="outline" className="text-red-600 border-red-600 hover:bg-red-100" onClick={() => remove(post.id)}>Delete</Button>
            </li>
          ))
        ) : (
          <p className="text-center text-gray-400 italic">No posts added.</p>
        )}
      </ul>
    </div>
  );
}

// ---------- Availability Manager ----------
function AvailabilityManager() {
  const [blocked, setBlocked] = useState<{ date: string; time: string }[]>([]);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState(DEFAULT_TIME_SLOTS[0]);
  const minDate = format(addDays(new Date(), 2), "yyyy-MM-dd");

  useEffect(() => {
    const raw = window.localStorage.getItem("adminBlockedSlots");
    if (raw) {
      try { setBlocked(JSON.parse(raw)); } catch { setBlocked([]); }
    }
  }, []);

  const add = () => {
    if (!selectedDate || !selectedTime) {
      toast({ title: "Invalid input", description: "Please select date and time", variant: "destructive" });
      return;
    }
    if (selectedDate < minDate) {
      toast({ title: "Invalid date", description: `Date must be ${minDate} or later`, variant: "destructive" });
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

  const remove = (slot: { date: string; time: string }) => {
    const updated = blocked.filter(b => !(b.date === slot.date && b.time === slot.time));
    setBlocked(updated);
    window.localStorage.setItem("adminBlockedSlots", JSON.stringify(updated));
    toast({ title: "Unblocked", description: "Slot is now available." });
  };

  return (
    <div className="bg-white rounded-md shadow p-6 max-w-xl mx-auto">
      <h2 className="text-2xl font-semibold mb-6 text-green-800">Availability Manager</h2>
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="flex flex-col flex-1">
          <label htmlFor="date" className="mb-1 font-medium text-green-700">Select Date</label>
          <Input
            id="date"
            type="date"
            min={minDate}
            value={selectedDate}
            onChange={e => setSelectedDate(e.target.value)}
            className="border border-green-600 rounded-md focus:ring-2 focus:ring-green-500"
          />
        </div>
        <div className="flex flex-col flex-1">
          <label htmlFor="time" className="mb-1 font-medium text-green-700">Select Time</label>
          <select
            id="time"
            value={selectedTime}
            onChange={e => setSelectedTime(e.target.value)}
            className="border border-green-600 rounded-md px-3 py-2 focus:ring-2 focus:ring-green-500"
          >
            {DEFAULT_TIME_SLOTS.map(t => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>
        <div className="flex items-end">
          <Button className="min-w-[120px]" onClick={add}>Block Slot</Button>
        </div>
      </div>
      <h3 className="text-xl font-semibold mb-4 text-green-800">Blocked Slots</h3>
      <ul className="space-y-3 max-h-64 overflow-y-auto">
        {blocked.length === 0 ? (
          <p className="text-center text-gray-400 italic">No blocked slots</p>
        ) : blocked.map((slot, idx) => (
          <li key={idx} className="flex justify-between items-center p-3 bg-green-50 rounded border border-green-200 shadow-sm">
            <span>{slot.date} at {slot.time}</span>
            <Button size="sm" variant="outline" className="text-red-600 border-red-600 hover:bg-red-100" onClick={() => remove(slot)}>
              Remove
            </Button>
          </li>
        ))}
      </ul>
    </div>
  );
}

// ---------- Main Dashboard ----------
export default function AdminDashboard() {
  const [tab, setTab] = useState<string>("appointments");

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col">
      <header className="sticky top-0 z-20 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-4 flex items-center justify-between max-w-7xl mx-auto">
        <h1 className="text-2xl font-extrabold text-green-900 dark:text-green-400">Admin Dashboard</h1>
        <Button variant="outline" onClick={() => window.location.href = "/"}>Back to Site</Button>
      </header>
      <main className="flex-grow max-w-7xl mx-auto p-6 w-full">
        <Tabs value={tab} onValueChange={setTab} className="w-full">
          <TabsList className="flex gap-2 overflow-x-auto border-b border-green-700">
            {["users", "appointments", "instagram", "availability"].map(
              (value) => (
                <TabsTrigger
                  key={value}
                  value={value}
                  className={`min-w-[150px] py-2 px-4 font-semibold cursor-pointer ${
                    tab === value
                      ? "border-b-4 border-green-700 text-green-900 dark:text-green-400"
                      : "border-b-4 border-transparent text-green-600 dark:text-green-500 hover:text-green-900 dark:hover:text-green-400"
                  }`}
                >
                  {value === "users"
                    ? "User Management"
                    : value === "appointments"
                    ? "Appointment Management"
                    : value.charAt(0).toUpperCase() + value.slice(1)}
                </TabsTrigger>
              )
            )}
          </TabsList>
          <TabsContent value="users"><UserManager /></TabsContent>
          <TabsContent value="appointments"><AppointmentManager /></TabsContent>
          <TabsContent value="instagram"><InstagramManager /></TabsContent>
          <TabsContent value="availability"><AvailabilityManager /></TabsContent>
        </Tabs>
      </main>
      <Footer />
    </div>
  );
}
