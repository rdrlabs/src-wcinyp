import React, { useState, useEffect } from 'react';

interface Document {
  name: string;
  path: string;
  category: string;
  modality?: string;
  location?: string;
  language?: string;
  requiresMinorAuth?: boolean;
  requiresChaperone?: boolean;
  isSpanish?: boolean;
}

interface WorkflowBundle {
  name: string;
  description: string;
  documents: string[];
}

const LOCATIONS = ['55th Street', '61st Street', 'Beekman', 'Broadway', 'DHK', 'LIC', 'Spiral', 'York'];
const MODALITIES = ['CT', 'MRI', 'PET', 'Ultrasound', 'Mammography', 'X-Ray', 'Fluoroscopy'];

const WORKFLOW_BUNDLES: WorkflowBundle[] = [
  {
    name: 'Mammography Package',
    description: 'Complete mammography workflow forms',
    documents: ['/documents/Mammogram Visit Confirmation Form.pdf', '/documents/Mammography History Sheet.pdf']
  },
  {
    name: 'Minor Patient Package', 
    description: 'Forms required for pediatric patients',
    documents: ['/documents/Minor Auth Form.pdf', '/documents/Outpatient Medical Chaperone Form.pdf']
  },
  {
    name: 'Self-Pay Package',
    description: 'Self-pay patient documentation',
    documents: ['/documents/Waiver of Liability Form - Self Pay.pdf']
  }
];

