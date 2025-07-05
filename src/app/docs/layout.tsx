'use client'

import { pageTree } from '@/app/source'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

function renderTree(tree: any[], pathname: string, level = 0) {
  return tree.map((item) => {
    if (item.type === 'separator') {
      return (
        <div key={item.name} className="mt-4 mb-2">
          <div className="text-sm font-semibold text-muted-foreground px-3">
            {item.name}
          </div>
        </div>
      )
    }

    if (item.type === 'page') {
      const isActive = pathname === item.url
      return (
        <Link
          key={item.url}
          href={item.url}
          className={`block px-3 py-1.5 text-sm rounded-md transition-colors ${
            isActive
              ? 'bg-primary text-primary-foreground'
              : 'hover:bg-accent hover:text-accent-foreground'
          }`}
          style={{ paddingLeft: `${(level + 1) * 12}px` }}
        >
          {item.name}
        </Link>
      )
    }

    if (item.type === 'folder' && item.children) {
      return (
        <div key={item.name}>
          <div className="px-3 py-1.5 text-sm font-medium" style={{ paddingLeft: `${level * 12}px` }}>
            {item.name}
          </div>
          {renderTree(item.children, pathname, level + 1)}
        </div>
      )
    }

    return null
  })
}

export default function Layout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()

  return (
    <div className="flex min-h-screen">
      <aside className="w-64 border-r bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="sticky top-0 p-4">
          <Link href="/docs" className="text-lg font-bold mb-4 block">
            WCINYP Wiki
          </Link>
          <nav className="space-y-1">
            {renderTree(pageTree.children || [], pathname)}
          </nav>
        </div>
      </aside>
      <main className="flex-1 p-6">
        <div className="max-w-4xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  )
}