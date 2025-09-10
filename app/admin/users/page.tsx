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

// Instagram Manager (same as previously)
function InstagramManager() {
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

  const addPost = () => {
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
    setPosts(prev => {
      const updated = [...prev, { id: Date.now().toString(), url }];
      localStorage.setItem("instagramPosts", JSON.stringify(updated));
      return updated;
    });
    inputRef.current.value = "";
    toast({ title: "Success", description: "Post added." });
  };

  const deletePost = (id: string) => {
    setPosts(posts => {
      const updated = posts.filter(p => p.id !== id);
      localStorage.setItem("instagramPosts", JSON.stringify(updated));
      return updated;
    });
    toast({ title: "Deleted", description: "Post removed." });
  };

  return (
    <div>
      <div className="mb-4 flex gap-2">
        <Input ref={inputRef} placeholder="Add Instagram post/reel URL" className="flex-1" />
        <Button onClick={addPost}>Add</Button>
      </div>
      <ul className="space-y-2">
        {posts.length > 0 ? (
          posts.map(post => (
            <li key={post.id} className="flex justify-between items-center bg-gray-50 px-3 py-2 rounded">
              <span className="truncate">{post.url}</span>
              <Button variant="outline" size="sm" onClick={() => deletePost(post.id)}>
                Delete
              </Button>
            </li>
          ))
        ) : (
          <li>
            <p className="text-center text-gray-500">No posts added yet.</p>
          </li>
        )}
      </ul>
    </div>
  );
}

