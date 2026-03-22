import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-primary" />
            <span className="text-xl font-bold">SaaS Starter</span>
          </div>
          <nav className="flex items-center gap-4">
            <Link href="/login">
              <Button variant="ghost">Login</Button>
            </Link>
            <Link href="/register">
              <Button>Get Started</Button>
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <section className="py-24 text-center">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold tracking-tight sm:text-6xl">
            Build your SaaS <span className="text-primary">faster</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground">
            Production-ready starter template with authentication, database,
            multi-tenancy, and payments. Focus on your product, not the boilerplate.
          </p>
          <div className="mt-10 flex justify-center gap-4">
            <Link href="/register">
              <Button size="lg">Start Building</Button>
            </Link>
            <Link href="https://github.com">
              <Button variant="outline" size="lg">
                View on GitHub
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-24 bg-muted/50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">
            Everything you need to ship
          </h2>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle>Authentication</CardTitle>
                <CardDescription>Secure auth with NextAuth.js</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Email/password, Google, GitHub OAuth supported. Session management and security best practices built-in.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Multi-tenancy</CardTitle>
                <CardDescription>Workspaces and team management</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Create workspaces, invite team members, role-based access control. Build multi-tenant apps easily.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Database</CardTitle>
                <CardDescription>PostgreSQL with Prisma ORM</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Type-safe database access with Prisma. Schema for users, accounts, sessions, workspaces.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Payments</CardTitle>
                <CardDescription>Stripe integration ready</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Subscription management, webhook handling, invoice generation. Ready for Stripe integration.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Modern Stack</CardTitle>
                <CardDescription>Next.js 14, TypeScript, Tailwind</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  App Router, Server Actions, strict TypeScript, Tailwind CSS. Modern best practices.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>API Ready</CardTitle>
                <CardDescription>REST API with API keys</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Build your public API with API key authentication. Webhook support for external integrations.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">
            Simple, transparent pricing
          </h2>
          <div className="grid gap-6 max-w-4xl mx-auto md:grid-cols-2">
            <Card className="border-primary">
              <CardHeader>
                <CardTitle>MIT License</CardTitle>
                <CardDescription>Free for personal projects</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-4xl font-bold">$0</p>
                <ul className="mt-4 space-y-2 text-sm">
                  <li>✓ Full source code</li>
                  <li>✓ Use for personal projects</li>
                  <li>✓ Community support</li>
                </ul>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Commercial</CardTitle>
                <CardDescription>For commercial use</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-4xl font-bold">$99</p>
                <ul className="mt-4 space-y-2 text-sm">
                  <li>✓ Full source code</li>
                  <li>✓ Use in commercial projects</li>
                  <li>✓ Priority support</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-12">
        <div className="container mx-auto px-4 text-center text-muted-foreground">
          <p>© 2024 SaaS Starter. Built with Next.js and TypeScript.</p>
        </div>
      </footer>
    </div>
  )
}
