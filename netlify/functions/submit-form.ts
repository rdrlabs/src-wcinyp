// Netlify Function types
interface HandlerEvent {
  httpMethod: string;
  body: string | null;
}

interface HandlerContext {
  functionName: string;
}

interface HandlerResponse {
  statusCode: number;
  headers?: Record<string, string>;
  body: string;
}

type Handler = (event: HandlerEvent, context: HandlerContext) => Promise<HandlerResponse>;

interface FormSubmission {
  formType: string
  patientName: string
  email?: string
  phone?: string
  data: Record<string, any>
  submittedAt: string
}

export const handler: Handler = async (event: HandlerEvent, context: HandlerContext) => {
  // Only allow POST
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method Not Allowed' }),
    }
  }

  try {
    // Parse the form data
    const submission: FormSubmission = JSON.parse(event.body || '{}')
    
    // Validate required fields
    if (!submission.formType || !submission.patientName) {
      return {
        statusCode: 400,
        body: JSON.stringify({ 
          error: 'Missing required fields',
          required: ['formType', 'patientName']
        }),
      }
    }

    // Add timestamp
    submission.submittedAt = new Date().toISOString()

    // Here you would typically:
    // 1. Save to database (e.g., Supabase, Airtable)
    // 2. Send confirmation email
    // 3. Create PDF
    // 4. Notify staff
    
    // For now, just log and return success
    console.log('Form submission received:', submission)

    // Simulate processing delay
    await new Promise(resolve => setTimeout(resolve, 500))

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        success: true,
        message: 'Form submitted successfully',
        submissionId: `SUB-${Date.now()}`,
        data: submission,
      }),
    }
  } catch (error) {
    console.error('Form submission error:', error)
    
    return {
      statusCode: 500,
      body: JSON.stringify({ 
        error: 'Internal server error',
        message: 'An error occurred while processing your request. Please try again later.'
      }),
    }
  }
}