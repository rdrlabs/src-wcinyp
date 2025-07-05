/**
 * Location and department constants
 */

export const LOCATIONS = {
  '61st Street': {
    name: '61st Street',
    address: '525 East 61st Street',
    colorKey: 'blue',
  },
  'Broadway': {
    name: 'Broadway',
    address: '1305 York Avenue',
    colorKey: 'purple',
  },
  '55th Street': {
    name: '55th Street',
    address: '416 East 55th Street',
    colorKey: 'green',
  },
  'Beekman': {
    name: 'Beekman',
    address: '1320 York Avenue',
    colorKey: 'orange',
  },
  'DHK': {
    name: 'DHK',
    address: 'David H. Koch Center',
    colorKey: 'pink',
  },
  'LIC': {
    name: 'LIC',
    address: 'Long Island City',
    colorKey: 'indigo',
  },
  'Spiral': {
    name: 'Spiral',
    address: '66 Hudson Boulevard',
    colorKey: 'teal',
  },
  'York Avenue': {
    name: 'York Avenue',
    address: '1283 York Avenue',
    colorKey: 'red',
  },
} as const

export const DEPARTMENTS = {
  administration: 'Administration',
  it: 'IT',
  hr: 'Human Resources',
  clinical: 'Clinical',
  finance: 'Finance',
  imaging: 'Imaging',
  emergency: 'Emergency',
  surgery: 'Surgery',
  outpatient: 'Outpatient',
  radiology: 'Radiology',
  cardiology: 'Cardiology',
  neurology: 'Neurology',
  orthopedics: 'Orthopedics',
  pediatrics: 'Pediatrics',
} as const

export const AFFILIATIONS = {
  WCM: {
    code: 'WCM',
    label: 'Weill Cornell Medicine',
    colorKey: 'red',
  },
  NYP: {
    code: 'NYP',
    label: 'NewYork-Presbyterian',
    colorKey: 'blue',
  },
  'NYP-Affiliate': {
    code: 'NYP-Affiliate',
    label: 'NYP Affiliate',
    colorKey: 'indigo',
  },
  'NYP/Columbia': {
    code: 'NYP/Columbia',
    label: 'NYP/Columbia',
    colorKey: 'purple',
  },
  Private: {
    code: 'Private',
    label: 'Private Practice',
    colorKey: 'gray',
  },
  BTC: {
    code: 'BTC',
    label: 'Brain Tumor Center',
    colorKey: 'orange',
  },
  WCCC: {
    code: 'WCCC',
    label: 'WC Community Clinic',
    colorKey: 'green',
  },
} as const