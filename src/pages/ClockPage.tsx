import { useEffect, useState, type ChangeEvent, type FormEvent, type JSX } from "react";
import { Link } from "react-router-dom";
import { PageHero } from "../components/sections/PageHero";

type ClockSize = 10 | 12;
type WoodType = "cedar" | "mahogany" | "blueMahoe";
type NumberStyle = "standardArabic" | "roman";

type WoodSpec = {
  label: string;
  tones: {
    base: string;
    grain: string;
    shadow: string;
    highlight: string;
  };
};

type ClockDesignFormValues = {
  name: string;
  email: string;
  phone: string;
  notes: string;
};

const sizeOptions: ClockSize[] = [10, 12];

const centerBySize: Record<ClockSize, number> = {
  10: 5,
  12: 6,
};

const woodOrder: WoodType[] = ["cedar", "mahogany", "blueMahoe"];

const woodSpecs: Record<WoodType, WoodSpec> = {
  cedar: {
    label: "Cedar",
    tones: {
      base: "#bb7547",
      grain: "#8e4f2d",
      shadow: "#58311f",
      highlight: "#d99762",
    },
  },
  mahogany: {
    label: "Mahogany",
    tones: {
      base: "#7f3f34",
      grain: "#5a241d",
      shadow: "#2f1110",
      highlight: "#9f5c4e",
    },
  },
  blueMahoe: {
    label: "Blue Mahoe",
    tones: {
      base: "#6d7c86",
      grain: "#48535c",
      shadow: "#283037",
      highlight: "#90a1ad",
    },
  },
};

const numberAngles = Array.from({ length: 12 }, (_, index) => ({
  value: index === 0 ? 12 : index,
  radians: ((index * 30 - 90) * Math.PI) / 180,
}));

const romanByPosition = ["XII", "I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X", "XI"];

const numberStyleOptions: Array<{ id: NumberStyle; label: string; sample: string }> = [
  { id: "standardArabic", label: "Standard Arabic", sample: "1 2 3 ... 12" },
  { id: "roman", label: "Roman", sample: "I II III ... XII" },
];

const designFormInitialValues: ClockDesignFormValues = {
  name: "",
  email: "",
  phone: "",
  notes: "",
};

const FORMSPARK_ACTION_URL = "https://submit-form.com/RYHyzaTr";

