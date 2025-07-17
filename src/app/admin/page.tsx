'use client'

import React from 'react'
import { useAuth } from '@/contexts/auth-context'
import { Card } from '@/components/ui/card'
import { Users, FileText, Activity, ShieldCheck } from 'lucide-react'
import Link from 'next/link'

export default function AdminDashboard() {
  const { user } = useAuth()

  const stats = [
    {
      title: 'Access Requests',
      value: 'View',
      icon: Users,
      href: '/admin/access-requests',
      description: 'Manage pending user access requests'
    },
    {
      title: 'System Status',
      value: 'Online',
      icon: Activity,
      description: 'All systems operational'
    },
    {
      title: 'Documents',
      value: '147',
      icon: FileText,
      href: '/documents',
      description: 'Total documents in system'
    },
    {
      title: 'Security',
      value: 'Secure',
      icon: ShieldCheck,
      description: 'No security issues detected'
    }
  ]

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Welcome, {user?.email}</h2>
        <p className="text-muted-foreground mt-1">
          Admin dashboard for WCI@NYP system management
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon
          const content = (
            <>
              <div className="flex items-center justify-between">
                <Icon className="h-8 w-8 text-muted-foreground" />
                <span className="text-2xl font-bold">{stat.value}</span>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium">{stat.title}</p>
                <p className="text-xs text-muted-foreground">
                  {stat.description}
                </p>
              </div>
            </>
          )

          if (stat.href) {
            return (
              <Link key={stat.title} href={stat.href}>
                <Card className="p-6 hover:bg-accent transition-colors cursor-pointer">
                  {content}
                </Card>
              </Link>
            )
          }

          return (
            <Card key={stat.title} className="p-6">
              {content}
            </Card>
          )
        })}
      </div>

      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between py-2 border-b">
            <div>
              <p className="text-sm font-medium">New access request</p>
              <p className="text-xs text-muted-foreground">user@example.com requested access</p>
            </div>
            <span className="text-xs text-muted-foreground">5 minutes ago</span>
          </div>
          <div className="flex items-center justify-between py-2 border-b">
            <div>
              <p className="text-sm font-medium">Document uploaded</p>
              <p className="text-xs text-muted-foreground">New policy document added</p>
            </div>
            <span className="text-xs text-muted-foreground">1 hour ago</span>
          </div>
          <div className="flex items-center justify-between py-2">
            <div>
              <p className="text-sm font-medium">System backup completed</p>
              <p className="text-xs text-muted-foreground">Daily backup successful</p>
            </div>
            <span className="text-xs text-muted-foreground">3 hours ago</span>
          </div>
        </div>
      </Card>
    </div>
  )
}