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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  MailPlus,
  Copy,
  Check,
  Clock,
  X,
  UserPlus,
  RefreshCw,
} from 'lucide-react'

interface Invitation {
  id: string
  email: string
  role: 'ADMIN' | 'MEMBER'
  invitedBy: string
  status: 'pending' | 'accepted' | 'expired'
  sentAt: string
  expiresAt: string
}

const MOCK_INVITATIONS: Invitation[] = [
  {
    id: '1',
    email: 'alice@example.com',
    role: 'MEMBER',
    invitedBy: 'john@example.com',
    status: 'pending',
    sentAt: new Date(Date.now() - 2 * 24 * 3600000).toISOString(),
    expiresAt: new Date(Date.now() + 5 * 24 * 3600000).toISOString(),
  },
  {
    id: '2',
    email: 'bob@example.com',
    role: 'ADMIN',
    invitedBy: 'john@example.com',
    status: 'pending',
    sentAt: new Date(Date.now() - 1 * 24 * 3600000).toISOString(),
    expiresAt: new Date(Date.now() + 6 * 24 * 3600000).toISOString(),
  },
  {
    id: '3',
    email: 'charlie@example.com',
    role: 'MEMBER',
    invitedBy: 'john@example.com',
    status: 'expired',
    sentAt: new Date(Date.now() - 10 * 24 * 3600000).toISOString(),
    expiresAt: new Date(Date.now() - 3 * 24 * 3600000).toISOString(),
  },
]

export default function InvitationsPage() {
  const [invitations, setInvitations] = useState<Invitation[]>(MOCK_INVITATIONS)
  const [isInviteDialogOpen, setIsInviteDialogOpen] = useState(false)
  const [newEmail, setNewEmail] = useState('')
  const [newRole, setNewRole] = useState<'ADMIN' | 'MEMBER'>('MEMBER')
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const pendingInvitations = invitations.filter(i => i.status === 'pending')
  const expiredInvitations = invitations.filter(i => i.status === 'expired')

  const sendInvitation = () => {
    if (!newEmail) return
    const invitation: Invitation = {
      id: Date.now().toString(),
      email: newEmail,
      role: newRole,
      invitedBy: 'john@example.com',
      status: 'pending',
      sentAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 7 * 24 * 3600000).toISOString(),
    }
    setInvitations([invitation, ...invitations])
    setNewEmail('')
    setNewRole('MEMBER')
    setIsInviteDialogOpen(false)
  }

  const resendInvitation = (id: string) => {
    setInvitations(invitations.map(inv =>
      inv.id === id
        ? { ...inv, sentAt: new Date().toISOString(), expiresAt: new Date(Date.now() + 7 * 24 * 3600000).toISOString(), status: 'pending' as const }
        : inv
    ))
  }

  const cancelInvitation = (id: string) => {
    setInvitations(invitations.filter(inv => inv.id !== id))
  }

  const copyLink = (id: string) => {
    const link = `https://app.saas-starter.com/invite/${id}`
    navigator.clipboard.writeText(link)
    setCopiedId(id)
    setTimeout(() => setCopiedId(null), 2000)
  }

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="secondary">Pending</Badge>
      case 'accepted':
        return <Badge className="bg-green-500">Accepted</Badge>
      case 'expired':
        return <Badge variant="destructive">Expired</Badge>
      default:
        return <Badge>{status}</Badge>
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
                <MailPlus className="w-8 h-8" />
                Invitations
              </h1>
              <p className="text-muted-foreground mt-2">
                Manage pending workspace invitations
              </p>
            </div>
            <Dialog open={isInviteDialogOpen} onOpenChange={setIsInviteDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <UserPlus className="w-4 h-4 mr-2" />
                  Send Invitation
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Invite Team Member</DialogTitle>
                  <DialogDescription>
                    Send an invitation to join your workspace.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 pt-4">
                  <div>
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="colleague@example.com"
                      value={newEmail}
                      onChange={(e) => setNewEmail(e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="role">Role</Label>
                    <Select value={newRole} onValueChange={(v) => setNewRole(v as 'ADMIN' | 'MEMBER')}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select role" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="ADMIN">Admin</SelectItem>
                        <SelectItem value="MEMBER">Member</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <Button onClick={sendInvitation} className="w-full">
                    Send Invitation
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          {/* Stats */}
          <div className="grid gap-4 md:grid-cols-3 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Sent</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{invitations.length}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Pending</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-yellow-500">{pendingInvitations.length}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Expired</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-500">{expiredInvitations.length}</div>
              </CardContent>
            </Card>
          </div>

          {/* Pending Invitations */}
          {pendingInvitations.length > 0 && (
            <Card className="mb-8">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="w-5 h-5" />
                  Pending Invitations
                </CardTitle>
                <CardDescription>
                  {pendingInvitations.length} invitation{pendingInvitations.length !== 1 ? 's' : ''} waiting for response
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {pendingInvitations.map((invitation) => (
                    <div
                      key={invitation.id}
                      className="flex items-center justify-between p-4 border rounded-lg"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                          <MailPlus className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium">{invitation.email}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge variant="outline">{invitation.role}</Badge>
                            {getStatusBadge(invitation.status)}
                          </div>
                          <p className="text-xs text-muted-foreground mt-1">
                            Sent {formatDate(invitation.sentAt)} • Expires {formatDate(invitation.expiresAt)}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => copyLink(invitation.id)}
                        >
                          {copiedId === invitation.id ? (
                            <Check className="w-4 h-4 mr-2" />
                          ) : (
                            <Copy className="w-4 h-4 mr-2" />
                          )}
                          Copy Link
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => resendInvitation(invitation.id)}
                        >
                          <RefreshCw className="w-4 h-4 mr-2" />
                          Resend
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => cancelInvitation(invitation.id)}
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* All Invitations */}
          <Card>
            <CardHeader>
              <CardTitle>All Invitations</CardTitle>
              <CardDescription>
                Complete history of workspace invitations
              </CardDescription>
            </CardHeader>
            <CardContent>
              {invitations.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <MailPlus className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>No invitations sent yet</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {invitations.map((invitation) => (
                    <div
                      key={invitation.id}
                      className="flex items-center justify-between p-4 border rounded-lg"
                    >
                      <div>
                        <p className="font-medium">{invitation.email}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant="outline">{invitation.role}</Badge>
                          {getStatusBadge(invitation.status)}
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                          Invited by {invitation.invitedBy} • {formatDate(invitation.sentAt)}
                        </p>
                      </div>
                      {invitation.status === 'expired' && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setNewEmail(invitation.email)
                            setNewRole(invitation.role)
                            setIsInviteDialogOpen(true)
                          }}
                        >
                          Re-invite
                        </Button>
                      )}
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
