import { useRef, useState, type FormEvent, type JSX } from "react";
import { useSearchParams } from "react-router-dom";
import { Field, SelectField } from "./FormFields";
import { services } from "../../data/services";
import {
  acceptedFileFormats,
  contactDetails,
  mailtoHref,
  whatsappHref,
} from "../../data/contact";
import {
  conditionalFieldsFor,
  initialQuoteValues,
  quoteFieldOrder,
  validateQuote,
  type QuoteFieldName,
  type QuoteFormValues,
} from "../../lib/quoteFields";

const FORM_ACTION_URL =
  import.meta.env.VITE_FORMSPARK_ACTION_URL ?? "https://submit-form.com/RYHyzaTr";

export function QuoteForm(): JSX.Element {
  const [searchParams] = useSearchParams();
  const [values, setValues] = useState<QuoteFormValues>(() => {
    // Arriving from a service page should not mean re-picking the service.
    const requested = searchParams.get("service");
    const matched = services.find((service) => service.slug === requested);

    return matched ? { ...initialQuoteValues, service: matched.slug } : initialQuoteValues;
  });
  const [errors, setErrors] = useState<Partial<Record<QuoteFieldName, string>>>({});
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");

  const fieldRefs = useRef<Partial<Record<QuoteFieldName, HTMLElement | null>>>({});
  // The disabled button alone loses a race against a double Enter press.
  const submittingRef = useRef(false);

  const selectedService = services.find((service) => service.slug === values.service);
  const visibleFields = conditionalFieldsFor(values.service);
  const isVisible = (field: QuoteFieldName) => visibleFields.includes(field);

  const setValue = (field: QuoteFieldName, value: string) => {
    setValues((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => {
      if (!prev[field] && !prev.email && !prev.phone) return prev;
      const next = { ...prev };
      delete next[field];
      // Email and phone are validated as a pair, so clear both together.
      if (field === "email" || field === "phone") {
        delete next.email;
        delete next.phone;
      }
      return next;
    });
  };

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (submittingRef.current) return;

    const nextErrors = validateQuote(values);
    setErrors(nextErrors);

    const firstInvalid = quoteFieldOrder.find((field) => nextErrors[field]);
    if (firstInvalid) {
      fieldRefs.current[firstInvalid]?.focus();
      return;
    }

    submittingRef.current = true;
    setStatus("submitting");

    try {
      const response = await fetch(FORM_ACTION_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          name: values.name,
          company: values.company || "Not specified",
          email: values.email || "Not provided",
          phone: values.phone || "Not provided",
          preferredContact: values.preferredContact,
          service: selectedService?.name ?? values.service,
          details: values.details,
          ...(isVisible("quantity") && values.quantity ? { quantity: values.quantity } : {}),
          ...(isVisible("dimensions") && values.dimensions ? { dimensions: values.dimensions } : {}),
          ...(isVisible("material") && values.material ? { material: values.material } : {}),
          ...(isVisible("deliveryLocation") && values.deliveryLocation
            ? { deliveryLocation: values.deliveryLocation }
            : {}),
          ...(isVisible("currentWebsite") && values.currentWebsite
            ? { currentWebsite: values.currentWebsite }
            : {}),
          ...(isVisible("referenceFiles") && values.referenceFiles
            ? { referenceFiles: values.referenceFiles }
            : {}),
          deadline: values.deadline || "Not specified",
          budget: values.budgetAmount
            ? `${values.budgetCurrency} ${values.budgetAmount}`
            : "Not specified",
        }),
      });

      if (!response.ok) throw new Error("Submission failed.");

      setStatus("success");
      setValues(initialQuoteValues);
      setErrors({});
    } catch {
      setStatus("error");
    } finally {
      submittingRef.current = false;
    }
  };

  const registerRef = (field: QuoteFieldName) => (element: HTMLElement | null) => {
    fieldRefs.current[field] = element;
  };

  if (status === "success") {
    return (
      <section className="surface-card" aria-labelledby="quote-success-title" id="quote">
        <div role="status">
          <p className="chip">Request received</p>
          <h2 id="quote-success-title" className="mt-4 text-2xl font-semibold text-white">
            Thanks - your quote request is in.
          </h2>
          <p className="mt-3 text-sm text-slate-300">
            We will review the details and reply with scope, production approach, and pricing.
          </p>
        </div>

        <SendFilesPanel />

        <button
          type="button"
          className="secondary-button mt-6"
          onClick={() => setStatus("idle")}
        >
          Submit another request
        </button>
      </section>
    );
  }

  const errorList = quoteFieldOrder
    .filter((field) => errors[field])
    .map((field) => ({ field, message: errors[field] as string }));

  return (
    <section className="surface-card" aria-labelledby="quote-form-title" id="quote">
      <h2 id="quote-form-title" className="text-2xl font-semibold text-white">
        Request a Quote
      </h2>
      <p className="mt-2 text-sm text-slate-300">
        Tell us what you are building. The more detail you give, the more accurate the quote.
        Fields marked <span aria-hidden="true">*</span> are required.
      </p>

      <div
        role="alert"
        className={errorList.length > 0 ? "mt-4 rounded-lg border border-red-500/50 bg-red-500/15 px-4 py-3" : undefined}
      >
        {errorList.length > 0 ? (
          <>
            <p className="text-sm font-semibold text-red-200">
              {errorList.length === 1
                ? "There is 1 problem with this form:"
                : `There are ${errorList.length} problems with this form:`}
            </p>
            <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-red-200">
              {errorList.map((item) => (
                <li key={item.field}>{item.message}</li>
              ))}
            </ul>
          </>
        ) : null}
      </div>

      <p aria-live="polite" className="sr-only">
        {status === "submitting" ? "Submitting your quote request." : ""}
      </p>

      {status === "error" ? (
        <p
          role="alert"
          className="mt-4 rounded-lg border border-red-500/50 bg-red-500/20 px-4 py-3 text-sm text-red-200"
        >
          We could not send your request. Please try again, or reach us directly at{" "}
          <a className="font-semibold underline" href={mailtoHref("Quote request")}>
            {contactDetails.email}
          </a>
          .
        </p>
      ) : null}

      <form
        className="mt-6 grid gap-5 sm:grid-cols-2"
        noValidate
        onSubmit={onSubmit}
        aria-busy={status === "submitting"}
      >
        <Field
          name="name"
          label="Name"
          required
          value={values.name}
          error={errors.name}
          onChange={setValue}
          inputRef={registerRef("name")}
          autoComplete="name"
        />

        <Field
          name="company"
          label="Company / organisation"
          value={values.company}
          onChange={setValue}
          autoComplete="organization"
        />

        <Field
          name="email"
          label="Email"
          type="email"
          value={values.email}
          error={errors.email}
          onChange={setValue}
          inputRef={registerRef("email")}
          autoComplete="email"
          hint="Email or phone - whichever you prefer. At least one is required."
        />

        <Field
          name="phone"
          label="Phone / WhatsApp"
          type="tel"
          value={values.phone}
          error={errors.phone}
          onChange={setValue}
          inputRef={registerRef("phone")}
          autoComplete="tel"
        />

        <SelectField
          name="preferredContact"
          label="Preferred way to reach you"
          value={values.preferredContact}
          onChange={setValue}
          options={[
            { value: "email", label: "Email" },
            { value: "phone", label: "Phone call" },
            { value: "whatsapp", label: "WhatsApp" },
          ]}
        />

        <SelectField
          name="service"
          label="Service needed"
          required
          value={values.service}
          error={errors.service}
          onChange={setValue}
          selectRef={registerRef("service")}
          placeholder="Select a service"
          options={services.map((service) => ({ value: service.slug, label: service.name }))}
        />

        <Field
          name="details"
          label="Project details"
          required
          multiline
          value={values.details}
          error={errors.details}
          onChange={setValue}
          inputRef={registerRef("details")}
          className="sm:col-span-2"
          hint="What is it, what is it for, and any finish or branding requirements."
        />

        {isVisible("quantity") ? (
          <Field
            name="quantity"
            label="Quantity"
            value={values.quantity}
            onChange={setValue}
            placeholder="e.g., 1 prototype, 250 units"
          />
        ) : null}

        {isVisible("dimensions") ? (
          <Field
            name="dimensions"
            label="Size / dimensions"
            value={values.dimensions}
            onChange={setValue}
            placeholder='e.g., 300 x 200 x 15 mm, or 12" diameter'
            hint="Include the units."
          />
        ) : null}

        {isVisible("material") ? (
          <Field
            name="material"
            label="Material preference"
            value={values.material}
            onChange={setValue}
            placeholder="e.g., mahogany, acrylic, PETG"
            hint="Not sure? Leave it blank and we will advise."
          />
        ) : null}

        {isVisible("referenceFiles") ? (
          <Field
            name="referenceFiles"
            label="What do you have to work from?"
            value={values.referenceFiles}
            onChange={setValue}
            placeholder="e.g., hand sketches, photos, a broken part, an existing STEP file"
          />
        ) : null}

        {isVisible("currentWebsite") ? (
          <Field
            name="currentWebsite"
            label="Current website (if any)"
            type="url"
            value={values.currentWebsite}
            onChange={setValue}
            placeholder="https://"
            autoComplete="url"
          />
        ) : null}

        <Field
          name="deadline"
          label="Date you need it by"
          type="date"
          value={values.deadline}
          onChange={setValue}
        />

        {isVisible("deliveryLocation") ? (
          <Field
            name="deliveryLocation"
            label="Delivery or collection location"
            value={values.deliveryLocation}
            onChange={setValue}
            placeholder="e.g., Montego Bay, Kingston, collection from your workshop"
          />
        ) : null}

        <fieldset className="border-0 p-0">
          <legend className="text-sm font-semibold text-slate-200">Budget (optional)</legend>
          <div className="mt-2 flex gap-2">
            <label className="sr-only" htmlFor="budgetCurrency">
              Budget currency
            </label>
            <select
              id="budgetCurrency"
              name="budgetCurrency"
              className="field mt-0 w-28"
              value={values.budgetCurrency}
              onChange={(event) => setValue("budgetCurrency", event.target.value)}
            >
              <option value="JMD">JMD</option>
              <option value="USD">USD</option>
            </select>
            <label className="sr-only" htmlFor="budgetAmount">
              Budget amount
            </label>
            <input
              id="budgetAmount"
              name="budgetAmount"
              type="number"
              inputMode="numeric"
              min="0"
              step="any"
              className="field mt-0 flex-1"
              placeholder="Approximate amount"
              value={values.budgetAmount}
              onChange={(event) => setValue("budgetAmount", event.target.value)}
            />
          </div>
          <p className="mt-2 text-xs text-slate-400">
            A rough figure helps us propose an approach that fits. Leave it blank if you would
            rather we advise.
          </p>
        </fieldset>

        <div className="sm:col-span-2">
          <button type="submit" className="primary-button" disabled={status === "submitting"}>
            {status === "submitting" ? "Submitting..." : "Submit Quote Request"}
          </button>
        </div>
      </form>

      <SendFilesPanel serviceName={selectedService?.name} name={values.name} />
    </section>
  );
}

