'use client'

import React, { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/auth-context'
import { useDemo } from '@/contexts/demo-context'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Loader2, Mail, ArrowRight, UserPlus } from 'lucide-react'
import { BrandName } from '@/components/brand-name'
import { useRouter } from 'next/navigation'
import { getAuthErrorMessage } from '@/lib/auth-errors'
import { motion } from 'framer-motion'
import { Textarea } from '@/components/ui/textarea'
import { NiivueBrain3DGrid } from '@/components/niivue-brain-3d-grid'
import { logger } from '@/lib/logger'
// import { NiivueBrainGrid } from '@/components/niivue-brain-grid'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

interface AccessRequestForm {
  email: string
  fullName: string
  organization: string
  role: string
  reason: string
}

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [submittedEmail, setSubmittedEmail] = useState('')
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [localError, setLocalError] = useState<string | null>(null)
  const [lastEmailSent, setLastEmailSent] = useState<number>(0)
  const [cooldownSeconds, setCooldownSeconds] = useState(0)
  const [rememberMe, setRememberMe] = useState(false)
  const [showRequestAccess, setShowRequestAccess] = useState(false)
  const [requestSubmitted, setRequestSubmitted] = useState(false)
  const [requestForm, setRequestForm] = useState<AccessRequestForm>({
    email: '',
    fullName: '',
    organization: '',
    role: '',
    reason: ''
  })
  const [requestLoading, setRequestLoading] = useState(false)
  const { signInWithEmail, loading, error: authError, user, isPollingForAuth } = useAuth()
  const { setIsDemoMode } = useDemo()
  const router = useRouter()

  const error = localError || authError

  // Redirect if already authenticated
  useEffect(() => {
    if (user) {
      router.push('/')
    }
  }, [user, router])
  
  // Force dark theme for login page
  useEffect(() => {
    document.documentElement.classList.add('dark')
    document.documentElement.setAttribute('data-theme', 'dark')
    
    return () => {
      // Don't remove dark mode on cleanup - let the app handle theme
    }
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLocalError(null)
    setIsSubmitted(false)

    // Client-side validation
    const emailLower = email.toLowerCase()
    
    // Check if email ends with correct domain
    if (!emailLower.endsWith('@med.cornell.edu')) {
      // Instead of showing error, prompt to request access
      setShowRequestAccess(true)
      setRequestForm(prev => ({ ...prev, email: emailLower }))
      return
    }
    
    // Extract CWID and validate format
    const cwid = emailLower.split('@')[0]
    const cwidRegex = /^[a-z]{3}\d{4}$/
    
    if (!cwidRegex.test(cwid)) {
      setLocalError(getAuthErrorMessage('invalid_cwid'))
      return
    }

    try {
      await signInWithEmail(emailLower, rememberMe)
      setSubmittedEmail(emailLower)
      setIsSubmitted(true)
      setEmail('')
      setLastEmailSent(Date.now())
      startCooldown()
    } catch (err) {
      // Error is already handled in the auth context
      logger.error('Login error', { error: err, context: 'LoginPage' })
    }
  }

  const handleRequestAccess = async (e: React.FormEvent) => {
    e.preventDefault()
    setRequestLoading(true)
    setLocalError(null)

    try {
      // Submit access request through rate-limited endpoint
      const response = await fetch('/.netlify/functions/submit-access-request', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: requestForm.email.toLowerCase(),
          fullName: requestForm.fullName,
          organization: requestForm.organization,
          role: requestForm.role,
          reason: requestForm.reason,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        if (response.status === 429) {
          // Rate limit exceeded
          const retryAfter = data.retryAfter || 60
          throw new Error(`Too many requests. Please try again in ${retryAfter} seconds.`)
        }
        throw new Error(data.error || 'Failed to submit access request')
      }

      setRequestSubmitted(true)
      // Reset form after a delay
      setTimeout(() => {
        setShowRequestAccess(false)
        setRequestSubmitted(false)
        setRequestForm({
          email: '',
          fullName: '',
          organization: '',
          role: '',
          reason: ''
        })
      }, 5000)
    } catch (err: unknown) {
      logger.error('Access request error', { error: err, context: 'LoginPage' })
      setLocalError((err as Error).message || 'Failed to submit access request. Please try again.')
    } finally {
      setRequestLoading(false)
    }
  }

  const startCooldown = () => {
    setCooldownSeconds(60)
    const interval = setInterval(() => {
      setCooldownSeconds((prev) => {
        if (prev <= 1) {
          clearInterval(interval)
          return 0
        }
        return prev - 1
      })
    }, 1000)
  }

  const canResendEmail = () => {
    const elapsed = Date.now() - lastEmailSent
    return elapsed >= 60000 // 60 seconds
  }

  const handleResendEmail = async () => {
    if (!canResendEmail()) {
      setLocalError(`Please wait ${cooldownSeconds} seconds before resending`)
      return
    }

    setLocalError(null)
    try {
      await signInWithEmail(submittedEmail, rememberMe)
      setLastEmailSent(Date.now())
      startCooldown()
    } catch (err) {
      logger.error('Resend error', { error: err, context: 'LoginPage' })
    }
  }

  if (isSubmitted) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <Card className="w-full max-w-md shadow-lg">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 h-12 w-12 rounded-full bg-success/10 dark:bg-success/20 flex items-center justify-center">
              <Mail className="h-6 w-6 text-success" />
            </div>
            <CardTitle>Check your email</CardTitle>
            <CardDescription className="mt-2">
              We&apos;ve sent a login link to <strong>{submittedEmail}</strong>
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Alert>
              <AlertDescription>
                Click the link in your email to sign in. You can open it on any device, including your phone.
                The link will expire in 15 minutes.
              </AlertDescription>
            </Alert>
            
            {isPollingForAuth && (
              <div className="space-y-3">
                <div className="flex items-center justify-center space-x-2 text-sm text-muted-foreground">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Waiting for authentication...</span>
                </div>
                <p className="text-xs text-center text-muted-foreground">
                  Once you click the link on any device, you&apos;ll be signed in here automatically.
                </p>
              </div>
            )}
          </CardContent>
          <CardFooter className="flex flex-col gap-3">
            <Button 
              variant="default" 
              className="w-full"
              onClick={handleResendEmail}
              disabled={!canResendEmail() || loading}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Sending...
                </>
              ) : cooldownSeconds > 0 ? (
                `Resend email (${cooldownSeconds}s)`
              ) : (
                'Resend email'
              )}
            </Button>
            <Button 
              variant="outline" 
              className="w-full"
              onClick={() => {
                setIsSubmitted(false)
                setLocalError(null)
              }}
            >
              Try a different email
            </Button>
          </CardFooter>
        </Card>
        <p className="mt-8 text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} Weill Cornell Imaging at NewYork-Presbyterian
        </p>
      </div>
    )
  }

  return (
    <div className="min-h-screen relative flex items-center justify-center p-4 overflow-hidden bg-black" data-theme="dark">
      {/* 3D Brain visualization background */}
      <NiivueBrain3DGrid />
      {/* Fallback to 2D if 3D fails to load */}
      {/* <NiivueBrainGrid /> */}
      
      {/* Dark overlay with gradient for depth */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/50 to-black/70" />
      
      {/* Main content */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="relative z-10 w-full max-w-md"
      >
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1, duration: 0.5 }}
          className="text-center mb-8"
        >
          <div className="text-2xl font-semibold tracking-tight">
            <BrandName />
          </div>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <Card 
            className="shadow-2xl bg-black/60 text-white"
            style={{
              backdropFilter: 'blur(40px) saturate(150%)',
              WebkitBackdropFilter: 'blur(40px) saturate(150%)'
            }}
          >
            <form onSubmit={handleSubmit}>
              <CardHeader>
                <CardTitle>Sign in to your account</CardTitle>
                <CardDescription>
                  Enter your Weill Cornell email to receive a login link
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {error && (
                  <Alert variant="destructive">
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}
                
                <div className="space-y-2">
                  <Label htmlFor="email">Email address</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="abc1234@med.cornell.edu"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    disabled={loading}
                    className="lowercase"
                    autoComplete="email"
                  />
                </div>
                
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="remember"
                    className="rounded border-muted"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                  />
                  <Label htmlFor="remember" className="text-sm font-normal cursor-pointer">
                    Remember me for 30 days
                  </Label>
                </div>
              </CardContent>
              <CardFooter className="flex flex-col gap-3">
                <Button 
                  type="submit" 
                  className="w-full" 
                  disabled={loading || !email}
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    'Send login link'
                  )}
                </Button>
                
                <div className="relative w-full">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-background px-2 text-muted-foreground">Or</span>
                  </div>
                </div>
                
                {/* Demo Mode Button */}
                <Button 
                  type="button"
                  variant="outline"
                  className="w-full"
                  onClick={() => setIsDemoMode(true)}
                  disabled={loading}
                >
                  <ArrowRight className="mr-2 h-4 w-4" />
                  Continue with Demo Mode
                </Button>
                
                {/* Request Access Button */}
                <Button 
                  type="button"
                  variant="ghost"
                  className="w-full"
                  onClick={() => setShowRequestAccess(true)}
                  disabled={loading}
                >
                  <UserPlus className="mr-2 h-4 w-4" />
                  Request Access
                </Button>
              </CardFooter>
            </form>
          </Card>
        </motion.div>
        
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="mt-8 text-center text-xs text-muted-foreground"
        >
          © {new Date().getFullYear()} Weill Cornell Imaging at NewYork-Presbyterian
        </motion.p>
      </motion.div>

      {/* Request Access Dialog */}
      <Dialog open={showRequestAccess} onOpenChange={setShowRequestAccess}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Request Access</DialogTitle>
            <DialogDescription>
              Submit a request to access the WCI@NYP application. Your request will be reviewed by our administrators.
            </DialogDescription>
          </DialogHeader>
          
          {requestSubmitted ? (
            <div className="py-8 text-center">
              <div className="mx-auto mb-4 h-12 w-12 rounded-full bg-success/10 dark:bg-success/20 flex items-center justify-center">
                <Mail className="h-6 w-6 text-success" />
              </div>
              <h3 className="text-lg font-medium mb-2">Request Submitted</h3>
              <p className="text-sm text-muted-foreground">
                We&apos;ll review your request and send you an email once it&apos;s approved.
              </p>
            </div>
          ) : (
            <form onSubmit={handleRequestAccess}>
              <div className="grid gap-4 py-4">
                {localError && (
                  <Alert variant="destructive">
                    <AlertDescription>{localError}</AlertDescription>
                  </Alert>
                )}
                
                <div className="grid gap-2">
                  <Label htmlFor="request-email">Email</Label>
                  <Input
                    id="request-email"
                    type="email"
                    value={requestForm.email}
                    onChange={(e) => setRequestForm(prev => ({ ...prev, email: e.target.value }))}
                    placeholder="your.email@example.com"
                    required
                    disabled={requestLoading}
                  />
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="full-name">Full Name</Label>
                  <Input
                    id="full-name"
                    value={requestForm.fullName}
                    onChange={(e) => setRequestForm(prev => ({ ...prev, fullName: e.target.value }))}
                    placeholder="John Doe"
                    required
                    disabled={requestLoading}
                  />
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="organization">Organization</Label>
                  <Input
                    id="organization"
                    value={requestForm.organization}
                    onChange={(e) => setRequestForm(prev => ({ ...prev, organization: e.target.value }))}
                    placeholder="Department or Institution"
                    required
                    disabled={requestLoading}
                  />
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="role">Role</Label>
                  <Input
                    id="role"
                    value={requestForm.role}
                    onChange={(e) => setRequestForm(prev => ({ ...prev, role: e.target.value }))}
                    placeholder="Your position or title"
                    required
                    disabled={requestLoading}
                  />
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="reason">Reason for Access</Label>
                  <Textarea
                    id="reason"
                    value={requestForm.reason}
                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setRequestForm(prev => ({ ...prev, reason: e.target.value }))}
                    placeholder="Please explain why you need access to this application..."
                    rows={3}
                    required
                    disabled={requestLoading}
                  />
                </div>
              </div>
              
              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowRequestAccess(false)}
                  disabled={requestLoading}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={requestLoading}>
                  {requestLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    'Submit Request'
                  )}
                </Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}