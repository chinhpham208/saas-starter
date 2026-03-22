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
  Shield,
  Search,
  Download,
  Filter,
  LogIn,
  LogOut,
  Key,
  Users,
  Settings,
  Globe,
  AlertTriangle,
  CheckCircle,
  XCircle,
} from 'lucide-react'

interface AuditEvent {
  id: string
  action: string
  category: 'auth' | 'api_key' | 'webhook' | 'member' | 'settings' | 'domain'
  severity: 'info' | 'warning' | 'critical'
  actor: string
  actorType: 'user' | 'api_key' | 'system'
  ipAddress: string
  userAgent: string
  description: string
  metadata: Record<string, any>
  createdAt: string
}

const MOCK_AUDIT_EVENTS: AuditEvent[] = [
  {
    id: '1',
    action: 'user.login',
    category: 'auth',
    severity: 'info',
    actor: 'john@example.com',
    actorType: 'user',
    ipAddress: '192.168.1.100',
    userAgent: 'Chrome/122.0 (Macintosh; Intel Mac OS X 10_15_7)',
    description: 'User logged in successfully',
    metadata: { method: 'password' },
    createdAt: new Date(Date.now() - 5 * 60000).toISOString(),
  },
  {
    id: '2',
    action: 'api_key.used',
    category: 'api_key',
    severity: 'info',
    actor: 'sk_live_xxxx...',
    actorType: 'api_key',
    ipAddress: '203.0.113.45',
    userAgent: 'Python/3.11',
    description: 'API key used for request',
    metadata: { endpoint: '/api/users', method: 'GET', status: 200 },
    createdAt: new Date(Date.now() - 15 * 60000).toISOString(),
  },
  {
    id: '3',
    action: 'member.invited',
    category: 'member',
    severity: 'info',
    actor: 'john@example.com',
    actorType: 'user',
    ipAddress: '192.168.1.100',
    userAgent: 'Chrome/122.0 (Macintosh; Intel Mac OS X 10_15_7)',
    description: 'New member invited to workspace',
    metadata: { email: 'colleague@example.com', role: 'MEMBER' },
    createdAt: new Date(Date.now() - 2 * 3600000).toISOString(),
  },
  {
    id: '4',
    action: 'webhook.created',
    category: 'webhook',
    severity: 'info',
    actor: 'john@example.com',
    actorType: 'user',
    ipAddress: '192.168.1.100',
    userAgent: 'Chrome/122.0 (Macintosh; Intel Mac OS X 10_15_7)',
    description: 'New webhook created',
    metadata: { name: 'Slack Notifications', url: 'https://slack.com/...' },
    createdAt: new Date(Date.now() - 5 * 3600000).toISOString(),
  },
  {
    id: '5',
    action: 'api_key.created',
    category: 'api_key',
    severity: 'info',
    actor: 'john@example.com',
    actorType: 'user',
    ipAddress: '192.168.1.100',
    userAgent: 'Chrome/122.0 (Macintosh; Intel Mac OS X 10_15_7)',
    description: 'New API key created',
    metadata: { keyName: 'Production Key', expiresAt: '2025-04-22' },
    createdAt: new Date(Date.now() - 24 * 3600000).toISOString(),
  },
  {
    id: '6',
    action: 'failed_login',
    category: 'auth',
    severity: 'warning',
    actor: 'unknown@example.com',
    actorType: 'user',
    ipAddress: '198.51.100.23',
    userAgent: 'Python/3.11',
    description: 'Failed login attempt - invalid password',
    metadata: { method: 'password', reason: 'invalid_credentials' },
    createdAt: new Date(Date.now() - 48 * 3600000).toISOString(),
  },
  {
    id: '7',
    action: 'settings.updated',
    category: 'settings',
    severity: 'info',
    actor: 'john@example.com',
    actorType: 'user',
    ipAddress: '192.168.1.100',
    userAgent: 'Chrome/122.0 (Macintosh; Intel Mac OS X 10_15_7)',
    description: 'Workspace settings updated',
    metadata: { changes: ['webhook_timeout', 'api_rate_limit'] },
    createdAt: new Date(Date.now() - 72 * 3600000).toISOString(),
  },
  {
    id: '8',
    action: 'suspicious_ip',
    category: 'auth',
    severity: 'critical',
    actor: 'attacker@evil.com',
    actorType: 'user',
    ipAddress: '185.220.101.45',
    userAgent: 'curl/7.68.0',
    description: 'Login attempt from suspicious IP (TOR exit node)',
    metadata: { country: 'Germany', isTor: true },
    createdAt: new Date(Date.now() - 96 * 3600000).toISOString(),
  },
]

