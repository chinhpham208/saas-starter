'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  BookOpen,
  Code,
  Copy,
  Check,
  ChevronRight,
  Terminal,
  Globe,
  Key,
  Users,
  CreditCard,
} from 'lucide-react'

const ENDPOINTS = [
  {
    category: 'Authentication',
    icon: Key,
    items: [
      {
        method: 'POST',
        path: '/api/auth/register',
        description: 'Register a new user account',
        params: [
          { name: 'email', type: 'string', required: true, description: 'User email address' },
          { name: 'password', type: 'string', required: true, description: 'User password (min 8 chars)' },
          { name: 'name', type: 'string', required: false, description: 'User full name' },
        ],
      },
      {
        method: 'POST',
        path: '/api/auth/login',
        description: 'Authenticate user and get session token',
        params: [
          { name: 'email', type: 'string', required: true, description: 'User email address' },
          { name: 'password', type: 'string', required: true, description: 'User password' },
        ],
      },
    ],
  },
  {
    category: 'Users',
    icon: Users,
    items: [
      {
        method: 'GET',
        path: '/api/users',
        description: 'List all users in the workspace',
        params: [
          { name: 'page', type: 'integer', required: false, description: 'Page number' },
          { name: 'limit', type: 'integer', required: false, description: 'Items per page (max 100)' },
        ],
      },
      {
        method: 'GET',
        path: '/api/users/:id',
        description: 'Get a specific user by ID',
        params: [
          { name: 'id', type: 'string', required: true, description: 'User ID' },
        ],
      },
      {
        method: 'PATCH',
        path: '/api/users/:id',
        description: 'Update user information',
        params: [
          { name: 'id', type: 'string', required: true, description: 'User ID' },
          { name: 'name', type: 'string', required: false, description: 'Updated name' },
          { name: 'role', type: 'string', required: false, description: 'ADMIN or MEMBER' },
        ],
      },
    ],
  },
  {
    category: 'API Keys',
    icon: Key,
    items: [
      {
        method: 'GET',
        path: '/api/keys',
        description: 'List all API keys for the workspace',
        params: [],
      },
      {
        method: 'POST',
        path: '/api/keys',
        description: 'Create a new API key',
        params: [
          { name: 'name', type: 'string', required: true, description: 'Descriptive name for the key' },
          { name: 'expiresAt', type: 'string', required: false, description: 'ISO date string for expiration' },
        ],
      },
      {
        method: 'DELETE',
        path: '/api/keys/:id',
        description: 'Revoke an API key',
        params: [
          { name: 'id', type: 'string', required: true, description: 'API key ID' },
        ],
      },
    ],
  },
  {
    category: 'Webhooks',
    icon: Globe,
    items: [
      {
        method: 'GET',
        path: '/api/webhooks',
        description: 'List all webhooks for the workspace',
        params: [],
      },
      {
        method: 'POST',
        path: '/api/webhooks',
        description: 'Create a new webhook',
        params: [
          { name: 'name', type: 'string', required: true, description: 'Webhook name' },
          { name: 'url', type: 'string', required: true, description: 'Target URL' },
          { name: 'events', type: 'array', required: true, description: 'Array of event types' },
        ],
      },
      {
        method: 'DELETE',
        path: '/api/webhooks/:id',
        description: 'Delete a webhook',
        params: [
          { name: 'id', type: 'string', required: true, description: 'Webhook ID' },
        ],
      },
    ],
  },
]

const METHOD_COLORS: Record<string, string> = {
  GET: 'bg-blue-500',
  POST: 'bg-green-500',
  PATCH: 'bg-yellow-500',
  DELETE: 'bg-red-500',
}

const EXAMPLE_CODE = `// Example: List users
const response = await fetch('https://api.saas-starter.com/api/users', {
  headers: {
    'Authorization': 'Bearer sk_live_xxxx...',
    'Content-Type': 'application/json'
  }
});

const users = await response.json();
console.log(users);

// Example response:
{
  "users": [
    {
      "id": "user_123",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "ADMIN"
    }
  ],
  "total": 1
}`

