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
  BarChart3,
  TrendingUp,
  TrendingDown,
  Users,
  MousePointerClick,
  Clock,
  Globe,
  ArrowUpRight,
  ArrowDownRight,
} from 'lucide-react'

const PERIODS = [
  { value: '7d', label: 'Last 7 days' },
  { value: '30d', label: 'Last 30 days' },
  { value: '90d', label: 'Last 90 days' },
]

const MOCK_STATS = {
  totalUsers: 1234,
  totalUsersChange: 12.5,
  activeUsers: 856,
  activeUsersChange: 8.2,
  apiCalls: 45230,
  apiCallsChange: 23.1,
  avgResponseTime: 145,
  avgResponseTimeChange: -5.3,
}

const MOCK_DAILY_USAGE = [
  { date: 'Mar 16', apiCalls: 1200, users: 45 },
  { date: 'Mar 17', apiCalls: 1450, users: 52 },
  { date: 'Mar 18', apiCalls: 1320, users: 48 },
  { date: 'Mar 19', apiCalls: 1680, users: 61 },
  { date: 'Mar 20', apiCalls: 1890, users: 68 },
  { date: 'Mar 21', apiCalls: 2100, users: 75 },
  { date: 'Mar 22', apiCalls: 1950, users: 72 },
]

const TOP_ENDPOINTS = [
  { path: '/api/users', calls: 12500, avgTime: 120, change: 15.2 },
  { path: '/api/auth/login', calls: 8900, avgTime: 85, change: 8.5 },
  { path: '/api/workspaces', calls: 6700, avgTime: 145, change: -2.1 },
  { path: '/api/keys', calls: 4500, avgTime: 95, change: 22.3 },
  { path: '/api/webhooks', calls: 3200, avgTime: 210, change: 5.7 },
]

const GEOGRAPHIC_DATA = [
  { country: 'United States', users: 520, percentage: 42 },
  { country: 'United Kingdom', users: 185, percentage: 15 },
  { country: 'Germany', users: 142, percentage: 12 },
  { country: 'Canada', users: 98, percentage: 8 },
  { country: 'France', users: 87, percentage: 7 },
  { country: 'Other', users: 202, percentage: 16 },
]

