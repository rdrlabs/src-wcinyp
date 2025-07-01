import React, { useState, useEffect } from 'react';

interface Document {
  name: string;
  path: string;
}

const MOCK_DOCUMENTS: Document[] = [
  { name: 'Patient Consent Form', path: '/documents/patient-consent.pdf' },
  { name: 'Insurance Verification', path: '/documents/insurance-verify.pdf' },
  { name: 'Medical History Form', path: '/documents/medical-history.pdf' },
  { name: 'Screening Questionnaire', path: '/documents/screening-form.pdf' },
];

export default function DocumentSelector(): React.ReactElement {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [selectedDocs, setSelectedDocs] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDocuments(MOCK_DOCUMENTS);
      setLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  const toggleDocument = (path: string): void => {
    setSelectedDocs(prev => 
      prev.includes(path) 
        ? prev.filter(p => p !== path)
        : [...prev, path]
    );
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

  if (loading) {
    return (
      <div className="text--center padding--md">
        <p>Loading documents...</p>
      </div>
    );
  }

  return (
    <div>
      <div className="card margin-bottom--md">
        <div className="card__header">
          <h3>Available Documents</h3>
          <p>Select documents to print together as a batch</p>
        </div>
        <div className="card__body">
          {documents.map(doc => (
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
                {doc.name}
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