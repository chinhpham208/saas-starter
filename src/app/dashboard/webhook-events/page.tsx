'use client'

import { useState } from 'react'
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
import {
  Webhook,
  CheckCircle,
  XCircle,
  Clock,
  RefreshCw,
  Eye,
  ChevronRight,
} from 'lucide-react'

interface WebhookEvent {
  id: string
  webhookId: string
  webhookName: string
  eventType: string
  status: 'success' | 'failed' | 'pending'
  payload: Record<string, any>
  response: {
    statusCode: number
    body: string
  } | null
  attempt: number
  createdAt: string
}

const MOCK_EVENTS: WebhookEvent[] = [
  {
    id: '1',
    webhookId: 'wh_1',
    webhookName: 'Slack Notifications',
    eventType: 'user.created',
    status: 'success',
    payload: { userId: 'user_123', email: 'john@example.com' },
    response: { statusCode: 200, body: 'OK' },
    attempt: 1,
    createdAt: new Date(Date.now() - 5 * 60000).toISOString(),
  },
  {
    id: '2',
    webhookId: 'wh_1',
    webhookName: 'Slack Notifications',
    eventType: 'payment.success',
    status: 'success',
    payload: { paymentId: 'pay_456', amount: 2900 },
    response: { statusCode: 200, body: 'OK' },
    attempt: 1,
    createdAt: new Date(Date.now() - 30 * 60000).toISOString(),
  },
  {
    id: '3',
    webhookId: 'wh_2',
    webhookName: 'CRM Integration',
    eventType: 'workspace.created',
    status: 'failed',
    payload: { workspaceId: 'ws_789', name: 'Acme Corp' },
    response: { statusCode: 500, body: 'Internal Server Error' },
    attempt: 3,
    createdAt: new Date(Date.now() - 2 * 3600000).toISOString(),
  },
  {
    id: '4',
    webhookId: 'wh_1',
    webhookName: 'Slack Notifications',
    eventType: 'member.invited',
    status: 'pending',
    payload: { email: 'colleague@example.com', role: 'MEMBER' },
    response: null,
    attempt: 1,
    createdAt: new Date(Date.now() - 5 * 60000).toISOString(),
  },
]

const EVENT_TYPES = [
  { value: 'all', label: 'All Events' },
  { value: 'user.created', label: 'User Created' },
  { value: 'user.updated', label: 'User Updated' },
  { value: 'payment.success', label: 'Payment Success' },
  { value: 'payment.failed', label: 'Payment Failed' },
  { value: 'workspace.created', label: 'Workspace Created' },
  { value: 'member.invited', label: 'Member Invited' },
]

export default function WebhookEventsPage() {
  const [events] = useState<WebhookEvent[]>(MOCK_EVENTS)
  const [filter, setFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')

  const filteredEvents = events.filter(event => {
    if (filter !== 'all' && event.eventType !== filter) return false
    if (statusFilter !== 'all' && event.status !== statusFilter) return false
    return true
  })

  const successCount = events.filter(e => e.status === 'success').length
  const failedCount = events.filter(e => e.status === 'failed').length
  const pendingCount = events.filter(e => e.status === 'pending').length

  const formatDate = (date: string) => {
    const d = new Date(date)
    const now = new Date()
    const diff = now.getTime() - d.getTime()
    const minutes = Math.floor(diff / 60000)
    const hours = Math.floor(diff / 3600000)

    if (minutes < 1) return 'Just now'
    if (minutes < 60) return `${minutes}m ago`
    if (hours < 24) return `${hours}h ago`
    return d.toLocaleDateString()
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="w-5 h-5 text-green-500" />
      case 'failed':
        return <XCircle className="w-5 h-5 text-red-500" />
      case 'pending':
        return <Clock className="w-5 h-5 text-yellow-500" />
    }
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
              <Link href="/dashboard/webhooks">Webhooks</Link>
            </Button>
            <Button variant="outline">Sign Out</Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container py-8 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold flex items-center gap-2">
                <Webhook className="w-8 h-8" />
                Webhook Events
              </h1>
              <p className="text-muted-foreground mt-2">
                View delivery history for your webhooks
              </p>
            </div>
          </div>

          {/* Stats */}
          <div className="grid gap-4 md:grid-cols-4 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Events</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{events.length}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Successful</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-500">{successCount}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Failed</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-500">{failedCount}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Pending</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-yellow-500">{pendingCount}</div>
              </CardContent>
            </Card>
          </div>

          {/* Filters */}
          <Card className="mb-6">
            <CardContent className="pt-6">
              <div className="flex gap-4">
                <Select value={filter} onValueChange={setFilter}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Event Type" />
                  </SelectTrigger>
                  <SelectContent>
                    {EVENT_TYPES.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="success">Success</SelectItem>
                    <SelectItem value="failed">Failed</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Events List */}
          <Card>
            <CardHeader>
              <CardTitle>Delivery History</CardTitle>
              <CardDescription>
                {filteredEvents.length} event{filteredEvents.length !== 1 ? 's' : ''}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredEvents.map((event) => (
                  <div
                    key={event.id}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      {getStatusIcon(event.status)}
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="font-medium">{event.eventType}</p>
                          <Badge variant="outline">{event.webhookName}</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">
                          Attempt {event.attempt} • {formatDate(event.createdAt)}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      {event.response && (
                        <Badge variant={event.response.statusCode >= 200 && event.response.statusCode < 300 ? 'default' : 'destructive'}>
                          {event.response.statusCode}
                        </Badge>
                      )}
                      <Button variant="outline" size="sm">
                        <Eye className="w-4 h-4 mr-2" />
                        View Details
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
