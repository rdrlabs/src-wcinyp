'use client'

export default function IntroductionPage() {
  return (
    <article className="prose prose-gray dark:prose-invert max-w-none">
      <h1>Introduction to WCINYP</h1>
      <p className="text-xl text-muted-foreground">
        Learn about the WCINYP system
      </p>
      
      <h2>What is WCINYP?</h2>
      <p>
        WCINYP (Weill Cornell Imaging at NewYork-Presbyterian) is a comprehensive medical imaging center management system.
        It provides tools for document management, provider directories, form generation, and contact management.
      </p>
      
      <h2>Key Features</h2>
      <ul>
        <li><strong>Document Hub</strong>: Centralized repository for all medical forms and documents</li>
        <li><strong>Provider Directory</strong>: Complete database of medical staff and their contact information</li>
        <li><strong>Form Builder</strong>: Dynamic form creation and management system</li>
        <li><strong>Contact Directory</strong>: Comprehensive contact management for all personnel</li>
      </ul>
      
      <h2>Who Uses WCINYP?</h2>
      <p>
        The system is designed for:
      </p>
      <ul>
        <li>Medical staff needing quick access to forms and documents</li>
        <li>Administrative personnel managing provider information</li>
        <li>Front desk staff handling patient forms</li>
        <li>IT staff maintaining the system</li>
      </ul>
      
      <h2>Getting Help</h2>
      <p>
        If you need assistance with WCINYP:
      </p>
      <ul>
        <li>Check the Quick Start Guide for basic operations</li>
        <li>Browse the feature documentation for detailed guides</li>
        <li>Contact IT support through the Contact Directory</li>
      </ul>
    </article>
  )
}