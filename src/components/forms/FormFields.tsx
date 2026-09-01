import type { JSX, ReactNode } from "react";

/**
 * Labelled form controls that carry their own required marker, hint text and
 * inline error wiring (`aria-invalid`, `aria-describedby`), so every field on a
 * form announces the same way instead of each one re-implementing it.
 *
 * Generic over the field-name union so a caller keeps type-safety on its own keys.
 */
type FieldProps<TName extends string> = {
  name: TName;
  label: string;
  value: string;
  onChange: (field: TName, value: string) => void;
  type?: "text" | "email" | "tel" | "date" | "url";
  required?: boolean;
  multiline?: boolean;
  error?: string;
  hint?: string;
  placeholder?: string;
  autoComplete?: string;
  className?: string;
  inputRef?: (element: HTMLElement | null) => void;
};

export function Field<TName extends string>({
  name,
  label,
  value,
  onChange,
  type = "text",
  required = false,
  multiline = false,
  error,
  hint,
  placeholder,
  autoComplete,
  className = "",
  inputRef,
}: FieldProps<TName>): JSX.Element {
  const hintId = hint ? `${name}-hint` : undefined;
  const errorId = error ? `${name}-error` : undefined;
  const describedBy = [hintId, errorId].filter(Boolean).join(" ") || undefined;

  const shared = {
    id: name,
    name,
    value,
    placeholder,
    autoComplete,
    required,
    "aria-required": required || undefined,
    "aria-invalid": error ? (true as const) : undefined,
    "aria-describedby": describedBy,
    className: "field",
  };

  return (
    <div className={`block text-sm font-semibold text-slate-200 ${className}`}>
      <label htmlFor={name}>
        {label}
        {required ? (
          <>
            <span aria-hidden="true" className="ml-1 text-accentSoft">
              *
            </span>
            <span className="sr-only"> (required)</span>
          </>
        ) : null}
      </label>
      {multiline ? (
        <textarea
          {...shared}
          rows={5}
          ref={inputRef as (element: HTMLTextAreaElement | null) => void}
          onChange={(event) => onChange(name, event.target.value)}
        />
      ) : (
        <input
          {...shared}
          type={type}
          ref={inputRef as (element: HTMLInputElement | null) => void}
          onChange={(event) => onChange(name, event.target.value)}
        />
      )}
      {hint ? (
        <span id={hintId} className="mt-2 block text-xs font-normal text-slate-400">
          {hint}
        </span>
      ) : null}
      {error ? (
        <span id={errorId} className="mt-2 block text-xs font-normal text-red-300">
          {error}
        </span>
      ) : null}
    </div>
  );
}

type SelectFieldProps<TName extends string> = {
  name: TName;
  label: string;
  value: string;
  onChange: (field: TName, value: string) => void;
  options: { value: string; label: string }[];
  required?: boolean;
  error?: string;
  placeholder?: string;
  selectRef?: (element: HTMLElement | null) => void;
  children?: ReactNode;
};

export function SelectField<TName extends string>({
  name,
  label,
  value,
  onChange,
  options,
  required = false,
  error,
  placeholder,
  selectRef,
}: SelectFieldProps<TName>): JSX.Element {
  const errorId = error ? `${name}-error` : undefined;

  return (
    <div className="block text-sm font-semibold text-slate-200">
      <label htmlFor={name}>
        {label}
        {required ? (
          <>
            <span aria-hidden="true" className="ml-1 text-accentSoft">
              *
            </span>
            <span className="sr-only"> (required)</span>
          </>
        ) : null}
      </label>
      <select
        id={name}
        name={name}
        className="field"
        value={value}
        required={required}
        aria-required={required || undefined}
        aria-invalid={error ? true : undefined}
        aria-describedby={errorId}
        ref={selectRef as (element: HTMLSelectElement | null) => void}
        onChange={(event) => onChange(name, event.target.value)}
      >
        {placeholder ? <option value="">{placeholder}</option> : null}
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error ? (
        <span id={errorId} className="mt-2 block text-xs font-normal text-red-300">
          {error}
        </span>
      ) : null}
    </div>
  );
}
