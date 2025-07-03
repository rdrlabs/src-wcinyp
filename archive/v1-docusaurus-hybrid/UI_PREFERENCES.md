# UI Preferences & Design Decisions

## 📋 **Purpose**
This document tracks user preferences for UI organization, grouping, and layout patterns. These preferences guide development decisions but are NOT rigid constraints - they should be balanced with usability and future development needs.

## 🎯 **Document Organization Preferences**

### **General Forms Section**
**User Preference:** Keep 3 forms in General section with specific order:
1. **Minor Auth Form** (first)
2. **Outpatient Medical Chaperone Form** (second) 
3. **General Medical Records Release Form** (third/last)

**Rationale:** User requested moving Minor Auth and Med Chap from quick-add to General section, with Med Recs form added but placed after the other two.

### **Financial Forms Section**
**User Preference:** Maintain separate Financial Forms section for payment-related documents:
- **Waiver of Liability Form - Self Pay**
- **Waiver of Liability Form - Insurance Off-Hours**

**Rationale:** These forms serve different workflow purposes than general medical forms and should remain grouped separately for SPC workflow efficiency.

**Color:** Red (`#dc2626`) to distinguish from other sections

### **Screening Forms Sections**
**User Preference:** Keep modality-based organization:
- **MRI Forms** (Blue `#3b82f6`)
- **CT Forms** (Green `#10b981`) 
- **PET Forms** (Amber `#f59e0b`)
- **Ultrasound Forms** (Violet `#8b5cf6`)

## 🔧 **Layout Patterns**

### **Provider Pattern Standard**
**User Preference:** All components MUST follow Provider layout pattern exactly:
- Header with title, search, and filter buttons
- Content area with consistent spacing
- No sidebar layouts - everything in header

**Implementation:** Reference `src/pages/providers.tsx` as the design standard

### **Filter Button Organization**
**User Preference:** Filters in header area, not in sidebar
- General, Financial, MRI, CT, PET, US buttons
- Color-coded to match section colors
- Toggle visibility functionality

## 📝 **Change Management Guidelines**

### **When User Requests Changes**
1. **Document the preference** in this file immediately
2. **Ask clarifying questions** if the request could impact other areas
3. **Consider workflow implications** for SPCs using the system
4. **Implement flexibly** - don't hardcode preferences that might limit future development

### **Preference Tracking Format**
```markdown
### **[Component/Section Name]**
**User Preference:** [Specific request/preference]
**Rationale:** [Why this preference was requested]
**Implementation Notes:** [How to implement while maintaining flexibility]
**Date:** [When preference was established]
```

### **Example Change Request Processing**
**Request:** "Put minor auth and med chap from quick add to general section"

**Analysis:**
- User wants specific forms moved between sections
- Added Med Recs form as well (good assumption)
- BUT removed Financial section (mistake - should have asked)

**Correct Implementation:**
- Move requested forms to General section
- Keep Financial section separate
- Ask about any other organizational preferences

## 🚨 **Critical Guidelines**

### **DO:**
- ✅ Track all UI organization requests in this document
- ✅ Ask clarifying questions when requests might affect other areas
- ✅ Implement preferences while maintaining system flexibility
- ✅ Consider SPC workflow efficiency in all decisions
- ✅ Test changes to ensure they don't break existing functionality

### **DON'T:**
- ❌ Make assumptions about unmentioned areas when reorganizing
- ❌ Hardcode preferences that could limit future development
- ❌ Remove existing functionality without explicit user request
- ❌ Change multiple areas when only one was mentioned
- ❌ Forget to update tests when UI structure changes

## 📊 **Workflow Considerations**

### **SPC Usage Patterns**
- **High-volume document selection** requires efficient organization
- **Multi-category workflows** need clear visual separation
- **Quick access** to commonly used forms is critical
- **Error prevention** through logical grouping reduces mistakes

### **Future Development Flexibility**
- New document categories may be added
- Workflow requirements may change
- User preferences may evolve
- System should accommodate growth without major restructuring

---

**Remember:** These preferences guide decisions but don't override usability, accessibility, or technical best practices. Always balance user preferences with system requirements and SPC workflow efficiency.