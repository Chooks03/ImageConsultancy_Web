"use client";

import React, { useEffect, useState, useRef, ChangeEvent } from "react";
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
import { Download, Search, IndianRupee } from "lucide-react";
import { toast } from "@/hooks/use-toast";

// Types
interface UserType {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  username: string;
  isAdmin: boolean;
}

interface Booking {
  id: string;
  bookingId: string;
  date: Date;
  createdAt?: Date;
  username: string;
  userEmail: string;
  userPhone?: string;
  serviceName: string;
  duration?: string;
  amount: number;
  paymentMethod?: string;
  paymentStatus: string;
  cancelled?: boolean;
  cancelledAt?: Date | null;
  cancelledBy?: string;
  status?: string;
}

interface CancelDialogProps {
  booking: Booking;
  onCancel: (booking: Booking) => void;
  isCancelling: boolean;
}

// Instagram Manager
function InstagramManager(): React.ReactElement {
  const [posts, setPosts] = useState<{ id: string; url: string }[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const raw = localStorage.getItem("instagramPosts");
    if (raw) {
      try {
        setPosts(JSON.parse(raw));
      } catch {
        setPosts([]);
      }
    }
  }, []);

  const add = (): void => {
    if (!inputRef.current) return;
    const url = inputRef.current.value.trim();
    if (!url) {
      toast({
        title: "Validation Error",
        description: "URL required",
        variant: "destructive",
      });
      return;
    }
    setPosts((prev) => {
      const updated = [...prev, { id: Date.now().toString(), url }];
      localStorage.setItem("instagramPosts", JSON.stringify(updated));
      return updated;
    });
    inputRef.current.value = "";
    toast({ title: "Success", description: "Post added." });
  };

  const del = (id: string): void => {
    setPosts((posts) => {
      const updated = posts.filter((p) => p.id !== id);
      localStorage.setItem("instagramPosts", JSON.stringify(updated));
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
      <ul>
        {posts.length ? posts.map((p) => (
          <li key={p.id} className="flex justify-between items-center bg-gray-50 p-2 rounded">
            <span className="truncate">{p.url}</span>
            <Button size="sm" variant="outline" onClick={() => del(p.id)}>Delete</Button>
          </li>
        )) : (
          <li className="text-center text-gray-400">No posts added yet</li>
        )}
      </ul>
    </div>
  );
}

export default function AdminDashboard(): React.ReactElement {
  const router = useRouter();
  const { user: currentUser } = useAuth();

  const [users, setUsers] = useState<UserType[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [cancelledBookings, setCancelledBookings] = useState<Booking[]>([]);
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [filterDate, setFilterDate] = useState<string>("all");
  const [isCancelling, setIsCancelling] = useState<boolean>(false);
  const [cancellingBooking, setCancellingBooking] = useState<string | null>(null);

  const safeParse = <T,>(str?: string | null): T[] => {
    if (!str) return [];
    try {
      return JSON.parse(str);
    } catch {
      return [];
    }
  };

  useEffect(() => {
    const storedUsers = localStorage.getItem("users");
    const parsedUsers = safeParse<UserType>(storedUsers);
    setUsers(parsedUsers.map((u: any) => ({
      id: u.id ?? u._id ?? Math.random().toString(10).substring(2),
      firstName: u.firstName ?? "Unknown",
      lastName: u.lastName ?? "",
      email: u.email ?? "unknown@example.com",
      username: u.username ?? "unknown",
      isAdmin: u.isAdmin ?? false,
    })));

    setBookings(safeParse<Booking>(localStorage.getItem("bookings")).map((b: any) => ({
      ...b,
      date: new Date(b.date),
      cancelledAt: b.cancelledAt ? new Date(b.cancelledAt) : null,
    })));

    setCancelledBookings(safeParse<Booking>(localStorage.getItem("cancelledBookings")).map((b: any) => ({
      ...b,
      date: new Date(b.date),
      cancelledAt: b.cancelledAt ? new Date(b.cancelledAt) : null,
    })));
  }, []);

  const handleToggleAdmin = (id: string): void => {
    if (id === currentUser?.id) {
      toast({
        title: "Operation not allowed",
        description: "You cannot change your own admin status.",
        variant: "destructive"
      });
      return;
    }
    const updated = users.map(u => u.id === id ? { ...u, isAdmin: !u.isAdmin } : u);
    setUsers(updated);
    localStorage.setItem("users", JSON.stringify(updated));
    toast({ title: "Success", description: "User role updated" });
  };

  const handleDeleteUser = (id: string): void => {
    if (id === currentUser?.id) {
      toast({
        title: "Operation not allowed",
        description: "You cannot delete your own account.",
        variant: "destructive"
      });
      return;
    }
    const updated = users.filter(u => u.id !== id);
    setUsers(updated);
    localStorage.setItem("users", JSON.stringify(updated));
    toast({ title: "Success", description: "User deleted" });
  };

  const filterBookings = (arr: Booking[]): Booking[] => {
    const s = searchQuery.toLowerCase();
    return arr.filter(b => {
      const matchesText =
        !searchQuery ||
        [b.bookingId, b.username, b.userEmail, b.serviceName]
          .some(f => (f ?? "").toLowerCase().includes(s));
      let matchesStatus = true;
      if (filterStatus === "paid") matchesStatus = b.paymentStatus === "completed";
      else if (filterStatus === "pending") matchesStatus = b.paymentStatus !== "completed";
      let matchesDate = true;
      const now = new Date();
      const start = startOfDay(now);
      const end = endOfDay(now);
      const tomorrow = addDays(end, 1);
      if (filterDate === "today") matchesDate = b.date >= start && b.date <= end;
      else if (filterDate === "tomorrow") matchesDate = b.date > end && b.date <= tomorrow;
      else if (filterDate === "upcoming") matchesDate = b.date > now;
      else if (filterDate === "past") matchesDate = b.date < now;
      return matchesText && matchesStatus && matchesDate;
    });
  };

  const filteredUsers = searchQuery ? users.filter(u => {
    const combined = `${u.firstName} ${u.lastName} ${u.email} ${u.username}`.toLowerCase();
    return combined.includes(searchQuery.toLowerCase());
  }) : users;

  const filteredActiveBookings = filterBookings(bookings);
  const filteredCancelledBookings = filterBookings(cancelledBookings);

  const handleCancelAppointment = async (booking: Booking): Promise<void> => {
    setIsCancelling(true);
    setCancellingBooking(booking.id);

    try {
      await new Promise((res) => setTimeout(res, 1500));
      const updated = bookings.filter(b => b.id !== booking.id);
      const cancelledEntry = {...booking, cancelledAt: new Date(), status: "cancelled", cancelledBy: "admin"};
      const updatedCancelled = [...cancelledBookings, cancelledEntry];

      setBookings(updated);
      setCancelledBookings(updatedCancelled);

      localStorage.setItem("bookings", JSON.stringify(updated));
      localStorage.setItem("cancelledBookings", JSON.stringify(updatedCancelled));
      toast({ title: "Success", description: "Appointment cancelled." });
    } catch {
      toast({ title: "Error", description: "Failed to cancel appointment.", variant: "destructive" });
    } finally {
      setIsCancelling(false);
      setCancellingBooking(null);
    }
  };

  const downloadCsv = (): void => {
    const headers = ["Booking ID", "Date", "Time", "Username", "Email", "Phone", "Service", "Duration", "Amount", "Payment Method", "Payment Status", "Cancelled On", "Cancelled By"];
    const rows = [...bookings, ...cancelledBookings].map(b => [
      b.bookingId ?? "",
      b.date ? format(b.date, "yyyy-MM-dd") : "",
      b.date ? format(b.date, "HH:mm") : "",
      b.username ?? "",
      b.userEmail ?? "",
      b.userPhone ?? "",
      b.serviceName ?? "",
      b.duration ? `${b.duration} mins` : "",
      b.amount ?? "",
      b.paymentMethod ?? "",
      b.paymentStatus ?? "",
      b.cancelledAt ? format(b.cancelledAt, "yyyy-MM-dd HH:mm") : "",
      b.cancelledBy ?? "",
    ]);
    const csvContent = [headers, ...rows].map(row => row.map(item => `"${String(item).replace(/"/g, '""')}"`).join(",")).join("\n");
    const blob = new Blob([csvContent], {type: "text/csv"});
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `appointments_${format(new Date(), "yyyyMMdd")}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (!users.length && !bookings.length) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      {/* Header */}
      <header className="max-w-7xl mx-auto mb-8 flex justify-between items-center">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <Button onClick={() => router.push("/")}>Back to Site</Button>
      </header>

      <main className="max-w-7xl mx-auto bg-white p-6 rounded shadow">
        <Tabs defaultValue="users">
          <TabsList className="mb-6">
            <TabsTrigger value="users">User Management</TabsTrigger>
            <TabsTrigger value="appointments">Appointment Management</TabsTrigger>
            <TabsTrigger value="instagram">Instagram Feed</TabsTrigger>
          </TabsList>

          <TabsContent value="users">
            <div className="mb-4 flex gap-2">
              <Input
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search users by name, email, or username"
                className="max-w-sm"
              />
            </div>

            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Username</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Action</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {filteredUsers.length ? filteredUsers.map(user => (
                  <TableRow key={user.id}>
                    <TableCell>{user.firstName} {user.lastName}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>{user.username}</TableCell>
                    <TableCell>
                      <Switch
                        checked={user.isAdmin}
                        onCheckedChange={() => handleToggleAdmin(user.id)}
                        disabled={user.id === currentUser?.id}
                      />
                      <span className="ml-2">{user.isAdmin ? "Admin" : "User"}</span>
                    </TableCell>
                    <TableCell>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDeleteUser(user.id)}
                        disabled={user.id === currentUser?.id}
                      >
                        Delete
                      </Button>
                    </TableCell>
                  </TableRow>
                )) : (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center p-4 text-gray-500">
                      No users found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TabsContent>

          <TabsContent value="appointments">
            <div className="flex flex-col gap-4">
              <div className="flex flex-wrap gap-2 mb-4 items-center">
                <Input
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  placeholder="Search appointments"
                  className="max-w-sm"
                />
                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger>Status</SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All</SelectItem>
                    <SelectItem value="paid">Paid</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={filterDate} onValueChange={setFilterDate}>
                  <SelectTrigger>Date</SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All</SelectItem>
                    <SelectItem value="today">Today</SelectItem>
                    <SelectItem value="tomorrow">Tomorrow</SelectItem>
                    <SelectItem value="upcoming">Upcoming</SelectItem>
                    <SelectItem value="past">Past</SelectItem>
                  </SelectContent>
                </Select>
                <Button className="ml-auto" onClick={downloadCsv}>
                  <Download className="inline-block mr-1" />
                  Download CSV
                </Button>
              </div>

              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Booking ID</TableHead>
                    <TableHead>Date &amp; Time</TableHead>
                    <TableHead>Client</TableHead>
                    <TableHead>Service</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {filteredActiveBookings.length ? filteredActiveBookings.map(booking => (
                    <TableRow key={booking.id}>
                      <TableCell>{booking.bookingId ?? ""}</TableCell>
                      <TableCell>
                        {format(booking.date, "MMM d, yyyy")}
                        <br />
                        <small>{format(booking.date, "h:mm a")}</small>
                      </TableCell>
                      <TableCell>{booking.username ?? ""}</TableCell>
                      <TableCell>{booking.serviceName ?? ""}</TableCell>
                      <TableCell>
                        <IndianRupee className="inline-block mr-1" />
                        {booking.amount ?? ""}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={
                            booking.paymentStatus === "completed"
                              ? "text-green-700 border-green-500 bg-green-50"
                              : "text-yellow-700 border-yellow-500 bg-yellow-50"
                          }
                        >
                          {booking.paymentStatus === "completed" ? "Paid" : "Pending"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <CancelDialog
                          booking={booking}
                          onCancel={handleCancelAppointment}
                          isCancelling={isCancelling && cancellingBooking === booking.id}
                        />
                      </TableCell>
                    </TableRow>
                  )) : (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center p-4 text-gray-500">
                        No appointments found.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>

              <h3 className="mt-6 mb-2 font-semibold">Cancelled Appointments</h3>

              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Booking ID</TableHead>
                    <TableHead>Date &amp; Time</TableHead>
                    <TableHead>Client</TableHead>
                    <TableHead>Service</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Cancelled On</TableHead>
                    <TableHead>Cancelled By</TableHead>
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {filteredCancelledBookings.length ? filteredCancelledBookings.map(booking => (
                    <TableRow key={booking.id}>
                      <TableCell>{booking.bookingId ?? ""}</TableCell>
                      <TableCell>
                        {format(booking.date, "MMM d, yyyy")}
                        <br />
                        <small>{format(booking.date, "h:mm a")}</small>
                      </TableCell>
                      <TableCell>{booking.username ?? ""}</TableCell>
                      <TableCell>{booking.serviceName ?? ""}</TableCell>
                      <TableCell>
                        <IndianRupee className="inline-block mr-1" />
                        {booking.amount ?? ""}
                      </TableCell>
                      <TableCell>
                        {booking.cancelledAt ? format(booking.cancelledAt, "MMM d, yyyy") : ""}
                        <br />
                        <small>{booking.cancelledAt ? format(booking.cancelledAt, "h:mm a") : ""}</small>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="capitalize">
                          {booking.cancelledBy === "admin"
                            ? "Admin"
                            : booking.cancelledBy ?? booking.username ?? ""}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  )) : (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center p-4 text-gray-500">
                        No cancelled appointments found.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </TabsContent>

          <TabsContent value="instagram">
            <InstagramManager />
          </TabsContent>
        </Tabs>
      </main>
      <Footer />
    </div>
  );
}

function CancelDialog({ booking, onCancel, isCancelling }: CancelDialogProps): React.ReactElement {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button size="sm" variant="outline" disabled={isCancelling}>
          {isCancelling ? "Cancelling..." : "Cancel"}
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Cancel Appointment</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to cancel the appointment for{" "}
            <strong>{booking.username || "Unknown User"}</strong> on{" "}
            {booking.date ? format(booking.date, "MMMM d, yyyy 'at' h:mm a") : "Unknown date"}?
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Keep Appointment</AlertDialogCancel>
          <AlertDialogAction onClick={() => onCancel(booking)} className="bg-red-600 text-white">
            Confirm
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
