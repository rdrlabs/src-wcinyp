import { createLogger } from './utils/logger';

// Netlify Function types
interface HandlerEvent {
  httpMethod: string;
  queryStringParameters: Record<string, string> | null;
  headers: Record<string, string>;
  path: string;
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

const logger = createLogger('get-documents');

export const handler: Handler = async (event) => {
  const log = logger.withRequest(event);
  // Enable CORS with restricted origins from environment
  const allowedOrigins = process.env.CORS_ALLOWED_ORIGINS 
    ? process.env.CORS_ALLOWED_ORIGINS.split(',').map(origin => origin.trim())
    : [
        'http://localhost:3000',
        'https://wcinyp.netlify.app',
        process.env.URL || 'https://wcinyp.netlify.app'
      ]
  
  const origin = event.headers.origin || event.headers.Origin || ''
  const headers = {
    'Access-Control-Allow-Origin': allowedOrigins.includes(origin) ? origin : allowedOrigins[2],
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
    let response: any = {
      categories: DOCUMENT_CATEGORIES,
      totalDocuments: Object.values(DOCUMENT_CATEGORIES).reduce((a, b) => a + b, 0),
      timestamp: new Date().toISOString(),
    }

    // Add filtered count if category specified
    if (category && DOCUMENT_CATEGORIES[category as keyof typeof DOCUMENT_CATEGORIES]) {
      response.filteredCount = DOCUMENT_CATEGORIES[category as keyof typeof DOCUMENT_CATEGORIES]
    }

    log.info('Documents retrieved', { 
      category, 
      search, 
      totalDocuments: response.totalDocuments,
      filteredCount: response.filteredCount 
    });

    return {
      statusCode: 200,
      headers: {
        ...headers,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(response),
    }
  } catch (error) {
    log.error('Error getting documents', { error })
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ 
        error: 'Internal server error',
        message: 'An error occurred while retrieving documents. Please try again later.'
      }),
    }
  }
}