export function upgradeBookingsData() {
  const raw = localStorage.getItem("bookings")
  if (!raw) return
  try {
    const bookings = JSON.parse(raw)
    const upgraded = bookings.map((b: any) => ({
      ...b,
      userName: b.userName ?? (b.user?.firstName && b.user?.lastName ? `${b.user.firstName} ${b.user.lastName}` : b.user?.email || "Unknown User"),
      userEmail: b.userEmail ?? b.user?.email ?? "unknown@example.com",
      userId: b.userId ?? b.user?.id ?? "",
      serviceName: b.serviceName ?? b.service?.name ?? "Unknown Service",
      amount: b.amount ?? b.service?.price ?? 0,
      date: b.date ? new Date(b.date) : new Date(),
      createdAt: b.createdAt ? new Date(b.createdAt) : new Date(),
      id: b.id ?? b.bookingId ?? Math.random().toString(36),
    }))
    localStorage.setItem("bookings", JSON.stringify(upgraded))
  } catch (e) {
    console.error("Failed to upgrade bookings data", e)
  }
}
