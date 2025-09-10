"use client";

import React, { useEffect, useState, ChangeEvent } from "react";
import { useRouter } from "next/navigation";
import { format, startOfDay, endOfDay, addDays } from "date-fns";
import { useAuth } from "@/components/auth-provider";
import Footer from "@/components/footer";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
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
import {
  Download,
  Search,
  IndianRupee,
} from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface User {
  id: string;
  username: string;
  email: string;
  role: "admin" | "user";
  isActive: boolean;
}

interface Booking {
  id: string;
  bookingId: string;
  date: Date;
  createdAt: Date;
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

export default function AdminDashboard(): React.ReactElement {
  const router = useRouter();
  const { user: currentUser } = useAuth();

  // User Management
  const [users, setUsers] = useState<User[]>([]);

  // Appointment Management
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [cancelledBookings, setCancelledBookings] = useState<Booking[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [filterDate, setFilterDate] = useState<string>("all");
  const [isCancelling, setIsCancelling] = useState<boolean>(false);
  const [cancellingBooking, setCancellingBooking] = useState<string | null>(null);

  useEffect(() => {
    // Load users
    const rawUsers = localStorage.getItem("users");
    if (rawUsers) setUsers(JSON.parse(rawUsers));

    // Load bookings and cancelled bookings
    const parseBookings = (dataStr: string) => {
      try {
        const parsed = JSON.parse(dataStr);
        return parsed.map((b: any) => ({
          ...b,
          date: new Date(b.date),
          createdAt: new Date(b.createdAt),
          cancelledAt: b.cancelledAt ? new Date(b.cancelledAt) : null,
        }));
      } catch {
        return [];
      }
    };
    const bookingsStr = localStorage.getItem("bookings");
    if (bookingsStr) setBookings(parseBookings(bookingsStr));
    const cancelledStr = localStorage.getItem("cancelledBookings");
    if (cancelledStr) setCancelledBookings(parseBookings(cancelledStr));
  }, []);

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

      localStorage.setItem("bookings", JSON.stringify(updatedBookings));
      localStorage.setItem("cancelledBookings", JSON.stringify(updatedCancelled));
      setBookings(updatedBookings);
      setCancelledBookings(updatedCancelled);

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

  const filterBookings = (arr: Booking[]): Booking[] => {
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

  // CSV download (Appointments)
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
      <header className="max-w-7xl mx-auto mb-8 flex justify-between items-center">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <Button onClick={() => router.push("/")}>Back to Site</Button>
      </header>
      <main className="max-w-7xl mx-auto bg-white p-6 rounded shadow">
        <Tabs defaultValue="users">
          <TabsList className="mb-6">
            <TabsTrigger value="users">User Management</TabsTrigger>
            <TabsTrigger value="appointments">Appointment Management</TabsTrigger>
          </TabsList>

          {/* USER MANAGEMENT */}
          <TabsContent value="users">
            <h2 className="text-xl font-semibold mb-4">User Management</h2>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User ID</TableHead>
                  <TableHead>Username</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map(user => (
                  <TableRow key={user.id}>
                    <TableCell>{user.id}</TableCell>
                    <TableCell>{user.username}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>{user.role}</TableCell>
                    <TableCell>{user.isActive ? "Active" : "Inactive"}</TableCell>
                  </TableRow>
                ))}
                {users.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center p-6 text-gray-500">
                      No users found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TabsContent>

          {/* APPOINTMENTS */}
          <TabsContent value="appointments">
            <h2 className="text-xl font-semibold mb-4">Appointment Management</h2>
            <div className="flex flex-col gap-4">
              <div className="flex flex-wrap items-center gap-2">
                <div className="relative">
                  <Search className="absolute left-3 top-3 text-gray-400" />
                  <Input
                    value={searchQuery}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
                    placeholder="Search appointments"
                    className="pl-10"
                  />
                </div>
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
              {/* Cancelled Appointments */}
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
                              {booking.cancelledBy === "admin" ? "Admin" : booking.cancelledBy || booking.username || "Unknown"}
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
            {booking.date ? format(booking.date, "MMMM d, yyyy 'at' h:mm a") : "Unknown date"}
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