export default function AdminDashboard(): React.ReactElement {
  const router = useRouter();
  const { user: currentUser } = useAuth();

  const [users, setUsers] = useState<UserType[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [cancelledBookings, setCancelledBookings] = useState<Booking[]>([]);
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [filterDate, setFilterDate] = useState<string>("all");
  const [isCancelling, setIsCancelling] = useState<boolean>(false);
  const [cancellingBooking, setCancellingBooking] = useState<string | null>(null);

  const safeParse = <T,>(dataStr: string | null): T | null => {
    if (!dataStr) return null;
    try {
      return JSON.parse(dataStr);
    } catch {
      return null;
    }
  };

  useEffect(() => {
    // Load users
    const storedUsers = localStorage.getItem("users");
    if (storedUsers) {
      const parsedUsers = safeParse<any[]>(storedUsers) || [];
      setUsers(
        parsedUsers.map((user: any) => ({
          id: user.id ?? user._id ?? Math.random().toString(36).slice(2, 9),
          firstName: user.firstName ?? "Unknown",
          lastName: user.lastName ?? "",
          email: user.email ?? "unknown@example.com",
          username: user.username ?? "unknown",
          isAdmin: user.isAdmin ?? false,
        }))
      );
    } else setUsers([]);

    // Appointments
    const parseBookings = (dataStr: string) => {
      if (!dataStr) return [];
      try {
        const parsed = JSON.parse(dataStr);
        return parsed.map((b: any) => ({
          ...b,
          date: new Date(b.date),
          cancelledAt: b.cancelledAt ? new Date(b.cancelledAt) : null,
        }));
      } catch {
        return [];
      }
    };
    setBookings(parseBookings(localStorage.getItem("bookings") || ""));
    setCancelledBookings(parseBookings(localStorage.getItem("cancelledBookings") || ""));
  }, []);

  // Admin toggle logic
  const handleToggleAdmin = (id: string) => {
    if (id === currentUser?.id) {
      toast({
        title: "Cannot change self role",
        description: "You cannot change your own admin status.",
        variant: "destructive",
      });
      return;
    }
    const updated = users.map(u => u.id === id ? { ...u, isAdmin: !u.isAdmin } : u);
    setUsers(updated);
    localStorage.setItem("users", JSON.stringify(updated));
    toast({
      title: "Role Updated",
      description: "User role updated successfully.",
    });
  };

  const handleDelete = (id: string) => {
    if (id === currentUser?.id) {
      toast({
        title: "Cannot delete self",
        description: "You cannot delete your own account.",
        variant: "destructive",
      });
      return;
    }
    const updatedUsers = users.filter(u => u.id !== id);
    setUsers(updatedUsers);
    localStorage.setItem("users", JSON.stringify(updatedUsers));
    toast({
      title: "User Deleted",
      description: "User and associated data deleted successfully.",
    });
  };

  const filteredUsers = searchQuery
    ? users.filter(user =>
        [
          user.firstName ?? "",
          user.lastName ?? "",
          user.email ?? "",
          user.username ?? "",
        ].some(field => field.toLowerCase().includes(searchQuery.toLowerCase())),
      )
    : users;

  // --- Appointment logic... (as in your earlier code) ---
  const handleCancel = async (booking: Booking): Promise<void> => {
    setIsCancelling(true);
    setCancellingBooking(booking.id);

    try {
      await new Promise(res => setTimeout(res, 1500));
      const updatedBookings = bookings.filter(b => b.id !== booking.id);
      const cancelledEntry: Booking = {
        ...booking,
        cancelledAt: new Date(),
        status: "cancelled",
        cancelledBy: "admin",
      };
      const updatedCancelled = [...cancelledBookings, cancelledEntry];
      setBookings(updatedBookings);
      setCancelledBookings(updatedCancelled);
      localStorage.setItem("bookings", JSON.stringify(updatedBookings));
      localStorage.setItem("cancelledBookings", JSON.stringify(updatedCancelled));
      toast({
        title: "Appointment Cancelled",
        description: `Cancelled appointment for ${booking.username}.`,
      });
    } catch {
      toast({
        title: "Cancellation Failed",
        description: "Failed to cancel appointment, please try again.",
        variant: "destructive",
      });
    } finally {
      setIsCancelling(false);
      setCancellingBooking(null);
    }
  };

  const filterBookings = (arr: Booking[]) => {
    const lowerQuery = searchQuery.toLowerCase();
    return arr.filter((booking) => {
      const matchesSearch =
        !searchQuery ||
        [booking.bookingId, booking.username, booking.userEmail, booking.serviceName]
          .filter(Boolean)
          .some(f => f.toLowerCase().includes(lowerQuery));
      let matchesStatus = true;
      if (filterStatus === "paid")
        matchesStatus = booking.paymentStatus === "completed";
      else if (filterStatus === "pending")
        matchesStatus = booking.paymentStatus !== "completed";
      let matchesDate = true;
      const now = new Date();
      const startToday = startOfDay(now);
      const endToday = endOfDay(now);
      const tomorrow = endOfDay(addDays(startToday, 1));
      const bookDate = booking.date;
      if (filterDate === "today")
        matchesDate = bookDate >= startToday && bookDate <= endToday;
      else if (filterDate === "tomorrow")
        matchesDate = bookDate > endToday && bookDate <= tomorrow;
      else if (filterDate === "upcoming")
        matchesDate = bookDate > now;
      else if (filterDate === "past")
        matchesDate = bookDate < now;
      return matchesSearch && matchesStatus && matchesDate;
    });
  };

  const filteredActiveBookings = filterBookings(bookings);
  const filteredCancelledBookings = filterBookings(cancelledBookings);

  const downloadCsv = () => {
    const headers = [
      "Booking ID", "Date", "Time", "Username", "Email", "Phone", "Service",
      "Duration", "Amount", "Payment Method", "Payment Status", "Cancelled On", "Cancelled By"
    ];
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
      b.cancelledBy === "admin" ? "Admin" : b.cancelledBy ?? b.username ?? "",
    ]);
    const csvContent = [headers, ...rows]
      .map(row => row.map(field => `"${String(field).replace(/"/g, '""')}"`).join(",")).join("\n");
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `appointments_${format(new Date(), "yyyyMMdd")}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

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

          {/* User Management Tab */}
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
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.length > 0 ? (
                  filteredUsers.map(user => (
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
                          variant="outline"
                          size="sm"
                          className="mr-2"
                          onClick={() => handleDelete(user.id)}
                          disabled={user.id === currentUser?.id}
                        >
                          Delete
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center text-gray-500">
                      No users found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TabsContent>

          {/* Appointment Management Tab */}
          <TabsContent value="appointments">
            <div className="flex flex-col gap-4">
              <div className="flex flex-wrap items-center gap-2">
                <Input
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  placeholder="Search appointments"
                  className="max-w-sm"
                />
                <Select
                  value={filterStatus}
                  onValueChange={setFilterStatus as (value: string) => void}
                >
                  <SelectTrigger>Status</SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All</SelectItem>
                    <SelectItem value="paid">Paid</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                  </SelectContent>
                </Select>
                <Select
                  value={filterDate}
                  onValueChange={setFilterDate as (value: string) => void}
                >
                  <SelectTrigger>Date</SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All</SelectItem>
                    <SelectItem value="today">Today</SelectItem>
                    <SelectItem value="tomorrow">Tomorrow</SelectItem>
                    <SelectItem value="upcoming">Upcoming</SelectItem>
                    <SelectItem value="past">Past</SelectItem>
                  </SelectContent>
                </Select>
                <Button onClick={downloadCsv}>
                  <Download className="mr-2" />
                  Download CSV
                </Button>
              </div>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Booking ID</TableHead>
                    <TableHead>Date & Time</TableHead>
                    <TableHead>Client</TableHead>
                    <TableHead>Service</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredActiveBookings.length ? (
                    filteredActiveBookings
                      .sort((a, b) => a.date.getTime() - b.date.getTime())
                      .map((booking: Booking) => (
                        <TableRow key={booking.id}>
                          <TableCell>{booking.bookingId || "-"}</TableCell>
                          <TableCell>
                            {format(booking.date, "MMM d, yyyy")}
                            <br />
                            <small>{format(booking.date, "h:mm a")}</small>
                          </TableCell>
                          <TableCell>
                            <div>{booking.username || "Unknown User"}</div>
                            <small>{booking.userEmail || ""}</small>
                          </TableCell>
                          <TableCell>
                            <div>{booking.serviceName || "No Service"}</div>
                            <small>{booking.duration ? `${booking.duration} mins` : ""}</small>
                          </TableCell>
                          <TableCell>
                            <div>
                              <IndianRupee className="inline mr-1 w-4 h-4" />
                              {booking.amount || "-"}
                            </div>
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
                              onCancel={handleCancel}
                              isCancelling={isCancelling && cancellingBooking === booking.id}
                            />
                          </TableCell>
                        </TableRow>
                      ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center p-6 text-gray-500">
                        {searchQuery || filterStatus !== "all" || filterDate !== "all"
                          ? "No matching appointments found"
                          : "No active appointments"}
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
              <h3 className="text-lg mt-8 mb-4 font-semibold">Cancelled Appointments</h3>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Booking ID</TableHead>
                    <TableHead>Date & Time</TableHead>
                    <TableHead>Client</TableHead>
                    <TableHead>Service</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Cancelled On</TableHead>
                    <TableHead>Cancelled By</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredCancelledBookings.length ? (
                    filteredCancelledBookings
                      .sort((a, b) => (b.cancelledAt?.getTime() || 0) - (a.cancelledAt?.getTime() || 0))
                      .map((booking: Booking) => (
                        <TableRow key={booking.id}>
                          <TableCell>{booking.bookingId || "-"}</TableCell>
                          <TableCell>
                            {format(booking.date, "MMM d, yyyy")}
                            <br />
                            <small>{format(booking.date, "h:mm a")}</small>
                          </TableCell>
                          <TableCell>
                            <div>{booking.username || "Unknown User"}</div>
                            <small>{booking.userEmail || ""}</small>
                          </TableCell>
                          <TableCell>
                            <div>{booking.serviceName || "No Service"}</div>
                            <small>{booking.duration ? `${booking.duration} mins` : ""}</small>
                          </TableCell>
                          <TableCell>
                            <div>
                              <IndianRupee className="inline mr-1 w-4 h-4" />
                              {booking.amount || "-"}
                            </div>
                          </TableCell>
                          <TableCell>
                            {booking.cancelledAt ? format(booking.cancelledAt, "MMM d, yyyy") : "-"}
                            <br />
                            <small>{booking.cancelledAt ? format(booking.cancelledAt, "h:mm a") : ""}</small>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline" className="capitalize">
                              {booking.cancelledBy === "admin"
                                ? "Admin"
                                : booking.cancelledBy || booking.username || "Unknown"}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center p-6 text-gray-500">
                        {searchQuery || filterStatus !== "all" || filterDate !== "all"
                          ? "No matching cancelled appointments"
                          : "No cancelled appointments"}
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

function CancelDialog({
  booking,
  onCancel,
  isCancelling,
}: CancelDialogProps): React.ReactElement {
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
            {booking.date
              ? format(booking.date, "MMMM d, yyyy 'at' h:mm a")
              : "Unknown date"}
            ?
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Keep Appointment</AlertDialogCancel>
          <AlertDialogAction
            className="bg-red-600 text-white"
            onClick={() => onCancel(booking)}
          >
            Confirm Cancel
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
