'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { Plus, Trash2, Copy, Check, Webhook, ToggleLeft, ToggleRight } from 'lucide-react'

interface WebhookEvent {
  id: string
  name: string
  description: string
}

interface Webhook {
  id: string
  name: string
  url: string
  events: string[]
  isActive: boolean
  secret?: string
  createdAt: string
}

const AVAILABLE_EVENTS: WebhookEvent[] = [
  { id: 'user.created', name: 'User Created', description: 'New user registers' },
  { id: 'user.updated', name: 'User Updated', description: 'User profile updated' },
  { id: 'workspace.created', name: 'Workspace Created', description: 'New workspace created' },
  { id: 'workspace.member_added', name: 'Member Added', description: 'New member joins' },
  { id: 'api_key.created', name: 'API Key Created', description: 'API key generated' },
  { id: 'api_key.revoked', name: 'API Key Revoked', description: 'API key deleted' },
]

export default function WebhooksPage() {
  const [webhooks, setWebhooks] = useState<Webhook[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [newWebhook, setNewWebhook] = useState({ name: '', url: '', events: [] as string[] })
  const [newlyCreatedSecret, setNewlyCreatedSecret] = useState<string | null>(null)
  const [copiedId, setCopiedId] = useState<string | null>(null)

  const fetchWebhooks = async () => {
    try {
      const res = await fetch('/api/webhooks?workspaceId=default')
      const data = await res.json()
      setWebhooks(data.webhooks || [])
    } catch (error) {
      console.error('Failed to fetch webhooks:', error)
    }
  }

  useEffect(() => {
    fetchWebhooks()
  }, [])

  const createWebhook = async () => {
    if (!newWebhook.name.trim() || !newWebhook.url.trim() || newWebhook.events.length === 0) {
      return
    }

    setIsLoading(true)
    try {
      const res = await fetch('/api/webhooks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: newWebhook.name,
          url: newWebhook.url,
          events: newWebhook.events,
          workspaceId: 'default',
        }),
      })
      const data = await res.json()

      if (data.webhook) {
        setWebhooks([data.webhook, ...webhooks])
        setNewlyCreatedSecret(data.webhook.secret)
        setNewWebhook({ name: '', url: '', events: [] })
      }
    } catch (error) {
      console.error('Failed to create webhook:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const deleteWebhook = async (id: string) => {
    try {
      await fetch(`/api/webhooks?id=${id}`, { method: 'DELETE' })
      setWebhooks(webhooks.filter((w) => w.id !== id))
    } catch (error) {
      console.error('Failed to delete webhook:', error)
    }
  }

  const toggleWebhook = async (id: string, isActive: boolean) => {
    try {
      await fetch('/api/webhooks', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, isActive: !isActive }),
      })
      setWebhooks(webhooks.map((w) => (w.id === id ? { ...w, isActive: !isActive } : w)))
    } catch (error) {
      console.error('Failed to toggle webhook:', error)
    }
  }

  const copySecret = (secret: string) => {
    navigator.clipboard.writeText(secret)
    setCopiedId(secret)
    setTimeout(() => setCopiedId(null), 2000)
  }

  const toggleEvent = (eventId: string) => {
    setNewWebhook((prev) => ({
      ...prev,
      events: prev.events.includes(eventId)
        ? prev.events.filter((e) => e !== eventId)
        : [...prev.events, eventId],
    }))
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
              <Link href="/dashboard/keys">API Keys</Link>
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
              <Webhook className="w-8 h-8" />
              Webhooks
            </h1>
            <p className="text-muted-foreground mt-2">
              Receive real-time events when things happen in your workspace
            </p>
          </div>

          {/* Create New Webhook */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Create New Webhook</CardTitle>
              <CardDescription>
                Configure a URL to receive events when actions occur
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <Label htmlFor="webhookName">Name</Label>
                  <Input
                    id="webhookName"
                    placeholder="e.g., My Webhook"
                    value={newWebhook.name}
                    onChange={(e) => setNewWebhook({ ...newWebhook, name: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="webhookUrl">Endpoint URL</Label>
                  <Input
                    id="webhookUrl"
                    placeholder="https://your-server.com/webhook"
                    value={newWebhook.url}
                    onChange={(e) => setNewWebhook({ ...newWebhook, url: e.target.value })}
                  />
                </div>
              </div>

              <div>
                <Label>Events</Label>
                <div className="mt-2 grid gap-2 md:grid-cols-2">
                  {AVAILABLE_EVENTS.map((event) => (
                    <div
                      key={event.id}
                      className="flex items-center gap-2 p-2 border rounded cursor-pointer hover:bg-muted"
                      onClick={() => toggleEvent(event.id)}
                    >
                      <Checkbox
                        checked={newWebhook.events.includes(event.id)}
                        onCheckedChange={() => toggleEvent(event.id)}
                      />
                      <div>
                        <p className="text-sm font-medium">{event.name}</p>
                        <p className="text-xs text-muted-foreground">{event.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <Button onClick={createWebhook} disabled={isLoading || !newWebhook.name || !newWebhook.url || newWebhook.events.length === 0}>
                <Plus className="w-4 h-4 mr-2" />
                Create Webhook
              </Button>

              {/* Show newly created secret */}
              {newlyCreatedSecret && (
                <div className="mt-4 p-4 bg-yellow-500/10 border border-yellow-500/50 rounded-lg">
                  <p className="font-medium text-yellow-500 mb-2">
                    ⚠️ Copy your webhook secret now - you won&apos;t see it again!
                  </p>
                  <div className="flex gap-2">
                    <code className="flex-1 p-2 bg-background rounded font-mono text-sm">
                      {newlyCreatedSecret}
                    </code>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => copySecret(newlyCreatedSecret)}
                    >
                      {copiedId === newlyCreatedSecret ? (
                        <Check className="w-4 h-4" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Existing Webhooks */}
          <Card>
            <CardHeader>
              <CardTitle>Your Webhooks</CardTitle>
              <CardDescription>
                {webhooks.length} webhook{webhooks.length !== 1 ? 's' : ''} configured
              </CardDescription>
            </CardHeader>
            <CardContent>
              {webhooks.length === 0 ? (
                <p className="text-muted-foreground text-center py-8">
                  No webhooks yet. Create one above to get started.
                </p>
              ) : (
                <div className="space-y-4">
                  {webhooks.map((webhook) => (
                    <div
                      key={webhook.id}
                      className={`flex items-center justify-between p-4 border rounded-lg ${
                        !webhook.isActive && 'opacity-50'
                      }`}
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <p className="font-medium">{webhook.name}</p>
                          <span className={`px-2 py-0.5 text-xs rounded ${
                            webhook.isActive ? 'bg-green-500/20 text-green-500' : 'bg-gray-500/20 text-gray-500'
                          }`}>
                            {webhook.isActive ? 'Active' : 'Inactive'}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground font-mono">{webhook.url}</p>
                        <div className="flex flex-wrap gap-1 mt-2">
                          {webhook.events.map((event) => (
                            <span
                              key={event}
                              className="px-2 py-0.5 text-xs bg-primary/10 text-primary rounded"
                            >
                              {event}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => toggleWebhook(webhook.id, webhook.isActive)}
                        >
                          {webhook.isActive ? (
                            <ToggleRight className="w-5 h-5 text-green-500" />
                          ) : (
                            <ToggleLeft className="w-5 h-5" />
                          )}
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => deleteWebhook(webhook.id)}
                        >
                          <Trash2 className="w-4 h-4 text-destructive" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