const DOCUMENTS: Document[] = [
  // ABN Forms
  { name: 'ABN - 55th Street', path: '/documents/ABN/ABN - 55th Street.pdf', category: 'ABN', location: '55th Street' },
  { name: 'ABN - 61st Street', path: '/documents/ABN/ABN - 61st Street.pdf', category: 'ABN', location: '61st Street' },
  { name: 'ABN - Beekman', path: '/documents/ABN/ABN - Beekman.pdf', category: 'ABN', location: 'Beekman' },
  { name: 'ABN - Broadway', path: '/documents/ABN/ABN - Broadway.pdf', category: 'ABN', location: 'Broadway' },
  { name: 'ABN - DHK', path: '/documents/ABN/ABN - DHK.pdf', category: 'ABN', location: 'DHK' },
  { name: 'ABN - LIC', path: '/documents/ABN/ABN - LIC.pdf', category: 'ABN', location: 'LIC' },
  { name: 'ABN - Spiral', path: '/documents/ABN/ABN - Spiral.pdf', category: 'ABN', location: 'Spiral' },
  { name: 'ABN - York', path: '/documents/ABN/ABN - York.pdf', category: 'ABN', location: 'York' },
  
  // Calcium Score ABN Forms (English)
  { name: 'Calcium Score ABN - 61st Street', path: '/documents/ABN/ABN - Calcium Score 61st Street.pdf', category: 'ABN', modality: 'CT', location: '61st Street' },
  { name: 'Calcium Score ABN - Beekman', path: '/documents/ABN/ABN - Calcium Score Beekman.pdf', category: 'ABN', modality: 'CT', location: 'Beekman' },
  { name: 'Calcium Score ABN - Broadway', path: '/documents/ABN/ABN - Calcium Score Broadway.pdf', category: 'ABN', modality: 'CT', location: 'Broadway' },
  { name: 'Calcium Score ABN - DHK', path: '/documents/ABN/ABN - Calcium Score DHK.pdf', category: 'ABN', modality: 'CT', location: 'DHK' },
  { name: 'Calcium Score ABN - JO', path: '/documents/ABN/ABN - Calcium Score JO.pdf', category: 'ABN', modality: 'CT', location: 'JO' },
  { name: 'Calcium Score ABN - LIC', path: '/documents/ABN/ABN - Calcium Score LIC.pdf', category: 'ABN', modality: 'CT', location: 'LIC' },
  { name: 'Calcium Score ABN - Spiral', path: '/documents/ABN/ABN - Calcium Score Spiral.pdf', category: 'ABN', modality: 'CT', location: 'Spiral' },
  
  // Calcium Score ABN Forms (Spanish)
  { name: 'Calcium Score ABN - 61st Street (Spanish)', path: '/documents/ABN/ABN - Calcium Score 61st Street (Spanish).pdf', category: 'ABN', modality: 'CT', location: '61st Street', isSpanish: true },
  { name: 'Calcium Score ABN - Beekman (Spanish)', path: '/documents/ABN/ABN - Calcium Score Beekman (Spanish).pdf', category: 'ABN', modality: 'CT', location: 'Beekman', isSpanish: true },
  { name: 'Calcium Score ABN - Broadway (Spanish)', path: '/documents/ABN/ABN - Calcium Score Broadway (Spanish).pdf', category: 'ABN', modality: 'CT', location: 'Broadway', isSpanish: true },
  { name: 'Calcium Score ABN - DHK (Spanish)', path: '/documents/ABN/ABN - Calcium Score DHK (Spanish).pdf', category: 'ABN', modality: 'CT', location: 'DHK', isSpanish: true },
  { name: 'Calcium Score ABN - JO (Spanish)', path: '/documents/ABN/ABN - Calcium Score JO (Spanish).pdf', category: 'ABN', modality: 'CT', location: 'JO', isSpanish: true },
  { name: 'Calcium Score ABN - LIC (Spanish)', path: '/documents/ABN/ABN - Calcium Score LIC (Spanish).pdf', category: 'ABN', modality: 'CT', location: 'LIC', isSpanish: true },
  { name: 'Calcium Score ABN - Spiral (Spanish)', path: '/documents/ABN/ABN - Calcium Score Spiral (Spanish).pdf', category: 'ABN', modality: 'CT', location: 'Spiral', isSpanish: true },
  
  // Questionnaires
  { name: 'CT Questionnaire', path: '/documents/CT Questionnaire.pdf', category: 'Questionnaire', modality: 'CT' },
  { name: 'CT Disease Definitions', path: '/documents/CT Questionnaire Disease Definitions.pdf', category: 'Reference', modality: 'CT' },
  { name: 'MRI Questionnaire', path: '/documents/MRI Questionnaire.pdf', category: 'Questionnaire', modality: 'MRI' },
  { name: 'MRI Cardiovascular Form', path: '/documents/MRI Cardiovascular Form.pdf', category: 'Questionnaire', modality: 'MRI' },
  { name: 'MRI Gynecologic Questionnaire', path: '/documents/MRI Gynecologic Questionnaire.pdf', category: 'Questionnaire', modality: 'MRI' },
  { name: 'MRI Prostate Questionnaire', path: '/documents/MRI Prostate Questionnaire.pdf', category: 'Questionnaire', modality: 'MRI' },
  { name: 'MRI Screening Non-Patient', path: '/documents/MRI Screening Non-Patient.pdf', category: 'Questionnaire', modality: 'MRI' },
  { name: 'PETCT Questionnaire', path: '/documents/PETCT Questionnaire.pdf', category: 'Questionnaire', modality: 'PET' },
  { name: 'PETMRI Questionnaire', path: '/documents/PETMRI Questionnaire.pdf', category: 'Questionnaire', modality: 'PET' },
  { name: 'Ultrasound General Questionnaire', path: '/documents/Ultrasound General Questionnaire.pdf', category: 'Questionnaire', modality: 'Ultrasound' },
  { name: 'Ultrasound Gynecologic Questionnaire', path: '/documents/Ultrasound Gynecologic Questionnaire.pdf', category: 'Questionnaire', modality: 'Ultrasound' },
  { name: 'Ultrasound Soft Tissue Questionnaire', path: '/documents/Ultrasound Soft Tissue Questionnaire.pdf', category: 'Questionnaire', modality: 'Ultrasound' },
  { name: 'X-Ray Questionnaire', path: '/documents/X-Ray Questionnaire.pdf', category: 'Questionnaire', modality: 'X-Ray' },
  { name: 'Fluoro Questionnaire', path: '/documents/Fluoro Questionnaire.pdf', category: 'Questionnaire', modality: 'Fluoroscopy' },
  { name: 'Biopsy Questionnaire', path: '/documents/Biopsy Questionnaire.pdf', category: 'Questionnaire' },
  { name: 'Cardiac Questionnaire', path: '/documents/Cardiac Questionnaire.pdf', category: 'Questionnaire' },
  { name: 'Dexa Questionnaire', path: '/documents/Dexa Questionnaire.pdf', category: 'Questionnaire' },
  { name: 'PKD Patient Questionnaire', path: '/documents/PKD Patient Questionnaire.pdf', category: 'Questionnaire' },
  
  // Authorization & Consent Forms
  { name: 'Minor Auth Form', path: '/documents/Minor Auth Form.pdf', category: 'Authorization', requiresMinorAuth: true },
  { name: 'Outpatient Medical Chaperone Form', path: '/documents/Outpatient Medical Chaperone Form.pdf', category: 'Authorization', requiresChaperone: true },
  { name: 'General Medical Records Release Form', path: '/documents/General Medical Records Release Form.pdf', category: 'Authorization' },
  { name: 'Waiver of Liability - Self Pay', path: '/documents/Waiver of Liability Form - Self Pay.pdf', category: 'Authorization' },
  { name: 'Waiver of Liability - Insurance Off-Hours', path: '/documents/Waiver of Liability Form- Insurance Off-Hours.pdf', category: 'Authorization' },
  
  // Mammography Forms
  { name: 'Mammogram Visit Confirmation Form', path: '/documents/Mammogram Visit Confirmation Form.pdf', category: 'Workflow', modality: 'Mammography' },
  { name: 'Mammography History Sheet', path: '/documents/Mammography History Sheet.pdf', category: 'Workflow', modality: 'Mammography' },
  
  // Recall Forms
  { name: 'Mammography Recall Form', path: '/documents/AOB Recalled Diag Mammo and Ultrasound Breast -2025.pdf', category: 'Recall', modality: 'Mammography' },
  
  // Administrative Forms
  { name: 'Change Verbal Order Forms', path: '/documents/Change Verbal Order Forms.pdf', category: 'Administrative' },
  { name: 'Appointment Verification Letter', path: '/documents/Appointment Verification Letter.pdf', category: 'Administrative' }
];

