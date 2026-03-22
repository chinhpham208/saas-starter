'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  User,
  Mail,
  Lock,
  Shield,
  Bell,
  Camera,
  Save,
  Loader2,
  Key,
  Smartphone,
} from 'lucide-react'

export default function ProfilePage() {
  const [isLoading, setIsLoading] = useState(false)
  const [name, setName] = useState('John Doe')
  const [email, setEmail] = useState('john@example.com')
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false)

  const handleSaveProfile = async () => {
    setIsLoading(true)
    await new Promise(resolve => setTimeout(resolve, 1000))
    setIsLoading(false)
  }

  const handleChangePassword = async () => {
    if (newPassword !== confirmPassword) {
      alert('Passwords do not match')
      return
    }
    setIsLoading(true)
    await new Promise(resolve => setTimeout(resolve, 1000))
    setIsLoading(false)
    setCurrentPassword('')
    setNewPassword('')
    setConfirmPassword('')
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-primary" />
            <span className="text-xl font-bold">SaaS Starter</span>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="ghost" asChild>
              <Link href="/dashboard">Dashboard</Link>
            </Button>
            <Button variant="ghost" asChild>
              <Link href="/dashboard/settings">Settings</Link>
            </Button>
            <Button variant="outline">Sign Out</Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container py-8 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold flex items-center gap-2">
              <User className="w-8 h-8" />
              Profile
            </h1>
            <p className="text-muted-foreground mt-2">
              Manage your personal information and account settings
            </p>
          </div>

          <Tabs defaultValue="profile" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="profile">Profile</TabsTrigger>
              <TabsTrigger value="security">Security</TabsTrigger>
              <TabsTrigger value="notifications">Notifications</TabsTrigger>
              <TabsTrigger value="sessions">Sessions</TabsTrigger>
            </TabsList>

            {/* Profile Tab */}
            <TabsContent value="profile" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Personal Information</CardTitle>
                  <CardDescription>
                    Update your personal details and profile picture
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Avatar */}
                  <div className="flex items-center gap-6">
                    <div className="relative">
                      <Avatar className="h-20 w-20">
                        <AvatarImage src="" alt={name} />
                        <AvatarFallback className="text-2xl">JD</AvatarFallback>
                      </Avatar>
                      <Button
                        size="icon"
                        className="absolute bottom-0 right-0 h-8 w-8 rounded-full"
                        variant="secondary"
                      >
                        <Camera className="h-4 w-4" />
                      </Button>
                    </div>
                    <div>
                      <h3 className="font-medium">{name}</h3>
                      <p className="text-sm text-muted-foreground">{email}</p>
                    </div>
                  </div>

                  {/* Form */}
                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <Label htmlFor="name">Full Name</Label>
                      <Input
                        id="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                      />
                    </div>
                    <div>
                      <Label htmlFor="email">Email Address</Label>
                      <Input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                      />
                    </div>
                  </div>

                  <Button onClick={handleSaveProfile} disabled={isLoading}>
                    {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                    <Save className="w-4 h-4 mr-2" />
                    Save Changes
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Security Tab */}
            <TabsContent value="security" className="mt-6">
              <div className="space-y-6">
                {/* Change Password */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Lock className="w-5 h-5" />
                      Change Password
                    </CardTitle>
                    <CardDescription>
                      Update your password to keep your account secure
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="current">Current Password</Label>
                      <Input
                        id="current"
                        type="password"
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                      />
                    </div>
                    <div>
                      <Label htmlFor="new">New Password</Label>
                      <Input
                        id="new"
                        type="password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                      />
                    </div>
                    <div>
                      <Label htmlFor="confirm">Confirm New Password</Label>
                      <Input
                        id="confirm"
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                      />
                    </div>
                    <Button onClick={handleChangePassword} disabled={isLoading}>
                      {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                      Update Password
                    </Button>
                  </CardContent>
                </Card>

                {/* Two-Factor Authentication */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Shield className="w-5 h-5" />
                      Two-Factor Authentication
                    </CardTitle>
                    <CardDescription>
                      Add an extra layer of security to your account
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                          <Smartphone className="w-6 h-6 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium">Authenticator App</p>
                          <p className="text-sm text-muted-foreground">
                            Use an app like Google Authenticator or Authy
                          </p>
                        </div>
                      </div>
                      <Button
                        variant={twoFactorEnabled ? 'outline' : 'default'}
                        onClick={() => setTwoFactorEnabled(!twoFactorEnabled)}
                      >
                        {twoFactorEnabled ? 'Disable' : 'Enable'}
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                {/* API Tokens */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Key className="w-5 h-5" />
                      API Tokens
                    </CardTitle>
                    <CardDescription>
                      Manage your personal API tokens
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center py-4 text-muted-foreground">
                      <p>No API tokens created yet</p>
                      <Button variant="outline" className="mt-4">
                        Create Token
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Notifications Tab */}
            <TabsContent value="notifications" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Bell className="w-5 h-5" />
                    Email Notifications
                  </CardTitle>
                  <CardDescription>
                    Choose what notifications you want to receive via email
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {[
                    { id: 'security', label: 'Security alerts', description: 'Get notified about security events', enabled: true },
                    { id: 'product', label: 'Product updates', description: 'New features and improvements', enabled: true },
                    { id: 'billing', label: 'Billing reminders', description: 'Payment and subscription alerts', enabled: true },
                    { id: 'marketing', label: 'Marketing', description: 'Tips and best practices', enabled: false },
                  ].map((item) => (
                    <div key={item.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <p className="font-medium">{item.label}</p>
                        <p className="text-sm text-muted-foreground">{item.description}</p>
                      </div>
                      <Button variant={item.enabled ? 'default' : 'outline'} size="sm">
                        {item.enabled ? 'Enabled' : 'Disabled'}
                      </Button>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Sessions Tab */}
            <TabsContent value="sessions" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Active Sessions</CardTitle>
                  <CardDescription>
                    Manage your active sessions across devices
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-green-500/10 flex items-center justify-center">
                        <Shield className="w-5 h-5 text-green-500" />
                      </div>
                      <div>
                        <p className="font-medium">Current Session</p>
                        <p className="text-sm text-muted-foreground">
                          Chrome on macOS • 192.168.1.100
                        </p>
                      </div>
                    </div>
                    <Badge className="bg-green-500">Active</Badge>
                  </div>
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                        <Smartphone className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="font-medium">iPhone 15 Pro</p>
                        <p className="text-sm text-muted-foreground">
                          Safari on iOS • Last active 2 hours ago
                        </p>
                      </div>
                    </div>
                    <Button variant="outline" size="sm">
                      Revoke
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  )
}
