import { useStore } from '@/store'
import { useMemo, useEffect } from 'react'

export function useLeadsData(search: string, stageFilter: string[]) {
  const leads = useStore((state) => state.leads)
  const loadingLeads = useStore((state) => state.loadingLeads)
  const fetchLeads = useStore((state) => state.fetchLeads)
  const fetchAgents = useStore((state) => state.fetchAgents)
  
  useEffect(() => {
    fetchLeads()
    fetchAgents()
  }, [fetchLeads, fetchAgents])
  
  
  const activeLeads = useMemo(() => leads.filter(l => l.status === 'Activo'), [leads])
  const discardedLeads = useMemo(() => leads.filter(l => l.status === 'No Interesado' || l.status === 'Pausado'), [leads])

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
    loadingLeads
  }
}
