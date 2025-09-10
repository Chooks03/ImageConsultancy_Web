type ActivityType = "user" | "admin" | "system"

export function logActivity(
  userId: string,
  userName: string,
  action: string,
  details: string,
  type: ActivityType = "user",
) {
  const activity = {
    id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
    userId,
    userName,
    action,
    details,
    timestamp: new Date().toISOString(),
    type,
  }

  // Get existing logs
  const existingLogs = JSON.parse(localStorage.getItem("activityLogs") || "[]")

  // Add new activity and keep only last 100 entries
  const updatedLogs = [activity, ...existingLogs].slice(0, 100)

  // Save back to localStorage
  localStorage.setItem("activityLogs", JSON.stringify(updatedLogs))
}
