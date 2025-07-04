// Simple client-side MDX content loader for the wiki
// This is a placeholder that returns sample content
// In production, you would load MDX files through a build step or API

export interface WikiPage {
  title: string;
  description: string;
  content: string;
  category: string;
  slug: string;
}

// Sample wiki content - in production this would be loaded from MDX files
export const wikiContent: Record<string, WikiPage> = {
  'index': {
    title: 'WCINYP Staff Wiki',
    description: 'Your comprehensive guide to WCINYP policies, procedures, and operations',
    category: 'home',
    slug: 'index',
    content: `# Welcome to the WCINYP Staff Wiki

This wiki contains all the essential information you need as a WCINYP staff member. Navigate through our documentation to find policies, procedures, department guides, and more.

## Quick Links

### 📋 [Policies](/wiki?section=policies)
Official WCINYP policies including HR, patient care, and administrative guidelines.

### 🔄 [Procedures](/wiki?section=procedures)
Step-by-step guides for common tasks and workflows.

### 🏢 [Locations](/wiki?section=locations)
Information about all WCINYP facilities and locations.

### 👥 [Departments](/wiki?section=departments)
Department-specific information and contacts.

### 🚨 [Emergency Procedures](/wiki?section=emergency)
Critical procedures for emergency situations.

### 💼 [Workflows](/wiki?section=workflows)
Common workflow documentation and best practices.

## Getting Help

If you can't find what you're looking for, please contact:
- IT Support: ext. 1234
- HR Department: ext. 5678
- Your Department Manager

## Recent Updates

- **New Patient Registration Process** - Updated procedure for registering new patients
- **Holiday Schedule 2024** - Updated holiday coverage schedule
- **Emergency Contact Updates** - New emergency contact procedures`
  },
  'policies': {
    title: 'WCINYP Policies',
    description: 'Official policies and guidelines for WCINYP staff',
    category: 'policies',
    slug: 'policies',
    content: `# WCINYP Policies

This section contains all official WCINYP policies. All staff members are expected to be familiar with these policies.

## Policy Categories

### Human Resources
- [Employee Handbook](/wiki/policies/employee-handbook)
- [Code of Conduct](/wiki/policies/code-of-conduct)
- [Time Off Policy](/wiki/policies/time-off)
- [Benefits Overview](/wiki/policies/benefits)

### Patient Care
- [Patient Rights and Responsibilities](/wiki/policies/patient-rights)
- [HIPAA Compliance](/wiki/policies/hipaa)
- [Patient Safety Guidelines](/wiki/policies/patient-safety)
- [Consent Procedures](/wiki/policies/consent)

### Administrative
- [Facility Access](/wiki/policies/facility-access)
- [Equipment Usage](/wiki/policies/equipment)
- [Data Security](/wiki/policies/data-security)
- [Communication Standards](/wiki/policies/communication)

### Clinical Operations
- [Imaging Protocols](/wiki/policies/imaging-protocols)
- [Infection Control](/wiki/policies/infection-control)
- [Quality Assurance](/wiki/policies/quality-assurance)
- [Incident Reporting](/wiki/policies/incident-reporting)

## Policy Updates

Policies are reviewed annually. Last comprehensive review: January 2024

For questions about specific policies, contact HR at ext. 5678.`
  },
  'procedures': {
    title: 'Standard Operating Procedures',
    description: 'Step-by-step guides for WCINYP operations',
    category: 'procedures',
    slug: 'procedures',
    content: `# Standard Operating Procedures

This section contains detailed procedures for common tasks at WCINYP.

## Administrative Procedures

### Patient Registration
- [New Patient Registration](/wiki/procedures/new-patient)
- [Insurance Verification](/wiki/procedures/insurance-verification)
- [Appointment Scheduling](/wiki/procedures/scheduling)
- [Patient Check-in Process](/wiki/procedures/check-in)

### Billing and Coding
- [Insurance Claims Processing](/wiki/procedures/claims)
- [Prior Authorization](/wiki/procedures/prior-auth)
- [Payment Processing](/wiki/procedures/payments)
- [Billing Inquiries](/wiki/procedures/billing-inquiries)

## Clinical Procedures

### Imaging Procedures
- [MRI Safety Screening](/wiki/procedures/mri-screening)
- [CT Contrast Administration](/wiki/procedures/ct-contrast)
- [X-Ray Positioning Guide](/wiki/procedures/xray-positioning)
- [Ultrasound Preparation](/wiki/procedures/ultrasound-prep)

### Patient Care
- [Patient Preparation Guidelines](/wiki/procedures/patient-prep)
- [Post-Procedure Care](/wiki/procedures/post-procedure)
- [Patient Transfer Protocols](/wiki/procedures/patient-transfer)
- [Special Needs Accommodation](/wiki/procedures/special-needs)`
  },
  'emergency': {
    title: 'Emergency Procedures',
    description: 'Critical procedures for emergency situations at WCINYP',
    category: 'emergency',
    slug: 'emergency',
    content: `# Emergency Procedures

⚠️ **In case of immediate danger, call 911 first**

## Emergency Contact Numbers

### Internal Emergency Response
- **Security**: ext. 5555 or (555) 123-5555
- **Facility Manager**: ext. 5556 or (555) 123-5556
- **On-Call Administrator**: (555) 123-9999

### External Emergency Services
- **Emergency Services**: 911
- **Poison Control**: 1-800-222-1222
- **Hospital ER**: (555) 123-4567

## Medical Emergencies

### Patient Medical Emergency
1. **Stay calm** and assess the situation
2. **Do not move** the patient unless in immediate danger
3. **Call for help** - Use emergency button or dial ext. 5555
4. **Begin basic first aid** if trained
5. **Clear the area** for emergency responders
6. **Document** the incident thoroughly

### Fire Emergency
1. **R.A.C.E. Protocol**:
   - **R**escue anyone in immediate danger
   - **A**larm - Pull nearest fire alarm
   - **C**ontain - Close doors to prevent spread
   - **E**vacuation/Extinguish - Follow evacuation plan or use extinguisher if safe`
  },
  'departments': {
    title: 'Department Directory',
    description: 'Information and contacts for all WCINYP departments',
    category: 'departments',
    slug: 'departments',
    content: `# Department Directory

Find information about each department at WCINYP, including key contacts, locations, and services.

## Clinical Departments

### Radiology Department
- **Location**: Main Building, 2nd Floor
- **Phone**: ext. 2100
- **Director**: Dr. Sarah Mitchell
- **Hours**: 24/7 Emergency, 7am-8pm Regular
- **Services**: X-Ray, CT, MRI, Ultrasound, Nuclear Medicine

### Imaging Services
- **Location**: West Wing, Ground Floor
- **Phone**: ext. 2200
- **Manager**: Robert Chen
- **Hours**: Mon-Fri 7am-7pm, Sat 8am-4pm
- **Services**: Mammography, Bone Density, Fluoroscopy

## Administrative Departments

### Patient Registration
- **Location**: Main Entrance
- **Phone**: ext. 1100
- **Manager**: Lisa Anderson
- **Hours**: Mon-Fri 6:30am-8pm, Sat 7am-5pm

### Medical Records
- **Location**: East Building, 1st Floor
- **Phone**: ext. 1200
- **Manager**: James Wilson
- **Hours**: Mon-Fri 8am-5pm`
  },
  'workflows': {
    title: 'Common Workflows',
    description: 'Step-by-step guides for frequently performed tasks',
    category: 'workflows',
    slug: 'workflows',
    content: `# Common Workflows

This section provides detailed workflows for common tasks performed at WCINYP.

## Patient Workflows

### New Patient Complete Workflow

1. **Patient Arrival**
   - Greet patient warmly
   - Verify appointment in system
   - Direct to registration if first visit

2. **Registration Process**
   - Collect patient demographics
   - Verify insurance information
   - Scan photo ID and insurance cards
   - Have patient sign consent forms
   - Create patient wristband

3. **Pre-Procedure Preparation**
   - Review medical history
   - Confirm exam type and body part
   - Check for contraindications
   - Explain procedure to patient

### Insurance Authorization Workflow

1. **Receive Order**
   - Review physician order
   - Check insurance requirements
   - Identify if prior auth needed

2. **Submit Authorization**
   - Complete insurance form
   - Attach clinical documentation
   - Submit via portal or fax`
  },
  'locations': {
    title: 'WCINYP Locations',
    description: 'Information about all WCINYP facilities and locations',
    category: 'locations',
    slug: 'locations',
    content: `# WCINYP Locations

Information about all WCINYP imaging facilities and their services.

## Main Campus
**Address**: 1305 York Avenue, New York, NY 10021
**Phone**: (212) 746-5000
**Hours**: 24/7 Emergency Services, Mon-Fri 7am-8pm Regular Hours

### Services Available:
- All imaging modalities
- Emergency imaging
- Interventional procedures
- Women's imaging center

### Parking:
- Valet parking available
- Patient parking garage on 69th Street
- Handicap accessible entrances

## Satellite Locations

### Upper East Side Imaging
**Address**: 425 East 61st Street, New York, NY 10065
**Phone**: (212) 821-0600
**Hours**: Mon-Fri 7am-7pm, Sat 8am-4pm

### Downtown Location
**Address**: 156 William Street, New York, NY 10038
**Phone**: (212) 746-1500
**Hours**: Mon-Fri 8am-6pm

## Getting to WCINYP

### By Subway:
- 6 train to 68th Street
- Q train to 72nd Street
- F train to 63rd Street

### By Bus:
- M15, M31, M57, M66, M72

### By Car:
- FDR Drive to 71st Street exit
- Patient drop-off available at main entrance`
  }
};

export function getWikiPage(slug: string): WikiPage | null {
  return wikiContent[slug] || null;
}

export function getAllWikiPages(): WikiPage[] {
  return Object.values(wikiContent);
}

export function getWikiPagesByCategory(category: string): WikiPage[] {
  return Object.values(wikiContent).filter(page => page.category === category);
}