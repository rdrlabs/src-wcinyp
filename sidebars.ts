import type {SidebarsConfig} from '@docusaurus/plugin-content-docs';

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

/**
 * Creating a sidebar enables you to:
 - create an ordered group of docs
 - render a sidebar for each doc of that group
 - provide next/previous navigation

 The sidebars can be generated from the filesystem, or explicitly defined here.

 Create as many sidebars as you want.
 */
const sidebars: SidebarsConfig = {
  // Main documentation sidebar
  mainSidebar: [
    'intro',
    {
      type: 'category',
      label: 'Clinical Workflows',
      collapsed: false,
      items: [
        {
          type: 'category',
          label: 'Patient Questionnaires',
          items: [
            {
              type: 'category',
              label: 'Imaging Questionnaires',
              items: [
                'clinical-workflows/questionnaires/imaging/ct-questionnaire',
                'clinical-workflows/questionnaires/imaging/mri-questionnaire',
                'clinical-workflows/questionnaires/imaging/mri-cardiovascular',
                'clinical-workflows/questionnaires/imaging/mri-gynecologic',
                'clinical-workflows/questionnaires/imaging/mri-prostate',
                'clinical-workflows/questionnaires/imaging/pet-ct-questionnaire',
                'clinical-workflows/questionnaires/imaging/pet-mri-questionnaire',
                'clinical-workflows/questionnaires/imaging/cardiac-questionnaire',
                'clinical-workflows/questionnaires/imaging/fluoro-questionnaire',
                'clinical-workflows/questionnaires/imaging/xray-questionnaire',
              ],
            },
            {
              type: 'category',
              label: 'Ultrasound Questionnaires',
              items: [
                'clinical-workflows/questionnaires/ultrasound/general',
                'clinical-workflows/questionnaires/ultrasound/gynecologic',
                'clinical-workflows/questionnaires/ultrasound/soft-tissue',
              ],
            },
            {
              type: 'category',
              label: 'Specialized Questionnaires',
              items: [
                'clinical-workflows/questionnaires/specialized/biopsy',
                'clinical-workflows/questionnaires/specialized/mammography-history',
                'clinical-workflows/questionnaires/specialized/pkd-patient',
                'clinical-workflows/questionnaires/specialized/mri-screening-non-patient',
              ],
            },
          ],
        },
        {
          type: 'category',
          label: 'Appointment Management',
          items: [
            'clinical-workflows/appointments/confirmation-calls',
            'clinical-workflows/appointments/verification-letter',
            'clinical-workflows/appointments/mammogram-visit-confirmation',
          ],
        },
        {
          type: 'category',
          label: 'Clinical Procedures',
          items: [
            'clinical-workflows/procedures/facilitation',
            'clinical-workflows/procedures/gpcp',
            'clinical-workflows/procedures/pet-info',
            'clinical-workflows/procedures/change-verbal-orders',
          ],
        },
      ],
    },
    {
      type: 'category',
      label: 'Provider Information',
      collapsed: false,
      items: [
        'providers/directory',
        {
          type: 'category',
          label: 'Location Resources',
          items: [
            'providers/locations/fax-transmittal-forms',
            'providers/locations/abn-forms',
          ],
        },
      ],
    },
    {
      type: 'category',
      label: 'Communication Protocols',
      collapsed: false,
      items: [
        {
          type: 'category',
          label: 'Reports & Documentation',
          items: [
            'communications/reports/misc-reports',
            'communications/reports/ct-questionnaire-disease-definitions',
          ],
        },
        {
          type: 'category',
          label: 'Patient Communications',
          items: [
            'communications/patient/aob-recalled-diagnostic',
            'communications/patient/outpatient-medical-chaperone',
          ],
        },
      ],
    },
    {
      type: 'category',
      label: 'Administrative Procedures',
      collapsed: false,
      items: [
        {
          type: 'category',
          label: 'Billing & Invoicing',
          items: [
            'administrative/billing/invoice-guide',
            'administrative/billing/invoice-forms-by-modality',
            'administrative/billing/waiver-liability-self-pay',
            'administrative/billing/waiver-liability-insurance-off-hours',
          ],
        },
        {
          type: 'category',
          label: 'Legal & Compliance',
          items: [
            'administrative/legal/medical-records-release',
            'administrative/legal/minor-authorization',
            'administrative/legal/abn-documentation',
          ],
        },
      ],
    },
    {
      type: 'category',
      label: 'Reference Materials',
      collapsed: false,
      items: [
        {
          type: 'category',
          label: 'Technical Architecture',
          items: [
            {
              type: 'autogenerated',
              dirName: 'architecture',
            },
          ],
        },
        {
          type: 'category',
          label: 'Training & Tutorials',
          items: [
            {
              type: 'autogenerated',
              dirName: 'tutorial-basics',
            },
            {
              type: 'autogenerated',
              dirName: 'tutorial-extras',
            },
          ],
        },
      ],
    },
  ],
};

export default sidebars;
