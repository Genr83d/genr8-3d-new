import { useState, type FormEvent, type JSX } from "react";
import { services } from "../../data/services";

type QuoteFormValues = {
  name: string;
  email: string;
  phone: string;
  service: string;
  details: string;
  timeline: string;
  budget: string;
  fileName: string;
};

const initialValues: QuoteFormValues = {
  name: "",
  email: "",
  phone: "",
  service: "",
  details: "",
  timeline: "",
  budget: "",
  fileName: "",
};

const FORMSPARK_ACTION_URL = "https://submit-form.com/RYHyzaTr";

export function QuoteForm(): JSX.Element {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState<
    Partial<Record<keyof QuoteFormValues, string>>
  >({});
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const validate = (): Partial<Record<keyof QuoteFormValues, string>> => {
    const nextErrors: Partial<Record<keyof QuoteFormValues, string>> = {};

    if (!values.name.trim()) nextErrors.name = "Name is required.";
    if (!values.email.trim()) {
      nextErrors.email = "Email is required.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) {
      nextErrors.email = "Enter a valid email address.";
    }
    if (!values.phone.trim()) nextErrors.phone = "Phone is required.";
    if (!values.service) nextErrors.service = "Select a service.";
    if (!values.details.trim())
      nextErrors.details = "Project details are required.";
    if (!values.timeline.trim()) nextErrors.timeline = "Timeline is required.";

    return nextErrors;
  };

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const nextErrors = validate();

    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) return;

    setSubmitting(true);
    setSubmitError("");

    try {
      const response = await fetch(FORMSPARK_ACTION_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          name: values.name,
          email: values.email,
          phone: values.phone,
          service: values.service,
          details: values.details,
          timeline: values.timeline,
          budget: values.budget || "Not specified",
        }),
      });

      if (!response.ok) throw new Error("Submission failed.");

      setSubmitted(true);
      setValues(initialValues);
    } catch {
      setSubmitError("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="surface-card" aria-labelledby="quote-form-title">
      <h2 id="quote-form-title" className="text-2xl font-semibold text-white">
        Request a Quote
      </h2>
      <p className="mt-2 text-sm text-slate-300">
        Tell us what you are building. We respond with scope, timeline, and
        production guidance.
      </p>

      {submitted ? (
        <p className="mt-4 rounded-lg border border-support/50 bg-support/20 px-4 py-3 text-sm text-white">
          Your quote request has been submitted successfully. We will get back
          to you shortly.
        </p>
      ) : null}

      {submitError ? (
        <p className="mt-4 rounded-lg border border-red-500/50 bg-red-500/20 px-4 py-3 text-sm text-red-300">
          {submitError}
        </p>
      ) : null}

      <form
        className="mt-6 grid gap-5 sm:grid-cols-2"
        noValidate
        onSubmit={onSubmit}
      >
        <label
          className="block text-sm font-semibold text-slate-200"
          htmlFor="name"
        >
          Name
          <input
            id="name"
            className="field"
            value={values.name}
            onChange={(event) =>
              setValues((prev) => ({ ...prev, name: event.target.value }))
            }
            aria-invalid={Boolean(errors.name)}
            aria-describedby={errors.name ? "name-error" : undefined}
          />
          {errors.name ? (
            <span id="name-error" className="mt-2 block text-xs text-red-300">
              {errors.name}
            </span>
          ) : null}
        </label>

        <label
          className="block text-sm font-semibold text-slate-200"
          htmlFor="email"
        >
          Email
          <input
            id="email"
            type="email"
            className="field"
            value={values.email}
            onChange={(event) =>
              setValues((prev) => ({ ...prev, email: event.target.value }))
            }
            aria-invalid={Boolean(errors.email)}
            aria-describedby={errors.email ? "email-error" : undefined}
          />
          {errors.email ? (
            <span id="email-error" className="mt-2 block text-xs text-red-300">
              {errors.email}
            </span>
          ) : null}
        </label>

        <label
          className="block text-sm font-semibold text-slate-200"
          htmlFor="phone"
        >
          Phone
          <input
            id="phone"
            className="field"
            value={values.phone}
            onChange={(event) =>
              setValues((prev) => ({ ...prev, phone: event.target.value }))
            }
            aria-invalid={Boolean(errors.phone)}
            aria-describedby={errors.phone ? "phone-error" : undefined}
          />
          {errors.phone ? (
            <span id="phone-error" className="mt-2 block text-xs text-red-300">
              {errors.phone}
            </span>
          ) : null}
        </label>

        <label
          className="block text-sm font-semibold text-slate-200"
          htmlFor="service"
        >
          Service Needed
          <select
            id="service"
            className="field"
            value={values.service}
            onChange={(event) =>
              setValues((prev) => ({ ...prev, service: event.target.value }))
            }
            aria-invalid={Boolean(errors.service)}
            aria-describedby={errors.service ? "service-error" : undefined}
          >
            <option value="">Select a service</option>
            {services.map((service) => (
              <option key={service.id} value={service.name}>
                {service.name}
              </option>
            ))}
          </select>
          {errors.service ? (
            <span
              id="service-error"
              className="mt-2 block text-xs text-red-300"
            >
              {errors.service}
            </span>
          ) : null}
        </label>

        <label
          className="block text-sm font-semibold text-slate-200 sm:col-span-2"
          htmlFor="details"
        >
          Project Details
          <textarea
            id="details"
            rows={5}
            className="field"
            value={values.details}
            onChange={(event) =>
              setValues((prev) => ({ ...prev, details: event.target.value }))
            }
            aria-invalid={Boolean(errors.details)}
            aria-describedby={errors.details ? "details-error" : undefined}
          />
          {errors.details ? (
            <span
              id="details-error"
              className="mt-2 block text-xs text-red-300"
            >
              {errors.details}
            </span>
          ) : null}
        </label>

        <label
          className="block text-sm font-semibold text-slate-200"
          htmlFor="timeline"
        >
          Timeline
          <input
            id="timeline"
            className="field"
            placeholder="e.g., 2 weeks, end of quarter"
            value={values.timeline}
            onChange={(event) =>
              setValues((prev) => ({ ...prev, timeline: event.target.value }))
            }
            aria-invalid={Boolean(errors.timeline)}
            aria-describedby={errors.timeline ? "timeline-error" : undefined}
          />
          {errors.timeline ? (
            <span
              id="timeline-error"
              className="mt-2 block text-xs text-red-300"
            >
              {errors.timeline}
            </span>
          ) : null}
        </label>

        <label
          className="block text-sm font-semibold text-slate-200"
          htmlFor="budget"
        >
          Budget Range (optional)
          <select
            id="budget"
            className="field"
            value={values.budget}
            onChange={(event) =>
              setValues((prev) => ({ ...prev, budget: event.target.value }))
            }
          >
            <option value="">Select a range</option>
            <option value="Under $1,000">Under $1,000</option>
            <option value="$1,000 - $5,000">$1,000 - $5,000</option>
            <option value="$5,000 - $15,000">$5,000 - $15,000</option>
            <option value="$15,000+">$15,000+</option>
          </select>
        </label>

        <label
          className="block text-sm font-semibold text-slate-200 sm:col-span-2"
          htmlFor="file-upload"
        >
          File Upload (optional)
          <input
            id="file-upload"
            type="file"
            className="field hover:cursor-pointer file:mr-3 file:rounded-md file:border-0 file:bg-accent file:px-3 file:py-2 file:text-xs file:font-semibold file:text-white"
            onChange={(event) => {
              const selectedName = event.target.files?.[0]?.name ?? "";
              setValues((prev) => ({ ...prev, fileName: selectedName }));
            }}
          />
          {values.fileName ? (
            <span className="mt-2 block text-xs text-slate-400">
              Attached: {values.fileName}
            </span>
          ) : null}
        </label>

        <div className="sm:col-span-2">
          <button
            type="submit"
            className="primary-button"
            disabled={submitting}
          >
            {submitting ? "Submitting..." : "Submit Quote Request"}
          </button>
        </div>
      </form>
    </section>
  );
}
