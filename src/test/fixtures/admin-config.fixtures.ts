export const adminConfigFixtures = {
  default: {
    id: 'config-default',
    admin_emails: [
      'admin123@med.cornell.edu',
      'superadmin@med.cornell.edu',
      'dept.admin@med.cornell.edu',
    ],
    created_at: new Date('2024-01-01T00:00:00Z').toISOString(),
    updated_at: new Date('2024-01-15T12:00:00Z').toISOString(),
  },
  
  empty: {
    id: 'config-empty',
    admin_emails: [],
    created_at: new Date('2024-01-01T00:00:00Z').toISOString(),
    updated_at: new Date('2024-01-01T00:00:00Z').toISOString(),
  },
  
  single: {
    id: 'config-single',
    admin_emails: ['onlyadmin@med.cornell.edu'],
    created_at: new Date('2024-01-01T00:00:00Z').toISOString(),
    updated_at: new Date('2024-01-10T10:00:00Z').toISOString(),
  },
  
  large: {
    id: 'config-large',
    admin_emails: [
      'admin1@med.cornell.edu',
      'admin2@med.cornell.edu',
      'admin3@med.cornell.edu',
      'admin4@med.cornell.edu',
      'admin5@med.cornell.edu',
      'dept.head1@med.cornell.edu',
      'dept.head2@med.cornell.edu',
      'it.admin1@med.cornell.edu',
      'it.admin2@med.cornell.edu',
      'superuser@med.cornell.edu',
    ],
    created_at: new Date('2024-01-01T00:00:00Z').toISOString(),
    updated_at: new Date('2024-01-17T08:00:00Z').toISOString(),
  },
  
  // Helper to check if email is admin
  isAdmin: function(email: string, config = this.default) {
    return config.admin_emails.includes(email.toLowerCase())
  },
  
  // Helper to add admin email
  addAdmin: function(email: string, config = this.default) {
    return {
      ...config,
      admin_emails: [...new Set([...config.admin_emails, email.toLowerCase()])],
      updated_at: new Date().toISOString(),
    }
  },
  
  // Helper to remove admin email
  removeAdmin: function(email: string, config = this.default) {
    return {
      ...config,
      admin_emails: config.admin_emails.filter(e => e.toLowerCase() !== email.toLowerCase()),
      updated_at: new Date().toISOString(),
    }
  },
  
  // Helper to create custom config
  createCustom: (adminEmails: string[]) => ({
    id: `config-${Date.now()}`,
    admin_emails: adminEmails.map(e => e.toLowerCase()),
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  }),
}