// Netlify Function types
interface HandlerEvent {
  httpMethod: string;
  queryStringParameters: Record<string, string> | null;
}

interface HandlerResponse {
  statusCode: number;
  headers?: Record<string, string>;
  body: string;
}

type Handler = (event: HandlerEvent) => Promise<HandlerResponse>;

// This could be fetched from a database or CMS
const DOCUMENT_CATEGORIES = {
  "ABN Forms": 10,
  "Calcium Score ABN": 14,
  "Patient Questionnaires": 18,
  "Administrative Forms": 9,
  "Fax Transmittal Forms": 10,
  "Invoice Forms": 8,
}

export const handler: Handler = async (event) => {
  // Enable CORS
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
  }

  // Handle preflight
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' }
  }

  if (event.httpMethod !== 'GET') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method Not Allowed' }),
    }
  }

  try {
    // Parse query parameters
    const { category, search } = event.queryStringParameters || {}

    // In a real app, this would query a database
    interface DocumentResponse {
      categories: typeof DOCUMENT_CATEGORIES
      totalDocuments: number
      timestamp: string
      filteredCount?: number
      searchResults?: number
    }
    
    let response: DocumentResponse = {
      categories: DOCUMENT_CATEGORIES,
      totalDocuments: Object.values(DOCUMENT_CATEGORIES).reduce((a, b) => a + b, 0),
      timestamp: new Date().toISOString(),
    }

    // Add filtered count if category specified
    if (category && DOCUMENT_CATEGORIES[category as keyof typeof DOCUMENT_CATEGORIES]) {
      response.filteredCount = DOCUMENT_CATEGORIES[category as keyof typeof DOCUMENT_CATEGORIES]
    }

    return {
      statusCode: 200,
      headers: {
        ...headers,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(response),
    }
  } catch (error) {
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ 
        error: 'Internal server error',
        message: error instanceof Error ? error.message : 'Unknown error'
      }),
    }
  }
}