'use client'

export default function DirectTestPage() {
  return (
    <div className="p-8">
      <h1 className="text-4xl font-bold mb-8">Direct CSS Test</h1>
      
      <div className="space-y-8">
        {/* Direct OKLCH color test */}
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold">Direct OKLCH Colors</h2>
          <div className="flex gap-4">
            <div 
              className="w-32 h-32 rounded-lg flex items-center justify-center text-white font-semibold"
              style={{ backgroundColor: 'oklch(66.7% 0.203 241.7)' }}
            >
              Blue OKLCH
            </div>
            <div 
              className="w-32 h-32 rounded-lg flex items-center justify-center text-white font-semibold"
              style={{ backgroundColor: 'oklch(69.5% 0.203 25.5)' }}
            >
              Red OKLCH
            </div>
          </div>
        </div>

        {/* CSS variable test */}
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold">CSS Variables</h2>
          <div className="flex gap-4">
            <div 
              className="w-32 h-32 rounded-lg flex items-center justify-center text-white font-semibold"
              style={{ backgroundColor: 'var(--color-primary, #ff0000)' }}
            >
              var(--color-primary)
            </div>
            <div 
              className="w-32 h-32 rounded-lg flex items-center justify-center"
              style={{ 
                backgroundColor: 'var(--color-background, #ff0000)',
                color: 'var(--color-foreground, #00ff00)'
              }}
            >
              bg/fg vars
            </div>
          </div>
        </div>

        {/* Tailwind utility classes */}
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold">Tailwind Classes</h2>
          <div className="flex gap-4">
            <div className="w-32 h-32 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-primary-foreground font-semibold">bg-primary</span>
            </div>
            <div className="w-32 h-32 bg-background border-2 border-border rounded-lg flex items-center justify-center">
              <span className="text-foreground">bg-background</span>
            </div>
          </div>
        </div>

        {/* Manual theme test */}
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold">Manual Theme Application</h2>
          <button
            onClick={() => {
              const html = document.documentElement;
              // Remove all theme classes
              Array.from(html.classList).forEach(cls => {
                if (cls.startsWith('theme-')) {
                  html.classList.remove(cls);
                }
              });
              // Add theme-red class
              html.classList.add('theme-red');
              
              // Check computed styles
              const computed = getComputedStyle(html);
              console.log('HTML classes:', html.className);
              console.log('--color-primary:', computed.getPropertyValue('--color-primary'));
              
              // Force re-render
              window.location.reload();
            }}
            className="px-4 py-2 bg-secondary text-secondary-foreground rounded hover:bg-secondary/80"
          >
            Apply Red Theme & Reload
          </button>
        </div>
      </div>
    </div>
  )
}