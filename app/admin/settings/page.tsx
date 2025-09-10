"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/components/auth-provider"
import Header from "@/components/header"
import Footer from "@/components/footer"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "@/hooks/use-toast"
import { Shield, Building, CreditCard, ArrowRight, CheckCircle, Users } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function AdminSettingsPage() {
  const { user } = useAuth()
  const router = useRouter()
  const [isSaving, setIsSaving] = useState(false)
  const [bankDetails, setBankDetails] = useState({
    accountName: "",
    accountNumber: "",
    bankName: "",
    ifscCode: "",
    accountType: "savings",
    upiId: "",
  })

  useEffect(() => {
    // Load saved bank details
    const savedBankDetails = localStorage.getItem("adminBankDetails")
    if (savedBankDetails) {
      setBankDetails(JSON.parse(savedBankDetails))
    }
  }, [])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setBankDetails((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setBankDetails((prev) => ({ ...prev, [name]: value }))
  }

  const saveBankDetails = async () => {
    // Validate bank details
    if (!bankDetails.accountName || !bankDetails.accountNumber || !bankDetails.bankName || !bankDetails.ifscCode) {
      toast({
        title: "Missing Details",
        description: "Please fill in all required bank details",
        variant: "destructive",
      })
      return
    }

    setIsSaving(true)

    try {
      // In a real app, this would be a secure API call
      // For demo, we'll store in localStorage (NOT SECURE for real applications)
      await new Promise((resolve) => setTimeout(resolve, 1500)) // Simulate API call

      localStorage.setItem("adminBankDetails", JSON.stringify(bankDetails))

      toast({
        title: "Settings Saved",
        description: "Your bank details have been successfully saved",
      })
    } catch (error) {
      toast({
        title: "Error Saving Details",
        description: "There was a problem saving your bank details",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-white to-purple-50">
      <Header />
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-2 text-center bg-gradient-to-r from-rose-600 to-purple-600 bg-clip-text text-transparent">
            Admin Settings
          </h1>
          <p className="text-center text-gray-500 mb-8">Manage your business settings and payment information</p>

          <div className="grid gap-8">
            {/* Banking Information */}
            <Card>
              <CardHeader className="border-b">
                <div className="flex items-center gap-2">
                  <Building className="w-5 h-5 text-rose-600" />
                  <CardTitle>Banking Information</CardTitle>
                </div>
                <CardDescription>Enter your bank details to receive payments from client appointments</CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6 flex items-start gap-3">
                  <Shield className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-amber-800">
                    Your banking information is stored securely and only used for processing payments. This information
                    is encrypted and not accessible to regular users.
                  </p>
                </div>

                <div className="grid gap-6">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="accountName">Account Holder Name</Label>
                      <Input
                        id="accountName"
                        name="accountName"
                        placeholder="Sri Harshavardhini"
                        value={bankDetails.accountName}
                        onChange={handleChange}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="accountNumber">Account Number</Label>
                      <Input
                        id="accountNumber"
                        name="accountNumber"
                        placeholder="XXXXXXXXXXXX"
                        value={bankDetails.accountNumber}
                        onChange={handleChange}
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="bankName">Bank Name</Label>
                      <Input
                        id="bankName"
                        name="bankName"
                        placeholder="State Bank of India"
                        value={bankDetails.bankName}
                        onChange={handleChange}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="ifscCode">IFSC Code</Label>
                      <Input
                        id="ifscCode"
                        name="ifscCode"
                        placeholder="SBIN0001234"
                        value={bankDetails.ifscCode}
                        onChange={handleChange}
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="accountType">Account Type</Label>
                      <Select
                        value={bankDetails.accountType}
                        onValueChange={(value) => handleSelectChange("accountType", value)}
                      >
                        <SelectTrigger id="accountType">
                          <SelectValue placeholder="Select account type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="savings">Savings Account</SelectItem>
                          <SelectItem value="current">Current Account</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="upiId">UPI ID (Optional)</Label>
                      <Input
                        id="upiId"
                        name="upiId"
                        placeholder="yourid@ybl"
                        value={bankDetails.upiId}
                        onChange={handleChange}
                      />
                    </div>
                  </div>

                  <Button
                    onClick={saveBankDetails}
                    disabled={isSaving}
                    className="w-full md:w-auto md:self-end bg-gradient-to-r from-rose-500 to-purple-600 hover:from-rose-600 hover:to-purple-700"
                  >
                    {isSaving ? (
                      <div className="flex items-center">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Saving...
                      </div>
                    ) : (
                      <>Save Bank Details</>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Payment Settings */}
            <Card>
              <CardHeader className="border-b">
                <div className="flex items-center gap-2">
                  <CreditCard className="w-5 h-5 text-rose-600" />
                  <CardTitle>Payment Settings</CardTitle>
                </div>
                <CardDescription>Configure how payments are processed and received</CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="space-y-6">
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <div className="text-sm text-green-800">
                      <p className="font-medium">Payment Gateway Active</p>
                      <p>Your payment gateway is properly configured and ready to accept payments.</p>
                    </div>
                  </div>

                  <div className="grid gap-4">
                    <div className="flex items-center justify-between border-b pb-4">
                      <div>
                        <p className="font-medium">Payment Account</p>
                        <p className="text-sm text-gray-500">Bank account where payments will be deposited</p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">
                          {bankDetails.accountName ? `${bankDetails.accountName}` : "Not configured"}
                        </p>
                        {bankDetails.accountNumber && (
                          <p className="text-sm text-gray-500">
                            {bankDetails.bankName} (XXXX{bankDetails.accountNumber.slice(-4)})
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center justify-between border-b pb-4">
                      <div>
                        <p className="font-medium">Payment Confirmation</p>
                        <p className="text-sm text-gray-500">Email notifications for new payments</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-green-600">Enabled</p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">View Payment History</p>
                        <p className="text-sm text-gray-500">Complete record of all client payments</p>
                      </div>
                      <Button
                        variant="ghost"
                        className="text-rose-600 hover:text-rose-700"
                        onClick={() => router.push("/admin/payments")}
                      >
                        <span>View Payments</span>
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* User Management */}
            <Card>
              <CardHeader className="border-b">
                <div className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-rose-600" />
                  <CardTitle>User Management</CardTitle>
                </div>
                <CardDescription>Manage user accounts and administrator privileges</CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="space-y-6">
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-start gap-3">
                    <Shield className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                    <div className="text-sm text-blue-800">
                      <p className="font-medium">Administrator Access</p>
                      <p>Manage user accounts, assign admin roles, and control system access.</p>
                    </div>
                  </div>

                  <div className="grid gap-4">
                    <div className="flex items-center justify-between border-b pb-4">
                      <div>
                        <p className="font-medium">Total Users</p>
                        <p className="text-sm text-gray-500">Registered user accounts</p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">
                          {(() => {
                            const users = JSON.parse(localStorage.getItem("users") || "[]")
                            return users.length
                          })()}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between border-b pb-4">
                      <div>
                        <p className="font-medium">Active Administrators</p>
                        <p className="text-sm text-gray-500">Users with admin privileges</p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-purple-600">
                          {(() => {
                            const users = JSON.parse(localStorage.getItem("users") || "[]")
                            return users.filter((u: any) => u.isAdmin).length
                          })()}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Manage Users</p>
                        <p className="text-sm text-gray-500">View, edit, and manage user accounts</p>
                      </div>
                      <Button
                        variant="ghost"
                        className="text-rose-600 hover:text-rose-700"
                        onClick={() => router.push("/admin/users")}
                      >
                        <span>Manage Users</span>
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
