import { useEffect, useRef, useState, type ChangeEvent, type FormEvent, type JSX } from "react";
import {
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithPopup,
  signOut,
  type User,
} from "firebase/auth";
import { Link } from "react-router-dom";
import { ClockPreviewSvg } from "../components/clocks/ClockPreviewSvg";
import { PageHero } from "../components/sections/PageHero";
import {
  centerBySize,
  numberStyleOptions,
  readFileAsDataUrl,
  sizeOptions,
  svgToBase64DataUrl,
  woodOrder,
  woodSpecs,
  type ClockSize,
  type NumberStyle,
  type WoodType,
} from "../lib/clockDesign";
import { submitClockSubmission } from "../lib/clockSubmissions";
import { auth } from "../lib/firebase";

type ClockDesignFormValues = {
  name: string;
  phone: string;
  notes: string;
};

const designFormInitialValues: ClockDesignFormValues = {
  name: "",
  phone: "",
  notes: "",
};

const MAX_CENTER_IMAGE_BASE64_LENGTH = 250_000;
const MAX_PREVIEW_IMAGE_BASE64_LENGTH = 550_000;

const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: "select_account" });

export function ClockPage(): JSX.Element {
  const [size, setSize] = useState<ClockSize>(10);
  const [wood, setWood] = useState<WoodType>("cedar");
  const [numberStyle, setNumberStyle] = useState<NumberStyle>("standardArabic");
  const [centerDesignSrc, setCenterDesignSrc] = useState<string | null>(null);
  const [centerDesignFileName, setCenterDesignFileName] = useState("");

  const [formValues, setFormValues] = useState<ClockDesignFormValues>(designFormInitialValues);
  const [formErrors, setFormErrors] = useState<Partial<Record<keyof ClockDesignFormValues, string>>>({});
  const [isSubmittingForm, setIsSubmittingForm] = useState(false);
  const [isFormSubmitted, setIsFormSubmitted] = useState(false);
  const [formSubmitError, setFormSubmitError] = useState("");
  const [formSuccessMessage, setFormSuccessMessage] = useState("");

  const [authUser, setAuthUser] = useState<User | null>(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);
  const [isAuthBusy, setIsAuthBusy] = useState(false);
  const [authMessage, setAuthMessage] = useState("");

  const previewSvgRef = useRef<SVGSVGElement | null>(null);

  const centerSize = centerBySize[size];
  const sizeDifferencePercent = Math.round((1 - size / 12) * 100);
  const selectedNumberStyleLabel =
    numberStyleOptions.find((option) => option.id === numberStyle)?.label ?? "Standard Arabic";

  const clearCenterDesign = (): void => {
    setCenterDesignSrc(null);
    setCenterDesignFileName("");
  };

  const handleCenterDesignUpload = async (event: ChangeEvent<HTMLInputElement>): Promise<void> => {
    const file = event.target.files?.[0];
    event.target.value = "";

    if (!file) {
      return;
    }

    try {
      const dataUrl = await readFileAsDataUrl(file);
      if (dataUrl.length > MAX_CENTER_IMAGE_BASE64_LENGTH) {
        throw new Error("Center design image is too large. Use a smaller image before uploading.");
      }
      setCenterDesignSrc(dataUrl);
      setCenterDesignFileName(file.name);
      setFormSubmitError("");
    } catch (error) {
      setFormSubmitError(error instanceof Error ? error.message : "Could not process image upload.");
    }
  };

  const validateForm = (): Partial<Record<keyof ClockDesignFormValues, string>> => {
    const nextErrors: Partial<Record<keyof ClockDesignFormValues, string>> = {};

    if (!formValues.name.trim()) {
      nextErrors.name = "Name is required.";
    }

    if (!formValues.phone.trim()) {
      nextErrors.phone = "Phone is required.";
    } else if (!/^[0-9+()\-\s]{7,20}$/.test(formValues.phone.trim())) {
      nextErrors.phone = "Enter a valid phone number.";
    }

    return nextErrors;
  };

  const ensureGoogleSignedIn = async (): Promise<User | null> => {
    if (auth.currentUser) {
      await auth.currentUser.reload();
      return auth.currentUser;
    }

    setIsAuthBusy(true);
    setAuthMessage("");
    setFormSubmitError("");

    try {
      const credential = await signInWithPopup(auth, googleProvider);
      setAuthMessage(`Signed in as ${credential.user.email ?? "your Google account"}.`);
      return credential.user;
    } catch (error) {
      setFormSubmitError(
        error instanceof Error
          ? error.message
          : "Google sign-in did not complete. Please try again.",
      );
      return null;
    } finally {
      setIsAuthBusy(false);
    }
  };

  const onSubmitDesign = async (event: FormEvent<HTMLFormElement>): Promise<void> => {
    event.preventDefault();

    const nextErrors = validateForm();
    setFormErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      return;
    }

    const signedInUser = await ensureGoogleSignedIn();
    if (!signedInUser) {
      return;
    }

    if (!signedInUser.email) {
      setFormSubmitError("Your Google account does not provide an email address.");
      return;
    }

    if (!previewSvgRef.current) {
      setFormSubmitError("Preview is not ready yet. Please try again.");
      return;
    }

    setIsSubmittingForm(true);
    setFormSubmitError("");
    setFormSuccessMessage("");
    setAuthMessage("");

    try {
      const previewImageBase64 = svgToBase64DataUrl(previewSvgRef.current);
      if (previewImageBase64.length > MAX_PREVIEW_IMAGE_BASE64_LENGTH) {
        throw new Error("Clock preview payload is too large. Reduce image complexity and try again.");
      }

      if (centerDesignSrc && centerDesignSrc.length > MAX_CENTER_IMAGE_BASE64_LENGTH) {
        throw new Error("Center design image is too large. Use a smaller image before submitting.");
      }

      const moderationResult = await submitClockSubmission({
        userId: signedInUser.uid,
        userEmail: signedInUser.email,
        accountName: signedInUser.displayName ?? formValues.name,
        contactName: formValues.name,
        contactEmail: signedInUser.email,
        contactPhone: formValues.phone,
        notes: formValues.notes || "Not provided",
        clockSizeInches: size,
        woodType: wood,
        numberStyle,
        centerDesignDiameterInches: centerSize,
        centerDesignUploaded: Boolean(centerDesignSrc),
        centerDesignFileName: centerDesignFileName || "None",
        centerDesignBase64: centerDesignSrc || "",
        previewImageBase64,
      });

      setIsFormSubmitted(true);
      setFormSuccessMessage(
        moderationResult.moderationStatus === "pending_review"
          ? "Clock design saved and queued for review."
          : "Clock design saved successfully.",
      );
      setFormValues((previous) => ({
        ...designFormInitialValues,
        name: previous.name,
      }));
      setFormErrors({});
    } catch (error) {
      setFormSubmitError(
        error instanceof Error ? error.message : "Could not save the design right now. Please try again.",
      );
    } finally {
      setIsSubmittingForm(false);
    }
  };

  const onLogout = async (): Promise<void> => {
    await signOut(auth);
    setAuthUser(null);
    setAuthMessage("Signed out.");
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (nextUser) => {
      setAuthUser(nextUser);
      setIsAuthLoading(false);

      if (nextUser?.displayName) {
        setFormValues((previous) => ({
          ...previous,
          name: previous.name || nextUser.displayName || "",
        }));
      }
    });

    return () => {
      unsubscribe();
    };
  }, []);

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
            <ClockPreviewSvg
              ref={previewSvgRef}
              size={size}
              wood={wood}
              numberStyle={numberStyle}
              centerDesignSrc={centerDesignSrc}
            />
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
                    onClick={() => setWood(woodKey)}
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
                Upload artwork for the {centerSize}" center circle.
              </span>
              <input
                type="file"
                accept="image/png,image/jpeg,image/webp"
                onChange={(event) => {
                  void handleCenterDesignUpload(event);
                }}
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
                Number style: <span className="font-semibold text-white">{selectedNumberStyleLabel}</span>
              </li>
              <li>
                Center image file: <span className="font-semibold text-white">{centerDesignFileName || "None selected"}</span>
              </li>
            </ul>
          </div>

          <section className="rounded-xl border border-accentSoft/35 bg-black/30 p-4">
            <p className="text-sm font-semibold uppercase tracking-[0.12em] text-accentSoft">Account</p>
            <p className="mt-2 text-xs text-slate-300">
              When you click save, you will be prompted to sign in with Google if needed.
            </p>

            {isAuthLoading ? <p className="mt-3 text-sm text-slate-200">Checking session...</p> : null}

            {authMessage ? (
              <p className="mt-3 rounded-lg border border-support/50 bg-support/20 px-3 py-2 text-xs text-white">{authMessage}</p>
            ) : null}

            {authUser ? (
              <div className="mt-3 rounded-lg border border-support/40 bg-support/15 p-3">
                <p className="text-sm text-white">
                  Signed in as <span className="font-semibold">{authUser.email ?? "Google user"}</span>
                </p>
                <button
                  type="button"
                  className="secondary-button mt-3"
                  onClick={() => {
                    void onLogout();
                  }}
                >
                  Log Out
                </button>
              </div>
            ) : null}
          </section>

          {isFormSubmitted ? (
            <p className="rounded-lg border border-support/50 bg-support/20 px-4 py-3 text-sm text-white">
              {formSuccessMessage || "Clock design saved successfully."}
            </p>
          ) : null}

          {formSubmitError ? (
            <p className="rounded-lg border border-red-500/50 bg-red-500/20 px-4 py-3 text-sm text-red-300">
              {formSubmitError}
            </p>
          ) : null}

          <form className="grid gap-4" onSubmit={(event) => void onSubmitDesign(event)} noValidate>
            <p className="text-sm font-semibold uppercase tracking-[0.12em] text-accentSoft">Send This Design</p>

            <label className="block text-sm font-semibold text-slate-200" htmlFor="clock-design-name">
              Name
              <input
                id="clock-design-name"
                className="field"
                value={formValues.name}
                onChange={(event) => setFormValues((previous) => ({ ...previous, name: event.target.value }))}
                aria-invalid={Boolean(formErrors.name)}
                aria-describedby={formErrors.name ? "clock-design-name-error" : undefined}
              />
              {formErrors.name ? (
                <span id="clock-design-name-error" className="mt-2 block text-xs text-red-300">
                  {formErrors.name}
                </span>
              ) : null}
            </label>

            <label className="block text-sm font-semibold text-slate-200" htmlFor="clock-design-phone">
              Phone
              <input
                id="clock-design-phone"
                className="field"
                value={formValues.phone}
                onChange={(event) => setFormValues((previous) => ({ ...previous, phone: event.target.value }))}
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
                onChange={(event) => setFormValues((previous) => ({ ...previous, notes: event.target.value }))}
              />
            </label>

            <div>
              <button
                type="submit"
                className="primary-button"
                disabled={isSubmittingForm || isAuthBusy}
              >
                {isAuthBusy ? "Opening Google Sign-In..." : isSubmittingForm ? "Saving..." : "Save Clock Design"}
              </button>
            </div>
          </form>
        </article>
      </section>
    </>
  );
}
