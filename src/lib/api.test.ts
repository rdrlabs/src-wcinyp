import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { 
  submitForm, 
  getDocumentStats, 
  useFormSubmission,
  type FormSubmissionData 
} from './api'

// Mock fetch globally
const mockFetch = vi.fn()
global.fetch = mockFetch

describe('API Functions', () => {
  beforeEach(() => {
    mockFetch.mockClear()
  })

  describe('submitForm', () => {
    const mockFormData: FormSubmissionData = {
      formType: 'self-pay',
      patientName: 'John Doe',
      email: 'john@example.com',
      phone: '555-1234',
      data: {
        insurance: 'none',
        amount: 100
      }
    }

    it('submits form data successfully', async () => {
      const mockResponse = {
        success: true,
        message: 'Form submitted successfully',
        submissionId: '123',
        data: {
          ...mockFormData,
          submittedAt: '2025-07-04T10:00:00Z'
        }
      }

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse
      })

      const result = await submitForm(mockFormData)

      expect(mockFetch).toHaveBeenCalledWith('/.netlify/functions/submit-form', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(mockFormData),
      })

      expect(result).toEqual(mockResponse)
    })

    it('throws error when response is not ok', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        json: async () => ({ message: 'Invalid form data' })
      })

      await expect(submitForm(mockFormData)).rejects.toThrow('Invalid form data')
    })

    it('throws generic error when no error message provided', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        json: async () => ({})
      })

      await expect(submitForm(mockFormData)).rejects.toThrow('Form submission failed')
    })
  })

  describe('getDocumentStats', () => {
    it('fetches document stats without category', async () => {
      const mockResponse = {
        categories: { 'financial': 10, 'clinical': 20 },
        totalDocuments: 30,
        timestamp: '2025-07-04T10:00:00Z'
      }

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse
      })

      const result = await getDocumentStats()

      expect(mockFetch).toHaveBeenCalledWith('/.netlify/functions/get-documents?')
      expect(result).toEqual(mockResponse)
    })

    it('fetches document stats with category filter', async () => {
      const mockResponse = {
        categories: { 'financial': 10 },
        totalDocuments: 10,
        timestamp: '2025-07-04T10:00:00Z',
        filteredCount: 10
      }

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse
      })

      const result = await getDocumentStats('financial')

      expect(mockFetch).toHaveBeenCalledWith('/.netlify/functions/get-documents?category=financial')
      expect(result).toEqual(mockResponse)
    })

    it('throws error when fetch fails', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false
      })

      await expect(getDocumentStats()).rejects.toThrow('Failed to fetch document stats')
    })
  })

  describe('useFormSubmission hook', () => {
    beforeEach(() => {
      vi.clearAllMocks()
    })

    it('initializes with correct default state', () => {
      const { result } = renderHook(() => useFormSubmission())

      expect(result.current.isSubmitting).toBe(false)
      expect(result.current.error).toBe(null)
      expect(typeof result.current.submit).toBe('function')
    })

    it('handles successful submission', async () => {
      const mockResponse = {
        success: true,
        message: 'Success',
        submissionId: '123',
        data: {
          formType: 'test',
          patientName: 'John',
          submittedAt: '2025-07-04T10:00:00Z',
          data: {}
        }
      }

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse
      })

      const { result } = renderHook(() => useFormSubmission())

      let submissionResult: { success: boolean; id?: string } | undefined

      await act(async () => {
        submissionResult = await result.current.submit({
          formType: 'test',
          patientName: 'John',
          data: {}
        })
      })

      expect(submissionResult).toEqual(mockResponse)
      expect(result.current.isSubmitting).toBe(false)
      expect(result.current.error).toBe(null)
    })

    it('handles submission error', async () => {
      const errorMessage = 'Network error'
      mockFetch.mockRejectedValueOnce(new Error(errorMessage))

      const { result } = renderHook(() => useFormSubmission())

      await act(async () => {
        try {
          await result.current.submit({
            formType: 'test',
            patientName: 'John',
            data: {}
          })
        } catch (error) {
          // Expected error
        }
      })

      expect(result.current.isSubmitting).toBe(false)
      expect(result.current.error).toBe(errorMessage)
    })

    it('sets isSubmitting during submission', async () => {
      let resolvePromise: (value: { success: boolean; id: string }) => void
      const promise = new Promise(resolve => {
        resolvePromise = resolve
      })

      mockFetch.mockReturnValueOnce({
        ok: true,
        json: () => promise
      })

      const { result } = renderHook(() => useFormSubmission())

      act(() => {
        result.current.submit({
          formType: 'test',
          patientName: 'John',
          data: {}
        })
      })

      // Should be submitting
      expect(result.current.isSubmitting).toBe(true)

      // Resolve the promise
      await act(async () => {
        resolvePromise!({ 
          success: true, 
          message: 'Done',
          submissionId: '123',
          data: {
            formType: 'test',
            patientName: 'John',
            submittedAt: '2025-07-04T10:00:00Z',
            data: {}
          }
        })
        await promise
      })

      // Should no longer be submitting
      expect(result.current.isSubmitting).toBe(false)
    })

    it('handles non-Error exceptions', async () => {
      mockFetch.mockRejectedValueOnce('String error')

      const { result } = renderHook(() => useFormSubmission())

      await act(async () => {
        try {
          await result.current.submit({
            formType: 'test',
            patientName: 'John',
            data: {}
          })
        } catch (error) {
          // Expected error
        }
      })

      expect(result.current.error).toBe('Submission failed')
    })
  })
})