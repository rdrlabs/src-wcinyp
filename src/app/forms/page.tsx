'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function FormsRedirectPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/documents');
  }, [router]);

  return (
    <div className="container mx-auto py-8">
      <p className="text-center text-muted-foreground" data-testid="redirect-message">Redirecting to Documents & Forms...</p>
    </div>
  );
}