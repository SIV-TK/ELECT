import dynamic from 'next/dynamic'
import { Loader2 } from 'lucide-react'

// Loading component
const LoadingSpinner = () => (
  <div className="flex items-center justify-center min-h-screen">
    <Loader2 className="h-8 w-8 animate-spin" />
  </div>
)

// Dynamically import the actual page component with no SSR
const DynamicLiveTallyPage = dynamic(
  () => import('./live-tally-content'),
  { 
    ssr: false,
    loading: () => <LoadingSpinner />
  }
)

export default function LiveTallyPageWrapper() {
  return <DynamicLiveTallyPage />
}
