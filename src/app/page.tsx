import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  ArrowRight,
  Check,
  Code2,
  Database,
  Lock,
  CreditCard,
  Users,
  Webhook,
  Key,
  Star,
  Github,
  Twitter,
  Heart,
} from 'lucide-react'

const FEATURES = [
  {
    icon: Lock,
    title: 'Authentication',
    description: 'Email/password, Google, GitHub OAuth with NextAuth.js. Secure session management.',
  },
  {
    icon: Database,
    title: 'Database',
    description: 'PostgreSQL with Prisma ORM. Type-safe queries, migrations, and schema.',
  },
  {
    icon: Users,
    title: 'Multi-tenancy',
    description: 'Workspaces, team members, role-based access. Build multi-tenant apps.',
  },
  {
    icon: Key,
    title: 'API Keys',
    description: 'Generate and manage API keys for programmatic access to your platform.',
  },
  {
    icon: Webhook,
    title: 'Webhooks',
    description: 'Receive real-time events. Configure webhooks for external integrations.',
  },
  {
    icon: CreditCard,
    title: 'Payments',
    description: 'Stripe integration ready. Subscriptions, invoices, webhooks.',
  },
]

const TECH_STACK = [
  { name: 'Next.js', icon: '⚡' },
  { name: 'TypeScript', icon: '📘' },
  { name: 'Tailwind', icon: '🎨' },
  { name: 'Prisma', icon: '🗄️' },
  { name: 'PostgreSQL', icon: '🐘' },
  { name: 'NextAuth', icon: '🔐' },
]