/**
 * The form previously showed a file input that only ever recorded the filename -
 * the file itself was never sent anywhere. Until a storage backend is in place
 * (tracked in CONTENT_NEEDED.md) this tells customers how to actually get files
 * to us, rather than leaving a control that silently does nothing.
 */
function SendFilesPanel({
  serviceName,
  name,
}: {
  serviceName?: string;
  name?: string;
}): JSX.Element {
  const subject = ["Quote files", name?.trim(), serviceName].filter(Boolean).join(" - ");

  return (
    <div className="mt-8 rounded-xl border border-accentSoft/30 bg-black/40 p-5">
      <h3 className="text-sm font-semibold uppercase tracking-[0.14em] text-slate-200">
        Sending drawings or artwork
      </h3>
      <p className="mt-3 text-sm text-slate-300">
        Send your files to us directly and we will match them to your request.
      </p>
      <div className="mt-4 flex flex-wrap gap-3">
        <a className="secondary-button" href={mailtoHref(subject)}>
          Email {contactDetails.email}
        </a>
        <a
          className="secondary-button"
          href={whatsappHref(
            `Hi GENR8-3D, I just submitted a quote request${
              serviceName ? ` for ${serviceName}` : ""
            } and I would like to send my files.`,
          )}
          target="_blank"
          rel="noopener noreferrer"
        >
          Send on WhatsApp
        </a>
      </div>
      <p className="mt-4 text-xs text-slate-400">
        Formats we can open: {acceptedFileFormats.join(", ")}. For anything larger than an email
        will carry, send a share link (Google Drive, Dropbox, WeTransfer).
      </p>
    </div>
  );
}
