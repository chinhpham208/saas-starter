'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Users, UserPlus, Trash2, Mail, Crown, Shield, User, Copy, Check, Clock } from 'lucide-react'

interface Member {
  id: string
  role: string
  user: {
    id: string
    name: string | null
    email: string | null
    image: string | null
  }
}

interface Invitation {
  id: string
  email: string
  role: string
  expires: string
}

const ROLES = [
  { id: 'OWNER', name: 'Owner', description: 'Full access to all features', icon: Crown },
  { id: 'ADMIN', name: 'Admin', description: 'Manage members and settings', icon: Shield },
  { id: 'MEMBER', name: 'Member', description: 'Access workspace content', icon: User },
]

export default function TeamPage() {
  const [members, setMembers] = useState<Member[]>([])
  const [invitations, setInvitations] = useState<Invitation[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [newMember, setNewMember] = useState({ email: '', role: 'MEMBER' })
  const [copiedId, setCopiedId] = useState<string | null>(null)

  const fetchTeam = async () => {
    try {
      const res = await fetch('/api/team?workspaceId=default')
      const data = await res.json()
      setMembers(data.members || [])
      setInvitations(data.invitations || [])
    } catch (error) {
      console.error('Failed to fetch team:', error)
    }
  }

  useEffect(() => {
    fetchTeam()
  }, [])

  const inviteMember = async () => {
    if (!newMember.email.trim()) return

    setIsLoading(true)
    try {
      const res = await fetch('/api/team', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: newMember.email,
          role: newMember.role,
          workspaceId: 'default',
        }),
      })
      const data = await res.json()

      if (data.invitation) {
        setInvitations([data.invitation, ...invitations])
        setNewMember({ email: '', role: 'MEMBER' })
      } else if (data.error) {
        alert(data.error)
      }
    } catch (error) {
      console.error('Failed to invite member:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const removeMember = async (memberId: string) => {
    try {
      await fetch(`/api/team?memberId=${memberId}`, { method: 'DELETE' })
      setMembers(members.filter((m) => m.id !== memberId))
    } catch (error) {
      console.error('Failed to remove member:', error)
    }
  }

  const cancelInvitation = async (invitationId: string) => {
    try {
      await fetch(`/api/team?invitationId=${invitationId}`, { method: 'DELETE' })
      setInvitations(invitations.filter((i) => i.id !== invitationId))
    } catch (error) {
      console.error('Failed to cancel invitation:', error)
    }
  }

  const updateRole = async (memberId: string, role: string) => {
    try {
      await fetch('/api/team', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ memberId, role }),
      })
      setMembers(members.map((m) => (m.id === memberId ? { ...m, role } : m)))
    } catch (error) {
      console.error('Failed to update role:', error)
    }
  }

  const getRoleIcon = (role: string) => {
    const r = ROLES.find((r) => r.id === role)
    const Icon = r?.icon || User
    return <Icon className="w-4 h-4" />
  }

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'OWNER':
        return 'text-yellow-500'
      case 'ADMIN':
        return 'text-blue-500'
      default:
        return 'text-gray-500'
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
              <Link href="/dashboard/keys">API Keys</Link>
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
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold flex items-center gap-2">
              <Users className="w-8 h-8" />
              Team Members
            </h1>
            <p className="text-muted-foreground mt-2">
              Invite team members and manage their access to your workspace
            </p>
          </div>

          {/* Invite Member */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <UserPlus className="w-5 h-5" />
                Invite Member
              </CardTitle>
              <CardDescription>
                Send an invitation to join your workspace
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex gap-4">
                <div className="flex-1">
                  <Label htmlFor="memberEmail">Email Address</Label>
                  <Input
                    id="memberEmail"
                    type="email"
                    placeholder="colleague@example.com"
                    value={newMember.email}
                    onChange={(e) => setNewMember({ ...newMember, email: e.target.value })}
                    onKeyDown={(e) => e.key === 'Enter' && inviteMember()}
                  />
                </div>
                <div className="w-48">
                  <Label>Role</Label>
                  <Select
                    value={newMember.role}
                    onValueChange={(value) => setNewMember({ ...newMember, role: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {ROLES.filter(r => r.id !== 'OWNER').map((role) => (
                        <SelectItem key={role.id} value={role.id}>
                          <div className="flex items-center gap-2">
                            {getRoleIcon(role.id)}
                            {role.name}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-end">
                  <Button onClick={inviteMember} disabled={isLoading || !newMember.email.trim()}>
                    Send Invite
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Pending Invitations */}
          {invitations.length > 0 && (
            <Card className="mb-8">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Mail className="w-5 h-5" />
                  Pending Invitations
                </CardTitle>
                <CardDescription>
                  {invitations.length} invitation{invitations.length !== 1 ? 's' : ''} waiting for response
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {invitations.map((invitation) => (
                    <div
                      key={invitation.id}
                      className="flex items-center justify-between p-4 border rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center">
                          <Mail className="w-5 h-5 text-muted-foreground" />
                        </div>
                        <div>
                          <p className="font-medium">{invitation.email}</p>
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <Clock className="w-3 h-3" />
                            Expires {new Date(invitation.expires).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-1 text-xs rounded ${getRoleColor(invitation.role)} bg-muted`}>
                          {invitation.role}
                        </span>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => cancelInvitation(invitation.id)}
                        >
                          <Trash2 className="w-4 h-4 text-destructive" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Current Members */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5" />
                Current Members
              </CardTitle>
              <CardDescription>
                {members.length} member{members.length !== 1 ? 's' : ''} in your workspace
              </CardDescription>
            </CardHeader>
            <CardContent>
              {members.length === 0 ? (
                <p className="text-muted-foreground text-center py-8">
                  No members yet. Invite someone above to get started.
                </p>
              ) : (
                <div className="space-y-4">
                  {members.map((member) => (
                    <div
                      key={member.id}
                      className="flex items-center justify-between p-4 border rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                          {member.user.image ? (
                            <img
                              src={member.user.image}
                              alt={member.user.name || ''}
                              className="h-10 w-10 rounded-full"
                            />
                          ) : (
                            <span className="text-primary font-medium">
                              {(member.user.name || member.user.email || '?').charAt(0).toUpperCase()}
                            </span>
                          )}
                        </div>
                        <div>
                          <p className="font-medium">{member.user.name || 'Unnamed User'}</p>
                          <p className="text-sm text-muted-foreground">{member.user.email}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Select
                          value={member.role}
                          onValueChange={(value) => updateRole(member.id, value)}
                          disabled={member.role === 'OWNER'}
                        >
                          <SelectTrigger className={`w-32 ${getRoleColor(member.role)}`}>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {ROLES.map((role) => (
                              <SelectItem key={role.id} value={role.id}>
                                <div className="flex items-center gap-2">
                                  {getRoleIcon(role.id)}
                                  {role.name}
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        {member.role !== 'OWNER' && (
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => removeMember(member.id)}
                          >
                            <Trash2 className="w-4 h-4 text-destructive" />
                          </Button>
                        )}
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
