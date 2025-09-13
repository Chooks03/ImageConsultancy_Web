"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Switch } from "@/components/ui/switch";
import { toast } from "@/hooks/use-toast";
import { useAuth } from "@/components/auth-provider";

interface UserType {
  id: string;
  username: string;
  email: string;
  phone?: string;
  isAdmin: boolean;
}

export default function AdminUserManagement(): React.ReactElement {
  const router = useRouter();
  const { user: currentUser } = useAuth();

  const [users, setUsers] = useState<UserType[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  const safeParse = <T,>(dataStr: string | null): T | null => {
    if (!dataStr) return null;
    try {
      return JSON.parse(dataStr);
    } catch {
      return null;
    }
  };

  useEffect(() => {
    loadUsers();
    // Optionally: Refresh on localStorage changes from other tabs/windows
    const onStorage = (e: StorageEvent) => {
      if (e.key === "users") loadUsers();
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const loadUsers = () => {
    const storedUsers = localStorage.getItem("users");
    if (storedUsers) {
      const parsedUsers = safeParse<any[]>(storedUsers) || [];
      setUsers(
        parsedUsers.map((user: any) => ({
          id: user.id ?? Math.random().toString(36).slice(2, 9),
          username: user.username ?? "unknown",
          email: user.email ?? "unknown@example.com",
          phone: user.phone ?? "",
          isAdmin: user.isAdmin ?? false,
        }))
      );
    } else {
      setUsers([]);
    }
  };

  const handleToggleAdmin = (id: string) => {
    if (id === currentUser?.id) {
      toast({
        title: "Cannot change self role",
        description: "You cannot change your own admin status.",
        variant: "destructive",
      });
      return;
    }
    const updated = users.map((u) =>
      u.id === id ? { ...u, isAdmin: !u.isAdmin } : u
    );
    setUsers(updated);
    localStorage.setItem("users", JSON.stringify(updated));
    toast({ title: "Role Updated", description: "User role updated successfully." });
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
    const updatedUsers = users.filter((u) => u.id !== id);
    setUsers(updatedUsers);
    localStorage.setItem("users", JSON.stringify(updatedUsers));
    toast({ title: "User Deleted", description: "User and associated data deleted successfully." });
  };

  const filteredUsers = searchQuery
    ? users.filter((user) =>
        [
          user.username ?? "",
          user.email ?? "",
          user.phone ?? "",
        ].some((field) => field.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    : users;

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <header className="max-w-7xl mx-auto mb-8 flex justify-between items-center">
        <h1 className="text-3xl font-bold">User Management</h1>
        <Button onClick={() => router.push("/admin/dashboard")}>Back to Dashboard</Button>
      </header>
      <main className="max-w-7xl mx-auto bg-white p-6 rounded shadow">
        <div className="mb-4 flex gap-2">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by username, email, or phone"
            className="max-w-sm px-3 py-2 border rounded border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Username</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredUsers.length > 0 ? (
              filteredUsers.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>{user.username}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.phone || "-"}</TableCell>
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
      </main>
    </div>
  );
}
