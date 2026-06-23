import { useEffect } from 'react'
import { useStore } from '@/store'

export function useAgents() {
  const agents = useStore((state) => state.agents)
  const loadingAgents = useStore((state) => state.loadingAgents)
  const hasFetchedAgents = useStore((state) => state.hasFetchedAgents)
  const fetchAgents = useStore((state) => state.fetchAgents)

  useEffect(() => {
    if (!hasFetchedAgents && !loadingAgents) {
      fetchAgents()
    }
  }, [hasFetchedAgents, loadingAgents, fetchAgents])

  return { agents, loadingAgents, fetchAgents }
}
