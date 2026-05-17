import { useState } from 'react'
import './questionnaire.css'
import { questionnaireSections } from './questionnaireSections'
import { supabase } from '../../lib/supabaseClient'

function Questionnaire() {
  const [accessGranted, setAccessGranted] = useState(false)
  const [accessCode, setAccessCode] = useState('')
  const [client, setClient] = useState(null)
  const [currentStep, setCurrentStep] = useState(0)
  const [formData, setFormData] = useState({})
  const [completedSections, setCompletedSections] = useState([])
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [submitted, setSubmitted] = useState(false)

  const currentSection = questionnaireSections[currentStep]

  const progress =
    (completedSections.length / questionnaireSections.length) * 100

  const allSectionsCompleted =
  completedSections.length === questionnaireSections.length

  const loadSavedResponses = async (clientId) => {
    const { data, error } = await supabase
      .from('questionnaire_responses')
      .select('section_key, data_json, completed')
      .eq('client_id', clientId)

    if (error) {
      console.error(error)
      setMessage('No se pudieron cargar las respuestas guardadas.')
      return
    }

    const mergedData = {}
    const completed = []

    data.forEach((response) => {
      Object.assign(mergedData, response.data_json)

      if (response.completed) {
        completed.push(response.section_key)
      }
    })

    setFormData(mergedData)
setCompletedSections(completed)

const firstIncompleteIndex = questionnaireSections.findIndex(
  (section) => !completed.includes(section.key)
)

if (firstIncompleteIndex !== -1) {
  setCurrentStep(firstIncompleteIndex)
} else {
  setCurrentStep(questionnaireSections.length - 1)
}
  }

  const handleAccess = async () => {
    const cleanCode = accessCode.trim()

    if (!cleanCode) {
      setMessage('Introduce tu código de acceso.')
      return
    }

    setLoading(true)
    setMessage('')

    const { data, error } = await supabase
      .from('clients')
      .select('*')
      .eq('access_code', cleanCode)
      .single()

    setLoading(false)

    if (error || !data) {
      console.error(error)
      setMessage('Código no válido. Revisa el código recibido por Menuria Solutions.')
      return
    }

    setClient(data)
    setAccessGranted(true)

    if (data.status === 'submitted') {
      setSubmitted(true)
      return
    }

    await loadSavedResponses(data.id)
  }

  const getCurrentSectionData = () => {
    const sectionData = {}

    currentSection.fields.forEach((field) => {
      sectionData[field.name] = formData[field.name] || ''
    })

    return sectionData
  }

  const markSectionCompleted = (sectionKey) => {
    setCompletedSections((prev) => {
      if (prev.includes(sectionKey)) return prev
      return [...prev, sectionKey]
    })
  }

  const saveCurrentSection = async ({ completed = false } = {}) => {
    if (!client) return false

    setLoading(true)
    setMessage('')

    const { error } = await supabase
      .from('questionnaire_responses')
      .upsert(
        {
          client_id: client.id,
          section_key: currentSection.key,
          data_json: getCurrentSectionData(),
          completed,
          updated_at: new Date().toISOString(),
        },
        {
          onConflict: 'client_id,section_key',
        }
      )

    setLoading(false)

    if (error) {
      console.error(error)
      setMessage('No se pudo guardar esta sección. Revisa la conexión o Supabase.')
      return false
    }

    if (completed) {
      markSectionCompleted(currentSection.key)
    }

    setMessage('Guardado correctamente.')
    return true
  }

  const handleChange = (name, value) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const nextStep = async () => {
    const saved = await saveCurrentSection({ completed: true })

    if (!saved) return

    if (currentStep < questionnaireSections.length - 1) {
      setCurrentStep((prev) => prev + 1)
      setMessage('')
    }
  }

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1)
      setMessage('')
    }
  }

  const submitForm = async () => {
    const saved = await saveCurrentSection({ completed: true })

    if (!saved) return

    setLoading(true)
    setMessage('')

    const { error } = await supabase
      .from('clients')
      .update({
        status: 'submitted',
        updated_at: new Date().toISOString(),
      })
      .eq('id', client.id)

    setLoading(false)

    if (error) {
      console.error(error)
      setMessage('Formulario guardado, pero no se pudo marcar como enviado.')
      return
    }

    setSubmitted(true)
  }

  if (submitted) {
    return (
      <div className="questionnaire-page">
        <div className="questionnaire-card">
          <p className="eyebrow">Menuria Solutions</p>

          <h1>Gracias por completar el formulario.</h1>

          <p className="section-description">
            Hemos recibido la información principal de tu restaurante.
            A partir de estos datos prepararemos una estructura digital
            personalizada para tu proyecto Menuria.
          </p>

          <p className="section-description">
            Si necesitamos algún detalle adicional, nos pondremos en contacto contigo.
          </p>
        </div>
      </div>
    )
  }

  if (!accessGranted) {
    return (
      <div className="questionnaire-page">
        <div className="questionnaire-card">
          <p className="eyebrow">Menuria Solutions</p>

          <h1>Formulario de onboarding</h1>

          <p>
            Introduce tu código de acceso para comenzar el onboarding
            de tu restaurante.
          </p>

          <input
            type="text"
            placeholder="Código de acceso"
            value={accessCode}
            onChange={(e) => setAccessCode(e.target.value)}
          />

          {message && <p className="form-message">{message}</p>}

          <button onClick={handleAccess} disabled={loading}>
            {loading ? 'Comprobando...' : 'Acceder'}
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="questionnaire-page">
      <div className="questionnaire-card">
        <p className="eyebrow">Menuria Solutions</p>

        <div className="progress-container">
          <div
            className="progress-bar"
            style={{ width: `${progress}%` }}
          />
        </div>

        <span className="step-counter">
          Paso {currentStep + 1} de {questionnaireSections.length} · {Math.round(progress)}% completado
        </span>

        <h1>{currentSection.title}</h1>

        <p className="section-description">
          {currentSection.description}
        </p>

        <div className="fields-container">
          {currentSection.fields.map((field) => (
            <div key={field.name} className="field-group">
              <label>{field.label}</label>

              {field.type === 'textarea' ? (
                <textarea
                  value={formData[field.name] || ''}
                  onChange={(e) =>
                    handleChange(field.name, e.target.value)
                  }
                />
              ) : field.type === 'select' ? (
                <select
                  value={formData[field.name] || ''}
                  onChange={(e) =>
                    handleChange(field.name, e.target.value)
                  }
                >
                  <option value="">Selecciona una opción</option>

                  {field.options.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              ) : (
                <input
                  type={field.type}
                  value={formData[field.name] || ''}
                  onChange={(e) =>
                    handleChange(field.name, e.target.value)
                  }
                />
              )}
            </div>
          ))}
        </div>

        {message && <p className="form-message">{message}</p>}

        <div className="button-group">
          <button onClick={prevStep} disabled={loading || currentStep === 0}>
            Atrás
          </button>

          <button
            onClick={() => saveCurrentSection({ completed: false })}
            disabled={loading}
          >
            {loading ? 'Guardando...' : 'Guardar'}
          </button>

          {currentStep < questionnaireSections.length - 1 ? (
            <button onClick={nextStep} disabled={loading}>
              Continuar
            </button>
          ) : (
            <button onClick={submitForm} disabled={loading}>
              Enviar formulario
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

export default Questionnaire