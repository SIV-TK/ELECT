'use client'

import dynamic from 'next/dynamic'
import { ComponentType } from 'react'
import { Loader2 } from 'lucide-react'

const LoadingSpinner = () => (
  <div className="flex items-center justify-center p-4">
    <Loader2 className="h-6 w-6 animate-spin" />
  </div>
)

export function withNoSSR<T extends object>(Component: ComponentType<T>) {
  return dynamic(() => Promise.resolve(Component), {
    ssr: false,
    loading: () => <LoadingSpinner />
  })
}
