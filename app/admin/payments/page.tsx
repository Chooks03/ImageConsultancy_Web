"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Footer from "@/components/footer"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Download, Search } from "lucide-react"
import { IndianRupee } from "lucide-react"
import { format } from "date-fns"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"

export default function AdminPaymentsPage() {
  const router = useRouter()
  const [bookings, setBookings] = useState<any[]>([])
  const [searchQuery, setSearchQuery] = useState("")

  // Load bookings on mount
  useEffect(() => {
    const stored = localStorage.getItem("bookings")
    if (stored) {
      setBookings(JSON.parse(stored).map((b: any) => ({
        ...b,
        date: b.date ? new Date(b.date) : null,
        createdAt: b.createdAt ? new Date(b.createdAt) : new Date(),
      })))
    }
  }, [])

  const getTotalRevenue = () => {
    return bookings.reduce((sum, b) => sum + (b.amount ?? 0), 0)
  }

  // Filter bookings by search
  const filteredBookings = searchQuery ? bookings.filter(b => {
    const q = searchQuery.toLowerCase()
    return (
      (b.bookingId?.toLowerCase() ?? "").includes(q) ||
      (b.userName?.toLowerCase() ?? "").includes(q) ||
      (b.userEmail?.toLowerCase() ?? "").includes(q) ||
      (b.serviceName?.toLowerCase() ?? "").includes(q)
    )
  }) : bookings

  // Download CSV report
  const downloadReport = () => {
    const headers = [
      "Booking ID",
      "Date",
      "Time",
      "Client Name",
      "Email",
      "Phone",
      "Service",
      "Duration",
      "Amount",
      "Payment Method",
      "Payment Status",
    ]

    const rows = filteredBookings.map(b => ([
      b.bookingId ?? '',
      b.date ? format(b.date, 'yyyy-MM-dd') : '',
      b.date ? format(b.date, 'HH:mm') : '',
      b.userName ?? '',
      b.userEmail ?? '',
      b.userPhone ?? '',
      b.serviceName ?? '',
      b.duration ? `${b.duration} mins` : '',
      b.amount ?? '',
      b.paymentMethod ?? '',
      b.paymentStatus ?? '',
    ]))

    const csvContent = [headers, ...rows].map(row => row.join(",")).join("\n")

    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `payment_report_${format(new Date(), 'yyyyMMdd')}.csv`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-white to-purple-50">
      {/* <Header /> optionally add your header */}
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center mb-6">
            <Button onClick={() => router.push('/admin/dashboard')} variant="ghost" className="flex items-center">
              <ArrowLeft className="mr-2" />
              Back to Dashboard
            </Button>
            <h1 className="flex-grow text-center text-2xl font-bold bg-gradient-to-r from-rose-600 to-purple-600 text-transparent bg-clip-text">
              Payment History
            </h1>
          </div>

          <div className="grid grid-cols-3 gap-6 mb-8">
            <Card>
              <CardContent>
                <p className="text-sm text-gray-500">Total Revenue</p>
                <div className="flex items-center text-2xl font-semibold">
                  <IndianRupee className="mr-1" />
                  {getTotalRevenue().toLocaleString()}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent>
                <p className="text-sm text-gray-500">Total Transactions</p>
                <div className="text-2xl font-semibold">{bookings.length}</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent>
                <p className="text-sm text-gray-500">Download Reports</p>
                <Button onClick={downloadReport} className="mt-2 w-full">Download CSV</Button>
              </CardContent>
            </Card>
          </div>

          <div className="flex items-center mb-4 space-x-4">
            <div className="relative flex-grow">
              <Search className="absolute left-2 top-2 text-gray-400" />
              <Input
                placeholder="Search transactions..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8"
              />
            </div>
          </div>

          <Card>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Booking ID</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Client</TableHead>
                    <TableHead>Service</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredBookings.length > 0 ? (
                    filteredBookings.map(booking => (
                      <TableRow key={booking.id}>
                        <TableCell>{booking.bookingId ?? 'N/A'}</TableCell>
                        <TableCell>
                          {booking.date ? format(booking.date, 'MMM d, yyyy') : 'N/A'}<br />
                          <span className="text-xs">{booking.date ? format(booking.date, 'h:mm a') : 'N/A'}</span>
                        </TableCell>
                        <TableCell>
                          {booking.userName ?? 'N/A'}<br />
                          <span className="text-xs">{booking.userEmail ?? 'N/A'}</span>
                        </TableCell>
                        <TableCell>
                          {booking.serviceName ?? 'N/A'}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center">
                            <IndianRupee className="mr-1" />
                            {booking.amount ?? '0'}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant={booking.paymentStatus === 'completed' ? 'default' : 'secondary'}>
                            {booking.paymentStatus === 'completed' ? 'Paid' : 'Pending'}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-4">
                        {searchQuery ? 'No matching transactions found' : 'No payment transactions found'}
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  )
}
