'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { useAuth } from '@/contexts/auth-context'
import { useRouter } from 'next/navigation'
import { getSupabaseClient } from '@/lib/supabase-client'
import { getUserRole, isHardcodedAdmin } from '@/lib/auth-validation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Textarea } from '@/components/ui/textarea'
import { Loader2, Check, X, Clock, Search } from 'lucide-react'
import { format } from 'date-fns'
import { logger } from '@/lib/logger'

interface AccessRequest {
  id: string
  email: string
  full_name: string
  organization: string
  role: string
  reason: string
  status: 'pending' | 'approved' | 'rejected'
  requested_at: string
  reviewed_at?: string
  review_notes?: string
  ip_address?: string
}

interface AccessRequestStats {
  pending_count: number
  approved_count: number
  rejected_count: number
  total_count: number
  last_week_count: number
  last_month_count: number
}

export default function AccessRequestsPage() {
  const { user, loading: authLoading } = useAuth()
  const router = useRouter()
  const supabase = getSupabaseClient()
  
  const [requests, setRequests] = useState<AccessRequest[]>([])
  const [filteredRequests, setFilteredRequests] = useState<AccessRequest[]>([])
  const [stats, setStats] = useState<AccessRequestStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedRequest, setSelectedRequest] = useState<AccessRequest | null>(null)
  const [reviewNotes, setReviewNotes] = useState('')
  const [actionLoading, setActionLoading] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [activeTab, setActiveTab] = useState('pending')
  const [isAdmin, setIsAdmin] = useState(false)

  // Check if user is admin
  useEffect(() => {
    async function checkAdminStatus() {
      if (!user) return
      
      // HARDCODED: Double-check both role and email
      const role = await getUserRole(user.id)
      const isAuthorizedAdmin = isHardcodedAdmin(user.email || '')
      
      if (role !== 'admin' || !isAuthorizedAdmin) {
        logger.securityWarn(`Unauthorized admin access attempt by ${user.email}`)
        router.push('/')
      } else {
        setIsAdmin(true)
      }
    }
    
    if (!authLoading) {
      checkAdminStatus()
    }
  }, [user, authLoading, router])

  const fetchAccessRequests = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      
      const { data, error } = await supabase
        .from('access_requests')
        .select('*')
        .order('requested_at', { ascending: false })

      if (error) throw error
      
      setRequests(data || [])
    } catch (err) {
      logger.error('Error fetching access requests', { error: err, context: 'AdminAccessRequests' })
      setError('Failed to load access requests')
    } finally {
      setLoading(false)
    }
  }, [supabase])

  const fetchStats = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('access_request_stats')
        .select('*')
        .single()

      if (error) throw error
      
      setStats(data)
    } catch (err) {
      logger.error('Error fetching stats', { error: err, context: 'AdminAccessRequests' })
    }
  }, [supabase])

  // Fetch access requests and stats
  useEffect(() => {
    async function fetchData() {
      if (isAdmin) {
        fetchAccessRequests()
        fetchStats()
      }
    }
    fetchData()
  }, [isAdmin, supabase, fetchAccessRequests, fetchStats])

  // Filter requests based on search query
  useEffect(() => {
    const filtered = requests.filter(request => {
      const searchLower = searchQuery.toLowerCase()
      return (
        request.email.toLowerCase().includes(searchLower) ||
        request.full_name.toLowerCase().includes(searchLower) ||
        request.organization.toLowerCase().includes(searchLower) ||
        request.role.toLowerCase().includes(searchLower)
      )
    })
    setFilteredRequests(filtered)
  }, [requests, searchQuery])

  async function handleApprove(request: AccessRequest) {
    setActionLoading(true)
    setError(null)

    try {
      const { error } = await supabase
        .rpc('approve_access_request', {
          request_id: request.id,
          notes: reviewNotes || null
        })

      if (error) throw error

      // Refresh data
      await fetchAccessRequests()
      await fetchStats()
      
      setSelectedRequest(null)
      setReviewNotes('')
    } catch (err) {
      logger.error('Error approving request', { error: err, context: 'AdminAccessRequests' })
      setError('Failed to approve request')
    } finally {
      setActionLoading(false)
    }
  }

  async function handleReject(request: AccessRequest) {
    setActionLoading(true)
    setError(null)

    try {
      const { error } = await supabase
        .rpc('reject_access_request', {
          request_id: request.id,
          notes: reviewNotes || null
        })

      if (error) throw error

      // Refresh data
      await fetchAccessRequests()
      await fetchStats()
      
      setSelectedRequest(null)
      setReviewNotes('')
    } catch (err) {
      logger.error('Error rejecting request', { error: err, context: 'AdminAccessRequests' })
      setError('Failed to reject request')
    } finally {
      setActionLoading(false)
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="default"><Clock className="w-3 h-3 mr-1" />Pending</Badge>
      case 'approved':
        return <Badge variant="outline" className="text-success border-success"><Check className="w-3 h-3 mr-1" />Approved</Badge>
      case 'rejected':
        return <Badge variant="outline" className="text-destructive border-destructive"><X className="w-3 h-3 mr-1" />Rejected</Badge>
      default:
        return null
    }
  }

  const getFilteredRequestsByTab = () => {
    switch (activeTab) {
      case 'pending':
        return filteredRequests.filter(r => r.status === 'pending')
      case 'approved':
        return filteredRequests.filter(r => r.status === 'approved')
      case 'rejected':
        return filteredRequests.filter(r => r.status === 'rejected')
      case 'all':
      default:
        return filteredRequests
    }
  }

  if (authLoading || !isAdmin) {
    return (
      <div className="container mx-auto p-6 flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6 max-w-7xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Access Requests</h1>
        <p className="text-muted-foreground">Manage user access requests for the WCI@NYP application</p>
      </div>

      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Pending</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.pending_count}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Approved</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-success">{stats.approved_count}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Rejected</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-destructive">{stats.rejected_count}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.total_count}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Last Week</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.last_week_count}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Last Month</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.last_month_count}</div>
            </CardContent>
          </Card>
        </div>
      )}

      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Search */}
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by email, name, organization, or role..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="pending" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-6">
          <TabsTrigger value="pending">Pending ({requests.filter(r => r.status === 'pending').length})</TabsTrigger>
          <TabsTrigger value="approved">Approved ({requests.filter(r => r.status === 'approved').length})</TabsTrigger>
          <TabsTrigger value="rejected">Rejected ({requests.filter(r => r.status === 'rejected').length})</TabsTrigger>
          <TabsTrigger value="all">All ({requests.length})</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab}>
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          ) : getFilteredRequestsByTab().length === 0 ? (
            <Card>
              <CardContent className="text-center py-12">
                <p className="text-muted-foreground">No {activeTab === 'all' ? '' : activeTab} requests found</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {getFilteredRequestsByTab().map((request) => (
                <Card key={request.id} className="hover:shadow-lg transition-shadow">
                  <CardContent className="pt-6">
                    <div className="flex items-start justify-between">
                      <div className="space-y-2 flex-1">
                        <div className="flex items-center gap-3">
                          <h3 className="text-lg font-semibold">{request.full_name}</h3>
                          {getStatusBadge(request.status)}
                        </div>
                        <div className="text-sm text-muted-foreground space-y-1">
                          <p><strong>Email:</strong> {request.email}</p>
                          <p><strong>Organization:</strong> {request.organization}</p>
                          <p><strong>Role:</strong> {request.role}</p>
                          <p><strong>Requested:</strong> {format(new Date(request.requested_at), 'PPp')}</p>
                          {request.reviewed_at && (
                            <p><strong>Reviewed:</strong> {format(new Date(request.reviewed_at), 'PPp')}</p>
                          )}
                        </div>
                        <div className="mt-3">
                          <p className="text-sm"><strong>Reason:</strong></p>
                          <p className="text-sm text-muted-foreground mt-1">{request.reason}</p>
                        </div>
                        {request.review_notes && (
                          <div className="mt-3 p-3 bg-muted rounded-md">
                            <p className="text-sm font-medium">Review Notes:</p>
                            <p className="text-sm text-muted-foreground mt-1">{request.review_notes}</p>
                          </div>
                        )}
                      </div>
                      {request.status === 'pending' && (
                        <div className="ml-4 space-x-2">
                          <Button
                            size="sm"
                            onClick={() => setSelectedRequest(request)}
                          >
                            Review
                          </Button>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Review Dialog */}
      <Dialog open={!!selectedRequest} onOpenChange={(open) => !open && setSelectedRequest(null)}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Review Access Request</DialogTitle>
            <DialogDescription>
              Review and take action on this access request from {selectedRequest?.full_name}
            </DialogDescription>
          </DialogHeader>
          
          {selectedRequest && (
            <div className="space-y-4 py-4">
              <div className="space-y-2 text-sm">
                <p><strong>Email:</strong> {selectedRequest.email}</p>
                <p><strong>Organization:</strong> {selectedRequest.organization}</p>
                <p><strong>Role:</strong> {selectedRequest.role}</p>
                <p><strong>Reason:</strong> {selectedRequest.reason}</p>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="review-notes">Review Notes (optional)</Label>
                <Textarea
                  id="review-notes"
                  value={reviewNotes}
                  onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setReviewNotes(e.target.value)}
                  placeholder="Add any notes about this decision..."
                  rows={3}
                />
              </div>
            </div>
          )}
          
          <DialogFooter className="gap-2">
            <Button
              variant="outline"
              onClick={() => setSelectedRequest(null)}
              disabled={actionLoading}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => selectedRequest && handleReject(selectedRequest)}
              disabled={actionLoading}
            >
              {actionLoading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <X className="mr-2 h-4 w-4" />
              )}
              Reject
            </Button>
            <Button
              onClick={() => selectedRequest && handleApprove(selectedRequest)}
              disabled={actionLoading}
            >
              {actionLoading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Check className="mr-2 h-4 w-4" />
              )}
              Approve
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}