export default function DocumentSelector(): React.ReactElement {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [selectedDocs, setSelectedDocs] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedLocation, setSelectedLocation] = useState<string>('');
  const [selectedModality, setSelectedModality] = useState<string>('');
  const [showSpanish, setShowSpanish] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [suggestions, setSuggestions] = useState<string[]>([]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDocuments(DOCUMENTS);
      setLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  const toggleDocument = (path: string): void => {
    setSelectedDocs(prev => {
      const newSelection = prev.includes(path) 
        ? prev.filter(p => p !== path)
        : [...prev, path];
      
      // Generate suggestions based on new selection
      generateSuggestions(newSelection);
      return newSelection;
    });
  };

  const generateSuggestions = (currentSelection: string[]): void => {
    const selectedDocs = documents.filter(doc => currentSelection.includes(doc.path));
    const newSuggestions = new Set<string>();

    selectedDocs.forEach(doc => {
      // Suggest location-specific ABN when modality is selected
      if (doc.modality && selectedLocation) {
        const abnDoc = documents.find(d => 
          d.category === 'ABN' && 
          d.location === selectedLocation && 
          (!doc.modality || d.modality === doc.modality)
        );
        if (abnDoc && !currentSelection.includes(abnDoc.path)) {
          newSuggestions.add(abnDoc.path);
        }
      }
      
      // Suggest chaperone form for certain procedures
      if (doc.modality === 'MRI' || doc.modality === 'Ultrasound') {
        const chaperoneDoc = documents.find(d => d.requiresChaperone);
        if (chaperoneDoc && !currentSelection.includes(chaperoneDoc.path)) {
          newSuggestions.add(chaperoneDoc.path);
        }
      }
      
      // Suggest mammography workflow forms
      if (doc.modality === 'Mammography') {
        const mammoForms = documents.filter(d => 
          d.modality === 'Mammography' && 
          d.category === 'Workflow' && 
          !currentSelection.includes(d.path)
        );
        mammoForms.forEach(form => newSuggestions.add(form.path));
      }
    });

    setSuggestions(Array.from(newSuggestions));
  };

  const addWorkflowBundle = (bundle: WorkflowBundle): void => {
    setSelectedDocs(prev => {
      const newDocs = [...prev];
      bundle.documents.forEach(docPath => {
        if (!newDocs.includes(docPath)) {
          newDocs.push(docPath);
        }
      });
      generateSuggestions(newDocs);
      return newDocs;
    });
  };

  const handlePrint = (): void => {
    if (selectedDocs.length === 0) {
      alert('Please select at least one document to print');
      return;
    }
    
    selectedDocs.forEach(path => {
      window.open(path, '_blank');
    });
  };

  const filteredDocuments = documents.filter(doc => {
    if (selectedLocation && doc.location && doc.location !== selectedLocation) return false;
    if (selectedModality && doc.modality && doc.modality !== selectedModality) return false;
    if (selectedCategory && doc.category !== selectedCategory) return false;
    if (!showSpanish && doc.isSpanish) return false;
    return true;
  });

  if (loading) {
    return (
      <div className="text--center padding--md">
        <p>Loading documents...</p>
      </div>
    );
  }

  return (
    <div>
      {/* Workflow Bundles */}
      <div className="card margin-bottom--md">
        <div className="card__header">
          <h3>Quick Workflow Packages</h3>
          <p>Pre-configured document bundles for common scenarios</p>
        </div>
        <div className="card__body">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem' }}>
            {WORKFLOW_BUNDLES.map(bundle => (
              <div key={bundle.name} className="alert alert--secondary" style={{ margin: 0 }}>
                <h4>{bundle.name}</h4>
                <p style={{ fontSize: '0.9em', margin: '0.5rem 0' }}>{bundle.description}</p>
                <button 
                  className="button button--outline button--primary button--sm"
                  onClick={() => addWorkflowBundle(bundle)}
                >
                  Add Package
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="card margin-bottom--md">
        <div className="card__header">
          <h3>Filters</h3>
        </div>
        <div className="card__body">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
            <div>
              <label>Location:</label>
              <select 
                value={selectedLocation} 
                onChange={(e) => setSelectedLocation(e.target.value)}
                style={{ width: '100%', padding: '0.5rem', marginTop: '0.25rem' }}
              >
                <option value="">All Locations</option>
                {LOCATIONS.map(location => (
                  <option key={location} value={location}>{location}</option>
                ))}
              </select>
            </div>
            <div>
              <label>Modality:</label>
              <select 
                value={selectedModality} 
                onChange={(e) => setSelectedModality(e.target.value)}
                style={{ width: '100%', padding: '0.5rem', marginTop: '0.25rem' }}
              >
                <option value="">All Modalities</option>
                {MODALITIES.map(modality => (
                  <option key={modality} value={modality}>{modality}</option>
                ))}
              </select>
            </div>
            <div>
              <label>Category:</label>
              <select 
                value={selectedCategory} 
                onChange={(e) => setSelectedCategory(e.target.value)}
                style={{ width: '100%', padding: '0.5rem', marginTop: '0.25rem' }}
              >
                <option value="">All Categories</option>
                <option value="ABN">ABN Forms</option>
                <option value="Questionnaire">Questionnaires</option>
                <option value="Authorization">Authorization</option>
                <option value="Workflow">Workflow</option>
                <option value="Recall">Recall</option>
                <option value="Administrative">Administrative</option>
              </select>
            </div>
            <div>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '1.5rem' }}>
                <input
                  type="checkbox"
                  checked={showSpanish}
                  onChange={(e) => setShowSpanish(e.target.checked)}
                />
                Show Spanish Forms
              </label>
            </div>
          </div>
        </div>
      </div>

      {/* Suggestions */}
      {suggestions.length > 0 && (
        <div className="card margin-bottom--md">
          <div className="card__header">
            <h3>Suggested Forms</h3>
            <p>Based on your current selection, you might also need:</p>
          </div>
          <div className="card__body">
            {suggestions.map(path => {
              const doc = documents.find(d => d.path === path);
              return doc ? (
                <div key={path} className="alert alert--warning" style={{ marginBottom: '0.5rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span>{doc.name}</span>
                    <button 
                      className="button button--outline button--primary button--sm"
                      onClick={() => toggleDocument(path)}
                    >
                      Add
                    </button>
                  </div>
                </div>
              ) : null;
            })}
          </div>
        </div>
      )}

      {/* Document List */}
      <div className="card margin-bottom--md">
        <div className="card__header">
          <h3>Available Documents ({filteredDocuments.length})</h3>
          <p>Select documents to print together as a batch</p>
        </div>
        <div className="card__body">
          {filteredDocuments.map(doc => (
            <div 
              key={doc.path} 
              className={`alert ${selectedDocs.includes(doc.path) ? 'alert--info' : 'alert--secondary'}`}
              style={{ cursor: 'pointer', marginBottom: '0.5rem' }}
              onClick={() => toggleDocument(doc.path)}
            >
              <label style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <input
                  type="checkbox"
                  checked={selectedDocs.includes(doc.path)}
                  onChange={() => toggleDocument(doc.path)}
                />
                <div style={{ flex: 1 }}>
                  <div>{doc.name}</div>
                  <div style={{ fontSize: '0.8em', opacity: 0.7 }}>
                    {doc.category}
                    {doc.modality && ` • ${doc.modality}`}
                    {doc.location && ` • ${doc.location}`}
                    {doc.isSpanish && ' • Spanish'}
                  </div>
                </div>
              </label>
            </div>
          ))}
        </div>
      </div>
      
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span>
          {selectedDocs.length} document{selectedDocs.length !== 1 ? 's' : ''} selected
        </span>
        <button 
          className="button button--primary"
          onClick={handlePrint}
          disabled={selectedDocs.length === 0}
        >
          Print Selected Documents
        </button>
      </div>
    </div>
  );
}