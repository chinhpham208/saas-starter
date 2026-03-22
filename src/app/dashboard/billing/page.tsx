'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { CreditCard, Check, Zap, Building, Clock, Download, Loader2 } from 'lucide-react'

const PLANS = [
  {
    id: 'starter',
    name: 'Starter',
    price: 0,
    interval: 'forever',
    description: 'Perfect for side projects',
    features: [
      'Up to 3 workspaces',
      '1,000 API calls/month',
      'Basic support',
      'Community access',
    ],
    notIncluded: [
      'Advanced analytics',
      'Priority support',
      'Custom domains',
    ],
  },
  {
    id: 'pro',
    name: 'Pro',
    price: 29,
    interval: 'month',
    description: 'For growing businesses',
    features: [
      'Unlimited workspaces',
      '100,000 API calls/month',
      'Priority support',
      'Advanced analytics',
      'Custom domains',
      'Team training',
    ],
    notIncluded: [],
    popular: true,
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    price: 199,
    interval: 'month',
    description: 'For large organizations',
    features: [
      'Everything in Pro',
      'Unlimited API calls',
      'Dedicated support',
      'SLA guarantee',
      'Custom integrations',
      'On-premise option',
    ],
    notIncluded: [],
  },
]

const CURRENT_PLAN = {
  name: 'Pro',
  price: 29,
  interval: 'month',
  status: 'active',
  nextBilling: 'April 22, 2024',
  usage: {
    apiCalls: 45230,
    apiCallsLimit: 100000,
    workspaces: 12,
    workspacesLimit: 'unlimited',
  },
}

const PAYMENT_METHOD = {
  brand: 'Visa',
  last4: '4242',
  expMonth: 12,
  expYear: 2025,
}

const INVOICES = [
  { id: '1', date: 'March 22, 2024', amount: 29, status: 'paid' },
  { id: '2', date: 'February 22, 2024', amount: 29, status: 'paid' },
  { id: '3', date: 'January 22, 2024', amount: 29, status: 'paid' },
]

