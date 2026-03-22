'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import {
  HelpCircle,
  BookOpen,
  MessageCircle,
  Mail,
  FileText,
  ChevronRight,
  Search,
  ExternalLink,
  Zap,
  Shield,
  CreditCard,
  Key,
  Globe,
} from 'lucide-react'

const CATEGORIES = [
  {
    id: 'getting-started',
    name: 'Getting Started',
    icon: Zap,
    articles: [
      { title: 'Quick Start Guide', description: 'Get up and running in 5 minutes' },
      { title: 'Creating your first workspace', description: 'Learn how to create and manage workspaces' },
      { title: 'Inviting team members', description: 'Add collaborators to your workspace' },
    ],
  },
  {
    id: 'account',
    name: 'Account & Billing',
    icon: CreditCard,
    articles: [
      { title: 'Managing your subscription', description: 'Upgrade, downgrade, or cancel your plan' },
      { title: 'Payment methods', description: 'Add or update your payment information' },
      { title: 'Understanding your invoice', description: 'Read and download your invoices' },
    ],
  },
  {
    id: 'security',
    name: 'Security',
    icon: Shield,
    articles: [
      { title: 'Setting up 2FA', description: 'Add an extra layer of security to your account' },
      { title: 'API key best practices', description: 'How to securely manage your API keys' },
      { title: 'Audit logs', description: 'Understanding security events in your workspace' },
    ],
  },
  {
    id: 'api',
    name: 'API Reference',
    icon: Key,
    articles: [
      { title: 'Authentication', description: 'How to authenticate your API requests' },
      { title: 'Rate limits', description: 'Understanding API rate limits' },
      { title: 'Error handling', description: 'Common errors and how to resolve them' },
    ],
  },
  {
    id: 'integrations',
    name: 'Integrations',
    icon: Globe,
    articles: [
      { title: 'Setting up webhooks', description: 'Receive real-time notifications' },
      { title: 'Custom domains', description: 'Connect your own domain to your workspace' },
      { title: 'Third-party integrations', description: 'Connect with popular tools' },
    ],
  },
]

const FAQS = [
  {
    question: 'How do I reset my password?',
    answer: 'Go to the login page and click "Forgot Password". Enter your email address and we will send you a password reset link.',
  },
  {
    question: 'Can I change my workspace name?',
    answer: 'Yes! Navigate to Settings > General and click on your workspace name to edit it.',
  },
  {
    question: 'How do I cancel my subscription?',
    answer: 'Go to Billing > Subscription and click "Cancel Subscription". Your access will continue until the end of your billing period.',
  },
  {
    question: 'What payment methods do you accept?',
    answer: 'We accept all major credit cards (Visa, Mastercard, American Express) and PayPal.',
  },
  {
    question: 'How do API rate limits work?',
    answer: 'Rate limits vary by plan. Starter: 1,000/month, Pro: 100,000/month, Enterprise: Unlimited. Excess requests will return a 429 status code.',
  },
]

export default function HelpPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null)

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
          {/* Hero */}
          <div className="text-center mb-12">
            <h1 className="text-3xl font-bold flex items-center justify-center gap-2">
              <HelpCircle className="w-8 h-8" />
              Help Center
            </h1>
            <p className="text-muted-foreground mt-2">
              Find answers to common questions and learn how to use SaaS Starter
            </p>
            <div className="mt-6 max-w-xl mx-auto">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search for help..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
          </div>

          {/* Contact Support Banner */}
          <Card className="mb-12 bg-primary text-primary-foreground">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-lg">Still need help?</h3>
                  <p className="text-primary-foreground/80">Our support team is available 24/7</p>
                </div>
                <div className="flex gap-2">
                  <Button variant="secondary">
                    <MessageCircle className="w-4 h-4 mr-2" />
                    Live Chat
                  </Button>
                  <Button variant="outline" className="bg-transparent">
                    <Mail className="w-4 h-4 mr-2" />
                    Email Support
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Categories */}
          <div className="mb-12">
            <h2 className="text-xl font-bold mb-6">Browse by Category</h2>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {CATEGORIES.map((category) => {
                const Icon = category.icon
                return (
                  <Card key={category.id} className="hover:border-primary cursor-pointer transition-colors">
                    <CardHeader className="flex flex-row items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <Icon className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <CardTitle className="text-base">{category.name}</CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        {category.articles.slice(0, 3).map((article, idx) => (
                          <li key={idx}>
                            <a href="#" className="text-sm text-muted-foreground hover:text-primary flex items-center gap-2">
                              <FileText className="w-3 h-3" />
                              {article.title}
                            </a>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </div>

          {/* Popular Articles */}
          <div className="mb-12">
            <h2 className="text-xl font-bold mb-6">Popular Articles</h2>
            <Card>
              <CardContent className="p-0">
                {CATEGORIES[0].articles.map((article, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-4 border-b last:border-0 hover:bg-muted/50 cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <BookOpen className="w-5 h-5 text-muted-foreground" />
                      <div>
                        <p className="font-medium">{article.title}</p>
                        <p className="text-sm text-muted-foreground">{article.description}</p>
                      </div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-muted-foreground" />
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* FAQ */}
          <div>
            <h2 className="text-xl font-bold mb-6">Frequently Asked Questions</h2>
            <div className="space-y-4">
              {FAQS.map((faq, idx) => (
                <Card key={idx}>
                  <CardHeader
                    className="cursor-pointer flex flex-row items-center justify-between"
                    onClick={() => setExpandedFaq(expandedFaq === idx ? null : idx)}
                  >
                    <CardTitle className="text-base">{faq.question}</CardTitle>
                    <ChevronRight className={`w-5 h-5 transition-transform ${expandedFaq === idx ? 'rotate-90' : ''}`} />
                  </CardHeader>
                  {expandedFaq === idx && (
                    <CardContent>
                      <p className="text-muted-foreground">{faq.answer}</p>
                    </CardContent>
                  )}
                </Card>
              ))}
            </div>
          </div>

          {/* Documentation Link */}
          <Card className="mt-12">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <BookOpen className="w-8 h-8 text-primary" />
                  <div>
                    <h3 className="font-bold">API Documentation</h3>
                    <p className="text-sm text-muted-foreground">Complete technical reference for developers</p>
                  </div>
                </div>
                <Button asChild>
                  <Link href="/dashboard/docs">
                    View Docs
                    <ExternalLink className="w-4 h-4 ml-2" />
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
