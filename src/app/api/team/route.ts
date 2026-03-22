import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { randomBytes } from 'crypto'

// GET /api/team - List team members
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const workspaceId = searchParams.get('workspaceId')

    if (!workspaceId) {
      return NextResponse.json({ error: 'Workspace ID required' }, { status: 400 })
    }

    const members = await db.workspaceMember.findMany({
      where: { workspaceId },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
          },
        },
      },
    })

    // Also get pending invitations
    const invitations = await db.workspaceInvitation.findMany({
      where: { workspaceId },
    })

    return NextResponse.json({ members, invitations })
  } catch (error) {
    console.error('Error fetching team:', error)
    return NextResponse.json({ error: 'Failed to fetch team' }, { status: 500 })
  }
}

// POST /api/team - Invite new member
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { email, role, workspaceId } = body

    if (!email || !role || !workspaceId) {
      return NextResponse.json(
        { error: 'Email, role, and workspace ID are required' },
        { status: 400 }
      )
    }

    // Check if user is already a member
    const existingMember = await db.workspaceMember.findFirst({
      where: {
        workspaceId,
        user: { email },
      },
    })

    if (existingMember) {
      return NextResponse.json(
        { error: 'User is already a member' },
        { status: 400 }
      )
    }

    // Check for pending invitation
    const existingInvitation = await db.workspaceInvitation.findFirst({
      where: {
        workspaceId,
        email,
      },
    })

    if (existingInvitation) {
      return NextResponse.json(
        { error: 'Invitation already sent' },
        { status: 400 }
      )
    }

    // Create invitation token
    const token = randomBytes(32).toString('hex')
    const expires = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days

    const invitation = await db.workspaceInvitation.create({
      data: {
        email,
        role,
        workspaceId,
        token,
        expires,
      },
    })

    return NextResponse.json({
      invitation: {
        id: invitation.id,
        email: invitation.email,
        role: invitation.role,
        expires: invitation.expires,
      },
    })
  } catch (error) {
    console.error('Error inviting member:', error)
    return NextResponse.json({ error: 'Failed to invite member' }, { status: 500 })
  }
}

// DELETE /api/team - Remove member or cancel invitation
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const memberId = searchParams.get('memberId')
    const invitationId = searchParams.get('invitationId')

    if (!memberId && !invitationId) {
      return NextResponse.json(
        { error: 'Member ID or Invitation ID required' },
        { status: 400 }
      )
    }

    if (memberId) {
      await db.workspaceMember.delete({
        where: { id: memberId },
      })
    }

    if (invitationId) {
      await db.workspaceInvitation.delete({
        where: { id: invitationId },
      })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error removing member:', error)
    return NextResponse.json({ error: 'Failed to remove member' }, { status: 500 })
  }
}

// PATCH /api/team - Update member role
export async function PATCH(request: Request) {
  try {
    const body = await request.json()
    const { memberId, role } = body

    if (!memberId || !role) {
      return NextResponse.json(
        { error: 'Member ID and role are required' },
        { status: 400 }
      )
    }

    const member = await db.workspaceMember.update({
      where: { id: memberId },
      data: { role },
    })

    return NextResponse.json({ member })
  } catch (error) {
    console.error('Error updating member:', error)
    return NextResponse.json({ error: 'Failed to update member' }, { status: 500 })
  }
}