const TESTIMONIALS = [
  {
    name: 'Sarah Chen',
    role: 'Founder at StartupX',
    content: 'Launched my SaaS in 2 weeks instead of 3 months. This starter saved me countless hours.',
    avatar: 'SC',
  },
  {
    name: 'Marcus Johnson',
    role: 'CTO at TechCorp',
    content: 'Best SaaS template I have used. Clean code, great documentation, and very extensible.',
    avatar: 'MJ',
  },
  {
    name: 'Emily Davis',
    role: 'Indie Hacker',
    content: 'The multi-tenancy and API key features are exactly what I needed for my product.',
    avatar: 'ED',
  },
]

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
          <nav className="flex items-center gap-6">
            <Link href="#features" className="text-sm text-muted-foreground hover:text-foreground">
              Features
            </Link>
            <Link href="#pricing" className="text-sm text-muted-foreground hover:text-foreground">
              Pricing
            </Link>
            <Link href="#testimonials" className="text-sm text-muted-foreground hover:text-foreground">
              Testimonials
            </Link>
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
          <Badge variant="secondary" className="mb-4">
            v1.0.0 - Production Ready
          </Badge>
          <h1 className="text-4xl font-bold tracking-tight sm:text-6xl">
            Build your SaaS <span className="text-primary">faster</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground">
            Production-ready starter template with authentication, database,
            multi-tenancy, API keys, webhooks, and payments. Focus on your product, not the boilerplate.
          </p>
          <div className="mt-10 flex justify-center gap-4">
            <Link href="/register">
              <Button size="lg" className="gap-2">
                Start Building <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
            <Link href="https://github.com/chinhpham208/saas-starter">
              <Button variant="outline" size="lg" className="gap-2">
                <Github className="w-4 h-4" />
                Star on GitHub
              </Button>
            </Link>
          </div>

          {/* Tech Stack */}
          <div className="mt-12 flex flex-wrap justify-center gap-4">
            {TECH_STACK.map((tech) => (
              <div
                key={tech.name}
                className="flex items-center gap-2 px-4 py-2 rounded-full bg-muted"
              >
                <span>{tech.icon}</span>
                <span className="text-sm font-medium">{tech.name}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-24 bg-muted/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold">Everything you need to ship</h2>
            <p className="mt-4 text-muted-foreground">
              Production-grade features included out of the box
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {FEATURES.map((feature) => (
              <Card key={feature.title}>
                <CardHeader>
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-2">
                    <feature.icon className="w-6 h-6 text-primary" />
                  </div>
                  <CardTitle>{feature.title}</CardTitle>
                  <CardDescription>{feature.description}</CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Code Preview */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold">Clean, production-ready code</h2>
            <p className="mt-4 text-muted-foreground">
              Built with best practices and modern patterns
            </p>
          </div>
          <div className="max-w-3xl mx-auto rounded-xl border bg-card p-6 font-mono text-sm">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-3 h-3 rounded-full bg-red-500" />
              <div className="w-3 h-3 rounded-full bg-yellow-500" />
              <div className="w-3 h-3 rounded-full bg-green-500" />
            </div>
            <pre className="text-muted-foreground">
{`// Create a new workspace
const workspace = await db.workspace.create({
  data: {
    name: "My Company",
    slug: "my-company",
    ownerId: user.id,
  },
});

// Generate API key
const apiKey = await db.apiKey.create({
  data: {
    name: "Production",
    key: generateApiKey(),
    workspaceId: workspace.id,
  },
});

// Invite team members
await db.workspaceMember.createMany({
  data: members.map(email => ({
    email,
    role: "MEMBER",
    workspaceId: workspace.id,
  })),
});`}
            </pre>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-24 bg-muted/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold">Loved by developers</h2>
            <p className="mt-4 text-muted-foreground">
              Join thousands of developers building with SaaS Starter
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-3 max-w-5xl mx-auto">
            {TESTIMONIALS.map((testimonial) => (
              <Card key={testimonial.name}>
                <CardContent className="pt-6">
                  <div className="flex gap-1 mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-yellow-500 text-yellow-500" />
                    ))}
                  </div>
                  <p className="text-muted-foreground mb-4">&ldquo;{testimonial.content}&rdquo;</p>
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <span className="text-sm font-medium">{testimonial.avatar}</span>
                    </div>
                    <div>
                      <p className="font-medium">{testimonial.name}</p>
                      <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold">Simple, transparent pricing</h2>
            <p className="mt-4 text-muted-foreground">
              Use it free for personal projects, pay for commercial
            </p>
          </div>
          <div className="grid gap-6 max-w-4xl mx-auto md:grid-cols-2">
            <Card className="border-primary">
              <CardHeader>
                <CardTitle>MIT License</CardTitle>
                <CardDescription>Free for personal projects</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-4xl font-bold">$0</p>
                <ul className="mt-4 space-y-2 text-sm">
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-green-500" />
                    Full source code
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-green-500" />
                    Personal use
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-green-500" />
                    Community support
                  </li>
                </ul>
                <Button className="w-full mt-6" asChild>
                  <Link href="/register">Get Started</Link>
                </Button>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Commercial</CardTitle>
                <CardDescription>For business use</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-4xl font-bold">$99</p>
                <ul className="mt-4 space-y-2 text-sm">
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-green-500" />
                    Full source code
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-green-500" />
                    Commercial use
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-green-500" />
                    Priority support
                  </li>
                </ul>
                <Button variant="outline" className="w-full mt-6">
                  Contact Sales
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold">Ready to build?</h2>
          <p className="mx-auto mt-4 max-w-xl text-primary-foreground/80">
            Start building your SaaS today. Ship faster with production-ready infrastructure.
          </p>
          <div className="mt-8 flex justify-center gap-4">
            <Button size="lg" variant="secondary" asChild>
              <Link href="/register">Get Started Free</Link>
            </Button>
            <Button size="lg" variant="outline" className="border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary" asChild>
              <Link href="https://github.com/chinhpham208/saas-starter">
                <Github className="w-4 h-4 mr-2" />
                View on GitHub
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="h-6 w-6 rounded bg-primary" />
              <span className="font-bold">SaaS Starter</span>
            </div>
            <div className="flex items-center gap-6 text-sm text-muted-foreground">
              <Link href="#" className="hover:text-foreground">Privacy</Link>
              <Link href="#" className="hover:text-foreground">Terms</Link>
              <Link href="https://github.com/chinhpham208/saas-starter" className="hover:text-foreground">
                <Github className="w-5 h-5" />
              </Link>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span>Made with</span>
              <Heart className="w-4 h-4 text-red-500 fill-red-500" />
              <span>for developers</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
