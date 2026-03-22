'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  Globe,
  Plus,
  Trash2,
  Copy,
  Check,
  ExternalLink,
  AlertCircle,
  Shield,
} from 'lucide-react'

interface Domain {
  id: string
  name: string
  status: 'pending' | 'verified' | 'active' | 'failed'
  sslStatus: 'pending' | 'active' | 'failed'
  addedAt: string
  verifiedAt?: string
}

const MOCK_DOMAINS: Domain[] = [
  {
    id: '1',
    name: 'app.acmecorp.com',
    status: 'active',
    sslStatus: 'active',
    addedAt: new Date(Date.now() - 30 * 24 * 3600000).toISOString(),
    verifiedAt: new Date(Date.now() - 30 * 24 * 3600000).toISOString(),
  },
  {
    id: '2',
    name: 'portal.acmecorp.com',
    status: 'pending',
    sslStatus: 'pending',
    addedAt: new Date(Date.now() - 2 * 24 * 3600000).toISOString(),
  },
  {
    id: '3',
    name: 'staging.acmecorp.com',
    status: 'failed',
    sslStatus: 'failed',
    addedAt: new Date(Date.now() - 7 * 24 * 3600000).toISOString(),
  },
]

const DNS_INSTRUCTIONS = {
  A: [
    { type: 'A', host: '@', value: '76.76.21.21', proxy: 'Proxied' },
  ],
  CNAME: [
    { type: 'CNAME', host: 'www', value: 'cname.vercel-dns.com', proxy: 'Proxied' },
  ],
}

export default function DomainsPage() {
  const [domains, setDomains] = useState<Domain[]>(MOCK_DOMAINS)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [newDomain, setNewDomain] = useState('')
  const [copiedId, setCopiedId] = useState<string | null>(null)

  const addDomain = () => {
    if (!newDomain) return
    const domain: Domain = {
      id: Date.now().toString(),
      name: newDomain,
      status: 'pending',
      sslStatus: 'pending',
      addedAt: new Date().toISOString(),
    }
    setDomains([...domains, domain])
    setNewDomain('')
    setIsAddDialogOpen(false)
  }

  const deleteDomain = (id: string) => {
    setDomains(domains.filter(d => d.id !== id))
  }

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text)
    setCopiedId(id)
    setTimeout(() => setCopiedId(null), 2000)
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-500">Active</Badge>
      case 'verified':
        return <Badge className="bg-blue-500">Verified</Badge>
      case 'pending':
        return <Badge variant="secondary">Pending</Badge>
      case 'failed':
        return <Badge variant="destructive">Failed</Badge>
      default:
        return <Badge>{status}</Badge>
    }
  }

  const getSslBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-500">SSL Active</Badge>
      case 'pending':
        return <Badge variant="secondary">SSL Pending</Badge>
      case 'failed':
        return <Badge variant="destructive">SSL Failed</Badge>
      default:
        return <Badge>{status}</Badge>
    }
  }

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  }

  const activeDomains = domains.filter(d => d.status === 'active').length

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
                <Globe className="w-8 h-8" />
                Domains
              </h1>
              <p className="text-muted-foreground mt-2">
                Manage custom domains for your workspace
              </p>
            </div>
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Domain
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add Custom Domain</DialogTitle>
                  <DialogDescription>
                    Enter your custom domain to connect it to your workspace.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 pt-4">
                  <div>
                    <Label htmlFor="domain">Domain Name</Label>
                    <Input
                      id="domain"
                      placeholder="example.com"
                      value={newDomain}
                      onChange={(e) => setNewDomain(e.target.value)}
                    />
                  </div>
                  <div className="bg-muted p-4 rounded-lg">
                    <h4 className="font-medium mb-2">DNS Configuration</h4>
                    <p className="text-sm text-muted-foreground mb-3">
                      Add the following DNS records to your domain:
                    </p>
                    <div className="space-y-2 text-sm font-mono">
                      <div className="flex items-center justify-between">
                        <span>A record @ → 76.76.21.21</span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => copyToClipboard('76.76.21.21', 'a-record')}
                        >
                          {copiedId === 'a-record' ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                        </Button>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>CNAME www → cname.vercel-dns.com</span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => copyToClipboard('cname.vercel-dns.com', 'cname-record')}
                        >
                          {copiedId === 'cname-record' ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                        </Button>
                      </div>
                    </div>
                  </div>
                  <Button onClick={addDomain} className="w-full">
                    Add Domain
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          {/* Stats */}
          <div className="grid gap-4 md:grid-cols-3 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Domains</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{domains.length}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-500">{activeDomains}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Pending</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-yellow-500">
                  {domains.filter(d => d.status === 'pending').length}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Domains List */}
          <Card>
            <CardHeader>
              <CardTitle>Your Domains</CardTitle>
              <CardDescription>
                {domains.length} domain{domains.length !== 1 ? 's' : ''} connected to your workspace
              </CardDescription>
            </CardHeader>
            <CardContent>
              {domains.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Globe className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>No domains added yet</p>
                  <Button variant="outline" className="mt-4" onClick={() => setIsAddDialogOpen(true)}>
                    <Plus className="w-4 h-4 mr-2" />
                    Add Your First Domain
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {domains.map((domain) => (
                    <div
                      key={domain.id}
                      className="flex items-center justify-between p-4 border rounded-lg"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                          <Globe className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium">{domain.name}</p>
                          <div className="flex items-center gap-2 mt-1">
                            {getStatusBadge(domain.status)}
                            {getSslBadge(domain.sslStatus)}
                          </div>
                          <p className="text-xs text-muted-foreground mt-1">
                            Added {formatDate(domain.addedAt)}
                            {domain.verifiedAt && ` • Verified ${formatDate(domain.verifiedAt)}`}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {domain.status === 'pending' && (
                          <Button variant="outline" size="sm">
                            Verify
                          </Button>
                        )}
                        {domain.status === 'failed' && (
                          <Button variant="outline" size="sm">
                            <AlertCircle className="w-4 h-4 mr-2" />
                            Fix DNS
                          </Button>
                        )}
                        {domain.status === 'active' && (
                          <Button variant="outline" size="sm">
                            <ExternalLink className="w-4 h-4 mr-2" />
                            Visit
                          </Button>
                        )}
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => deleteDomain(domain.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* DNS Instructions */}
          <Card className="mt-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5" />
                DNS Configuration Guide
              </CardTitle>
              <CardDescription>
                Follow these steps to connect your custom domain
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2">
                <div className="border rounded-lg p-4">
                  <h4 className="font-medium mb-3">For root domains (example.com)</h4>
                  <div className="space-y-3 text-sm">
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Type</span>
                      <span className="font-mono">A</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Host</span>
                      <span className="font-mono">@</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Value</span>
                      <span className="font-mono">76.76.21.21</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Proxy</span>
                      <Badge>Proxied</Badge>
                    </div>
                  </div>
                </div>

                <div className="border rounded-lg p-4">
                  <h4 className="font-medium mb-3">For subdomains (www.example.com)</h4>
                  <div className="space-y-3 text-sm">
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Type</span>
                      <span className="font-mono">CNAME</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Host</span>
                      <span className="font-mono">www</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Value</span>
                      <span className="font-mono">cname.vercel-dns.com</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Proxy</span>
                      <Badge>Proxied</Badge>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-yellow-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-yellow-500">DNS propagation</h4>
                    <p className="text-sm text-muted-foreground mt-1">
                      DNS changes can take up to 48 hours to propagate globally. Use the &quot;Verify&quot; button to check your domain status after adding DNS records.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
