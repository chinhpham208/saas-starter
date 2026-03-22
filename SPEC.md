# SaaS Starter Kit - Specification

## Overview

Production-ready SaaS starter template for quickly building SaaS applications. Includes authentication, database, payments, and multi-tenancy.

## Goals

- Full-stack production-ready codebase
- Modern best practices
- Easy to customize and extend
- Impressive GitHub portfolio piece

## Tech Stack

| Layer | Tech |
|-------|------|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS + shadcn/ui |
| Database | PostgreSQL + Prisma |
| Auth | NextAuth.js v5 |
| Payments | Stripe |
| Email | Resend |
| State | Zustand |

## Core Features

### 1. Authentication
- [ ] Email/Password login
- [ ] Register with verification
- [ ] OAuth (Google, GitHub)
- [ ] Password reset
- [ ] Session management

### 2. Database Schema
- [ ] Users
- [ ] Accounts (OAuth)
- [ ] Sessions
- [ ] Workspaces (multi-tenant)
- [ ] API Keys

### 3. Multi-tenancy
- [ ] Workspace creation
- [ ] Team member invitation
- [ ] Role-based access (Owner, Admin, Member)
- [ ] Workspace settings

### 4. Dashboard
- [ ] Overview stats
- [ ] Settings page
- [ ] Profile management

### 5. Landing Page
- [ ] Hero section
- [ ] Features showcase
- [ ] Pricing section
- [ ] CTA

### 6. API
- [ ] REST API routes
- [ ] API key management
- [ ] Webhook support

## File Structure

```
/src
├── app/
│   ├── (auth)/           # Auth routes
│   │   ├── login/
│   │   ├── register/
│   │   └── verify-email/
│   ├── (dashboard)/      # Protected routes
│   │   ├── settings/
│   │   ├── billing/
│   │   └── workspace/
│   ├── api/              # API routes
│   │   ├── auth/
│   │   ├── webhooks/
│   │   └── v1/
│   └── page.tsx         # Landing page
├── components/
│   ├── ui/              # shadcn components
│   ├── auth/            # Auth components
│   └── dashboard/       # Dashboard components
├── lib/
│   ├── auth.ts          # Auth config
│   ├── db.ts            # Prisma client
│   ├── stripe.ts        # Stripe config
│   └── utils.ts         # Utilities
├── actions/            # Server actions
└── types/               # TypeScript types
```

## UI/UX

### Design System
- Dark mode support
- Responsive (mobile, tablet, desktop)
- Accessible (WCAG)
- Consistent spacing (4px base)

### Color Scheme
- Primary: Blue (#0EA5E9)
- Background: Slate (#020617)
- Text: White/Gray
- Accent: Indigo

### Components
- Button (primary, secondary, ghost)
- Input, Textarea
- Card
- Modal/Dialog
- Dropdown Menu
- Avatar
- Badge

## Acceptance Criteria

1. ✅ User can register and login
2. ✅ User can create workspace
3. ✅ User can invite team members
4. ✅ Landing page displays properly
5. ✅ Dashboard shows workspace info
6. ✅ Build passes without errors
7. ✅ TypeScript strict mode passes
8. ✅ Lint passes

## Out of Scope (v1)

- Stripe payments (setup ready, not activated)
- Email sending (setup ready)
- Real API key usage

## Future Versions

- v2: Stripe payments
- v3: Email templates
- v4: More OAuth providers
