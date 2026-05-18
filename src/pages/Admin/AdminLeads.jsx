import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabaseClient'

const ADMIN_CODE = import.meta.env.VITE_ADMIN_CODE

function AdminLeads() {
    const [accessCode, setAccessCode] = useState('')
    const [isAdmin, setIsAdmin] = useState(false)
    const [leads, setLeads] = useState([])
    const [loading, setLoading] = useState(false)
    const [message, setMessage] = useState('')
    const [statusFilter, setStatusFilter] = useState('all')
    const [searchTerm, setSearchTerm] = useState('')
    const statusFilters = [
        { value: 'all', label: 'Todos' },
        { value: 'new', label: 'Nuevos' },
        { value: 'contacted', label: 'Contactados' },
        { value: 'qualified', label: 'Calificados' },
        { value: 'proposal_sent', label: 'Propuesta enviada' },
        { value: 'accepted', label: 'Aceptados' },
        { value: 'lost', label: 'Perdidos' },
    ]

    const getOnboardingMessage = (lead) => {
        if (!lead.clients?.access_code) return ''

        return `Hola ${lead.contact_name}, gracias por tu interés en Menuria Solutions.

Ya hemos preparado tu acceso privado al formulario de onboarding.

Enlace:
${window.location.origin}/questionnaire

Código de acceso:
${lead.clients.access_code}

Con este formulario podremos recopilar la información necesaria para preparar la estructura digital de tu restaurante.

Un saludo,
Menuria Solutions`
    }

    const openWhatsApp = (lead) => {
        const phone = (lead.phone || '').replace(/\D/g, '')
        const message = encodeURIComponent(getOnboardingMessage(lead))

        if (!phone) {
            setMessage('Este lead no tiene teléfono para WhatsApp.')
            return
        }

        window.open(`https://wa.me/${phone}?text=${message}`, '_blank')
    }

    const openEmail = (lead) => {
        const email = lead.email || ''
        const subject = encodeURIComponent('Acceso onboarding Menuria Solutions')
        const body = encodeURIComponent(getOnboardingMessage(lead))

        if (!email) {
            setMessage('Este lead no tiene email.')
            return
        }

        window.location.href = `mailto:${email}?subject=${subject}&body=${body}`
    }

    const logLeadInteraction = async (leadId, actionType, note = '') => {
        const { error } = await supabase
            .from('lead_interactions')
            .insert({
                lead_id: leadId,
                action_type: actionType,
                note,
            })

        if (error) {
            console.error(error)
            setMessage('Acción realizada, pero no se pudo guardar la interacción.')
        }
    }
    const loadLeads = async () => {
        setLoading(true)
        setMessage('')

        const { data, error } = await supabase
            .from('leads')
            .select(`
    *,
    clients (
      id,
      restaurant_name,
      access_code,
      status
    ),
    lead_interactions (
      id,
      action_type,
      note,
      created_at
    )
  `)
            .order('created_at', { ascending: false })

        setLoading(false)

        if (error) {
            console.error(error)
            setMessage('No se pudieron cargar los leads.')
            return
        }

        setLeads(data || [])
    }

    const handleAccess = () => {
        if (accessCode.trim() !== ADMIN_CODE) {
            setMessage('Código admin no válido.')
            return
        }

        setIsAdmin(true)
        setMessage('')
    }

    

    const createOnboardingFromLead = async (lead) => {
        setMessage('')

        if (lead.client_id) {
            setMessage('Este lead ya tiene un onboarding creado.')
            return
        }

        const { data, error } = await supabase.functions.invoke(
            'admin-create-onboarding',
            {
                body: {
                    leadId: lead.id,
                },
                headers: {
                    'x-admin-code': ADMIN_CODE,
                },
            }
        )

        if (error) {
            console.error(error)
            setMessage('No se pudo crear el onboarding para este lead.')
            return
        }

        if (!data?.success) {
            console.error(data)
            setMessage(data?.error || 'No se pudo crear el onboarding.')
            return
        }

        setLeads((prev) =>
            prev.map((item) =>
                item.id === lead.id
                    ? {
                        ...item,
                        status: 'accepted',
                        client_id: data.client.id,
                        clients: {
                            id: data.client.id,
                            restaurant_name: data.client.restaurant_name,
                            access_code: data.accessCode,
                            status: data.client.status,
                        },
                    }
                    : item
            )
        )

        setMessage(`Onboarding creado. Código: ${data.accessCode}`)
    }


    const updateLeadStatus = async (leadId, status) => {
        setMessage('')

        const { error } = await supabase
            .from('leads')
            .update({
                status,
                updated_at: new Date().toISOString(),
            })
            .eq('id', leadId)

        if (error) {
            console.error(error)
            setMessage('No se pudo actualizar el estado del lead.')
            return
        }

        setLeads((prev) =>
            prev.map((lead) =>
                lead.id === leadId ? { ...lead, status } : lead
            )
        )
    }

    useEffect(() => {
        if (isAdmin) {
            loadLeads()
        }
    }, [isAdmin])

    if (!isAdmin) {
        return (
            <main className="min-h-screen bg-[#050816] px-6 py-12 text-white">
                <section className="mx-auto max-w-md rounded-3xl border border-white/10 bg-white/10 p-8 shadow-xl">
                    <p className="mb-3 text-sm font-bold uppercase tracking-[0.25em] text-[#c49a5a]">
                        Menuria Admin
                    </p>

                    <h1 className="mb-4 text-3xl font-bold text-[#f4c76b]">
                        Acceso leads
                    </h1>

                    <p className="mb-6 text-white/65">
                        Introduce el código admin para ver los contactos recibidos.
                    </p>

                    <input
                        type="password"
                        placeholder="Código admin"
                        value={accessCode}
                        onChange={(e) => setAccessCode(e.target.value)}
                        className="mb-4 w-full rounded-2xl border border-white/10 px-4 py-3 outline-none focus:border-[#c49a5a]"
                    />

                    {message && (
                        <p className="mb-4 rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-700">
                            {message}
                        </p>
                    )}

                    <button
                        onClick={handleAccess}
                        className="w-full rounded-2xl bg-[#f4c76b] px-5 py-3 font-bold text-white transition hover:bg-[#ffd978]"
                    >
                        Entrar
                    </button>
                </section>
            </main>
        )
    }

    const filteredLeads = leads.filter((lead) => {
        const matchesStatus =
            statusFilter === 'all' || lead.status === statusFilter

        const searchValue = searchTerm.toLowerCase().trim()

        const searchableText = [
            lead.restaurant_name,
            lead.contact_name,
            lead.email,
            lead.phone,
            lead.interest,
            lead.contact_method,
            lead.message,
        ]
            .filter(Boolean)
            .join(' ')
            .toLowerCase()

        const matchesSearch =
            !searchValue || searchableText.includes(searchValue)

        return matchesStatus && matchesSearch
    })
    const getStatusCount = (status) => {
        if (status === 'all') return leads.length
        return leads.filter((lead) => lead.status === status).length
    }
    const totalLeads = leads.length
    const newLeads = getStatusCount('new')
    const acceptedLeads = getStatusCount('accepted')
    const contactedLeads = getStatusCount('contacted')
    const conversionRate =
        totalLeads === 0 ? 0 : Math.round((acceptedLeads / totalLeads) * 100)
    return (
        <main className="min-h-screen bg-[#050816] px-4 py-8 text-white md:px-8">
            <section className="mx-auto max-w-6xl">
                <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
                    <div>
                        <p className="mb-2 text-sm font-bold uppercase tracking-[0.25em] text-[#c49a5a]">
                            Menuria Admin
                        </p>

                        <h1 className="text-3xl font-bold text-[#f4c76b] md:text-4xl">
                            Leads recibidos
                        </h1>

                        <p className="mt-2 text-white/65">
                            Contactos capturados desde el microform de la web.
                        </p>
                    </div>

                    <button
                        onClick={loadLeads}
                        disabled={loading}
                        className="rounded-2xl border border-[#c49a5a] bg-white/10 px-5 py-3 font-bold text-[#f4c76b] transition hover:bg-[#fff8ee] disabled:opacity-60"
                    >
                        {loading ? 'Cargando...' : 'Actualizar'}
                    </button>
                </div>

                {message && (
                    <p className="mb-6 rounded-2xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-700">
                        {message}
                    </p>
                )}
                <div className="mb-6 grid gap-4 md:grid-cols-4">
                    <div className="rounded-3xl border border-white/10 bg-white/10 p-5 shadow-sm">
                        <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#c49a5a]">
                            Total leads
                        </p>
                        <p className="mt-2 text-3xl font-bold text-[#f4c76b]">
                            {totalLeads}
                        </p>
                    </div>

                    <div className="rounded-3xl border border-white/10 bg-white/10 p-5 shadow-sm">
                        <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#c49a5a]">
                            Nuevos
                        </p>
                        <p className="mt-2 text-3xl font-bold text-[#f4c76b]">
                            {newLeads}
                        </p>
                    </div>

                    <div className="rounded-3xl border border-white/10 bg-white/10 p-5 shadow-sm">
                        <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#c49a5a]">
                            Contactados
                        </p>
                        <p className="mt-2 text-3xl font-bold text-[#f4c76b]">
                            {contactedLeads}
                        </p>
                    </div>

                    <div className="rounded-3xl border border-white/10 bg-white/10 p-5 shadow-sm">
                        <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#c49a5a]">
                            Conversión
                        </p>
                        <p className="mt-2 text-3xl font-bold text-[#f4c76b]">
                            {conversionRate}%
                        </p>
                        <p className="mt-1 text-xs text-white/65">
                            Leads aceptados / total
                        </p>
                    </div>
                </div>
                <div className="mb-4">
                    <input
                        type="text"
                        placeholder="Buscar por restaurante, contacto, email, teléfono o interés..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-sm text-white outline-none transition focus:border-[#c49a5a]"
                    />
                </div>
                <div className="mb-6 flex flex-wrap gap-2">
                    {statusFilters.map((filter) => (
                        <button
                            key={filter.value}
                            onClick={() => setStatusFilter(filter.value)}
                            className={`rounded-full border px-4 py-2 text-sm font-bold transition ${statusFilter === filter.value
                                ? 'border-[#7a3e22] bg-[#f4c76b] text-white'
                                : 'border-[#c49a5a] bg-white/10 text-[#f4c76b] hover:bg-[#fff8ee]'
                                }`}
                        >
                            {filter.label}
                            <span className="ml-2 rounded-full bg-white/10/25 px-2 py-0.5 text-xs">
                                {getStatusCount(filter.value)}
                            </span>
                        </button>
                    ))}
                </div>
                <div className="grid gap-4">
                    {filteredLeads.length === 0 && !loading && (
                        <div className="rounded-3xl border border-white/10 bg-white/10 p-8 text-center text-white/65">
                            Todavía no hay leads.
                        </div>
                    )}

                    {filteredLeads.map((lead) => (
                        <article
                            key={lead.id}
                            className="rounded-3xl border border-white/10 bg-white/10 p-5 shadow-sm"
                        >
                            <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                                <div>
                                    <h2 className="text-xl font-bold text-[#f4c76b]">
                                        {lead.restaurant_name || 'Restaurante sin nombre'}
                                    </h2>

                                    <p className="text-sm text-white/65">
                                        Contacto: <strong>{lead.contact_name}</strong>
                                    </p>

                                    <p className="text-sm text-white/65">
                                        Recibido: {new Date(lead.created_at).toLocaleString('es-ES')}
                                    </p>
                                </div>

                                <div className="flex flex-col gap-2">
                                    <select
                                        value={lead.status}
                                        onChange={(e) => updateLeadStatus(lead.id, e.target.value)}
                                        className="rounded-2xl border border-white/10 bg-[#050816] px-4 py-2 font-semibold text-white outline-none focus:border-[#c49a5a]"
                                    >
                                        <option value="new">Nuevo</option>
                                        <option value="contacted">Contactado</option>
                                        <option value="qualified">Calificado</option>
                                        <option value="proposal_sent">Propuesta enviada</option>
                                        <option value="accepted">Aceptado</option>
                                        <option value="lost">Perdido</option>
                                    </select>

                                    <button
                                        onClick={() => createOnboardingFromLead(lead)}
                                        disabled={Boolean(lead.client_id)}
                                        className="rounded-2xl bg-[#f4c76b] px-4 py-2 text-sm font-bold text-white transition hover:bg-[#ffd978] disabled:cursor-not-allowed disabled:opacity-50"
                                    >
                                        {lead.client_id ? 'Onboarding creado' : 'Crear onboarding'}
                                    </button>
                                </div>
                            </div>

                            <div className="grid gap-3 text-sm md:grid-cols-2">
                                <p>
                                    <span className="font-bold text-white">Método:</span>{' '}
                                    {lead.contact_method}
                                </p>

                                <p>
                                    <span className="font-bold text-white">Interés:</span>{' '}
                                    {lead.interest || 'No indicado'}
                                </p>

                                <p>
                                    <span className="font-bold text-white">Teléfono:</span>{' '}
                                    {lead.phone || 'No indicado'}
                                </p>

                                <p>
                                    <span className="font-bold text-white">Email:</span>{' '}
                                    {lead.email || 'No indicado'}
                                </p>
                            </div>

                            {lead.message && (
                                <p className="mt-4 rounded-2xl bg-[#050816] p-4 text-sm leading-relaxed text-white/65">
                                    {lead.message}
                                </p>
                            )}
                            {lead.clients?.access_code && (
                                <div className="mt-4 rounded-2xl border border-[#f4c76b]/30 bg-white/10 p-4 shadow-lg backdrop-blur">
                                    <p className="mb-2 text-sm font-bold text-[#f4c76b]">
                                        Onboarding creado
                                    </p>

                                    <p className="text-sm text-white/65">
                                        Link:
                                        <span className="ml-2 font-semibold text-white">
                                            /questionnaire
                                        </span>
                                    </p>

                                    <p className="text-sm text-white/65">
                                        Código:
                                        <span className="ml-2 font-semibold text-white">
                                            {lead.clients.access_code}
                                        </span>
                                    </p>

                                    <textarea
                                        readOnly
                                        value={getOnboardingMessage(lead)}
                                        className="mt-4 min-h-44 w-full rounded-2xl border border-white/10 bg-white/10 p-4 text-sm text-white outline-none"
                                    />

                                    <div className="mt-3 flex flex-col gap-2 md:flex-row">
                                        <button
                                            onClick={async () => {
                                                await navigator.clipboard.writeText(getOnboardingMessage(lead))
                                                await logLeadInteraction(lead.id, 'copy_message', 'Mensaje de onboarding copiado')
                                            }}
                                            className="rounded-2xl bg-[#f4c76b] px-4 py-2 text-sm font-bold text-[#050816] transition hover:bg-[#ffd978]"
                                        >
                                            Copiar mensaje
                                        </button>

                                        <button
                                            onClick={async () => {
                                                openWhatsApp(lead)
                                                await logLeadInteraction(lead.id, 'whatsapp_opened', 'WhatsApp abierto con mensaje de onboarding')
                                            }}
                                            className="rounded-2xl bg-[#1f7a4d] px-4 py-2 text-sm font-bold text-white transition hover:bg-[#17613d]"
                                        >
                                            Abrir WhatsApp
                                        </button>

                                        <button
                                            onClick={async () => {
                                                openEmail(lead)
                                                await logLeadInteraction(lead.id, 'email_opened', 'Email abierto con mensaje de onboarding')
                                            }}
                                            className="rounded-2xl bg-[#2f5f9f] px-4 py-2 text-sm font-bold text-white transition hover:bg-[#254d80]"
                                        >
                                            Abrir email
                                        </button>
                                    </div>
                                </div>
                            )}
                            {lead.lead_interactions?.length > 0 && (
                                <div className="mt-4 rounded-2xl border border-white/10 bg-[#050816] p-4">
                                    <p className="mb-3 text-sm font-bold text-[#f4c76b]">
                                        Historial comercial
                                    </p>

                                    <div className="space-y-2">
                                        {lead.lead_interactions
                                            .slice()
                                            .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
                                            .map((interaction) => (
                                                <div
                                                    key={interaction.id}
                                                    className="rounded-xl bg-white/10 px-3 py-2 text-sm text-white/65"
                                                >
                                                    <div className="flex flex-col gap-1 md:flex-row md:items-center md:justify-between">
                                                        <span className="font-semibold text-white">
                                                            {interaction.action_type}
                                                        </span>

                                                        <span className="text-xs text-white/65">
                                                            {new Date(interaction.created_at).toLocaleString('es-ES')}
                                                        </span>
                                                    </div>

                                                    {interaction.note && (
                                                        <p className="mt-1 text-xs">
                                                            {interaction.note}
                                                        </p>
                                                    )}
                                                </div>
                                            ))}
                                    </div>
                                </div>
                            )}
                        </article>
                    ))}
                </div>
            </section>
        </main>
    )
}

export default AdminLeads