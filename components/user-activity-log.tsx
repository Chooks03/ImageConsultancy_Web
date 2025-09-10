"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { format } from "date-fns"
import { Activity, User, Shield, Trash2, Edit } from "lucide-react"

type ActivityLog = {
  id: string
  userId: string
  userName: string
  action: string
  details: string
  timestamp: string
  type: "user" | "admin" | "system"
}

export default function UserActivityLog() {
  const [activities, setActivities] = useState<ActivityLog[]>([])

  useEffect(() => {
    // Load activity logs from localStorage
    const storedActivities = localStorage.getItem("activityLogs")
    if (storedActivities) {
      setActivities(JSON.parse(storedActivities))
    }
  }, [])

  const getActivityIcon = (action: string) => {
    switch (action) {
      case "user_created":
      case "user_login":
        return <User className="w-4 h-4" />
      case "admin_granted":
      case "admin_revoked":
        return <Shield className="w-4 h-4" />
      case "user_edited":
        return <Edit className="w-4 h-4" />
      case "user_deleted":
        return <Trash2 className="w-4 h-4" />
      default:
        return <Activity className="w-4 h-4" />
    }
  }

  const getActivityColor = (type: string) => {
    switch (type) {
      case "admin":
        return "border-purple-500 bg-purple-50 text-purple-700"
      case "system":
        return "border-blue-500 bg-blue-50 text-blue-700"
      default:
        return "border-gray-500 bg-gray-50 text-gray-700"
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Activity className="w-5 h-5" />
          Recent Activity
        </CardTitle>
        <CardDescription>User management and system activities</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4 max-h-96 overflow-y-auto">
          {activities.length > 0 ? (
            activities
              .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
              .slice(0, 20)
              .map((activity) => (
                <div key={activity.id} className="flex items-start space-x-3 p-3 border rounded-lg">
                  <div className="flex-shrink-0 mt-1">{getActivityIcon(activity.action)}</div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium text-gray-900">{activity.userName}</p>
                      <Badge variant="outline" className={getActivityColor(activity.type)}>
                        {activity.type}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">{activity.details}</p>
                    <p className="text-xs text-gray-400 mt-1">
                      {format(new Date(activity.timestamp), "MMM d, yyyy 'at' h:mm a")}
                    </p>
                  </div>
                </div>
              ))
          ) : (
            <p className="text-center py-8 text-gray-500">No recent activity</p>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