export default function BillingPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [selectedPlan, setSelectedPlan] = useState('pro')

  const handleUpgrade = async (planId: string) => {
    setIsLoading(true)
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500))
    setIsLoading(false)
    setSelectedPlan(planId)
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
        <div className="max-w-5xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold flex items-center gap-2">
              <CreditCard className="w-8 h-8" />
              Billing
            </h1>
            <p className="text-muted-foreground mt-2">
              Manage your subscription and billing information
            </p>
          </div>

          <Tabs defaultValue="plans" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="plans">Plans</TabsTrigger>
              <TabsTrigger value="subscription">Subscription</TabsTrigger>
              <TabsTrigger value="payment">Payment Method</TabsTrigger>
            </TabsList>

            {/* Plans Tab */}
            <TabsContent value="plans" className="mt-6">
              <div className="grid gap-6 md:grid-cols-3">
                {PLANS.map((plan) => (
                  <Card key={plan.id} className={plan.popular ? 'border-primary' : ''}>
                    {plan.popular && (
                      <div className="text-center -mt-3">
                        <Badge className="bg-primary">Most Popular</Badge>
                      </div>
                    )}
                    <CardHeader>
                      <CardTitle>{plan.name}</CardTitle>
                      <CardDescription>{plan.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="mb-4">
                        <span className="text-4xl font-bold">${plan.price}</span>
                        {plan.price > 0 && (
                          <span className="text-muted-foreground">/{plan.interval}</span>
                        )}
                      </div>
                      <ul className="space-y-2 mb-6">
                        {plan.features.map((feature) => (
                          <li key={feature} className="flex items-center gap-2 text-sm">
                            <Check className="w-4 h-4 text-green-500" />
                            {feature}
                          </li>
                        ))}
                        {plan.notIncluded.map((feature) => (
                          <li key={feature} className="flex items-center gap-2 text-sm text-muted-foreground">
                            <span className="w-4 h-4" />
                            {feature}
                          </li>
                        ))}
                      </ul>
                      <Button
                        className="w-full"
                        variant={plan.id === selectedPlan ? 'outline' : plan.popular ? 'default' : 'outline'}
                        disabled={plan.id === selectedPlan || isLoading}
                        onClick={() => handleUpgrade(plan.id)}
                      >
                        {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                        {plan.id === selectedPlan ? 'Current Plan' : plan.price === 0 ? 'Get Started' : 'Upgrade'}
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            {/* Subscription Tab */}
            <TabsContent value="subscription" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Current Subscription</CardTitle>
                  <CardDescription>Your active subscription details</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <p className="font-medium flex items-center gap-2">
                        {CURRENT_PLAN.name} Plan
                        <Badge variant="secondary" className="bg-green-500/10 text-green-500">
                          Active
                        </Badge>
                      </p>
                      <p className="text-sm text-muted-foreground">
                        ${CURRENT_PLAN.price}/{CURRENT_PLAN.interval}
                      </p>
                    </div>
                    <Button variant="outline">Change Plan</Button>
                  </div>

                  <div>
                    <h3 className="font-medium mb-3">Usage</h3>
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>API Calls</span>
                          <span className="text-muted-foreground">
                            {CURRENT_PLAN.usage.apiCalls.toLocaleString()} / {CURRENT_PLAN.usage.apiCallsLimit.toLocaleString()}
                          </span>
                        </div>
                        <div className="h-2 bg-muted rounded-full overflow-hidden">
                          <div
                            className="h-full bg-primary"
                            style={{ width: `${(CURRENT_PLAN.usage.apiCalls / CURRENT_PLAN.usage.apiCallsLimit) * 100}%` }}
                          />
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>Workspaces</span>
                          <span className="text-muted-foreground">
                            {CURRENT_PLAN.usage.workspaces} / {CURRENT_PLAN.usage.workspacesLimit}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <Clock className="w-5 h-5 text-muted-foreground" />
                      <div>
                        <p className="font-medium">Next billing date</p>
                        <p className="text-sm text-muted-foreground">{CURRENT_PLAN.nextBilling}</p>
                      </div>
                    </div>
                    <Button variant="outline">Cancel Subscription</Button>
                  </div>
                </CardContent>
              </Card>

              <Card className="mt-6">
                <CardHeader>
                  <CardTitle>Billing History</CardTitle>
                  <CardDescription>Your recent invoices</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {INVOICES.map((invoice) => (
                      <div
                        key={invoice.id}
                        className="flex items-center justify-between p-3 border rounded-lg"
                      >
                        <div>
                          <p className="font-medium">${invoice.amount}.00</p>
                          <p className="text-sm text-muted-foreground">{invoice.date}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant="secondary">{invoice.status}</Badge>
                          <Button variant="ghost" size="sm">
                            <Download className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Payment Method Tab */}
            <TabsContent value="payment" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Payment Method</CardTitle>
                  <CardDescription>Manage your payment information</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between p-4 border rounded-lg mb-6">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-8 bg-gradient-to-r from-blue-600 to-blue-800 rounded flex items-center justify-center">
                        <CreditCard className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <p className="font-medium">{PAYMENT_METHOD.brand} ending in {PAYMENT_METHOD.last4}</p>
                        <p className="text-sm text-muted-foreground">
                          Expires {PAYMENT_METHOD.expMonth}/{PAYMENT_METHOD.expYear}
                        </p>
                      </div>
                    </div>
                    <Badge variant="secondary">Default</Badge>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline">Update Card</Button>
                    <Button variant="ghost" className="text-destructive">Remove</Button>
                  </div>
                </CardContent>
              </Card>

              <Card className="mt-6">
                <CardHeader>
                  <CardTitle>Billing Email</CardTitle>
                  <CardDescription>Where we send your invoices</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">john@example.com</p>
                      <p className="text-sm text-muted-foreground">john@example.com</p>
                    </div>
                    <Button variant="outline">Update</Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  )
}
