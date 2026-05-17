import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabaseClient'

const ADMIN_CODE = 'MENURIA-ADMIN-2026'

function AdminLeads() {
  const [accessCode, setAccessCode] = useState('')
  const [isAdmin, setIsAdmin] = useState(false)
  const [leads, setLeads] = useState([])
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

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

  const generateAccessCode = (restaurantName = '') => {
  const cleanPrefix = restaurantName
    .toUpperCase()
    .replace(/[^A-Z0-9\s]/g, '')
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word.slice(0, 3))
    .join('-') || 'MENURIA'

  const randomPart = Math.random().toString(36).substring(2, 6).toUpperCase()

  return `${cleanPrefix}-2026-${randomPart}`
}

const createOnboardingFromLead = async (lead) => {
  setMessage('')

  if (lead.client_id) {
    setMessage('Este lead ya tiene un onboarding creado.')
    return
  }

  const accessCode = generateAccessCode(lead.restaurant_name)

  const { data: clientData, error: clientError } = await supabase
    .from('clients')
    .insert({
      restaurant_name: lead.restaurant_name || 'Restaurante sin nombre',
      contact_name: lead.contact_name,
      email: lead.email || null,
      phone: lead.phone || null,
      access_code: accessCode,
      status: 'onboarding',
      updated_at: new Date().toISOString(),
    })
    .select()
    .single()

  if (clientError) {
    console.error(clientError)
    setMessage('No se pudo crear el onboarding para este lead.')
    return
  }

  const { error: leadError } = await supabase
    .from('leads')
    .update({
      status: 'accepted',
      client_id: clientData.id,
      updated_at: new Date().toISOString(),
    })
    .eq('id', lead.id)

  if (leadError) {
    console.error(leadError)
    setMessage('Cliente creado, pero no se pudo vincular el lead.')
    return
  }

  setLeads((prev) =>
    prev.map((item) =>
      item.id === lead.id
        ? {
            ...item,
            status: 'accepted',
            client_id: clientData.id,
            generated_access_code: accessCode,
          }
        : item
    )
  )

  setMessage(`Onboarding creado. Código: ${accessCode}`)
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
      <main className="min-h-screen bg-[#f8f3ea] px-6 py-12 text-[#2b2118]">
        <section className="mx-auto max-w-md rounded-3xl border border-[#e5d8c7] bg-white p-8 shadow-xl">
          <p className="mb-3 text-sm font-bold uppercase tracking-[0.25em] text-[#c49a5a]">
            Menuria Admin
          </p>

          <h1 className="mb-4 text-3xl font-bold text-[#7a3e22]">
            Acceso leads
          </h1>

          <p className="mb-6 text-[#7b6f64]">
            Introduce el código admin para ver los contactos recibidos.
          </p>

          <input
            type="password"
            placeholder="Código admin"
            value={accessCode}
            onChange={(e) => setAccessCode(e.target.value)}
            className="mb-4 w-full rounded-2xl border border-[#e5d8c7] px-4 py-3 outline-none focus:border-[#c49a5a]"
          />

          {message && (
            <p className="mb-4 rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-700">
              {message}
            </p>
          )}

          <button
            onClick={handleAccess}
            className="w-full rounded-2xl bg-[#7a3e22] px-5 py-3 font-bold text-white transition hover:bg-[#5f2f19]"
          >
            Entrar
          </button>
        </section>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-[#f8f3ea] px-4 py-8 text-[#2b2118] md:px-8">
      <section className="mx-auto max-w-6xl">
        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="mb-2 text-sm font-bold uppercase tracking-[0.25em] text-[#c49a5a]">
              Menuria Admin
            </p>

            <h1 className="text-3xl font-bold text-[#7a3e22] md:text-4xl">
              Leads recibidos
            </h1>

            <p className="mt-2 text-[#7b6f64]">
              Contactos capturados desde el microform de la web.
            </p>
          </div>

          <button
            onClick={loadLeads}
            disabled={loading}
            className="rounded-2xl border border-[#c49a5a] bg-white px-5 py-3 font-bold text-[#7a3e22] transition hover:bg-[#fff8ee] disabled:opacity-60"
          >
            {loading ? 'Cargando...' : 'Actualizar'}
          </button>
        </div>

        {message && (
          <p className="mb-6 rounded-2xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-700">
            {message}
          </p>
        )}

        <div className="grid gap-4">
          {leads.length === 0 && !loading && (
            <div className="rounded-3xl border border-[#e5d8c7] bg-white p-8 text-center text-[#7b6f64]">
              Todavía no hay leads.
            </div>
          )}

          {leads.map((lead) => (
            <article
              key={lead.id}
              className="rounded-3xl border border-[#e5d8c7] bg-white p-5 shadow-sm"
            >
              <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                <div>
                  <h2 className="text-xl font-bold text-[#7a3e22]">
                    {lead.restaurant_name || 'Restaurante sin nombre'}
                  </h2>

                  <p className="text-sm text-[#7b6f64]">
                    Contacto: <strong>{lead.contact_name}</strong>
                  </p>

                  <p className="text-sm text-[#7b6f64]">
                    Recibido: {new Date(lead.created_at).toLocaleString('es-ES')}
                  </p>
                </div>

                <div className="flex flex-col gap-2">
                <select
                    value={lead.status}
                    onChange={(e) => updateLeadStatus(lead.id, e.target.value)}
                    className="rounded-2xl border border-[#e5d8c7] bg-[#f8f3ea] px-4 py-2 font-semibold text-[#2b2118] outline-none focus:border-[#c49a5a]"
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
                    className="rounded-2xl bg-[#7a3e22] px-4 py-2 text-sm font-bold text-white transition hover:bg-[#5f2f19] disabled:cursor-not-allowed disabled:opacity-50"
                >
                    {lead.client_id ? 'Onboarding creado' : 'Crear onboarding'}
                </button>
                </div>
              </div>

              <div className="grid gap-3 text-sm md:grid-cols-2">
                <p>
                  <span className="font-bold text-[#2b2118]">Método:</span>{' '}
                  {lead.contact_method}
                </p>

                <p>
                  <span className="font-bold text-[#2b2118]">Interés:</span>{' '}
                  {lead.interest || 'No indicado'}
                </p>

                <p>
                  <span className="font-bold text-[#2b2118]">Teléfono:</span>{' '}
                  {lead.phone || 'No indicado'}
                </p>

                <p>
                  <span className="font-bold text-[#2b2118]">Email:</span>{' '}
                  {lead.email || 'No indicado'}
                </p>
              </div>

              {lead.message && (
                <p className="mt-4 rounded-2xl bg-[#f8f3ea] p-4 text-sm leading-relaxed text-[#7b6f64]">
                  {lead.message}
                </p>
              )}
              {lead.clients?.access_code && (
                <div className="mt-4 rounded-2xl border border-[#c49a5a]/40 bg-[#fff8ee] p-4">
                    <p className="mb-2 text-sm font-bold text-[#7a3e22]">
                    Onboarding creado
                    </p>

                    <p className="text-sm text-[#7b6f64]">
                    Link:
                    <span className="ml-2 font-semibold text-[#2b2118]">
                        /questionnaire
                    </span>
                    </p>

                    <p className="text-sm text-[#7b6f64]">
                    Código:
                    <span className="ml-2 font-semibold text-[#2b2118]">
                        {lead.clients.access_code}
                    </span>
                    </p>

                    <textarea
                    readOnly
                    value={`Hola ${lead.contact_name}, gracias por tu interés en Menuria Solutions.

                Ya hemos preparado tu acceso privado al formulario de onboarding.

                Enlace:
                ${window.location.origin}/questionnaire

                Código de acceso:
                ${lead.clients.access_code}

                Con este formulario podremos recopilar la información necesaria para preparar la estructura digital de tu restaurante.

                Un saludo,
                Menuria Solutions`}
                    className="mt-4 min-h-44 w-full rounded-2xl border border-[#e5d8c7] bg-white p-4 text-sm text-[#2b2118] outline-none"
                    />

                    <button
                    onClick={() =>
                        navigator.clipboard.writeText(`Hola ${lead.contact_name}, gracias por tu interés en Menuria Solutions.

                Ya hemos preparado tu acceso privado al formulario de onboarding.

                Enlace:
                ${window.location.origin}/questionnaire

                Código de acceso:
                ${lead.clients.access_code}

                Con este formulario podremos recopilar la información necesaria para preparar la estructura digital de tu restaurante.

                Un saludo,
                Menuria Solutions`)
                    }
                    className="mt-3 rounded-2xl bg-[#7a3e22] px-4 py-2 text-sm font-bold text-white transition hover:bg-[#5f2f19]"
                    >
                    Copiar mensaje para cliente
                    </button>
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