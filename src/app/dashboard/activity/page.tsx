'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Activity, Key, Webhook, Users, Settings, User, LogIn, UserPlus, UserMinus, Bell } from 'lucide-react'

interface Activity {
  id: string
  type: string
  description: string
  label: string
  metadata: Record<string, any>
  createdAt: string
}

const ACTIVITY_ICONS: Record<string, any> = {
  'user.login': LogIn,
  'user.registered': User,
  'workspace.created': Activity,
  'api_key.created': Key,
  'api_key.deleted': Key,
  'webhook.created': Webhook,
  'webhook.updated': Webhook,
  'webhook.deleted': Webhook,
  'member.invited': UserPlus,
  'member.joined': Users,
  'member.removed': UserMinus,
  'member.role_updated': Users,
  'settings.updated': Settings,
  'profile.updated': User,
}

const ACTIVITY_COLORS: Record<string, string> = {
  'user.login': 'bg-blue-500',
  'user.registered': 'bg-green-500',
  'workspace.created': 'bg-purple-500',
  'api_key.created': 'bg-yellow-500',
  'api_key.deleted': 'bg-red-500',
  'webhook.created': 'bg-yellow-500',
  'webhook.updated': 'bg-blue-500',
  'webhook.deleted': 'bg-red-500',
  'member.invited': 'bg-purple-500',
  'member.joined': 'bg-green-500',
  'member.removed': 'bg-red-500',
  'member.role_updated': 'bg-blue-500',
  'settings.updated': 'bg-gray-500',
  'profile.updated': 'bg-gray-500',
}

const ACTIVITY_FILTERS = [
  { value: 'all', label: 'All Activities' },
  { value: 'user.login', label: 'User Login' },
  { value: 'api_key', label: 'API Keys' },
  { value: 'webhook', label: 'Webhooks' },
  { value: 'member', label: 'Team Members' },
]

export default function ActivityPage() {
  const [activities, setActivities] = useState<Activity[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [filter, setFilter] = useState('all')

  const fetchActivities = async () => {
    setIsLoading(true)
    try {
      const params = new URLSearchParams({ workspaceId: 'default' })
      if (filter !== 'all') {
        params.append('type', filter)
      }
      const res = await fetch(`/api/activity?${params}`)
      const data = await res.json()
      setActivities(data.activities || [])
    } catch (error) {
      console.error('Failed to fetch activities:', error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchActivities()
  }, [filter])

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

  const getActivityIcon = (type: string) => {
    // Find matching prefix
    for (const key of Object.keys(ACTIVITY_ICONS)) {
      if (type.includes(key) || key.includes(type)) {
        return ACTIVITY_ICONS[key]
      }
    }
    return Activity
  }

  const getActivityColor = (type: string) => {
    for (const key of Object.keys(ACTIVITY_COLORS)) {
      if (type.includes(key) || key.includes(type)) {
        return ACTIVITY_COLORS[key]
      }
    }
    return 'bg-gray-500'
  }

  // Generate demo activities if none exist
  const demoActivities: Activity[] = [
    {
      id: '1',
      type: 'user.login',
      description: 'John logged in from Chrome on macOS',
      label: 'User logged in',
      metadata: {},
      createdAt: new Date(Date.now() - 5 * 60000).toISOString(),
    },
    {
      id: '2',
      type: 'api_key.created',
      description: 'New API key "Production" was created',
      label: 'API key created',
      metadata: { keyName: 'Production' },
      createdAt: new Date(Date.now() - 30 * 60000).toISOString(),
    },
    {
      id: '3',
      type: 'member.invited',
      description: 'colleague@example.com was invited to the workspace',
      label: 'Member invited',
      metadata: { email: 'colleague@example.com' },
      createdAt: new Date(Date.now() - 2 * 3600000).toISOString(),
    },
    {
      id: '4',
      type: 'webhook.created',
      description: 'New webhook "Slack Notifications" was created',
      label: 'Webhook created',
      metadata: { webhookName: 'Slack Notifications' },
      createdAt: new Date(Date.now() - 5 * 3600000).toISOString(),
    },
    {
      id: '5',
      type: 'member.joined',
      description: 'colleague@example.com joined the workspace',
      label: 'Member joined',
      metadata: { email: 'colleague@example.com' },
      createdAt: new Date(Date.now() - 24 * 3600000).toISOString(),
    },
    {
      id: '6',
      type: 'settings.updated',
      description: 'Workspace settings were updated',
      label: 'Settings updated',
      metadata: {},
      createdAt: new Date(Date.now() - 48 * 3600000).toISOString(),
    },
  ]

  const displayActivities = activities.length > 0 ? activities : demoActivities

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
                <Activity className="w-8 h-8" />
                Activity Log
              </h1>
              <p className="text-muted-foreground mt-2">
                Track all activities in your workspace
              </p>
            </div>
            <Select value={filter} onValueChange={setFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter activities" />
              </SelectTrigger>
              <SelectContent>
                {ACTIVITY_FILTERS.map((f) => (
                  <SelectItem key={f.value} value={f.value}>
                    {f.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Activity List */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Activities</CardTitle>
              <CardDescription>
                {displayActivities.length} activity{displayActivities.length !== 1 ? 's' : ''}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="text-center py-8 text-muted-foreground">Loading...</div>
              ) : displayActivities.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  No activities yet. Start using your workspace to see activity here.
                </div>
              ) : (
                <div className="space-y-4">
                  {displayActivities.map((activity) => {
                    const Icon = getActivityIcon(activity.type)
                    const color = getActivityColor(activity.type)
                    return (
                      <div
                        key={activity.id}
                        className="flex items-start gap-4 p-4 rounded-lg hover:bg-muted/50 transition-colors"
                      >
                        <div className={`w-10 h-10 rounded-full ${color} flex items-center justify-center flex-shrink-0`}>
                          <Icon className="w-5 h-5 text-white" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium">{activity.label}</p>
                          <p className="text-sm text-muted-foreground truncate">
                            {activity.description}
                          </p>
                          <p className="text-xs text-muted-foreground mt-1">
                            {formatDate(activity.createdAt)}
                          </p>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
