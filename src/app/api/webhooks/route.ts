import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { randomBytes } from 'crypto'

// Available webhook events
const WEBHOOK_EVENTS = [
  { id: 'user.created', name: 'User Created', description: 'Triggered when a new user registers' },
  { id: 'user.updated', name: 'User Updated', description: 'Triggered when user profile is updated' },
  { id: 'workspace.created', name: 'Workspace Created', description: 'Triggered when a new workspace is created' },
  { id: 'workspace.member_added', name: 'Member Added', description: 'Triggered when a new member joins' },
  { id: 'api_key.created', name: 'API Key Created', description: 'Triggered when an API key is generated' },
  { id: 'api_key.revoked', name: 'API Key Revoked', description: 'Triggered when an API key is deleted' },
]

// GET /api/webhooks - List webhooks or get available events
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const workspaceId = searchParams.get('workspaceId')
    const events = searchParams.get('events')

    // Return available events
    if (events === 'true') {
      return NextResponse.json({ events: WEBHOOK_EVENTS })
    }

    if (!workspaceId) {
      return NextResponse.json({ error: 'Workspace ID required' }, { status: 400 })
    }

    const webhooks = await db.webhook.findMany({
      where: { workspaceId },
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json({ webhooks })
  } catch (error) {
    console.error('Error fetching webhooks:', error)
    return NextResponse.json({ error: 'Failed to fetch webhooks' }, { status: 500 })
  }
}

// POST /api/webhooks - Create new webhook
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { name, url, events, workspaceId } = body

    if (!name || !url || !events?.length || !workspaceId) {
      return NextResponse.json(
        { error: 'Name, URL, events, and workspace ID are required' },
        { status: 400 }
      )
    }

    // Validate URL
    try {
      new URL(url)
    } catch {
      return NextResponse.json({ error: 'Invalid URL format' }, { status: 400 })
    }

    // Generate secret
    const secret = randomBytes(32).toString('hex')

    const webhook = await db.webhook.create({
      data: {
        name,
        url,
        events,
        secret,
        workspaceId,
      },
    })

    // Return secret only once
    return NextResponse.json({
      webhook: {
        id: webhook.id,
        name: webhook.name,
        url: webhook.url,
        events: webhook.events,
        isActive: webhook.isActive,
        secret: webhook.secret, // Only returned once!
        createdAt: webhook.createdAt,
      },
    })
  } catch (error) {
    console.error('Error creating webhook:', error)
    return NextResponse.json({ error: 'Failed to create webhook' }, { status: 500 })
  }
}

// DELETE /api/webhooks - Delete webhook
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const webhookId = searchParams.get('id')

    if (!webhookId) {
      return NextResponse.json({ error: 'Webhook ID required' }, { status: 400 })
    }

    await db.webhook.delete({
      where: { id: webhookId },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting webhook:', error)
    return NextResponse.json({ error: 'Failed to delete webhook' }, { status: 500 })
  }
}

// PATCH /api/webhooks - Toggle webhook active status
export async function PATCH(request: Request) {
  try {
    const body = await request.json()
    const { id, isActive } = body

    if (!id || isActive === undefined) {
      return NextResponse.json({ error: 'ID and isActive are required' }, { status: 400 })
    }

    const webhook = await db.webhook.update({
      where: { id },
      data: { isActive },
    })

    return NextResponse.json({ webhook })
  } catch (error) {
    console.error('Error updating webhook:', error)
    return NextResponse.json({ error: 'Failed to update webhook' }, { status: 500 })
  }
}