export default function AnalyticsPage() {
  const [period, setPeriod] = useState('30d')

  const maxApiCalls = Math.max(...MOCK_DAILY_USAGE.map(d => d.apiCalls))
  const maxUsers = Math.max(...MOCK_DAILY_USAGE.map(d => d.users))

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
                <BarChart3 className="w-8 h-8" />
                Analytics
              </h1>
              <p className="text-muted-foreground mt-2">
                Track your API usage and performance metrics
              </p>
            </div>
            <Select value={period} onValueChange={setPeriod}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Select period" />
              </SelectTrigger>
              <SelectContent>
                {PERIODS.map((p) => (
                  <SelectItem key={p.value} value={p.value}>
                    {p.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Key Metrics */}
          <div className="grid gap-4 md:grid-cols-4 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{MOCK_STATS.totalUsers.toLocaleString()}</div>
                <div className="flex items-center text-xs text-muted-foreground">
                  {MOCK_STATS.totalUsersChange > 0 ? (
                    <ArrowUpRight className="h-3 w-3 text-green-500 mr-1" />
                  ) : (
                    <ArrowDownRight className="h-3 w-3 text-red-500 mr-1" />
                  )}
                  <span className={MOCK_STATS.totalUsersChange > 0 ? 'text-green-500' : 'text-red-500'}>
                    {Math.abs(MOCK_STATS.totalUsersChange)}%
                  </span>
                  <span className="ml-1">from last month</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Users</CardTitle>
                <MousePointerClick className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{MOCK_STATS.activeUsers.toLocaleString()}</div>
                <div className="flex items-center text-xs text-muted-foreground">
                  {MOCK_STATS.activeUsersChange > 0 ? (
                    <ArrowUpRight className="h-3 w-3 text-green-500 mr-1" />
                  ) : (
                    <ArrowDownRight className="h-3 w-3 text-red-500 mr-1" />
                  )}
                  <span className={MOCK_STATS.activeUsersChange > 0 ? 'text-green-500' : 'text-red-500'}>
                    {Math.abs(MOCK_STATS.activeUsersChange)}%
                  </span>
                  <span className="ml-1">from last month</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">API Calls</CardTitle>
                <BarChart3 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{MOCK_STATS.apiCalls.toLocaleString()}</div>
                <div className="flex items-center text-xs text-muted-foreground">
                  {MOCK_STATS.apiCallsChange > 0 ? (
                    <ArrowUpRight className="h-3 w-3 text-green-500 mr-1" />
                  ) : (
                    <ArrowDownRight className="h-3 w-3 text-red-500 mr-1" />
                  )}
                  <span className={MOCK_STATS.apiCallsChange > 0 ? 'text-green-500' : 'text-red-500'}>
                    {Math.abs(MOCK_STATS.apiCallsChange)}%
                  </span>
                  <span className="ml-1">from last month</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Avg Response Time</CardTitle>
                <Clock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{MOCK_STATS.avgResponseTime}ms</div>
                <div className="flex items-center text-xs text-muted-foreground">
                  {MOCK_STATS.avgResponseTimeChange < 0 ? (
                    <ArrowUpRight className="h-3 w-3 text-green-500 mr-1" />
                  ) : (
                    <ArrowDownRight className="h-3 w-3 text-red-500 mr-1" />
                  )}
                  <span className={MOCK_STATS.avgResponseTimeChange < 0 ? 'text-green-500' : 'text-red-500'}>
                    {Math.abs(MOCK_STATS.avgResponseTimeChange)}%
                  </span>
                  <span className="ml-1">from last month</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Charts Row */}
          <div className="grid gap-6 md:grid-cols-2 mb-8">
            {/* API Usage Chart */}
            <Card>
              <CardHeader>
                <CardTitle>API Usage</CardTitle>
                <CardDescription>Daily API calls over time</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64 flex items-end gap-2">
                  {MOCK_DAILY_USAGE.map((day, index) => (
                    <div key={index} className="flex-1 flex flex-col items-center gap-2">
                      <div
                        className="w-full bg-primary rounded-t transition-all duration-300 hover:bg-primary/80"
                        style={{ height: `${(day.apiCalls / maxApiCalls) * 100}%`, minHeight: '8px' }}
                        title={`${day.apiCalls.toLocaleString()} calls`}
                      />
                      <span className="text-xs text-muted-foreground">{day.date.split(' ')[1]}</span>
                    </div>
                  ))}
                </div>
                <div className="mt-4 flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Peak: {maxApiCalls.toLocaleString()}</span>
                  <span className="text-muted-foreground">Avg: {Math.round(MOCK_DAILY_USAGE.reduce((a, b) => a + b.apiCalls, 0) / MOCK_DAILY_USAGE.length).toLocaleString()}</span>
                </div>
              </CardContent>
            </Card>

            {/* Active Users Chart */}
            <Card>
              <CardHeader>
                <CardTitle>Active Users</CardTitle>
                <CardDescription>Daily active users over time</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64 flex items-end gap-2">
                  {MOCK_DAILY_USAGE.map((day, index) => (
                    <div key={index} className="flex-1 flex flex-col items-center gap-2">
                      <div
                        className="w-full bg-blue-500 rounded-t transition-all duration-300 hover:bg-blue-600"
                        style={{ height: `${(day.users / maxUsers) * 100}%`, minHeight: '8px' }}
                        title={`${day.users} users`}
                      />
                      <span className="text-xs text-muted-foreground">{day.date.split(' ')[1]}</span>
                    </div>
                  ))}
                </div>
                <div className="mt-4 flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Peak: {maxUsers}</span>
                  <span className="text-muted-foreground">Avg: {Math.round(MOCK_DAILY_USAGE.reduce((a, b) => a + b.users, 0) / MOCK_DAILY_USAGE.length)}</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Bottom Row */}
          <div className="grid gap-6 md:grid-cols-2">
            {/* Top Endpoints */}
            <Card>
              <CardHeader>
                <CardTitle>Top Endpoints</CardTitle>
                <CardDescription>Most used API endpoints</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {TOP_ENDPOINTS.map((endpoint, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex-1">
                        <p className="font-mono text-sm font-medium">{endpoint.path}</p>
                        <div className="flex items-center gap-4 mt-1">
                          <span className="text-xs text-muted-foreground">
                            {endpoint.calls.toLocaleString()} calls
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {endpoint.avgTime}ms avg
                          </span>
                        </div>
                      </div>
                      <div className={`flex items-center text-xs ${endpoint.change > 0 ? 'text-green-500' : 'text-red-500'}`}>
                        {endpoint.change > 0 ? (
                          <TrendingUp className="h-3 w-3 mr-1" />
                        ) : (
                          <TrendingDown className="h-3 w-3 mr-1" />
                        )}
                        {Math.abs(endpoint.change)}%
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Geographic Distribution */}
            <Card>
              <CardHeader>
                <CardTitle>Geographic Distribution</CardTitle>
                <CardDescription>Users by country</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {GEOGRAPHIC_DATA.map((geo, index) => (
                    <div key={index}>
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-2">
                          <Globe className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">{geo.country}</span>
                        </div>
                        <span className="text-sm font-medium">{geo.users} ({geo.percentage}%)</span>
                      </div>
                      <div className="h-2 bg-muted rounded-full overflow-hidden">
                        <div
                          className="h-full bg-primary"
                          style={{ width: `${geo.percentage}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}
