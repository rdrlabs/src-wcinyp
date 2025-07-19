export const accessRequestFixtures = {
  pending: [
    {
      id: 'req-1',
      email: 'john.doe@med.cornell.edu',
      full_name: 'John Doe',
      organization: 'Radiology Department',
      role: 'Radiologist',
      reason: 'Need access to review patient imaging studies and reports for clinical practice.',
      status: 'pending' as const,
      requested_at: new Date('2024-01-15T10:00:00Z').toISOString(),
      reviewed_at: null,
      review_notes: null,
      ip_address: '10.0.0.1',
    },
    {
      id: 'req-2',
      email: 'jane.smith@med.cornell.edu',
      full_name: 'Jane Smith',
      organization: 'Administration',
      role: 'Department Administrator',
      reason: 'Require access to manage department resources and view aggregated reports.',
      status: 'pending' as const,
      requested_at: new Date('2024-01-16T14:30:00Z').toISOString(),
      reviewed_at: null,
      review_notes: null,
      ip_address: '10.0.0.2',
    },
    {
      id: 'req-3',
      email: 'bob.johnson@med.cornell.edu',
      full_name: 'Bob Johnson',
      organization: 'IT Department',
      role: 'System Administrator',
      reason: 'Need administrative access for system maintenance and user support.',
      status: 'pending' as const,
      requested_at: new Date('2024-01-17T09:15:00Z').toISOString(),
      reviewed_at: null,
      review_notes: null,
      ip_address: '10.0.0.3',
    },
  ],
  
  approved: [
    {
      id: 'req-4',
      email: 'alice.williams@med.cornell.edu',
      full_name: 'Alice Williams',
      organization: 'Radiology Department',
      role: 'Senior Radiologist',
      reason: 'Need access for patient care and teaching responsibilities.',
      status: 'approved' as const,
      requested_at: new Date('2024-01-10T08:00:00Z').toISOString(),
      reviewed_at: new Date('2024-01-10T10:00:00Z').toISOString(),
      review_notes: 'Verified department head. Approved for full access.',
      ip_address: '10.0.0.4',
    },
    {
      id: 'req-5',
      email: 'charlie.brown@med.cornell.edu',
      full_name: 'Charlie Brown',
      organization: 'Research',
      role: 'Research Coordinator',
      reason: 'Access needed for clinical research data collection.',
      status: 'approved' as const,
      requested_at: new Date('2024-01-12T11:00:00Z').toISOString(),
      reviewed_at: new Date('2024-01-12T16:00:00Z').toISOString(),
      review_notes: 'Approved for research access only. No patient PHI access.',
      ip_address: '10.0.0.5',
    },
  ],
  
  rejected: [
    {
      id: 'req-6',
      email: 'invalid.user@example.com',
      full_name: 'Invalid User',
      organization: 'Unknown',
      role: 'External Contractor',
      reason: 'Need access for project work.',
      status: 'rejected' as const,
      requested_at: new Date('2024-01-14T13:00:00Z').toISOString(),
      reviewed_at: new Date('2024-01-14T14:00:00Z').toISOString(),
      review_notes: 'Not a valid Cornell Medicine email address. External contractors must use VPN access.',
      ip_address: '192.168.1.1',
    },
    {
      id: 'req-7',
      email: 'test@med.cornell.edu',
      full_name: 'Test Account',
      organization: 'Testing',
      role: 'Test User',
      reason: 'Testing access request system.',
      status: 'rejected' as const,
      requested_at: new Date('2024-01-13T15:00:00Z').toISOString(),
      reviewed_at: new Date('2024-01-13T15:30:00Z').toISOString(),
      review_notes: 'Test account - not a real user.',
      ip_address: '127.0.0.1',
    },
  ],
  
  // Combined array for convenience
  get all() {
    return [...this.pending, ...this.approved, ...this.rejected]
  },
  
  // Helper to create a new request
  createNew: (overrides: Partial<any> = {}) => ({
    id: `req-${Date.now()}`,
    email: 'newuser@med.cornell.edu',
    full_name: 'New User',
    organization: 'Department',
    role: 'Staff',
    reason: 'Need access for daily work.',
    status: 'pending' as const,
    requested_at: new Date().toISOString(),
    reviewed_at: null,
    review_notes: null,
    ip_address: '10.0.0.100',
    ...overrides,
  }),
  
  // Helper to find by email
  findByEmail: function(email: string) {
    return this.all.find(req => req.email === email)
  },
  
  // Helper to filter by status
  filterByStatus: function(status: 'pending' | 'approved' | 'rejected') {
    return this.all.filter(req => req.status === status)
  },
}