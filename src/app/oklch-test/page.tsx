'use client'

export default function OKLCHTestPage() {
  return (
    <div className="p-8">
      <h1 className="text-4xl font-bold mb-8">OKLCH Color Support Test</h1>
      
      <div className="space-y-8">
        {/* Test if OKLCH is supported */}
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold">Direct OKLCH Colors</h2>
          <p className="text-sm text-muted-foreground">
            If you see colored boxes below, your browser supports OKLCH colors.
          </p>
          <div className="grid grid-cols-4 gap-4">
            <div className="space-y-2">
              <div 
                className="w-32 h-32 rounded-lg flex items-center justify-center text-white font-semibold"
                style={{ backgroundColor: 'oklch(66.7% 0.203 241.7)' }}
              >
                Blue
              </div>
              <p className="text-xs">oklch(66.7% 0.203 241.7)</p>
            </div>
            <div className="space-y-2">
              <div 
                className="w-32 h-32 rounded-lg flex items-center justify-center text-white font-semibold"
                style={{ backgroundColor: 'oklch(69.5% 0.203 25.5)' }}
              >
                Red
              </div>
              <p className="text-xs">oklch(69.5% 0.203 25.5)</p>
            </div>
            <div className="space-y-2">
              <div 
                className="w-32 h-32 rounded-lg flex items-center justify-center text-white font-semibold"
                style={{ backgroundColor: 'oklch(60.8% 0.149 149.5)' }}
              >
                Green
              </div>
              <p className="text-xs">oklch(60.8% 0.149 149.5)</p>
            </div>
            <div className="space-y-2">
              <div 
                className="w-32 h-32 rounded-lg flex items-center justify-center text-white font-semibold"
                style={{ backgroundColor: 'oklch(70.1% 0.179 44.2)' }}
              >
                Orange
              </div>
              <p className="text-xs">oklch(70.1% 0.179 44.2)</p>
            </div>
          </div>
        </div>

        {/* Fallback hex colors for comparison */}
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold">Fallback Hex Colors (for comparison)</h2>
          <div className="grid grid-cols-4 gap-4">
            <div className="space-y-2">
              <div 
                className="w-32 h-32 rounded-lg flex items-center justify-center text-white font-semibold"
                style={{ backgroundColor: '#3b82f6' }}
              >
                Blue
              </div>
              <p className="text-xs">#3b82f6</p>
            </div>
            <div className="space-y-2">
              <div 
                className="w-32 h-32 rounded-lg flex items-center justify-center text-white font-semibold"
                style={{ backgroundColor: '#ef4444' }}
              >
                Red
              </div>
              <p className="text-xs">#ef4444</p>
            </div>
            <div className="space-y-2">
              <div 
                className="w-32 h-32 rounded-lg flex items-center justify-center text-white font-semibold"
                style={{ backgroundColor: '#22c55e' }}
              >
                Green
              </div>
              <p className="text-xs">#22c55e</p>
            </div>
            <div className="space-y-2">
              <div 
                className="w-32 h-32 rounded-lg flex items-center justify-center text-white font-semibold"
                style={{ backgroundColor: '#f97316' }}
              >
                Orange
              </div>
              <p className="text-xs">#f97316</p>
            </div>
          </div>
        </div>

        {/* Test with CSS variables */}
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold">CSS Variables with OKLCH</h2>
          <style jsx>{`
            .test-oklch-blue {
              --test-color: oklch(66.7% 0.203 241.7);
              background-color: var(--test-color);
            }
            .test-oklch-red {
              --test-color: oklch(69.5% 0.203 25.5);
              background-color: var(--test-color);
            }
          `}</style>
          <div className="flex gap-4">
            <div className="test-oklch-blue w-32 h-32 rounded-lg flex items-center justify-center text-white font-semibold">
              CSS Var Blue
            </div>
            <div className="test-oklch-red w-32 h-32 rounded-lg flex items-center justify-center text-white font-semibold">
              CSS Var Red
            </div>
          </div>
        </div>

        {/* Browser support info */}
        <div className="space-y-2 p-4 bg-muted rounded-lg">
          <h3 className="font-semibold">Browser Support Notes:</h3>
          <ul className="list-disc list-inside text-sm space-y-1">
            <li>Chrome 111+ supports OKLCH colors</li>
            <li>Safari 15.4+ supports OKLCH colors</li>
            <li>Firefox 113+ supports OKLCH colors</li>
            <li>If you don&apos;t see colors above, your browser may not support OKLCH</li>
          </ul>
        </div>
      </div>
    </div>
  )
}