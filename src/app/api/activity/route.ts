import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

// Activity types with labels
const ACTIVITY_TYPES: Record<string, string> = {
  'user.login': 'User logged in',
  'user.registered': 'User registered',
  'workspace.created': 'Workspace created',
  'api_key.created': 'API key created',
  'api_key.deleted': 'API key deleted',
  'webhook.created': 'Webhook created',
  'webhook.updated': 'Webhook updated',
  'webhook.deleted': 'Webhook deleted',
  'member.invited': 'Member invited',
  'member.joined': 'Member joined',
  'member.removed': 'Member removed',
  'member.role_updated': 'Member role updated',
  'settings.updated': 'Settings updated',
  'profile.updated': 'Profile updated',
}

// GET /api/activity - List activities
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const workspaceId = searchParams.get('workspaceId') || 'default'
    const limit = parseInt(searchParams.get('limit') || '50')
    const type = searchParams.get('type')

    const where: any = { workspaceId }
    if (type) {
      where.type = type
    }

    const activities = await db.activity.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      take: limit,
    })

    // Add labels to activities
    const activitiesWithLabels = activities.map(activity => ({
      ...activity,
      label: ACTIVITY_TYPES[activity.type] || activity.type,
    }))

    return NextResponse.json({ activities: activitiesWithLabels })
  } catch (error) {
    console.error('Error fetching activities:', error)
    return NextResponse.json({ error: 'Failed to fetch activities' }, { status: 500 })
  }
}

// POST /api/activity - Create activity
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { type, description, metadata, workspaceId } = body

    if (!type || !description || !workspaceId) {
      return NextResponse.json(
        { error: 'Type, description, and workspace ID are required' },
        { status: 400 }
      )
    }

    const activity = await db.activity.create({
      data: {
        type,
        description,
        metadata: metadata || {},
        workspaceId,
      },
    })

    return NextResponse.json({ activity })
  } catch (error) {
    console.error('Error creating activity:', error)
    return NextResponse.json({ error: 'Failed to create activity' }, { status: 500 })
  }
}
