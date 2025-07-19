export const profileFixtures = {
  regular: {
    id: 'user-jdoe123',
    email: 'jdoe123@med.cornell.edu',
    net_id: 'jdoe123',
    created_at: new Date('2024-01-01T10:00:00Z').toISOString(),
    updated_at: new Date('2024-01-15T14:30:00Z').toISOString(),
    last_login: new Date('2024-01-17T09:00:00Z').toISOString(),
  },
  
  admin: {
    id: 'user-admin123',
    email: 'admin123@med.cornell.edu',
    net_id: 'admin123',
    created_at: new Date('2023-01-01T10:00:00Z').toISOString(),
    updated_at: new Date('2024-01-17T08:00:00Z').toISOString(),
    last_login: new Date('2024-01-17T08:00:00Z').toISOString(),
    role: 'admin', // Note: This field may not exist in the actual schema
  },
  
  inactive: {
    id: 'user-inactive123',
    email: 'inactive123@med.cornell.edu',
    net_id: 'inactive123',
    created_at: new Date('2023-06-01T10:00:00Z').toISOString(),
    updated_at: new Date('2023-12-01T10:00:00Z').toISOString(),
    last_login: new Date('2023-12-01T10:00:00Z').toISOString(),
  },
  
  newUser: {
    id: 'user-new123',
    email: 'new123@med.cornell.edu',
    net_id: 'new123',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    last_login: null,
  },
  
  // Multiple users for testing lists
  list: [
    {
      id: 'user-alice123',
      email: 'alice123@med.cornell.edu',
      net_id: 'alice123',
      created_at: new Date('2024-01-10T10:00:00Z').toISOString(),
      updated_at: new Date('2024-01-16T10:00:00Z').toISOString(),
      last_login: new Date('2024-01-16T10:00:00Z').toISOString(),
    },
    {
      id: 'user-bob456',
      email: 'bob456@med.cornell.edu',
      net_id: 'bob456',
      created_at: new Date('2024-01-11T10:00:00Z').toISOString(),
      updated_at: new Date('2024-01-17T11:00:00Z').toISOString(),
      last_login: new Date('2024-01-17T11:00:00Z').toISOString(),
    },
    {
      id: 'user-carol789',
      email: 'carol789@med.cornell.edu',
      net_id: 'carol789',
      created_at: new Date('2024-01-12T10:00:00Z').toISOString(),
      updated_at: new Date('2024-01-17T12:00:00Z').toISOString(),
      last_login: new Date('2024-01-17T12:00:00Z').toISOString(),
    },
  ],
  
  // Helper to create a new profile
  createNew: (overrides: Partial<any> = {}) => {
    const netId = overrides.net_id || `test${Date.now()}`
    return {
      id: `user-${netId}`,
      email: `${netId}@med.cornell.edu`,
      net_id: netId,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      last_login: null,
      ...overrides,
    }
  },
  
  // Helper to create profile from email
  fromEmail: (email: string) => {
    const netId = email.split('@')[0]
    return {
      id: `user-${netId}`,
      email,
      net_id: netId,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      last_login: new Date().toISOString(),
    }
  },
}