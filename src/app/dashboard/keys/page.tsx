'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Plus, Trash2, Copy, Check } from 'lucide-react'

interface ApiKey {
  id: string
  name: string
  prefix: string
  key?: string
  lastUsed: string | null
  expiresAt: string | null
  createdAt: string
}

export default function ApiKeysPage() {
  const [keys, setKeys] = useState<ApiKey[]>([])
  const [newKeyName, setNewKeyName] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [newlyCreatedKey, setNewlyCreatedKey] = useState<string | null>(null)
  const [copiedId, setCopiedId] = useState<string | null>(null)

  const fetchKeys = async () => {
    try {
      const res = await fetch('/api/keys?workspaceId=default')
      const data = await res.json()
      setKeys(data.keys || [])
    } catch (error) {
      console.error('Failed to fetch keys:', error)
    }
  }

  const createKey = async () => {
    if (!newKeyName.trim()) return

    setIsLoading(true)
    try {
      const res = await fetch('/api/keys', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: newKeyName,
          workspaceId: 'default',
          expiresIn: 365 * 24 * 60 * 60, // 1 year
        }),
      })
      const data = await res.json()

      if (data.key) {
        setKeys([data.key, ...keys])
        setNewlyCreatedKey(data.key.key)
        setNewKeyName('')
      }
    } catch (error) {
      console.error('Failed to create key:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const deleteKey = async (id: string) => {
    try {
      await fetch(`/api/keys?id=${id}`, { method: 'DELETE' })
      setKeys(keys.filter((k) => k.id !== id))
    } catch (error) {
      console.error('Failed to delete key:', error)
    }
  }

  const copyKey = (key: string, id: string) => {
    navigator.clipboard.writeText(key)
    setCopiedId(id)
    setTimeout(() => setCopiedId(null), 2000)
  }

  const formatDate = (date: string | null) => {
    if (!date) return 'Never'
    return new Date(date).toLocaleDateString()
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
              <a href="/dashboard">Dashboard</a>
            </Button>
            <Button variant="outline">Sign Out</Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container py-8 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold">API Keys</h1>
            <p className="text-muted-foreground mt-2">
              Manage API keys for accessing your workspace programmatically
            </p>
          </div>

          {/* Create New Key */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Create New API Key</CardTitle>
              <CardDescription>
                Generate a new API key to access your workspace API
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex gap-4">
                <div className="flex-1">
                  <Label htmlFor="keyName">Key Name</Label>
                  <Input
                    id="keyName"
                    placeholder="e.g., Production API"
                    value={newKeyName}
                    onChange={(e) => setNewKeyName(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && createKey()}
                  />
                </div>
                <div className="flex items-end">
                  <Button onClick={createKey} disabled={isLoading || !newKeyName.trim()}>
                    <Plus className="w-4 h-4 mr-2" />
                    Create Key
                  </Button>
                </div>
              </div>

              {/* Show newly created key */}
              {newlyCreatedKey && (
                <div className="mt-4 p-4 bg-yellow-500/10 border border-yellow-500/50 rounded-lg">
                  <p className="font-medium text-yellow-500 mb-2">
                    ⚠️ Copy your API key now - you won&apos;t see it again!
                  </p>
                  <div className="flex gap-2">
                    <code className="flex-1 p-2 bg-background rounded font-mono text-sm">
                      {newlyCreatedKey}
                    </code>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => copyKey(newlyCreatedKey, 'new')}
                    >
                      {copiedId === 'new' ? (
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

          {/* Existing Keys */}
          <Card>
            <CardHeader>
              <CardTitle>Your API Keys</CardTitle>
              <CardDescription>
                {keys.length} API key{keys.length !== 1 ? 's' : ''} active
              </CardDescription>
            </CardHeader>
            <CardContent>
              {keys.length === 0 ? (
                <p className="text-muted-foreground text-center py-8">
                  No API keys yet. Create one above to get started.
                </p>
              ) : (
                <div className="space-y-4">
                  {keys.map((key) => (
                    <div
                      key={key.id}
                      className="flex items-center justify-between p-4 border rounded-lg"
                    >
                      <div>
                        <p className="font-medium">{key.name}</p>
                        <p className="text-sm text-muted-foreground font-mono">
                          {key.prefix}...••••••••••••••
                        </p>
                        <div className="flex gap-4 mt-1 text-xs text-muted-foreground">
                          <span>Created: {formatDate(key.createdAt)}</span>
                          <span>Last used: {formatDate(key.lastUsed)}</span>
                          {key.expiresAt && (
                            <span>Expires: {formatDate(key.expiresAt)}</span>
                          )}
                        </div>
                      </div>
                      <div className="flex gap-2">
                        {key.key && (
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => copyKey(key.key!, key.id)}
                          >
                            {copiedId === key.id ? (
                              <Check className="w-4 h-4" />
                            ) : (
                              <Copy className="w-4 h-4" />
                            )}
                          </Button>
                        )}
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => deleteKey(key.id)}
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
