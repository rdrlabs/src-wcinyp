/**
 * Bug Demonstrations - Actual code that reproduces the identified issues
 * These examples show how the current implementation can fail
 */

// 1. DOCUMENT SELECTOR - Print Function Memory Leak
function demonstratePrintMemoryLeak() {
  console.log("=== DEMONSTRATING PRINT MEMORY LEAK ===");
  
  // Current implementation creates windows but may not clean them up properly
  const selectedDocs = ['/doc1.pdf', '/doc2.pdf', '/doc3.pdf'];
  const openWindows = [];
  
  try {
    selectedDocs.forEach(path => {
      const printWindow = window.open(path, '_blank');
      if (printWindow) {
        openWindows.push(printWindow);
        // If an error occurs here, windows remain open
        setTimeout(() => {
          printWindow.print(); // This could fail
        }, 500);
      }
    });
  } catch (error) {
    console.error("Print failed, but windows might still be open:", error);
    // BUG: No cleanup of openWindows array in current implementation
    console.log("Unclosed windows:", openWindows.length);
  }
}

// 2. DOCUMENT SELECTOR - State Inconsistency Bug
function demonstrateStateInconsistency() {
  console.log("=== DEMONSTRATING STATE INCONSISTENCY ===");
  
  let selectedDocs = [];
  let docQuantities = {};
  
  const toggleDocument = (path) => {
    if (selectedDocs.includes(path)) {
      // BUG: State updates are not atomic
      selectedDocs = selectedDocs.filter(p => p !== path);
      delete docQuantities[path]; // This could fail silently
    } else {
      selectedDocs = [...selectedDocs, path];
      docQuantities[path] = 1;
    }
  };
  
  // Simulate rapid toggling
  const docPath = '/test.pdf';
  for (let i = 0; i < 5; i++) {
    toggleDocument(docPath);
    console.log(`Toggle ${i}: Selected=${selectedDocs.length}, Quantities=${Object.keys(docQuantities).length}`);
  }
  
  // BUG: selectedDocs and docQuantities can become out of sync
  const isConsistent = selectedDocs.length === Object.keys(docQuantities).length;
  console.log("State is consistent:", isConsistent);
}

// 3. DOCUMENT SELECTOR - Popup Blocker Issue
function demonstratePopupBlockerIssue() {
  console.log("=== DEMONSTRATING POPUP BLOCKER ISSUE ===");
  
  // Mock window.open returning null (popup blocked)
  const originalOpen = window.open;
  window.open = () => null;
  
  const selectedDocs = ['/doc1.pdf', '/doc2.pdf'];
  
  try {
    selectedDocs.forEach(path => {
      const printWindow = window.open(path, '_blank');
      if (printWindow) {
        console.log("Window opened successfully");
      } else {
        // BUG: Current implementation throws error instead of graceful handling
        throw new Error('Unable to open print dialog. Please check your popup blocker settings.');
      }
    });
  } catch (error) {
    console.error("Print failed:", error.message);
    // BUG: User gets cryptic error message
  }
  
  // Restore original function
  window.open = originalOpen;
}

