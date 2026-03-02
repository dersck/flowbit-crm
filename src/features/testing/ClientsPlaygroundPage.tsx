import { useEffect, useMemo, useState } from 'react'
import { Filter, Search } from 'lucide-react'
import ClientCard from '@/components/common/ClientCard'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { PageHeader } from '@/components/ui/page-header'
import FilterSidebar, { type ClientFilters } from '@/features/clients/FilterSidebar'
import { createTestClients } from '@/test/fixtures/workspace'
import type { Client } from '@/types'
import { cn } from '@/lib/utils'

export default function ClientsPlaygroundPage() {
  const [clients, setClients] = useState<Client[]>(() => createTestClients())
  const [searchTerm, setSearchTerm] = useState('')
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [filters, setFilters] = useState<ClientFilters>({
    source: [],
    stage: [],
    minBudget: '',
    maxBudget: '',
  })

  useEffect(() => {
    document.title = 'Clientes de prueba | Flowbit CRM'
  }, [])

  const filteredClients = useMemo(() => {
    return clients.filter((client) => {
      const term = searchTerm.toLowerCase()
      const matchesSearch =
        client.name.toLowerCase().includes(term) ||
        client.company?.toLowerCase().includes(term) ||
        client.contact.email?.toLowerCase().includes(term) ||
        client.contact.phone?.toLowerCase().includes(term)

      if (!matchesSearch) return false
      if (filters.source.length > 0 && !filters.source.includes(client.source || 'otro')) return false
      if (filters.stage.length > 0 && !filters.stage.includes(client.stage)) return false
      if (filters.minBudget && (client.budget || 0) < Number(filters.minBudget)) return false
      if (filters.maxBudget && (client.budget || 0) > Number(filters.maxBudget)) return false

      return true
    })
  }, [clients, filters, searchTerm])

  const activeFilterCount =
    filters.source.length +
    filters.stage.length +
    (filters.minBudget ? 1 : 0) +
    (filters.maxBudget ? 1 : 0)

  const hasActiveFilters = activeFilterCount > 0

  const handleDelete = (id: string) => {
    setClients((current) => current.filter((client) => client.id !== id))
  }

  const handleUpdateStage = (id: string, stage: Client['stage']) => {
    setClients((current) =>
      current.map((client) => (client.id === id ? { ...client, stage, updatedAt: new Date() } : client))
    )
  }

  const handleToggleWhatsApp = (target: Client) => {
    setClients((current) =>
      current.map((client) =>
        client.id === target.id
          ? {
              ...client,
              contact: {
                ...client.contact,
                noWhatsApp: !client.contact.noWhatsApp,
              },
              updatedAt: new Date(),
            }
          : client
      )
    )
  }

  return (
    <main className="min-h-screen bg-slate-50 p-6">
      <div className="mx-auto max-w-7xl space-y-8 pb-16">
        <PageHeader
          title="Clientes"
          subtitle="Sandbox semántico para validar flujos de búsqueda y filtros."
          eyebrow="Testing Route"
        />

        <section aria-label="Herramientas de busqueda y visualizacion" className="flex flex-col items-center gap-4 lg:flex-row">
          <div className="group relative w-full flex-1">
            <label htmlFor="testing-clients-search" className="sr-only">
              Buscar por nombre, empresa, email o telefono
            </label>
            <Search className="absolute left-5 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400 transition-colors group-focus-within:text-emerald-600" />
            <Input
              id="testing-clients-search"
              placeholder="Buscar por nombre, empresa, email o telefono..."
              className="h-[3.25rem] rounded-2xl border-slate-200 bg-white pl-14 text-base shadow-sm transition-all focus:ring-4 focus:ring-emerald-500/10"
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
            />
          </div>

          <FilterSidebar
            isOpen={isFilterOpen}
            onOpenChange={setIsFilterOpen}
            filters={filters}
            setFilters={setFilters}
            trigger={(
              <Button
                variant="outline"
                className={cn(
                  'h-[3.25rem] gap-3 rounded-2xl border-slate-200 bg-white px-6 font-black transition-all hover:bg-slate-50',
                  hasActiveFilters && 'border-emerald-200 bg-emerald-50/30 text-emerald-700'
                )}
              >
                <Filter className="h-5 w-5" />
                Filtros Avanzados
                {activeFilterCount > 0 ? (
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-600 text-[10px] text-white">
                    {activeFilterCount}
                  </span>
                ) : null}
              </Button>
            )}
          />
        </section>

        <section aria-labelledby="testing-clients-results-heading" className="space-y-4">
          <h2 id="testing-clients-results-heading" className="sr-only">
            Resultados de clientes
          </h2>
          <ul className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3 lg:gap-6">
            {filteredClients.map((client) => (
              <li key={client.id}>
                <ClientCard
                  client={client}
                  onDelete={handleDelete}
                  onUpdateStage={handleUpdateStage}
                  onToggleWhatsApp={handleToggleWhatsApp}
                />
              </li>
            ))}
          </ul>
        </section>
      </div>
    </main>
  )
}
