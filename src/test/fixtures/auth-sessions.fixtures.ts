export const authSessionFixtures = {
  pending: {
    id: 'session-1',
    session_token: 'test-session-token-123',
    email: 'jdoe123@med.cornell.edu',
    device_info: JSON.stringify({
      userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
      platform: 'MacIntel',
      vendor: 'Apple Computer, Inc.',
      language: 'en-US',
    }),
    device_fingerprint: 'fp-abc123def456',
    is_authenticated: false,
    authenticated_at: null,
    created_at: new Date('2024-01-17T10:00:00Z').toISOString(),
    expires_at: new Date('2024-01-17T10:10:00Z').toISOString(), // 10 minutes
  },
  
  authenticated: {
    id: 'session-2',
    session_token: 'test-session-token-456',
    email: 'alice123@med.cornell.edu',
    device_info: JSON.stringify({
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      platform: 'Win32',
      vendor: 'Google Inc.',
      language: 'en-US',
    }),
    device_fingerprint: 'fp-def789ghi012',
    is_authenticated: true,
    authenticated_at: new Date('2024-01-17T10:05:00Z').toISOString(),
    created_at: new Date('2024-01-17T10:00:00Z').toISOString(),
    expires_at: new Date('2024-01-17T10:10:00Z').toISOString(),
  },
  
  expired: {
    id: 'session-3',
    session_token: 'test-session-token-789',
    email: 'bob456@med.cornell.edu',
    device_info: JSON.stringify({
      userAgent: 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36',
      platform: 'Linux x86_64',
      vendor: '',
      language: 'en-US',
    }),
    device_fingerprint: 'fp-ghi345jkl678',
    is_authenticated: false,
    authenticated_at: null,
    created_at: new Date('2024-01-16T10:00:00Z').toISOString(),
    expires_at: new Date('2024-01-16T10:10:00Z').toISOString(), // Already expired
  },
  
  mobile: {
    id: 'session-4',
    session_token: 'test-session-token-mobile',
    email: 'carol789@med.cornell.edu',
    device_info: JSON.stringify({
      userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 15_0 like Mac OS X) AppleWebKit/605.1.15',
      platform: 'iPhone',
      vendor: 'Apple Computer, Inc.',
      language: 'en-US',
    }),
    device_fingerprint: 'fp-mobile123',
    is_authenticated: false,
    authenticated_at: null,
    created_at: new Date('2024-01-17T09:55:00Z').toISOString(),
    expires_at: new Date('2024-01-17T10:05:00Z').toISOString(),
  },
  
  // List of sessions for testing multiple sessions
  list: [
    {
      id: 'session-list-1',
      session_token: 'list-token-1',
      email: 'user1@med.cornell.edu',
      device_info: null,
      device_fingerprint: null,
      is_authenticated: false,
      authenticated_at: null,
      created_at: new Date('2024-01-17T08:00:00Z').toISOString(),
      expires_at: new Date('2024-01-17T08:10:00Z').toISOString(),
    },
    {
      id: 'session-list-2',
      session_token: 'list-token-2',
      email: 'user2@med.cornell.edu',
      device_info: null,
      device_fingerprint: null,
      is_authenticated: true,
      authenticated_at: new Date('2024-01-17T08:05:00Z').toISOString(),
      created_at: new Date('2024-01-17T08:00:00Z').toISOString(),
      expires_at: new Date('2024-01-17T08:10:00Z').toISOString(),
    },
  ],
  
  // Helper to create a new session
  createNew: (overrides: Partial<any> = {}) => {
    const now = new Date()
    const tenMinutesLater = new Date(now.getTime() + 10 * 60 * 1000)
    
    return {
      id: `session-${Date.now()}`,
      session_token: `token-${Math.random().toString(36).substr(2, 9)}`,
      email: 'test@med.cornell.edu',
      device_info: JSON.stringify({
        userAgent: navigator.userAgent,
        platform: navigator.platform,
        vendor: navigator.vendor,
        language: navigator.language,
      }),
      device_fingerprint: `fp-${Math.random().toString(36).substr(2, 9)}`,
      is_authenticated: false,
      authenticated_at: null,
      created_at: now.toISOString(),
      expires_at: tenMinutesLater.toISOString(),
      ...overrides,
    }
  },
  
  // Helper to mark session as authenticated
  authenticate: (session: any) => ({
    ...session,
    is_authenticated: true,
    authenticated_at: new Date().toISOString(),
  }),
  
  // Helper to check if session is expired
  isExpired: (session: any) => {
    return new Date(session.expires_at) < new Date()
  },
}