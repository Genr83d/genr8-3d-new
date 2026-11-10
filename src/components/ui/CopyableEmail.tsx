import { useEffect, useRef, useState, type JSX } from "react";

type CopyStatus = "idle" | "visible" | "fading";

async function copyToClipboard(text: string): Promise<boolean> {
  if (navigator.clipboard?.writeText) {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch {
      // Some browsers expose the API but reject it outside a secure/user-gesture
      // context (e.g. non-HTTPS) - fall through to the legacy fallback below.
    }
  }

  const textarea = document.createElement("textarea");
  textarea.value = text;
  textarea.style.position = "fixed";
  textarea.style.opacity = "0";
  document.body.appendChild(textarea);
  textarea.select();
  let succeeded = false;
  try {
    succeeded = document.execCommand("copy");
  } catch {
    succeeded = false;
  }
  document.body.removeChild(textarea);
  return succeeded;
}

export function CopyableEmail({
  email,
  className = "",
}: {
  email: string;
  className?: string;
}): JSX.Element {
  const [status, setStatus] = useState<CopyStatus>("idle");
  const visibleTimeout = useRef<ReturnType<typeof setTimeout> | undefined>(
    undefined,
  );
  const fadeTimeout = useRef<ReturnType<typeof setTimeout> | undefined>(
    undefined,
  );

  useEffect(() => {
    return () => {
      clearTimeout(visibleTimeout.current);
      clearTimeout(fadeTimeout.current);
    };
  }, []);

  const handleCopy = async () => {
    const succeeded = await copyToClipboard(email);
    if (!succeeded) return;

    clearTimeout(visibleTimeout.current);
    clearTimeout(fadeTimeout.current);
    setStatus("visible");
    visibleTimeout.current = setTimeout(() => setStatus("fading"), 2000);
    fadeTimeout.current = setTimeout(() => setStatus("idle"), 2300);
  };

  return (
    <span className={`relative inline-block ${className}`}>
      <span
        role="button"
        tabIndex={0}
        onClick={handleCopy}
        onKeyDown={(event) => {
          if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            void handleCopy();
          }
        }}
        aria-label={`Copy email address ${email} to clipboard`}
        className="cursor-pointer"
      >
        {email}
      </span>
      {status !== "idle" && (
        <span
          role="status"
          aria-live="polite"
          className={`pointer-events-none absolute left-full top-1/2 ml-2 -translate-y-1/2 whitespace-nowrap rounded-md bg-accent px-2 py-1 text-xs text-white shadow-glow transition-opacity duration-300 ${
            status === "visible" ? "opacity-100" : "opacity-0"
          }`}
        >
          Email copied to clipboard
        </span>
      )}
    </span>
  );
}
