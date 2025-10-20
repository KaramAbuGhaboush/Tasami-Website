import { useHome } from '@/hooks/useHome'
import { Home } from '@/components/Home'

export default function HomePage() {
  const { services } = useHome()

  return <Home services={services} />
}