'use client';

import { DocsPage, DocsBody } from 'fumadocs-ui/page';
import { Callout } from 'fumadocs-ui/components/callout';

export default function KnowledgePage() {
  return (
    <DocsPage>
      <DocsBody>
        <h1>WCINYP Knowledge Base</h1>
        <p className="text-xl text-muted-foreground">
          Documentation and guides for the WCINYP platform
        </p>

        <Callout type="info" className="mt-6">
          The knowledge base is currently being updated. Please check back soon for comprehensive documentation, tutorials, and guides.
        </Callout>

        <div className="mt-8 space-y-8">
          <section>
            <h2>Coming Soon</h2>
            <p className="text-muted-foreground">
              We&apos;re working on creating comprehensive documentation for all WCINYP features:
            </p>
            <ul className="mt-4 space-y-2 text-sm">
              <li>• Getting started guides</li>
              <li>• Feature documentation</li>
              <li>• API references</li>
              <li>• Video tutorials</li>
              <li>• Best practices</li>
              <li>• Troubleshooting guides</li>
            </ul>
          </section>

          <section>
            <h2>Need Help Now?</h2>
            <p>While we build out the knowledge base, you can:</p>
            <ul className="mt-4 space-y-2 text-sm">
              <li>• Contact support at <strong>support@wcinyp.org</strong></li>
              <li>• Call us at <strong>(212) 555-0100</strong></li>
              <li>• Use the in-app help tooltips</li>
              <li>• Schedule a training session with our team</li>
            </ul>
          </section>
        </div>

        <Callout type="warning" className="mt-8">
          For urgent technical issues, please contact our support team directly for immediate assistance.
        </Callout>
      </DocsBody>
    </DocsPage>
  );
}