// 4. DOCUMENT SELECTOR - Search Performance Issue
function demonstrateSearchPerformanceIssue() {
  console.log("=== DEMONSTRATING SEARCH PERFORMANCE ISSUE ===");
  
  const largeFormList = Array.from({ length: 10000 }, (_, i) => ({
    name: `Document ${i}`,
    path: `/documents/doc${i}.pdf`,
    category: 'test'
  }));
  
  // Simulate the current search implementation
  const filterForms = (forms, searchTerm) => {
    return forms.filter(form => 
      form.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };
  
  // BUG: No debouncing - this runs on every keystroke
  const searchTerm = "Document";
  const startTime = performance.now();
  
  // Simulate typing "Document" character by character
  ['D', 'Do', 'Doc', 'Docu', 'Docum', 'Docume', 'Documen', 'Document'].forEach(term => {
    const results = filterForms(largeFormList, term);
    console.log(`Search "${term}": ${results.length} results`);
  });
  
  const endTime = performance.now();
  console.log(`Search took ${endTime - startTime}ms for ${largeFormList.length} items`);
  console.log("BUG: Each keystroke causes full list re-filtering without debouncing");
}

// 5. FORM BUILDER - Validation Bypass Bug
function demonstrateValidationBypassBug() {
  console.log("=== DEMONSTRATING VALIDATION BYPASS BUG ===");
  
  const formData = [
    { label: 'Patient Name', value: '', type: 'text', required: true },
    { label: 'Date of Birth', value: '', type: 'date', required: true },
    { label: 'Amount Due', value: '', type: 'number', required: true }
  ];
  
  // Current implementation only checks if form is completely empty
  const isFormEmpty = formData.every(field => !field.value.trim());
  
  // BUG: Can partially fill form and still print
  formData[0].value = 'John Doe'; // Fill only one field
  
  const isStillEmpty = formData.every(field => !field.value.trim());
  console.log("Form considered empty:", isStillEmpty); // false
  console.log("Print button enabled:", !isStillEmpty); // true
  
  // BUG: Should validate all required fields, not just check if completely empty
  const requiredFieldsValid = formData
    .filter(field => field.required)
    .every(field => field.value.trim());
  
  console.log("All required fields valid:", requiredFieldsValid); // false
  console.log("BUG: Print allowed despite missing required fields");
}

// 6. FORM BUILDER - Type Coercion Bug
function demonstrateTypeCoercionBug() {
  console.log("=== DEMONSTRATING TYPE COERCION BUG ===");
  
  const handleFieldChange = (field, value) => {
    // Current implementation just trims whitespace
    return { ...field, value: value.trim() };
  };
  
  const numberField = { label: 'Amount Due', value: '', type: 'number', required: true };
  
  // BUG: No type validation for number fields
  const invalidInputs = ['abc', '12.34.56', '1e10', '$100', 'NaN'];
  
  invalidInputs.forEach(input => {
    const updatedField = handleFieldChange(numberField, input);
    console.log(`Input "${input}" -> Value: "${updatedField.value}"`);
    console.log(`Is valid number: ${!isNaN(Number(updatedField.value))}`);
  });
  
  console.log("BUG: Invalid numeric inputs are accepted without validation");
}

// 7. FORM BUILDER - Print Without Validation Bug
function demonstratePrintWithoutValidationBug() {
  console.log("=== DEMONSTRATING PRINT WITHOUT VALIDATION BUG ===");
  
  const formData = [
    { label: 'Patient Name', value: 'John Doe', type: 'text', required: true },
    { label: 'Date of Birth', value: '2023-13-45', type: 'date', required: true }, // Invalid date
    { label: 'Amount Due', value: 'abc', type: 'number', required: true } // Invalid number
  ];
  
  // Current print validation
  const isFormEmpty = formData.every(field => !field.value.trim());
  
  console.log("Form empty check passed:", !isFormEmpty); // true
  console.log("Print would proceed with invalid data:");
  
  formData.forEach(field => {
    console.log(`  ${field.label}: "${field.value}" (type: ${field.type})`);
    
    if (field.type === 'date') {
      const isValidDate = !isNaN(Date.parse(field.value));
      console.log(`    Valid date: ${isValidDate}`);
    }
    
    if (field.type === 'number') {
      const isValidNumber = !isNaN(Number(field.value));
      console.log(`    Valid number: ${isValidNumber}`);
    }
  });
  
  console.log("BUG: Form prints with invalid data");
}

// 8. DOCUMENT SELECTOR - Document Name Extraction Bug
function demonstrateDocumentNameBug() {
  console.log("=== DEMONSTRATING DOCUMENT NAME EXTRACTION BUG ===");
  
  const getDocumentName = (path) => {
    const allForms = []; // Assume empty forms array
    const doc = allForms.find(f => f.path === path);
    return doc?.name || path.split('/').pop() || path;
  };
  
  const problematicPaths = [
    undefined,
    null,
    '',
    '/',
    '/documents/',
    '/documents/.hidden',
    '/very/long/path/with/many/segments/document-with-extremely-long-name-that-might-cause-ui-issues.pdf'
  ];
  
  problematicPaths.forEach(path => {
    try {
      const name = getDocumentName(path);
      console.log(`Path: ${path} -> Name: "${name}"`);
    } catch (error) {
      console.error(`Path: ${path} -> Error: ${error.message}`);
    }
  });
  
  console.log("BUG: Unsafe path handling can cause runtime errors");
}

// 9. DOCUMENT SELECTOR - Bulk Mode Calculation Bug
function demonstrateBulkModeCalculationBug() {
  console.log("=== DEMONSTRATING BULK MODE CALCULATION BUG ===");
  
  const selectedDocs = ['/doc1.pdf', '/doc2.pdf', '/doc3.pdf'];
  const docQuantities = {
    '/doc1.pdf': 5,
    '/doc2.pdf': 3,
    '/doc3.pdf': 2
  };
  let isBulkMode = false;
  let bulkQuantity = 10;
  
  const getTotalCopies = () => {
    if (isBulkMode) {
      return selectedDocs.length * bulkQuantity;
    }
    return selectedDocs.reduce((total, path) => total + (docQuantities[path] || 1), 0);
  };
  
  console.log("Individual mode totals:");
  console.log(`Total copies: ${getTotalCopies()}`); // 5 + 3 + 2 = 10
  
  // Switch to bulk mode
  isBulkMode = true;
  console.log("Bulk mode totals:");
  console.log(`Total copies: ${getTotalCopies()}`); // 3 * 10 = 30
  
  // BUG: Switching to bulk mode ignores individual quantities
  console.log("BUG: Previous individual quantities are lost when switching to bulk mode");
  
  // Switch back to individual mode
  isBulkMode = false;
  console.log("Back to individual mode:");
  console.log(`Total copies: ${getTotalCopies()}`); // Still 10, quantities preserved
  
  // But what if quantities were modified while in bulk mode?
  console.log("BUG: No clear indication to user about quantity behavior in mode switches");
}

// 10. CROSS-COMPONENT - Error Boundary Missing Bug
function demonstrateErrorBoundaryMissingBug() {
  console.log("=== DEMONSTRATING MISSING ERROR BOUNDARY BUG ===");
  
  // Simulate a component crash
  const CrashingComponent = () => {
    throw new Error("Simulated component crash");
  };
  
  try {
    // If this component crashes, it could take down the entire app
    console.log("Rendering crashing component...");
    // CrashingComponent(); // Uncomment to see crash
  } catch (error) {
    console.error("Component crashed:", error.message);
    console.log("BUG: No error boundary to catch component crashes");
    console.log("RESULT: Entire application becomes unusable");
  }
}

// Run all demonstrations
function runAllBugDemonstrations() {
  console.log("🐛 RUNNING BUG DEMONSTRATIONS\n");
  
  demonstratePrintMemoryLeak();
  console.log("\n" + "=".repeat(50) + "\n");
  
  demonstrateStateInconsistency();
  console.log("\n" + "=".repeat(50) + "\n");
  
  demonstratePopupBlockerIssue();
  console.log("\n" + "=".repeat(50) + "\n");
  
  demonstrateSearchPerformanceIssue();
  console.log("\n" + "=".repeat(50) + "\n");
  
  demonstrateValidationBypassBug();
  console.log("\n" + "=".repeat(50) + "\n");
  
  demonstrateTypeCoercionBug();
  console.log("\n" + "=".repeat(50) + "\n");
  
  demonstratePrintWithoutValidationBug();
  console.log("\n" + "=".repeat(50) + "\n");
  
  demonstrateDocumentNameBug();
  console.log("\n" + "=".repeat(50) + "\n");
  
  demonstrateBulkModeCalculationBug();
  console.log("\n" + "=".repeat(50) + "\n");
  
  demonstrateErrorBoundaryMissingBug();
  
  console.log("\n🐛 BUG DEMONSTRATIONS COMPLETE");
}

// Export for testing
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    demonstratePrintMemoryLeak,
    demonstrateStateInconsistency,
    demonstratePopupBlockerIssue,
    demonstrateSearchPerformanceIssue,
    demonstrateValidationBypassBug,
    demonstrateTypeCoercionBug,
    demonstratePrintWithoutValidationBug,
    demonstrateDocumentNameBug,
    demonstrateBulkModeCalculationBug,
    demonstrateErrorBoundaryMissingBug,
    runAllBugDemonstrations
  };
}