export function ClockPage(): JSX.Element {
  const [size, setSize] = useState<ClockSize>(10);
  const [wood, setWood] = useState<WoodType>("cedar");
  const [numberStyle, setNumberStyle] = useState<NumberStyle>("standardArabic");
  const [previousWood, setPreviousWood] = useState<WoodType | null>(null);
  const [showWoodLayer, setShowWoodLayer] = useState(true);
  const [centerDesignSrc, setCenterDesignSrc] = useState<string | null>(null);
  const [centerDesignFileName, setCenterDesignFileName] = useState("");
  const [formValues, setFormValues] = useState<ClockDesignFormValues>(designFormInitialValues);
  const [formErrors, setFormErrors] = useState<Partial<Record<keyof ClockDesignFormValues, string>>>({});
  const [isSubmittingForm, setIsSubmittingForm] = useState(false);
  const [isFormSubmitted, setIsFormSubmitted] = useState(false);
  const [formSubmitError, setFormSubmitError] = useState("");

  const centerSize = centerBySize[size];
  const maxPreviewOuterRadius = 170;
  const sizeScale = size / 12;
  const previewOuterRadius = Math.round(maxPreviewOuterRadius * sizeScale);
  const centerRadius = previewOuterRadius * (centerSize / size);
  const numberRadius = previewOuterRadius - Math.round(30 * sizeScale);
  const arabicNumberFontSize = Math.round(27 * sizeScale);
  const romanNumberFontSize = Math.round(22 * sizeScale);
  const sizeDifferencePercent = Math.round((1 - sizeScale) * 100);
  const selectedNumberStyleLabel =
    numberStyleOptions.find((option) => option.id === numberStyle)?.label ?? "Standard Arabic";

  const handleWoodChange = (nextWood: WoodType): void => {
    if (nextWood === wood) {
      return;
    }

    setPreviousWood(wood);
    setWood(nextWood);
    setShowWoodLayer(false);
    window.requestAnimationFrame(() => {
      setShowWoodLayer(true);
    });
  };

  const handleCenterDesignUpload = (event: ChangeEvent<HTMLInputElement>): void => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    const nextUrl = URL.createObjectURL(file);
    setCenterDesignSrc((previousUrl) => {
      if (previousUrl) {
        URL.revokeObjectURL(previousUrl);
      }
      return nextUrl;
    });
    setCenterDesignFileName(file.name);
    event.target.value = "";
  };

  const clearCenterDesign = (): void => {
    setCenterDesignSrc((previousUrl) => {
      if (previousUrl) {
        URL.revokeObjectURL(previousUrl);
      }
      return null;
    });
    setCenterDesignFileName("");
  };

  const validateForm = (): Partial<Record<keyof ClockDesignFormValues, string>> => {
    const nextErrors: Partial<Record<keyof ClockDesignFormValues, string>> = {};

    if (!formValues.name.trim()) {
      nextErrors.name = "Name is required.";
    }
    if (!formValues.email.trim()) {
      nextErrors.email = "Email is required.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formValues.email)) {
      nextErrors.email = "Enter a valid email address.";
    }
    if (!formValues.phone.trim()) {
      nextErrors.phone = "Phone is required.";
    }

    return nextErrors;
  };

  const onSubmitDesign = async (event: FormEvent<HTMLFormElement>): Promise<void> => {
    event.preventDefault();

    const nextErrors = validateForm();
    setFormErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      return;
    }

    setIsSubmittingForm(true);
    setFormSubmitError("");

    try {
      const response = await fetch(FORMSPARK_ACTION_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          requestType: "Clock Design Submission",
          name: formValues.name,
          email: formValues.email,
          phone: formValues.phone,
          notes: formValues.notes || "Not provided",
          clockSizeInches: size,
          woodType: woodSpecs[wood].label,
          numberStyle: selectedNumberStyleLabel,
          centerDesignDiameterInches: centerSize,
          centerDesignUploaded: Boolean(centerDesignSrc),
          centerDesignFileName: centerDesignFileName || "None",
        }),
      });

      if (!response.ok) {
        throw new Error("Submission failed");
      }

      setIsFormSubmitted(true);
      setFormValues(designFormInitialValues);
    } catch {
      setFormSubmitError("Could not send the design right now. Please try again.");
    } finally {
      setIsSubmittingForm(false);
    }
  };

  useEffect(() => {
    if (!previousWood) {
      return;
    }

    const timeoutId = window.setTimeout(() => {
      setPreviousWood(null);
    }, 520);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [previousWood, wood]);

  useEffect(() => {
    return () => {
      if (centerDesignSrc) {
        URL.revokeObjectURL(centerDesignSrc);
      }
    };
  }, [centerDesignSrc]);

  return (
    <>
      <PageHero
        eyebrow="Clock Product Builder"
        title="Configure your wooden wall clock before production"
        description='Preview 10" and 12" builds, switch between Cedar, Mahogany, and Blue Mahoe, and test your center design placement before final manufacturing.'
        actions={
          <>
            <a href="#clock-builder" className="primary-button">
              Start Building
            </a>
            <Link to="/contact" className="secondary-button">
              Request Production Quote
            </Link>
          </>
        }
      />

      <section id="clock-builder" className="section-shell grid gap-6 xl:grid-cols-[1.15fr_1fr]">
        <article className="surface-card space-y-6">
          <div>
            <p className="chip">Live Preview</p>
            <h2 className="mt-4 text-2xl font-semibold text-white">Clock Visualizer</h2>
            <p className="mt-2 small-muted">
              This preview matches your selected size and wood. Upload your center artwork and
              choose from your approved number styles.
            </p>
            <p className="mt-2 text-xs text-slate-300">
              {size === 10
                ? `10" is shown ${sizeDifferencePercent}% smaller than a 12" clock. Dashed ring marks full 12" size.`
                : '12" is shown at full reference size.'}
            </p>
          </div>

          <div className="rounded-2xl border border-accentSoft/30 bg-black/35 p-3 sm:p-5">
            <svg
              viewBox="0 0 400 400"
              className="mx-auto w-full max-w-[420px]"
              role="img"
              aria-label={`${size}-inch ${woodSpecs[wood].label} clock preview`}
            >
              <defs>
                {woodOrder.map((woodKey) => {
                  const spec = woodSpecs[woodKey];
                  return (
                    <pattern
                      key={woodKey}
                      id={`wood-${woodKey}`}
                      patternUnits="userSpaceOnUse"
                      width="220"
                      height="220"
                    >
                      <rect width="220" height="220" fill={spec.tones.base} />
                      <path
                        d="M-30 16 C 40 0, 110 28, 220 8 M-40 68 C 30 48, 120 88, 230 62 M-35 126 C 45 100, 130 154, 228 122 M-35 182 C 58 154, 140 198, 228 172"
                        fill="none"
                        stroke={spec.tones.grain}
                        strokeWidth="10"
                        strokeLinecap="round"
                        opacity="0.45"
                      />
                      <path
                        d="M-40 34 C 48 14, 140 52, 232 30 M-38 96 C 52 72, 142 122, 230 96 M-38 156 C 52 134, 142 178, 230 152 M-38 214 C 52 190, 142 226, 230 206"
                        fill="none"
                        stroke={spec.tones.highlight}
                        strokeWidth="6"
                        strokeLinecap="round"
                        opacity="0.24"
                      />
                      <rect width="220" height="220" fill={spec.tones.shadow} opacity="0.16" />
                    </pattern>
                  );
                })}
                <clipPath id="center-design-clip">
                  <circle cx="200" cy="200" r={centerRadius} />
                </clipPath>
              </defs>

              {size === 10 ? (
                <>
                  <circle
                    cx="200"
                    cy="200"
                    r={maxPreviewOuterRadius + 8}
                    fill="none"
                    stroke="#93afff77"
                    strokeWidth="1.8"
                    strokeDasharray="7 6"
                  />
                  <text
                    x="200"
                    y={200 - maxPreviewOuterRadius - 16}
                    fill="#d7e3ff"
                    fontSize="11"
                    textAnchor="middle"
                    style={{ letterSpacing: "0.08em" }}
                  >
                    12" REFERENCE SIZE
                  </text>
                </>
              ) : null}

              <circle cx="200" cy="200" r={previewOuterRadius + 8} fill="#0b0b0d" />
              <circle
                cx="200"
                cy="200"
                r={previewOuterRadius + 8}
                fill="none"
                stroke="#93afff88"
                strokeWidth="2"
              />

              {previousWood ? (
                <circle
                  cx="200"
                  cy="200"
                  r={previewOuterRadius}
                  fill={`url(#wood-${previousWood})`}
                />
              ) : null}

              <circle
                cx="200"
                cy="200"
                r={previewOuterRadius}
                fill={`url(#wood-${wood})`}
                style={{
                  opacity: showWoodLayer ? 1 : 0,
                  transition: "opacity 520ms ease",
                }}
              />

              <circle
                cx="200"
                cy="200"
                r={previewOuterRadius}
                fill="none"
                stroke="#1c2235"
                strokeWidth="3"
              />

              {numberAngles.map((mark, index) => {
                const x = 200 + Math.cos(mark.radians) * numberRadius;
                const y = 200 + Math.sin(mark.radians) * numberRadius;
                const label = numberStyle === "roman" ? romanByPosition[index] : String(mark.value);
                return (
                  <text
                    key={mark.value}
                    x={x}
                    y={y}
                    fill="#f8f8f8"
                    fontSize={numberStyle === "roman" ? romanNumberFontSize : arabicNumberFontSize}
                    fontWeight="700"
                    textAnchor="middle"
                    dominantBaseline="middle"
                    style={{ letterSpacing: numberStyle === "roman" ? "0.06em" : "0.02em" }}
                  >
                    {label}
                  </text>
                );
              })}
              <circle cx="200" cy="200" r={previewOuterRadius - 20} fill="none" stroke="#ebefff55" />

              {centerDesignSrc ? (
                <image
                  href={centerDesignSrc}
                  x={200 - centerRadius}
                  y={200 - centerRadius}
                  width={centerRadius * 2}
                  height={centerRadius * 2}
                  preserveAspectRatio="xMidYMid slice"
                  clipPath="url(#center-design-clip)"
                />
              ) : (
                <circle
                  cx="200"
                  cy="200"
                  r={centerRadius}
                  fill="rgba(10, 14, 22, 0.34)"
                  stroke="#d9e4ff88"
                  strokeWidth="2"
                  strokeDasharray="5 4"
                />
              )}

              <circle
                cx="200"
                cy="200"
                r={centerRadius}
                fill="none"
                stroke="#f8f8f8cc"
                strokeWidth="2.4"
              />

              <line x1="200" y1="200" x2="200" y2="118" stroke="#f2f2f2" strokeWidth="5.2" strokeLinecap="round" />
              <line x1="200" y1="200" x2="264" y2="200" stroke="#f2f2f2" strokeWidth="4" strokeLinecap="round" />
              <circle cx="200" cy="200" r="9" fill="#f0f3ff" />
              <circle cx="200" cy="200" r="4.5" fill="#0d1220" />
            </svg>
          </div>
        </article>

        <article className="surface-card space-y-6">
          <div>
            <p className="chip">Builder Controls</p>
            <h2 className="mt-4 text-2xl font-semibold text-white">Clock Specifications</h2>
          </div>

          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.12em] text-accentSoft">Clock Size</p>
            <div className="mt-3 grid grid-cols-2 gap-3">
              {sizeOptions.map((sizeOption) => {
                const isActive = size === sizeOption;
                return (
                  <button
                    key={sizeOption}
                    type="button"
                    onClick={() => setSize(sizeOption)}
                    className={`rounded-xl border px-4 py-3 text-left transition ${
                      isActive
                        ? "border-accentSoft bg-accent/35 text-white shadow-glow"
                        : "border-accentSoft/30 bg-black/30 text-white hover:border-accentSoft/80"
                    }`}
                  >
                    <span className="block text-base font-semibold text-white">{sizeOption}" Clock</span>
                    <span className="mt-1 block text-xs text-slate-200">
                      Center area: {centerBySize[sizeOption]}" diameter
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.12em] text-accentSoft">Wood Variety</p>
            <div className="mt-3 grid gap-2">
              {woodOrder.map((woodKey) => {
                const spec = woodSpecs[woodKey];
                const isActive = wood === woodKey;
                return (
                  <button
                    key={woodKey}
                    type="button"
                    onClick={() => handleWoodChange(woodKey)}
                    className={`flex items-center justify-between rounded-xl border px-4 py-3 transition ${
                      isActive
                        ? "border-accentSoft bg-accent/30 text-white shadow-glow"
                        : "border-accentSoft/30 bg-black/30 text-slate-300 hover:border-accentSoft/80 hover:text-white"
                    }`}
                  >
                    <span className="text-sm font-semibold">{spec.label}</span>
                    <span
                      className="h-6 w-6 rounded-full border border-white/40"
                      style={{
                        background: `linear-gradient(135deg, ${spec.tones.highlight}, ${spec.tones.base} 45%, ${spec.tones.shadow})`,
                      }}
                      aria-hidden="true"
                    />
                  </button>
                );
              })}
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="rounded-xl border border-accentSoft/35 bg-black/35 p-4">
              <span className="block text-sm font-semibold text-white">Center Design Upload</span>
              <span className="mt-1 block text-xs text-slate-300">
                PNG/JPG preview for the {centerSize}" center circle.
              </span>
              <input
                type="file"
                accept="image/png,image/jpeg,image/webp"
                onChange={handleCenterDesignUpload}
                className="field mt-3"
              />
              {centerDesignSrc ? (
                <button type="button" className="secondary-button mt-3 w-full" onClick={clearCenterDesign}>
                  Remove Center Image
                </button>
              ) : null}
            </label>

            <div className="rounded-xl border border-accentSoft/35 bg-black/35 p-4">
              <span className="block text-sm font-semibold text-white">Number Style</span>
              <span className="mt-1 block text-xs text-slate-300">
                Customer can only choose from options you provide.
              </span>
              <div className="mt-3 grid gap-2">
                {numberStyleOptions.map((option) => {
                  const isActive = numberStyle === option.id;
                  return (
                    <button
                      key={option.id}
                      type="button"
                      onClick={() => setNumberStyle(option.id)}
                      className={`rounded-lg border px-3 py-2 text-left transition ${
                        isActive
                          ? "border-accentSoft bg-accent/30 text-white"
                          : "border-accentSoft/30 bg-black/30 text-slate-300 hover:border-accentSoft/80 hover:text-white"
                      }`}
                    >
                      <span className="block text-sm font-semibold">{option.label}</span>
                      <span className="block text-xs opacity-85">{option.sample}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-accentSoft/35 bg-black/30 p-4">
            <p className="text-sm font-semibold text-white">Current Build Summary</p>
            <ul className="mt-3 space-y-2 text-sm text-slate-200">
              <li>
                Clock diameter: <span className="font-semibold text-white">{size}"</span>
              </li>
              <li>
                Wood type: <span className="font-semibold text-white">{woodSpecs[wood].label}</span>
              </li>
              <li>
                Center design area: <span className="font-semibold text-white">{centerSize}"</span> diameter
              </li>
              <li>
                Number style:{" "}
                <span className="font-semibold text-white">{selectedNumberStyleLabel}</span>
              </li>
              <li>
                Center image file:{" "}
                <span className="font-semibold text-white">{centerDesignFileName || "None selected"}</span>
              </li>
            </ul>
          </div>

          {isFormSubmitted ? (
            <p className="rounded-lg border border-support/50 bg-support/20 px-4 py-3 text-sm text-white">
              Clock design sent successfully. We will contact you shortly.
            </p>
          ) : null}

          {formSubmitError ? (
            <p className="rounded-lg border border-red-500/50 bg-red-500/20 px-4 py-3 text-sm text-red-300">
              {formSubmitError}
            </p>
          ) : null}

          <form className="grid gap-4" onSubmit={onSubmitDesign} noValidate>
            <p className="text-sm font-semibold uppercase tracking-[0.12em] text-accentSoft">
              Send This Design
            </p>

            <label className="block text-sm font-semibold text-slate-200" htmlFor="clock-design-name">
              Name
              <input
                id="clock-design-name"
                className="field"
                value={formValues.name}
                onChange={(event) =>
                  setFormValues((previous) => ({ ...previous, name: event.target.value }))
                }
                aria-invalid={Boolean(formErrors.name)}
                aria-describedby={formErrors.name ? "clock-design-name-error" : undefined}
              />
              {formErrors.name ? (
                <span id="clock-design-name-error" className="mt-2 block text-xs text-red-300">
                  {formErrors.name}
                </span>
              ) : null}
            </label>

            <label className="block text-sm font-semibold text-slate-200" htmlFor="clock-design-email">
              Email
              <input
                id="clock-design-email"
                type="email"
                className="field"
                value={formValues.email}
                onChange={(event) =>
                  setFormValues((previous) => ({ ...previous, email: event.target.value }))
                }
                aria-invalid={Boolean(formErrors.email)}
                aria-describedby={formErrors.email ? "clock-design-email-error" : undefined}
              />
              {formErrors.email ? (
                <span id="clock-design-email-error" className="mt-2 block text-xs text-red-300">
                  {formErrors.email}
                </span>
              ) : null}
            </label>

            <label className="block text-sm font-semibold text-slate-200" htmlFor="clock-design-phone">
              Phone
              <input
                id="clock-design-phone"
                className="field"
                value={formValues.phone}
                onChange={(event) =>
                  setFormValues((previous) => ({ ...previous, phone: event.target.value }))
                }
                aria-invalid={Boolean(formErrors.phone)}
                aria-describedby={formErrors.phone ? "clock-design-phone-error" : undefined}
              />
              {formErrors.phone ? (
                <span id="clock-design-phone-error" className="mt-2 block text-xs text-red-300">
                  {formErrors.phone}
                </span>
              ) : null}
            </label>

            <label className="block text-sm font-semibold text-slate-200" htmlFor="clock-design-notes">
              Additional Notes (optional)
              <textarea
                id="clock-design-notes"
                rows={4}
                className="field"
                value={formValues.notes}
                onChange={(event) =>
                  setFormValues((previous) => ({ ...previous, notes: event.target.value }))
                }
              />
            </label>

            <div>
              <button type="submit" className="primary-button" disabled={isSubmittingForm}>
                {isSubmittingForm ? "Sending..." : "Send Clock Design"}
              </button>
            </div>
          </form>
        </article>
      </section>
    </>
  );
}
