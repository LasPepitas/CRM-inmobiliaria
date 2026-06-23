import { useStore } from '@/store'
import { useMemo, useEffect } from 'react'

export function useLeadsData(search: string, stageFilter: string[]) {
  const leads = useStore((state) => state.leads)
  const loadingLeads = useStore((state) => state.loadingLeads)
  const leadsFetched = useStore((state) => state.leadsFetched)
  const hasFetchedAgents = useStore((state) => state.hasFetchedAgents)
  const fetchLeads = useStore((state) => state.fetchLeads)
  const fetchAgents = useStore((state) => state.fetchAgents)
  
  useEffect(() => {
    if (!leadsFetched) fetchLeads()
    if (!hasFetchedAgents) fetchAgents()
  }, [fetchLeads, fetchAgents, leadsFetched, hasFetchedAgents])
  
  
  const activeLeads = useMemo(() => {
    return leads
      .filter(l => l.status === 'Activo' || l.status === 'Convertido')
      .sort((a, b) => {
        if (a.status === 'Convertido' && b.status !== 'Convertido') return 1
        if (b.status === 'Convertido' && a.status !== 'Convertido') return -1
        return 0
      })
  }, [leads])
  const discardedLeads = useMemo(() => leads.filter(l => l.status === 'No Interesado'), [leads])

  const filteredLeads = useMemo(() => {
    return activeLeads.filter(lead => {
      const matchesSearch = (lead.firstName + ' ' + lead.lastName).toLowerCase().includes(search.toLowerCase()) ||
        lead.email.toLowerCase().includes(search.toLowerCase())
      const matchesStage = stageFilter.length === 0 || stageFilter.includes(lead.stage)
      return matchesSearch && matchesStage
    })
  }, [activeLeads, search, stageFilter])

  return {
    activeLeads,
    discardedLeads,
    filteredLeads,
    loadingLeads,
    refresh: fetchLeads
  }
}
