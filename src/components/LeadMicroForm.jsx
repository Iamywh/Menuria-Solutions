import { useState } from 'react'
import { supabase } from '../lib/supabaseClient'

function LeadMicroForm() {
  const [form, setForm] = useState({
    restaurant_name: '',
    contact_name: '',
    contact_method: 'phone',
    phone: '',
    email: '',
    interest: '',
    message: '',
  })

  const [loading, setLoading] = useState(false)
  const [feedback, setFeedback] = useState('')

  const updateField = (name, value) => {
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setFeedback('')

    if (!form.contact_name.trim()) {
      setFeedback('Indica tu nombre para poder contactarte.')
      return
    }

    if (form.contact_method === 'phone' && !form.phone.trim()) {
      setFeedback('Indica un teléfono para poder llamarte.')
      return
    }

    if (form.contact_method === 'email' && !form.email.trim()) {
      setFeedback('Indica un email para poder escribirte.')
      return
    }

    setLoading(true)

    const { error } = await supabase.from('leads').insert({
      restaurant_name: form.restaurant_name.trim(),
      contact_name: form.contact_name.trim(),
      contact_method: form.contact_method,
      phone: form.phone.trim(),
      email: form.email.trim(),
      interest: form.interest,
      message: form.message.trim(),
      status: 'new',
      source: 'website_microform',
      updated_at: new Date().toISOString(),
    })

    setLoading(false)

    if (error) {
      console.error(error)
      setFeedback('No se pudo enviar la solicitud. Inténtalo de nuevo.')
      return
    }

    setFeedback('Gracias. Hemos recibido tus datos y te contactaremos pronto.')

    setForm({
      restaurant_name: '',
      contact_name: '',
      contact_method: 'phone',
      phone: '',
      email: '',
      interest: '',
      message: '',
    })
  }

  return (
    <section className="relative z-10 mx-auto max-w-3xl px-6 py-16">
      <div className="rounded-3xl border border-white/10 bg-black/35 p-6 shadow-2xl backdrop-blur md:p-8">
        <p className="mb-3 text-sm font-semibold uppercase tracking-[0.25em] text-amber-300">
          Menuria Solutions
        </p>

        <h2 className="mb-4 text-3xl font-bold text-white md:text-4xl">
          ¿Quieres una experiencia digital para tu restaurante?
        </h2>

        <p className="mb-8 text-white/75">
          Déjanos tus datos y prepararemos una primera orientación para tu local.
          Sin compromiso, sin formularios eternos.
        </p>

        <form onSubmit={handleSubmit} className="grid gap-4">
          <input
            type="text"
            placeholder="Nombre del restaurante"
            value={form.restaurant_name}
            onChange={(e) => updateField('restaurant_name', e.target.value)}
            className="rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-white placeholder:text-white/45 outline-none focus:border-amber-300"
          />

          <input
            type="text"
            placeholder="Tu nombre"
            value={form.contact_name}
            onChange={(e) => updateField('contact_name', e.target.value)}
            className="rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-white placeholder:text-white/45 outline-none focus:border-amber-300"
          />

          <select
            value={form.contact_method}
            onChange={(e) => updateField('contact_method', e.target.value)}
            className="rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-white outline-none focus:border-amber-300"
          >
            <option value="phone">Prefiero llamada</option>
            <option value="email">Prefiero email</option>
            <option value="whatsapp">Prefiero WhatsApp</option>
          </select>

          {(form.contact_method === 'phone' || form.contact_method === 'whatsapp') && (
            <input
              type="text"
              placeholder="Teléfono / WhatsApp"
              value={form.phone}
              onChange={(e) => updateField('phone', e.target.value)}
              className="rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-white placeholder:text-white/45 outline-none focus:border-amber-300"
            />
          )}

          {form.contact_method === 'email' && (
            <input
              type="email"
              placeholder="Email"
              value={form.email}
              onChange={(e) => updateField('email', e.target.value)}
              className="rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-white placeholder:text-white/45 outline-none focus:border-amber-300"
            />
          )}

          <select
            value={form.interest}
            onChange={(e) => updateField('interest', e.target.value)}
            className="rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-white outline-none focus:border-amber-300"
          >
            <option value="">¿Qué te interesa mejorar?</option>
            <option value="qr_menu">Menú QR</option>
            <option value="allergens">Alérgenos y traducciones</option>
            <option value="bookings">Reservas online</option>
            <option value="chatbot">Chatbot FAQ</option>
            <option value="analytics">Analytics y dashboard</option>
            <option value="full_project">Proyecto completo Menuria</option>
          </select>

          <textarea
            placeholder="Cuéntanos brevemente qué necesitas"
            value={form.message}
            onChange={(e) => updateField('message', e.target.value)}
            className="min-h-28 rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-white placeholder:text-white/45 outline-none focus:border-amber-300"
          />

          {feedback && (
            <p className="rounded-2xl border border-amber-300/30 bg-amber-300/10 px-4 py-3 text-sm text-amber-100">
              {feedback}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="rounded-2xl bg-amber-400 px-5 py-3 font-bold text-black transition hover:bg-amber-300 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? 'Enviando...' : 'Solicitar primera orientación'}
          </button>
        </form>
      </div>
    </section>
  )
}

export default LeadMicroForm