export default function DocsPage() {
  const [selectedEndpoint, setSelectedEndpoint] = useState(ENDPOINTS[0].items[0])
  const [copied, setCopied] = useState(false)

  const copyCode = () => {
    navigator.clipboard.writeText(EXAMPLE_CODE)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const getCategoryIcon = (category: string) => {
    const endpoint = ENDPOINTS.find(e => e.category === category)
    return endpoint?.icon || Key
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
          <div className="mb-8">
            <h1 className="text-3xl font-bold flex items-center gap-2">
              <BookOpen className="w-8 h-8" />
              API Documentation
            </h1>
            <p className="text-muted-foreground mt-2">
              Complete reference for the SaaS Starter API
            </p>
          </div>

          <div className="grid gap-6 lg:grid-cols-4">
            {/* Sidebar */}
            <div className="lg:col-span-1">
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Endpoints</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  {ENDPOINTS.map((category) => {
                    const Icon = category.icon
                    return (
                      <div key={category.category} className="border-t">
                        <div className="flex items-center gap-2 px-4 py-3 bg-muted/50">
                          <Icon className="w-4 h-4" />
                          <span className="font-medium text-sm">{category.category}</span>
                        </div>
                        {category.items.map((endpoint) => (
                          <button
                            key={endpoint.path}
                            onClick={() => setSelectedEndpoint(endpoint)}
                            className={`w-full flex items-center gap-2 px-4 py-2 text-left text-sm hover:bg-muted/50 transition-colors ${
                              selectedEndpoint.path === endpoint.path ? 'bg-muted' : ''
                            }`}
                          >
                            <Badge className={`${METHOD_COLORS[endpoint.method]} text-xs`}>
                              {endpoint.method}
                            </Badge>
                            <span className="truncate font-mono text-xs">{endpoint.path}</span>
                          </button>
                        ))}
                      </div>
                    )
                  })}
                </CardContent>
              </Card>
            </div>

            {/* Main Content */}
            <div className="lg:col-span-3 space-y-6">
              {/* Endpoint Details */}
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <Badge className={`${METHOD_COLORS[selectedEndpoint.method]} text-lg px-3 py-1`}>
                      {selectedEndpoint.method}
                    </Badge>
                    <div>
                      <CardTitle className="font-mono">{selectedEndpoint.path}</CardTitle>
                      <CardDescription>{selectedEndpoint.description}</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <h4 className="font-medium mb-3">Parameters</h4>
                  {selectedEndpoint.params.length === 0 ? (
                    <p className="text-sm text-muted-foreground">No parameters required</p>
                  ) : (
                    <div className="space-y-3">
                      {selectedEndpoint.params.map((param) => (
                        <div key={param.name} className="grid grid-cols-4 gap-4 p-3 border rounded-lg">
                          <div className="col-span-1">
                            <div className="flex items-center gap-2">
                              <code className="text-sm font-mono">{param.name}</code>
                              {param.required && <Badge variant="destructive" className="text-xs">Required</Badge>}
                            </div>
                            <span className="text-xs text-muted-foreground">{param.type}</span>
                          </div>
                          <div className="col-span-3 text-sm text-muted-foreground">
                            {param.description}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Code Example */}
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <Code className="w-5 h-5" />
                      Example Request
                    </CardTitle>
                    <CardDescription>cURL / JavaScript</CardDescription>
                  </div>
                  <Button variant="outline" size="sm" onClick={copyCode}>
                    {copied ? <Check className="w-4 h-4 mr-2" /> : <Copy className="w-4 h-4 mr-2" />}
                    {copied ? 'Copied!' : 'Copy'}
                  </Button>
                </CardHeader>
                <CardContent>
                  <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm font-mono">
                    <code>{EXAMPLE_CODE}</code>
                  </pre>
                </CardContent>
              </Card>

              {/* Rate Limits */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Terminal className="w-5 h-5" />
                    Rate Limits
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4 md:grid-cols-3">
                    <div className="p-4 border rounded-lg">
                      <p className="font-medium">Starter</p>
                      <p className="text-2xl font-bold">1,000</p>
                      <p className="text-sm text-muted-foreground">requests/month</p>
                    </div>
                    <div className="p-4 border rounded-lg">
                      <p className="font-medium">Pro</p>
                      <p className="text-2xl font-bold">100,000</p>
                      <p className="text-sm text-muted-foreground">requests/month</p>
                    </div>
                    <div className="p-4 border rounded-lg">
                      <p className="font-medium">Enterprise</p>
                      <p className="text-2xl font-bold">Unlimited</p>
                      <p className="text-sm text-muted-foreground">requests/month</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Authentication */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Key className="w-5 h-5" />
                    Authentication
                  </CardTitle>
                  <CardDescription>
                    All API requests require authentication via API key
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">
                    Include your API key in the <code>Authorization</code> header:
                  </p>
                  <pre className="bg-muted p-4 rounded-lg text-sm font-mono">
                    Authorization: Bearer sk_live_xxxx...
                  </pre>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
