// Debug script to analyze document grouping behavior
// Focus on ABN Calcium Score documents

const documentsData = require('./src/data/documents.json');

// Helper functions from the page code
const extractBaseType = (name) => {
  // Remove location suffixes
  let baseName = name.replace(/ - (55th Street|61st Street|Beekman|Broadway|DHK|JO|LIC|Spiral|York|88 Pine|STARR|WGC|Westside|55th|61st)(\.pdf)?$/i, '');
  // Remove language suffixes
  baseName = baseName.replace(/ \((Spanish|Español)\)(\.pdf)?$/i, '');
  // Remove file extension
  baseName = baseName.replace(/\.pdf$/i, '');
  // Remove "Form" from Invoice Forms
  if (baseName.includes('Invoice Form')) {
    baseName = baseName.replace('Invoice Form - ', 'Invoice - ');
  }
  return baseName.trim();
};

// Process all documents
const allDocuments = [];
const documentCategories = documentsData.categories;

Object.entries(documentCategories).forEach(([category, docs]) => {
  docs.forEach(doc => {
    // Extract location from path/name (handle Spanish suffix)
    const locationMatch = doc.name.match(/(55th Street|61st Street|Beekman|Broadway|DHK|JO|LIC|Spiral|York|88 Pine|STARR|WGC|Westside|55th|61st)(?:\s*\(Spanish\))?/i);
    const location = locationMatch ? locationMatch[1] : null;
    
    // Check if Spanish
    const isSpanish = doc.name.toLowerCase().includes('spanish') || doc.name.toLowerCase().includes('español');
    
    // Extract document type
    const docType = doc.name.toLowerCase().includes('questionnaire') ? 'Questionnaire' :
                   doc.name.toLowerCase().includes('abn') ? 'ABN Form' :
                   doc.name.toLowerCase().includes('invoice') ? 'Invoice' :
                   doc.name.toLowerCase().includes('fax') ? 'Fax Form' :
                   'Other';
    
    // Extract modality for invoices
    let modality = undefined;
    if (docType === 'Invoice') {
      const modalityMatch = doc.name.match(/Invoice Form - (CT|MRI|Mammo|PET|US|Xray)/i);
      modality = modalityMatch ? modalityMatch[1] : undefined;
    }
    
    const baseType = extractBaseType(doc.name);
    
    const processedDoc = {
      ...doc,
      category,
      location,
      language: isSpanish ? 'Spanish' : 'English',
      docType,
      baseType,
      modality,
      shouldGroup: location || modality ? true : false
    };
    
    allDocuments.push(processedDoc);
  });
});

// Find ABN Calcium Score documents
console.log('=== ABN CALCIUM SCORE DOCUMENT ANALYSIS ===\n');

const abnCalciumDocs = allDocuments.filter(doc => 
  doc.name.toLowerCase().includes('abn calcium score')
);

console.log(`Found ${abnCalciumDocs.length} ABN Calcium Score documents:\n`);

abnCalciumDocs.forEach((doc, index) => {
  console.log(`\nDocument ${index + 1}:`);
  console.log(`  Original name: "${doc.name}"`);
  console.log(`  Base type: "${doc.baseType}"`);
  console.log(`  Location: ${doc.location ? `"${doc.location}"` : 'null'}`);
  console.log(`  Language: ${doc.language}`);
  console.log(`  Doc type: ${doc.docType}`);
  console.log(`  Should group: ${doc.shouldGroup}`);
  console.log(`  Group key: "${doc.baseType}"`);
});

// Check if they would group together
console.log('\n=== GROUPING ANALYSIS ===\n');

const groups = {};
abnCalciumDocs.forEach(doc => {
  if (doc.shouldGroup) {
    const groupKey = doc.baseType;
    if (!groups[groupKey]) {
      groups[groupKey] = [];
    }
    groups[groupKey].push(doc);
  }
});

console.log(`Number of groups formed: ${Object.keys(groups).length}\n`);

Object.entries(groups).forEach(([key, docs]) => {
  console.log(`\nGroup key: "${key}"`);
  console.log(`Documents in group (${docs.length}):`);
  docs.forEach(doc => {
    console.log(`  - ${doc.name} (${doc.language}, location: ${doc.location || 'none'})`);
  });
});

// Documents that won't group
const nonGroupedABN = abnCalciumDocs.filter(doc => !doc.shouldGroup);
if (nonGroupedABN.length > 0) {
  console.log('\n=== NON-GROUPED ABN CALCIUM SCORE DOCUMENTS ===\n');
  nonGroupedABN.forEach(doc => {
    console.log(`- ${doc.name} (No location/modality detected)`);
  });
}

// Test the specific documents mentioned
console.log('\n=== SPECIFIC DOCUMENT COMPARISON ===\n');

const english61st = abnCalciumDocs.find(doc => doc.name === 'ABN Calcium Score - 61st Street.pdf');
const spanish61st = abnCalciumDocs.find(doc => doc.name === 'ABN Calcium Score - 61st Street (Spanish).pdf');

if (english61st && spanish61st) {
  console.log('English version:');
  console.log(`  Base type: "${english61st.baseType}"`);
  console.log(`  Location: ${english61st.location}`);
  console.log(`  Should group: ${english61st.shouldGroup}`);
  
  console.log('\nSpanish version:');
  console.log(`  Base type: "${spanish61st.baseType}"`);
  console.log(`  Location: ${spanish61st.location}`);
  console.log(`  Should group: ${spanish61st.shouldGroup}`);
  
  console.log(`\nWould they group together? ${english61st.baseType === spanish61st.baseType ? 'YES' : 'NO'}`);
  
  if (english61st.baseType !== spanish61st.baseType) {
    console.log('\nREASON: Base types are different!');
    console.log(`  English base type: "${english61st.baseType}"`);
    console.log(`  Spanish base type: "${spanish61st.baseType}"`);
  }
}

// Debug the regex patterns
console.log('\n=== REGEX PATTERN TESTING ===\n');

const testNames = [
  'ABN Calcium Score - 61st Street.pdf',
  'ABN Calcium Score - 61st Street (Spanish).pdf',
  'ABN Calcium Score - 55th Street.pdf',
  'ABN Calcium Score - 55th Street (Spanish).pdf'
];

testNames.forEach(name => {
  console.log(`\nTesting: "${name}"`);
  
  // Test location regex
  const locationMatch = name.match(/(55th Street|61st Street|Beekman|Broadway|DHK|JO|LIC|Spiral|York|88 Pine|STARR|WGC|Westside|55th|61st)(?:\s*\(Spanish\))?/i);
  console.log(`  Location match: ${locationMatch ? locationMatch[0] : 'null'}`);
  console.log(`  Location extracted: ${locationMatch ? locationMatch[1] : 'null'}`);
  
  // Test base type extraction step by step
  let step1 = name.replace(/ - (55th Street|61st Street|Beekman|Broadway|DHK|JO|LIC|Spiral|York|88 Pine|STARR|WGC|Westside|55th|61st)(\.pdf)?$/i, '');
  console.log(`  After location removal: "${step1}"`);
  
  let step2 = step1.replace(/ \((Spanish|Español)\)(\.pdf)?$/i, '');
  console.log(`  After language removal: "${step2}"`);
  
  let step3 = step2.replace(/\.pdf$/i, '');
  console.log(`  After extension removal: "${step3}"`);
  
  console.log(`  Final base type: "${step3.trim()}"`);
});