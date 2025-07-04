// API client for Netlify Functions

const API_BASE = '/.netlify/functions'

export interface FormSubmissionData {
  formType: string
  patientName: string
  email?: string
  phone?: string
  data: Record<string, any>
}

export interface FormSubmissionResponse {
  success: boolean
  message: string
  submissionId: string
  data: FormSubmissionData & { submittedAt: string }
}

export async function submitForm(data: FormSubmissionData): Promise<FormSubmissionResponse> {
  const response = await fetch(`${API_BASE}/submit-form`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.message || 'Form submission failed')
  }

  return response.json()
}

export interface DocumentsResponse {
  categories: Record<string, number>
  totalDocuments: number
  timestamp: string
  filteredCount?: number
}

export async function getDocumentStats(category?: string): Promise<DocumentsResponse> {
  const params = new URLSearchParams()
  if (category) params.set('category', category)

  const response = await fetch(`${API_BASE}/get-documents?${params}`)
  
  if (!response.ok) {
    throw new Error('Failed to fetch document stats')
  }

  return response.json()
}

// Hook for form submission with loading state
import { useState } from 'react'

export function useFormSubmission() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const submit = async (data: FormSubmissionData) => {
    setIsSubmitting(true)
    setError(null)
    
    try {
      const result = await submitForm(data)
      return result
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Submission failed'
      setError(message)
      throw err
    } finally {
      setIsSubmitting(false)
    }
  }

  return { submit, isSubmitting, error }
}