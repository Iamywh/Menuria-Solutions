import { useState } from 'react'
import './questionnaire.css'
import { questionnaireSections } from './questionnaireSections'

function Questionnaire() {
  const [accessGranted, setAccessGranted] = useState(false)
  const [accessCode, setAccessCode] = useState('')
  const [currentStep, setCurrentStep] = useState(0)
  const [formData, setFormData] = useState({})

  const validCode = 'NA-2026-MENURIA'

  const currentSection = questionnaireSections[currentStep]

  const progress =
    ((currentStep + 1) / questionnaireSections.length) * 100

  const handleAccess = () => {
    if (accessCode === validCode) {
      setAccessGranted(true)
    } else {
      alert('Código no válido.')
    }
  }

  const handleChange = (name, value) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const nextStep = () => {
    if (currentStep < questionnaireSections.length - 1) {
      setCurrentStep((prev) => prev + 1)
    }
  }

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1)
    }
  }

  const saveForm = () => {
    localStorage.setItem(
      'menuria_questionnaire',
      JSON.stringify(formData)
    )

    alert('Formulario guardado correctamente.')
  }

  if (!accessGranted) {
    return (
      <div className="questionnaire-page">
        <div className="questionnaire-card">
          <h1>Menuria Solutions</h1>

          <p>
            Introduce tu código de acceso para comenzar el
            onboarding de tu restaurante.
          </p>

          <input
            type="text"
            placeholder="Código de acceso"
            value={accessCode}
            onChange={(e) => setAccessCode(e.target.value)}
          />

          <button onClick={handleAccess}>
            Acceder
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="questionnaire-page">
      <div className="questionnaire-card">

        <div className="progress-container">
          <div
            className="progress-bar"
            style={{ width: `${progress}%` }}
          />
        </div>

        <span className="step-counter">
          Paso {currentStep + 1} de {questionnaireSections.length}
        </span>

        <h1>{currentSection.title}</h1>

        <p className="section-description">
          {currentSection.description}
        </p>

        <div className="fields-container">
          {currentSection.fields.map((field) => (
            <div
              key={field.name}
              className="field-group"
            >
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
                  <option value="">
                    Selecciona una opción
                  </option>

                  {field.options.map((option) => (
                    <option
                      key={option}
                      value={option}
                    >
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

        <div className="button-group">

          <button onClick={prevStep}>
            Atrás
          </button>

          <button onClick={saveForm}>
            Guardar
          </button>

          {currentStep < questionnaireSections.length - 1 ? (
            <button onClick={nextStep}>
              Continuar
            </button>
          ) : (
            <button onClick={saveForm}>
              Enviar formulario
            </button>
          )}
        </div>

      </div>
    </div>
  )
}

export default Questionnaire