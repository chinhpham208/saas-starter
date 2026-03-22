'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Bell,
  Check,
  CheckCheck,
  Trash2,
  Settings,
  User,
  Key,
  Webhook,
  CreditCard,
  AlertTriangle,
  Info,
  X,
} from 'lucide-react'

interface Notification {
  id: string
  type: 'info' | 'warning' | 'success' | 'error'
  title: string
  message: string
  read: boolean
  createdAt: string
}

const MOCK_NOTIFICATIONS: Notification[] = [
  {
    id: '1',
    type: 'success',
    title: 'Payment successful',
    message: 'Your subscription payment of $29.00 has been processed successfully.',
    read: false,
    createdAt: new Date(Date.now() - 5 * 60000).toISOString(),
  },
  {
    id: '2',
    type: 'warning',
    title: 'API key expiring soon',
    message: 'Your API key "Production" will expire in 7 days. Please rotate it to avoid service interruption.',
    read: false,
    createdAt: new Date(Date.now() - 2 * 3600000).toISOString(),
  },
  {
    id: '3',
    type: 'info',
    title: 'New team member',
    message: 'john@example.com has accepted your invitation and joined the workspace.',
    read: true,
    createdAt: new Date(Date.now() - 24 * 3600000).toISOString(),
  },
  {
    id: '4',
    type: 'warning',
    title: 'Webhook delivery failed',
    message: 'Failed to deliver webhook to https://example.com/webhook. The endpoint returned a 500 error.',
    read: true,
    createdAt: new Date(Date.now() - 48 * 3600000).toISOString(),
  },
  {
    id: '5',
    type: 'info',
    title: 'API usage alert',
    message: 'You have used 80% of your monthly API call quota (80,000 / 100,000 calls).',
    read: true,
    createdAt: new Date(Date.now() - 72 * 3600000).toISOString(),
  },
  {
    id: '6',
    type: 'success',
    title: 'Workspace created',
    message: 'Your new workspace "Acme Corp" has been created successfully.',
    read: true,
    createdAt: new Date(Date.now() - 7 * 24 * 3600000).toISOString(),
  },
]

const NOTIFICATION_ICONS: Record<string, any> = {
  success: Check,
  warning: AlertTriangle,
  error: X,
  info: Info,
}

const NOTIFICATION_COLORS: Record<string, string> = {
  success: 'bg-green-500',
  warning: 'bg-yellow-500',
  error: 'bg-red-500',
  info: 'bg-blue-500',
}

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>(MOCK_NOTIFICATIONS)
  const [filter, setFilter] = useState<'all' | 'unread'>('all')

  const filteredNotifications = filter === 'unread'
    ? notifications.filter(n => !n.read)
    : notifications

  const unreadCount = notifications.filter(n => !n.read).length

  const markAsRead = (id: string) => {
    setNotifications(notifications.map(n =>
      n.id === id ? { ...n, read: true } : n
    ))
  }

  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })))
  }

  const deleteNotification = (id: string) => {
    setNotifications(notifications.filter(n => n.id !== id))
  }

  const formatDate = (date: string) => {
    const d = new Date(date)
    const now = new Date()
    const diff = now.getTime() - d.getTime()
    const minutes = Math.floor(diff / 60000)
    const hours = Math.floor(diff / 3600000)
    const days = Math.floor(diff / 86400000)

    if (minutes < 1) return 'Just now'
    if (minutes < 60) return `${minutes}m ago`
    if (hours < 24) return `${hours}h ago`
    if (days < 7) return `${days}d ago`
    return d.toLocaleDateString()
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
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold flex items-center gap-2">
                <Bell className="w-8 h-8" />
                Notifications
              </h1>
              <p className="text-muted-foreground mt-2">
                Manage your notifications and alerts
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={markAllAsRead}
                disabled={unreadCount === 0}
              >
                <CheckCheck className="w-4 h-4 mr-2" />
                Mark all read
              </Button>
              <Button variant="outline" size="sm" asChild>
                <Link href="/dashboard/settings">
                  <Settings className="w-4 h-4 mr-2" />
                  Settings
                </Link>
              </Button>
            </div>
          </div>

          <Tabs defaultValue="all" onValueChange={(v) => setFilter(v as any)}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="all">
                All Notifications
                <Badge variant="secondary" className="ml-2">
                  {notifications.length}
                </Badge>
              </TabsTrigger>
              <TabsTrigger value="unread">
                Unread
                {unreadCount > 0 && (
                  <Badge className="ml-2 bg-primary">
                    {unreadCount}
                  </Badge>
                )}
              </TabsTrigger>
            </TabsList>

            <TabsContent value={filter} className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>
                    {filter === 'all' ? 'All Notifications' : 'Unread Notifications'}
                  </CardTitle>
                  <CardDescription>
                    {filteredNotifications.length} notification{filteredNotifications.length !== 1 ? 's' : ''}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {filteredNotifications.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      <Bell className="w-12 h-12 mx-auto mb-4 opacity-50" />
                      <p>No notifications</p>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {filteredNotifications.map((notification) => {
                        const Icon = NOTIFICATION_ICONS[notification.type]
                        const color = NOTIFICATION_COLORS[notification.type]
                        return (
                          <div
                            key={notification.id}
                            className={`flex items-start gap-4 p-4 rounded-lg transition-colors ${
                              notification.read ? 'bg-background' : 'bg-muted/50'
                            }`}
                          >
                            <div className={`w-10 h-10 rounded-full ${color} flex items-center justify-center flex-shrink-0`}>
                              <Icon className="w-5 h-5 text-white" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2">
                                <p className="font-medium">{notification.title}</p>
                                {!notification.read && (
                                  <div className="w-2 h-2 rounded-full bg-primary" />
                                )}
                              </div>
                              <p className="text-sm text-muted-foreground mt-1">
                                {notification.message}
                              </p>
                              <p className="text-xs text-muted-foreground mt-2">
                                {formatDate(notification.createdAt)}
                              </p>
                            </div>
                            <div className="flex items-center gap-1">
                              {!notification.read && (
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => markAsRead(notification.id)}
                                  title="Mark as read"
                                >
                                  <Check className="w-4 h-4" />
                                </Button>
                              )}
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => deleteNotification(notification.id)}
                                title="Delete"
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          {/* Notification Preferences */}
          <Card className="mt-8">
            <CardHeader>
              <CardTitle>Notification Preferences</CardTitle>
              <CardDescription>Choose what notifications you want to receive</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                { id: 'payments', label: 'Payment notifications', description: 'Get notified about payments and billing', enabled: true },
                { id: 'api_keys', label: 'API key alerts', description: 'Alerts about API key expiration and usage', enabled: true },
                { id: 'webhooks', label: 'Webhook failures', description: 'Notifications when webhooks fail to deliver', enabled: true },
                { id: 'team', label: 'Team activity', description: 'When team members join or leave', enabled: true },
                { id: 'usage', label: 'Usage alerts', description: 'Alerts when approaching usage limits', enabled: true },
              ].map((pref) => (
                <div key={pref.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <p className="font-medium">{pref.label}</p>
                    <p className="text-sm text-muted-foreground">{pref.description}</p>
                  </div>
                  <Button variant="outline" size="sm">
                    {pref.enabled ? 'Enabled' : 'Disabled'}
                  </Button>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
