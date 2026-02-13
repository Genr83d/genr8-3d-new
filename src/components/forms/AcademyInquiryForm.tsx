import { useState, type FormEvent, type JSX } from 'react'
import { courseCategories } from '../../data/academy'

type AcademyFormState = {
  name: string
  email: string
  phone: string
  track: string
  goals: string
}

const initialState: AcademyFormState = {
  name: '',
  email: '',
  phone: '',
  track: '',
  goals: '',
}

export function AcademyInquiryForm(): JSX.Element {
  const [state, setState] = useState(initialState)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (!state.name || !state.email || !state.track || !state.goals) {
      setError('Please complete all required fields before submitting.')
      return
    }

    setError('')
    setSuccess(true)
    setState(initialState)
  }

  return (
    <section className="surface-card" aria-labelledby="academy-contact-title">
      <h2 id="academy-contact-title" className="text-2xl font-semibold text-white">
        Enrollment Inquiry
      </h2>
      <p className="mt-2 text-sm text-slate-300">
        Share your learning goals and we will match you to the right NEXT-GEN Academy track.
      </p>

      {error ? <p className="mt-4 text-sm text-red-300">{error}</p> : null}
      {success ? (
        <p className="mt-4 rounded-lg border border-support/60 bg-support/20 px-4 py-3 text-sm text-white">
          Inquiry captured. Connect this form to your enrollment endpoint for live submissions.
        </p>
      ) : null}

      <form className="mt-6 grid gap-5 sm:grid-cols-2" onSubmit={onSubmit}>
        <label htmlFor="academy-name" className="text-sm font-semibold text-slate-200">
          Name
          <input
            id="academy-name"
            className="field"
            value={state.name}
            onChange={(event) => setState((prev) => ({ ...prev, name: event.target.value }))}
          />
        </label>
        <label htmlFor="academy-email" className="text-sm font-semibold text-slate-200">
          Email
          <input
            id="academy-email"
            type="email"
            className="field"
            value={state.email}
            onChange={(event) => setState((prev) => ({ ...prev, email: event.target.value }))}
          />
        </label>
        <label htmlFor="academy-phone" className="text-sm font-semibold text-slate-200">
          Phone (optional)
          <input
            id="academy-phone"
            className="field"
            value={state.phone}
            onChange={(event) => setState((prev) => ({ ...prev, phone: event.target.value }))}
          />
        </label>
        <label htmlFor="academy-track" className="text-sm font-semibold text-slate-200">
          Course Interest
          <select
            id="academy-track"
            className="field"
            value={state.track}
            onChange={(event) => setState((prev) => ({ ...prev, track: event.target.value }))}
          >
            <option value="">Choose a track</option>
            {courseCategories.map((category) => (
              <option key={category.id} value={category.title}>
                {category.title}
              </option>
            ))}
          </select>
        </label>
        <label htmlFor="academy-goals" className="text-sm font-semibold text-slate-200 sm:col-span-2">
          Learning Goals
          <textarea
            id="academy-goals"
            rows={4}
            className="field"
            value={state.goals}
            onChange={(event) => setState((prev) => ({ ...prev, goals: event.target.value }))}
          />
        </label>
        <div className="sm:col-span-2">
          <button type="submit" className="primary-button">
            Start Enrollment
          </button>
        </div>
      </form>
    </section>
  )
}
