'use client'

import { MDXRemote, type MDXRemoteSerializeResult } from 'next-mdx-remote'
import { useMDXComponents } from '../mdx-components'

interface MDXContentProps {
  code: React.ComponentType<{ components?: Record<string, React.ComponentType> }> | MDXRemoteSerializeResult
}

export function MDXContent({ code }: MDXContentProps) {
  const components = useMDXComponents({}) as Record<string, React.ComponentType>
  
  // For static export, we need to handle MDX differently
  // This is a simplified version that works with client-side rendering
  if (!code) return null
  
  // If code is already a component, render it directly
  if (typeof code === 'function') {
    const Component = code
    return <Component components={components} />
  }
  
  // Otherwise, it might be serialized MDX
  return <MDXRemote {...code} components={components} />
}