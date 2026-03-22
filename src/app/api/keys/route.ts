import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

// Helper to generate random API key
function generateApiKey(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  let key = 'sk_'
  for (let i = 0; i < 32; i++) {
    key += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return key
}

function getKeyPrefix(key: string): string {
  return key.substring(0, 10)
}

// GET /api/keys - List all API keys for workspace
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const workspaceId = searchParams.get('workspaceId')

    if (!workspaceId) {
      return NextResponse.json({ error: 'Workspace ID required' }, { status: 400 })
    }

    const keys = await db.apiKey.findMany({
      where: { workspaceId },
      select: {
        id: true,
        name: true,
        prefix: true,
        lastUsed: true,
        expiresAt: true,
        createdAt: true,
      },
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json({ keys })
  } catch (error) {
    console.error('Error fetching API keys:', error)
    return NextResponse.json({ error: 'Failed to fetch API keys' }, { status: 500 })
  }
}

// POST /api/keys - Create new API key
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { name, workspaceId, expiresIn } = body

    if (!name || !workspaceId) {
      return NextResponse.json({ error: 'Name and workspace ID required' }, { status: 400 })
    }

    const key = generateApiKey()
    const prefix = getKeyPrefix(key)

    const expiresAt = expiresIn
      ? new Date(Date.now() + expiresIn * 1000)
      : null

    const apiKey = await db.apiKey.create({
      data: {
        name,
        key,
        prefix,
        workspaceId,
        expiresAt,
      },
    })

    // Return full key only once
    return NextResponse.json({
      key: {
        id: apiKey.id,
        name: apiKey.name,
        key: apiKey.key, // Only returned once!
        prefix: apiKey.prefix,
        expiresAt: apiKey.expiresAt,
        createdAt: apiKey.createdAt,
      },
    })
  } catch (error) {
    console.error('Error creating API key:', error)
    return NextResponse.json({ error: 'Failed to create API key' }, { status: 500 })
  }
}

// DELETE /api/keys - Delete API key
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const keyId = searchParams.get('id')

    if (!keyId) {
      return NextResponse.json({ error: 'Key ID required' }, { status: 400 })
    }

    await db.apiKey.delete({
      where: { id: keyId },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting API key:', error)
    return NextResponse.json({ error: 'Failed to delete API key' }, { status: 500 })
  }
}