const CATEGORIES = [
  { value: 'all', label: 'All Categories' },
  { value: 'auth', label: 'Authentication' },
  { value: 'api_key', label: 'API Keys' },
  { value: 'webhook', label: 'Webhooks' },
  { value: 'member', label: 'Team Members' },
  { value: 'settings', label: 'Settings' },
  { value: 'domain', label: 'Domains' },
]

const SEVERITIES = [
  { value: 'all', label: 'All Severities' },
  { value: 'info', label: 'Info' },
  { value: 'warning', label: 'Warning' },
  { value: 'critical', label: 'Critical' },
]

const CATEGORY_ICONS: Record<string, any> = {
  auth: LogIn,
  api_key: Key,
  webhook: Globe,
  member: Users,
  settings: Settings,
  domain: Globe,
}

const SEVERITY_COLORS: Record<string, string> = {
  info: 'bg-blue-500',
  warning: 'bg-yellow-500',
  critical: 'bg-red-500',
}

export default function AuditPage() {
  const [events] = useState<AuditEvent[]>(MOCK_AUDIT_EVENTS)
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [severityFilter, setSeverityFilter] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')

  const filteredEvents = events.filter(event => {
    if (categoryFilter !== 'all' && event.category !== categoryFilter) return false
    if (severityFilter !== 'all' && event.severity !== severityFilter) return false
    if (searchQuery && !event.description.toLowerCase().includes(searchQuery.toLowerCase())) return false
    return true
  })

  const formatDate = (date: string) => {
    const d = new Date(date)
    return d.toLocaleString()
  }

  const getActorBadge = (actor: string, actorType: string) => {
    if (actorType === 'api_key') {
      return <Badge variant="secondary">API Key</Badge>
    }
    if (actorType === 'system') {
      return <Badge variant="outline">System</Badge>
    }
    return <Badge>User</Badge>
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
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold flex items-center gap-2">
                <Shield className="w-8 h-8" />
                Audit Log
              </h1>
              <p className="text-muted-foreground mt-2">
                Security audit trail for your workspace
              </p>
            </div>
            <Button variant="outline">
              <Download className="w-4 h-4 mr-2" />
              Export Logs
            </Button>
          </div>

          {/* Filters */}
          <Card className="mb-6">
            <CardContent className="pt-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <input
                      type="text"
                      placeholder="Search audit logs..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border rounded-md bg-background"
                    />
                  </div>
                </div>
                <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent>
                    {CATEGORIES.map((cat) => (
                      <SelectItem key={cat.value} value={cat.value}>
                        {cat.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={severityFilter} onValueChange={setSeverityFilter}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Severity" />
                  </SelectTrigger>
                  <SelectContent>
                    {SEVERITIES.map((sev) => (
                      <SelectItem key={sev.value} value={sev.value}>
                        {sev.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Summary Stats */}
          <div className="grid gap-4 md:grid-cols-4 mb-6">
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
                <CardTitle className="text-sm font-medium">Auth Events</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {events.filter(e => e.category === 'auth').length}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Warnings</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-yellow-500">
                  {events.filter(e => e.severity === 'warning').length}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Critical</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-500">
                  {events.filter(e => e.severity === 'critical').length}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Audit Log Table */}
          <Card>
            <CardHeader>
              <CardTitle>Audit Events</CardTitle>
              <CardDescription>
                {filteredEvents.length} event{filteredEvents.length !== 1 ? 's' : ''} found
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredEvents.map((event) => {
                  const Icon = CATEGORY_ICONS[event.category]
                  const severityColor = SEVERITY_COLORS[event.severity]
                  return (
                    <div
                      key={event.id}
                      className="flex items-start gap-4 p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                    >
                      <div className={`w-10 h-10 rounded-full ${severityColor} flex items-center justify-center flex-shrink-0`}>
                        <Icon className="w-5 h-5 text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="font-medium">{event.description}</p>
                          {event.severity === 'critical' && (
                            <XCircle className="w-4 h-4 text-red-500" />
                          )}
                          {event.severity === 'warning' && (
                            <AlertTriangle className="w-4 h-4 text-yellow-500" />
                          )}
                        </div>
                        <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1">
                            {getActorBadge(event.actor, event.actorType)}
                            {event.actorType === 'user' ? event.actor : event.actor}
                          </span>
                          <span className="font-mono text-xs">{event.ipAddress}</span>
                        </div>
                        <div className="flex items-center gap-4 mt-1 text-xs text-muted-foreground">
                          <span>{event.userAgent}</span>
                        </div>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <Badge variant={event.severity === 'critical' ? 'destructive' : event.severity === 'warning' ? 'secondary' : 'outline'}>
                          {event.severity}
                        </Badge>
                        <p className="text-xs text-muted-foreground mt-2">
                          {formatDate(event.createdAt)}
                        </p>
                      </div>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
