"use client";

import React, { useState, useEffect, ChangeEvent } from "react";
import { useRouter } from "next/navigation";
import { format, addDays, startOfDay, endOfDay } from "date-fns";
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
import { Input } from "@/components/ui/input"; // <-- fixed import
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
  Download,
  Search,
  IndianRupee,
} from "lucide-react";
import { toast } from "@/hooks/use-toast";

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

  const [bookings, setBookings] = useState<Booking[]>([]);
  const [cancelledBookings, setCancelledBookings] = useState<Booking[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterDate, setFilterDate] = useState("all");
  const [isCancelling, setIsCancelling] = useState(false);
  const [cancellingBooking, setCancellingBooking] = useState<string | null>(null);

  useEffect(() => {
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
    const cancelledStr = localStorage.getItem("cancelledBookings");
    if (bookingsStr) setBookings(parseBookings(bookingsStr));
    if (cancelledStr) setCancelledBookings(parseBookings(cancelledStr));
  }, []);

  const handleCancel = async (booking: Booking) => {
    setIsCancelling(true);
    setCancellingBooking(booking.id);
    try {
      await new Promise((res) => setTimeout(res, 1500));
      const updatedBookings = bookings.filter((b) => b.id !== booking.id);
      const cancelledEntry = {
        ...booking,
        cancelled: true,
        cancelledAt: new Date(),
        cancelledBy: "admin",
        status: "cancelled",
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

  const filterBookings = (arr: Booking[]) => {
    const lower = searchQuery.toLowerCase();
    return arr.filter((booking) => {
      const matchesSearch =
        !searchQuery ||
        [booking.bookingId, booking.username, booking.userEmail, booking.serviceName]
          .filter(Boolean)
          .some((field) => field.toLowerCase().includes(lower));
      let matchesStatus = true;
      if (filterStatus === "paid") matchesStatus = booking.paymentStatus === "completed";
      else if (filterStatus === "pending") matchesStatus = booking.paymentStatus !== "completed";
      let matchesDate = true;
      const now = new Date();
      const startOfDay_ = startOfDay(now);
      const endOfDay_ = endOfDay(now);
      const tomorrow = endOfDay(startOfDay_).getTime() + 24 * 60 * 60 * 1000;
      const bookDate = booking.date;
      if (filterDate === "today") matchesDate = bookDate >= startOfDay_ && bookDate <= endOfDay_;
      else if (filterDate === "tomorrow") matchesDate = bookDate > endOfDay_ && bookDate <= new Date(tomorrow);
      else if (filterDate === "upcoming") matchesDate = bookDate > now;
      else if (filterDate === "past") matchesDate = bookDate < now;
      return matchesSearch && matchesStatus && matchesDate;
    });
  };

  const filteredActiveBookings = filterBookings(bookings);
  const filteredCancelledBookings = filterBookings(cancelledBookings);

  const downloadCsv = () => {
    const headers = [
      "Booking ID",
      "Date",
      "Time",
      "Username",
      "Email",
      "Phone",
      "Service",
      "Duration",
      "Amount",
      "Payment Method",
      "Payment Status",
      "Cancelled On",
      "Cancelled By",
    ];
    const rows = [...bookings, ...cancelledBookings].map((b) => [
      b.bookingId ?? "",
      b.date ? format(b.date, "yyyy-MM-dd") : "",
      b.date ? format(b.date, "HH:mm") : "",
      b.username ?? "",
      b.userEmail ?? "",
      b.userPhone ?? "",
      b.serviceName ?? "",
      b.duration ?? "",
      b.amount ?? "",
      b.paymentMethod ?? "",
      b.paymentStatus ?? "",
      b.cancelledAt ? format(b.cancelledAt, "yyyy-MM-dd HH:mm") : "",
      b.cancelledBy ?? "",
    ]);
    const csvContent = [headers, ...rows]
      .map((row) => row.map((field) => `"${String(field).replace(/"/g, '""')}"`).join(","))
      .join("\n");
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
      <header className="flex items-center justify-between max-w-7xl mx-auto mb-8">
        <h1 className="text-3xl font-bold">Appointment Management</h1>
        <Button onClick={() => router.push("/")}>Back to Site</Button>
      </header>

      <main className="max-w-7xl mx-auto bg-white rounded shadow p-6 overflow-auto">
        <div className="mb-4 flex flex-wrap gap-4 items-center">
          <div className="relative flex-grow max-w-xs">
            <Input
              placeholder="Search appointments"
              value={searchQuery}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
            <Search className="absolute left-2 top-2.5 w-5 h-5 text-gray-400" />
          </div>

          <Select
            value={filterStatus}
            onValueChange={setFilterStatus}
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
            onValueChange={setFilterDate}
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
            <Download className="mr-1" /> Export CSV
          </Button>
        </div>

        <Card className="mb-10">
          <CardHeader>
            <CardTitle>Active Appointments</CardTitle>
            <CardDescription>Manage upcoming appointments</CardDescription>
          </CardHeader>

          <CardContent className="overflow-auto max-h-[400px]">
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
                {filteredActiveBookings.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-10 text-gray-500">
                      No appointments found.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredActiveBookings
                    .sort((a, b) => a.date.getTime() - b.date.getTime())
                    .map((booking) => (
                      <TableRow key={booking.id}>
                        <TableCell>{booking.bookingId}</TableCell>
                        <TableCell>
                          {format(booking.date, "MMM d, yyyy")}
                          <br />
                          <small>{format(booking.date, "h:mm a")}</small>
                        </TableCell>
                        <TableCell>
                          {booking.username}
                          <br />
                          <small>{booking.userEmail}</small>
                        </TableCell>
                        <TableCell>
                          {booking.serviceName}
                          <br />
                          <small>{booking.duration || ""}</small>
                        </TableCell>
                        <TableCell>
                          <IndianRupee className="inline w-5 h-5 mr-1" />
                          {booking.amount}
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              booking.paymentStatus === "completed"
                                ? "default"
                                : "destructive"
                            }
                          >
                            {booking.paymentStatus === "completed"
                              ? "Paid"
                              : "Pending"}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <CancelDialog
                            booking={booking}
                            onCancel={handleCancel}
                            isCancelling={
                              isCancelling && cancellingBooking === booking.id
                            }
                          />
                        </TableCell>
                      </TableRow>
                    ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Cancelled Appointments</CardTitle>
            <CardDescription>Review cancelled appointments</CardDescription>
          </CardHeader>

          <CardContent className="overflow-auto max-h-[400px]">
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
                {filteredCancelledBookings.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-10 text-gray-500">
                      No cancelled appointments.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredCancelledBookings
                    .sort(
                      (a, b) =>
                        (b.cancelledAt?.getTime() || 0) -
                        (a.cancelledAt?.getTime() || 0)
                    )
                    .map((booking) => (
                      <TableRow key={booking.id}>
                        <TableCell>{booking.bookingId}</TableCell>
                        <TableCell>
                          {format(booking.date, "MMM d, yyyy")}
                          <br />
                          <small>{format(booking.date, "h:mm a")}</small>
                        </TableCell>
                        <TableCell>
                          {booking.username}
                          <br />
                          <small>{booking.userEmail}</small>
                        </TableCell>
                        <TableCell>
                          {booking.serviceName}
                          <br />
                          <small>{booking.duration || ""}</small>
                        </TableCell>
                        <TableCell>
                          <IndianRupee className="inline w-5 h-5 mr-1" />
                          {booking.amount}
                        </TableCell>
                        <TableCell>
                          {booking.cancelledAt
                            ? format(booking.cancelledAt, "MMM d, yyyy h:mm a")
                            : "-"}
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">{booking.cancelledBy || "Unknown"}</Badge>
                        </TableCell>
                      </TableRow>
                    ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </main>
      <Footer />
    </div>
  );
}

function CancelDialog({
  booking,
  onCancel,
  isCancelling,
}: CancelDialogProps) {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button size="sm" disabled={isCancelling}>
          {isCancelling ? "Cancelling..." : "Cancel"}
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Cancel Appointment</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to cancel the appointment for <strong>{booking.username}</strong> on {format(booking.date, "PPPP p")}?
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Keep Appointment</AlertDialogCancel>
          <AlertDialogAction className="bg-red-600" onClick={() => onCancel(booking)}>
            Confirm Cancel
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
