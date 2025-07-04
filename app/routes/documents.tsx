import { Button } from "~/components/ui/button";
import { ErrorBoundary } from "~/components/ErrorBoundary";
import { useState } from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";

export default function DocumentsRoute() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  // Organized documents by category
  const documentCategories = {
    "ABN Forms": [
      { name: "ABN - 55th Street.pdf", size: "83 KB", path: "ABN/ABN - 55th Street.pdf" },
      { name: "ABN - 61st Street.pdf", size: "83 KB", path: "ABN/ABN - 61st Street.pdf" },
      { name: "ABN - Beekman.pdf", size: "83 KB", path: "ABN/ABN - Beekman.pdf" },
      { name: "ABN - Broadway.pdf", size: "83 KB", path: "ABN/ABN - Broadway.pdf" },
      { name: "ABN - DHK.pdf", size: "132 KB", path: "ABN/ABN - DHK.pdf" },
      { name: "ABN - JO.pdf", size: "132 KB", path: "ABN/ABN - JO.pdf" },
      { name: "ABN - LIC.pdf", size: "132 KB", path: "ABN/ABN - LIC.pdf" },
      { name: "ABN - Spiral.pdf", size: "134 KB", path: "ABN/ABN - Spiral.pdf" },
      { name: "ABN - York.pdf", size: "135 KB", path: "ABN/ABN - York.pdf" },
      { name: "ABN in Spanish Template.pdf", size: "43 KB", path: "ABN/ABN in Spanish Template.pdf" },
    ],
    "Calcium Score ABN": [
      { name: "Calcium Score 61st Street.pdf", size: "128 KB", path: "ABN/ABN - Calcium Score 61st Street.pdf" },
      { name: "Calcium Score 61st Street (Spanish).pdf", size: "180 KB", path: "ABN/ABN - Calcium Score 61st Street (Spanish).pdf" },
      { name: "Calcium Score Beekman.pdf", size: "128 KB", path: "ABN/ABN - Calcium Score Beekman.pdf" },
      { name: "Calcium Score Beekman (Spanish).pdf", size: "194 KB", path: "ABN/ABN - Calcium Score Beekman (Spanish).pdf" },
      { name: "Calcium Score Broadway.pdf", size: "132 KB", path: "ABN/ABN - Calcium Score Broadway.pdf" },
      { name: "Calcium Score Broadway (Spanish).pdf", size: "196 KB", path: "ABN/ABN - Calcium Score Broadway (Spanish).pdf" },
      { name: "Calcium Score DHK.pdf", size: "132 KB", path: "ABN/ABN - Calcium Score DHK.pdf" },
      { name: "Calcium Score DHK (Spanish).pdf", size: "134 KB", path: "ABN/ABN - Calcium Score DHK (Spanish).pdf" },
      { name: "Calcium Score JO.pdf", size: "132 KB", path: "ABN/ABN - Calcium Score JO.pdf" },
      { name: "Calcium Score JO (Spanish).pdf", size: "134 KB", path: "ABN/ABN - Calcium Score JO (Spanish).pdf" },
      { name: "Calcium Score LIC.pdf", size: "132 KB", path: "ABN/ABN - Calcium Score LIC.pdf" },
      { name: "Calcium Score LIC (Spanish).pdf", size: "134 KB", path: "ABN/ABN - Calcium Score LIC (Spanish).pdf" },
      { name: "Calcium Score Spiral.pdf", size: "132 KB", path: "ABN/ABN - Calcium Score Spiral.pdf" },
      { name: "Calcium Score Spiral (Spanish).pdf", size: "134 KB", path: "ABN/ABN - Calcium Score Spiral (Spanish).pdf" },
    ],
    "Patient Questionnaires": [
      { name: "Biopsy Questionnaire.pdf", size: "175 KB", path: "Biopsy Questionnaire.pdf" },
      { name: "CT Questionnaire.pdf", size: "93 KB", path: "CT Questionnaire.pdf" },
      { name: "CT Questionnaire Disease Definitions.pdf", size: "235 KB", path: "CT Questionnaire Disease Definitions.pdf" },
      { name: "Cardiac Questionnaire.pdf", size: "145 KB", path: "Cardiac Questionnaire.pdf" },
      { name: "Fluoro Questionnaire.pdf", size: "222 KB", path: "Fluoro Questionnaire.pdf" },
      { name: "MRI Questionnaire.pdf", size: "157 KB", path: "MRI Questionnaire.pdf" },
      { name: "MRI Cardiovascular Form.pdf", size: "245 KB", path: "MRI Cardiovascular Form.pdf" },
      { name: "MRI Gynecologic Questionnaire.pdf", size: "208 KB", path: "MRI Gynecologic Questionnaire.pdf" },
      { name: "MRI Prostate Questionnaire.pdf", size: "208 KB", path: "MRI Prostate Questionnaire.pdf" },
      { name: "MRI Screening Non-Patient.pdf", size: "228 KB", path: "MRI Screening Non-Patient.pdf" },
      { name: "Mammography History Sheet.pdf", size: "228 KB", path: "Mammography History Sheet.pdf" },
      { name: "PETCT Questionnaire.pdf", size: "206 KB", path: "PETCT Questionnaire.pdf" },
      { name: "PETMRI Questionnaire.pdf", size: "205 KB", path: "PETMRI Questionnaire.pdf" },
      { name: "PKD Patient Questionnaire.pdf", size: "150 KB", path: "PKD Patient Questionnaire.pdf" },
      { name: "Ultrasound General Questionnaire.pdf", size: "196 KB", path: "Ultrasound General Questionnaire.pdf" },
      { name: "Ultrasound Gynecologic Questionnaire.pdf", size: "201 KB", path: "Ultrasound Gynecologic Questionnaire.pdf" },
      { name: "Ultrasound Soft Tissue Questionnaire.pdf", size: "528 KB", path: "Ultrasound Soft Tissue Questionnaire.pdf" },
      { name: "X-Ray Questionnaire.pdf", size: "213 KB", path: "X-Ray Questionnaire.pdf" },
    ],
    "Administrative Forms": [
      { name: "Appointment Verification Letter.pdf", size: "142 KB", path: "Appointment Verification Letter.pdf" },
      { name: "Change Verbal Order Forms.pdf", size: "166 KB", path: "Change Verbal Order Forms.pdf" },
      { name: "General Medical Records Release Form.pdf", size: "254 KB", path: "General Medical Records Release Form.pdf" },
      { name: "Mammogram Visit Confirmation Form.pdf", size: "156 KB", path: "Mammogram Visit Confirmation Form.pdf" },
      { name: "Minor Auth Form.pdf", size: "176 KB", path: "Minor Auth Form.pdf" },
      { name: "Outpatient Medical Chaperone Form.pdf", size: "111 KB", path: "Outpatient Medical Chaperone Form.pdf" },
      { name: "Waiver of Liability Form - Self Pay.pdf", size: "186 KB", path: "Waiver of Liability Form - Self Pay.pdf" },
      { name: "Waiver of Liability Form- Insurance Off-Hours.pdf", size: "186 KB", path: "Waiver of Liability Form- Insurance Off-Hours.pdf" },
      { name: "AOB Recalled Diag Mammo and Ultrasound Breast -2025.pdf", size: "109 KB", path: "AOB Recalled Diag Mammo and Ultrasound Breast -2025.pdf" },
    ],
    "Fax Transmittal Forms": [
      { name: "Fax Form - 55th.pdf", size: "214 KB", path: "Fax Transmittal Forms/Fax Transmittal Form - 55th.pdf" },
      { name: "Fax Form - 61st.pdf", size: "214 KB", path: "Fax Transmittal Forms/Fax Transmittal Form - 61st.pdf" },
      { name: "Fax Form - 88 Pine.pdf", size: "213 KB", path: "Fax Transmittal Forms/Fax Transmittal Form - 88 Pine.pdf" },
      { name: "Fax Form - Beekman.pdf", size: "213 KB", path: "Fax Transmittal Forms/Fax Transmittal Form - Beekman.pdf" },
      { name: "Fax Form - DHK.pdf", size: "213 KB", path: "Fax Transmittal Forms/Fax Transmittal Form - DHK.pdf" },
      { name: "Fax Form - LIC.pdf", size: "214 KB", path: "Fax Transmittal Forms/Fax Transmittal Form - LIC.pdf" },
      { name: "Fax Form - STARR.pdf", size: "214 KB", path: "Fax Transmittal Forms/Fax Transmittal Form - STARR.pdf" },
      { name: "Fax Form - Spiral.pdf", size: "213 KB", path: "Fax Transmittal Forms/Fax Transmittal Form - Spiral.pdf" },
      { name: "Fax Form - WGC.pdf", size: "214 KB", path: "Fax Transmittal Forms/Fax Transmittal Form - WGC.pdf" },
      { name: "Fax Form - Westside.pdf", size: "214 KB", path: "Fax Transmittal Forms/Fax Transmittal Form - Westside.pdf" },
    ],
    "Invoice Forms": [
      { name: "Invoice Guide - How to Fill Out.pdf", size: "247 KB", path: "Invoices/Invoice Form - (How to Fill Out an Invoice).pdf" },
      { name: "Invoice Form - CT.pdf", size: "117 KB", path: "Invoices/Invoice Form - CT.pdf" },
      { name: "Invoice Form - MRI.pdf", size: "118 KB", path: "Invoices/Invoice Form - MRI.pdf" },
      { name: "Invoice Form - Mammo.pdf", size: "115 KB", path: "Invoices/Invoice Form - Mammo.pdf" },
      { name: "Invoice Form - PET (FDG).pdf", size: "118 KB", path: "Invoices/Invoice Form - PET (FDG).pdf" },
      { name: "Invoice Form - PET.pdf", size: "116 KB", path: "Invoices/Invoice Form - PET.pdf" },
      { name: "Invoice Form - US.pdf", size: "116 KB", path: "Invoices/Invoice Form - US.pdf" },
      { name: "Invoice Form - Xray.pdf", size: "116 KB", path: "Invoices/Invoice Form - Xray.pdf" },
    ],
  };

  // Flatten all documents for search
  const allDocuments = Object.entries(documentCategories).flatMap(([category, docs]) =>
    docs.map(doc => ({ ...doc, category, lastUpdated: "2025-01-04" }))
  );
  
  // Filter documents based on search and category
  const baseDocuments = selectedCategory === "all"
    ? allDocuments
    : allDocuments.filter(doc => doc.category === selectedCategory);

  const filteredDocuments = searchTerm
    ? baseDocuments.filter(doc =>
        doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doc.category.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : baseDocuments;

  const categories = ["all", ...Object.keys(documentCategories)];

  return (
    <div className="container mx-auto py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Document Hub</h1>
        <p className="text-muted-foreground mt-2">
          Medical forms and documents repository
        </p>
      </div>

      <div className="mb-6 space-y-4">
        <div className="flex flex-wrap gap-2">
          {categories.map((category) => (
            <Button
              key={category}
              variant={selectedCategory === category ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory(category)}
              className="capitalize"
            >
              {category === "all" ? "All Documents" : category}
              {category === "all" && (
                <span className="ml-2 text-xs">({allDocuments.length})</span>
              )}
              {category !== "all" && (
                <span className="ml-2 text-xs">({documentCategories[category].length})</span>
              )}
            </Button>
          ))}
        </div>

        <input
          type="search"
          placeholder="Search documents..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full max-w-md px-4 py-2 border rounded-lg"
        />
      </div>

      <div className="rounded-md border">
        <Table>
          <TableCaption>
            {searchTerm && filteredDocuments.length === 0 
              ? `No documents found matching "${searchTerm}"`
              : `${filteredDocuments.length} documents available`
            }
          </TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[40%]">Document Name</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Size</TableHead>
              <TableHead>Updated</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredDocuments.map((doc, idx) => (
              <TableRow key={idx}>
                <TableCell className="font-medium">{doc.name}</TableCell>
                <TableCell>
                  <span className="inline-flex items-center rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10">
                    {doc.category}
                  </span>
                </TableCell>
                <TableCell>{doc.size}</TableCell>
                <TableCell>{doc.lastUpdated}</TableCell>
                <TableCell className="text-right">
                  <a
                    href={`/documents/${doc.path}`}
                    download
                    className="inline-flex"
                  >
                    <Button variant="ghost" size="sm">
                      <svg
                        className="w-4 h-4 mr-2"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10"
                        />
                      </svg>
                      Download
                    </Button>
                  </a>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

export { ErrorBoundary };