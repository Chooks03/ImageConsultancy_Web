"use client";

import { useAuth } from "@/components/auth-provider";
import { useEffect } from "react";

export function useAdminRefresh() {
  const { user, isAdmin, updateUserAdminStatus } = useAuth();

  useEffect(() => {
    if (user) {
      // Check if user's admin status has changed in localStorage
      const storedUsers = localStorage.getItem("users");
      if (storedUsers) {
        const users = JSON.parse(storedUsers);
        const currentUser = users.find((u: any) => u.id === user.id);

        if (currentUser && currentUser.isAdmin !== isAdmin) {
          // Update the auth context with the new admin status
          updateUserAdminStatus(currentUser.isAdmin);
        }
      }
    }
  }, [user, isAdmin, updateUserAdminStatus]);

  return { isAdmin };
}
