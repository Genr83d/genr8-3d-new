import { useEffect, useRef, useState, type ChangeEvent, type FormEvent, type JSX } from "react";
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  sendEmailVerification,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
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

type AuthMode = "login" | "register";

type ClockDesignFormValues = {
  name: string;
  email: string;
  phone: string;
  notes: string;
};

type AuthFormValues = {
  name: string;
  email: string;
  password: string;
};

const designFormInitialValues: ClockDesignFormValues = {
  name: "",
  email: "",
  phone: "",
  notes: "",
};

const authFormInitialValues: AuthFormValues = {
  name: "",
  email: "",
  password: "",
};

const MAX_CENTER_IMAGE_BASE64_LENGTH = 250_000;
const MAX_PREVIEW_IMAGE_BASE64_LENGTH = 550_000;

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

  const [authMode, setAuthMode] = useState<AuthMode>("login");
  const [authValues, setAuthValues] = useState<AuthFormValues>(authFormInitialValues);
  const [authUser, setAuthUser] = useState<User | null>(null);
  const [authInfo, setAuthInfo] = useState("");
  const [authError, setAuthError] = useState("");
  const [isAuthBusy, setIsAuthBusy] = useState(false);
  const [isAuthLoading, setIsAuthLoading] = useState(true);

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
      setFormSubmitError(error instanceof Error ? error.message : "Could not convert image to base64.");
    }
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
    } else if (!/^[0-9+()\-\s]{7,20}$/.test(formValues.phone.trim())) {
      nextErrors.phone = "Enter a valid phone number.";
    }

    return nextErrors;
  };

  const onSubmitDesign = async (event: FormEvent<HTMLFormElement>): Promise<void> => {
    event.preventDefault();

    if (!authUser) {
      setFormSubmitError("Sign in with a verified account before submitting a design.");
      return;
    }

    await authUser.reload();
    const verifiedUser = auth.currentUser;
    if (!verifiedUser?.emailVerified) {
      setFormSubmitError("Verify your email before submitting a design.");
      return;
    }

    const nextErrors = validateForm();
    setFormErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      return;
    }

    if (!previewSvgRef.current) {
      setFormSubmitError("Preview is not ready yet. Please try again.");
      return;
    }

    setIsSubmittingForm(true);
    setFormSubmitError("");
    setFormSuccessMessage("");

    try {
      const previewImageBase64 = svgToBase64DataUrl(previewSvgRef.current);
      if (previewImageBase64.length > MAX_PREVIEW_IMAGE_BASE64_LENGTH) {
        throw new Error("Clock preview payload is too large. Reduce image complexity and try again.");
      }

      if (centerDesignSrc && centerDesignSrc.length > MAX_CENTER_IMAGE_BASE64_LENGTH) {
        throw new Error("Center design image is too large. Use a smaller image before submitting.");
      }

      const moderationResult = await submitClockSubmission({
        userId: verifiedUser.uid,
        userEmail: verifiedUser.email ?? formValues.email,
        accountName: verifiedUser.displayName ?? formValues.name,
        contactName: formValues.name,
        contactEmail: formValues.email,
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
      setFormValues({
        ...designFormInitialValues,
        name: verifiedUser.displayName ?? "",
        email: verifiedUser.email ?? "",
      });
      setFormErrors({});
    } catch (error) {
      setFormSubmitError(
        error instanceof Error ? error.message : "Could not save the design right now. Please try again.",
      );
    } finally {
      setIsSubmittingForm(false);
    }
  };

  const onSubmitAuth = async (event: FormEvent<HTMLFormElement>): Promise<void> => {
    event.preventDefault();

    if (authMode === "register" && authValues.name.trim().length < 2) {
      setAuthError("Name must be at least 2 characters.");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(authValues.email.trim())) {
      setAuthError("Enter a valid email address.");
      return;
    }

    if (authValues.password.trim().length < 10) {
      setAuthError("Password must be at least 10 characters.");
      return;
    }

    setIsAuthBusy(true);
    setAuthError("");
    setAuthInfo("");

    try {
      if (authMode === "register") {
        const credential = await createUserWithEmailAndPassword(
          auth,
          authValues.email.trim(),
          authValues.password,
        );

        if (authValues.name.trim()) {
          await updateProfile(credential.user, {
            displayName: authValues.name.trim(),
          });
        }

        await sendEmailVerification(credential.user, {
          url: `${window.location.origin}/clocks`,
        });
        await signOut(auth);

        setAuthInfo("Account created. Check your email for the verification link before signing in.");
      } else {
        const credential = await signInWithEmailAndPassword(
          auth,
          authValues.email.trim(),
          authValues.password,
        );

        await credential.user.reload();
        if (!credential.user.emailVerified) {
          await sendEmailVerification(credential.user, {
            url: `${window.location.origin}/clocks`,
          });
          await signOut(auth);
          throw new Error("Email is not verified yet. We sent you a new verification link.");
        }

        setAuthInfo("Signed in. You can now submit this clock design.");
      }
    } catch (error) {
      setAuthError(error instanceof Error ? error.message : "Authentication failed.");
    } finally {
      setIsAuthBusy(false);
    }
  };

  const onResendVerification = async (): Promise<void> => {
    if (!authUser) {
      setAuthError("Sign in first so we can send a verification email.");
      return;
    }

    setIsAuthBusy(true);
    setAuthError("");
    setAuthInfo("");

    try {
      await sendEmailVerification(authUser, {
        url: `${window.location.origin}/clocks`,
      });
      setAuthInfo("Verification email sent. Check your inbox and spam folder.");
    } catch (error) {
      setAuthError(error instanceof Error ? error.message : "Could not send verification email.");
    } finally {
      setIsAuthBusy(false);
    }
  };

  const onRefreshVerification = async (): Promise<void> => {
    if (!authUser) {
      return;
    }

    setIsAuthBusy(true);
    setAuthError("");
    setAuthInfo("");

    try {
      await authUser.reload();
      const currentUser = auth.currentUser;
      if (currentUser?.emailVerified) {
        setAuthInfo("Email verified. You can submit designs now.");
      } else {
        setAuthInfo("Email is still unverified. After clicking the link, try again.");
      }
      setAuthUser(currentUser);
    } catch (error) {
      setAuthError(error instanceof Error ? error.message : "Could not refresh verification status.");
    } finally {
      setIsAuthBusy(false);
    }
  };

  const onLogout = async (): Promise<void> => {
    await signOut(auth);
    setAuthUser(null);
    setIsFormSubmitted(false);
    setFormSuccessMessage("");
    setFormSubmitError("");
    setFormValues(designFormInitialValues);
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (nextUser) => {
      setAuthUser(nextUser);
      setIsAuthLoading(false);

      if (nextUser?.email) {
        setFormValues((previous) => ({
          ...previous,
          name: previous.name || nextUser.displayName || "",
          email: nextUser.email || previous.email,
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
                Converted and stored as base64 for the {centerSize}" center circle.
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
            <p className="text-sm font-semibold uppercase tracking-[0.12em] text-accentSoft">Account Access</p>
            <p className="mt-2 text-xs text-slate-300">
              Firebase auth + verified email are required before saving a clock design.
            </p>

            {authInfo ? (
              <p className="mt-3 rounded-lg border border-support/50 bg-support/20 px-3 py-2 text-xs text-white">{authInfo}</p>
            ) : null}

            {authError ? (
              <p className="mt-3 rounded-lg border border-red-500/50 bg-red-500/20 px-3 py-2 text-xs text-red-300">{authError}</p>
            ) : null}

            {isAuthLoading ? <p className="mt-3 text-sm text-slate-200">Checking account session...</p> : null}

            {!isAuthLoading && authUser ? (
              <div className="mt-4 rounded-lg border border-support/40 bg-support/15 p-3">
                <p className="text-sm text-white">
                  Signed in as <span className="font-semibold">{authUser.email}</span>
                </p>
                <p className="mt-1 text-xs text-slate-200">Email verified: {authUser.emailVerified ? "Yes" : "No"}</p>
                {!authUser.emailVerified ? (
                  <div className="mt-3 flex flex-wrap gap-2">
                    <button type="button" className="secondary-button" onClick={() => void onResendVerification()} disabled={isAuthBusy}>
                      Resend Verification
                    </button>
                    <button type="button" className="secondary-button" onClick={() => void onRefreshVerification()} disabled={isAuthBusy}>
                      I Verified
                    </button>
                  </div>
                ) : null}
                <button type="button" className="secondary-button mt-3" onClick={() => void onLogout()}>
                  Log Out
                </button>
              </div>
            ) : null}

            {!isAuthLoading && !authUser ? (
              <>
                <div className="mt-4 grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    className={`rounded-lg border px-3 py-2 text-sm transition ${
                      authMode === "login"
                        ? "border-accentSoft bg-accent/30 text-white"
                        : "border-accentSoft/30 bg-black/30 text-slate-200 hover:border-accentSoft/80"
                    }`}
                    onClick={() => setAuthMode("login")}
                  >
                    Login
                  </button>
                  <button
                    type="button"
                    className={`rounded-lg border px-3 py-2 text-sm transition ${
                      authMode === "register"
                        ? "border-accentSoft bg-accent/30 text-white"
                        : "border-accentSoft/30 bg-black/30 text-slate-200 hover:border-accentSoft/80"
                    }`}
                    onClick={() => setAuthMode("register")}
                  >
                    Register
                  </button>
                </div>

                <form className="mt-4 grid gap-3" onSubmit={(event) => void onSubmitAuth(event)}>
                  {authMode === "register" ? (
                    <label className="block text-sm font-semibold text-slate-200" htmlFor="clock-auth-name">
                      Full Name
                      <input
                        id="clock-auth-name"
                        className="field"
                        value={authValues.name}
                        onChange={(event) =>
                          setAuthValues((previous) => ({ ...previous, name: event.target.value }))
                        }
                      />
                    </label>
                  ) : null}

                  <label className="block text-sm font-semibold text-slate-200" htmlFor="clock-auth-email">
                    Email
                    <input
                      id="clock-auth-email"
                      type="email"
                      className="field"
                      value={authValues.email}
                      onChange={(event) =>
                        setAuthValues((previous) => ({ ...previous, email: event.target.value }))
                      }
                    />
                  </label>

                  <label className="block text-sm font-semibold text-slate-200" htmlFor="clock-auth-password">
                    Password
                    <input
                      id="clock-auth-password"
                      type="password"
                      className="field"
                      value={authValues.password}
                      onChange={(event) =>
                        setAuthValues((previous) => ({ ...previous, password: event.target.value }))
                      }
                    />
                  </label>

                  <button type="submit" className="primary-button" disabled={isAuthBusy}>
                    {isAuthBusy ? "Please wait..." : authMode === "register" ? "Create Account" : "Sign In"}
                  </button>
                </form>
              </>
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

            {!authUser ? (
              <p className="rounded-lg border border-yellow-500/50 bg-yellow-500/10 px-3 py-2 text-xs text-yellow-100">
                Sign in above to unlock design submission.
              </p>
            ) : null}

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

            <label className="block text-sm font-semibold text-slate-200" htmlFor="clock-design-email">
              Email
              <input
                id="clock-design-email"
                type="email"
                className="field"
                value={formValues.email}
                onChange={(event) => setFormValues((previous) => ({ ...previous, email: event.target.value }))}
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
                disabled={isSubmittingForm || !authUser || !authUser.emailVerified}
              >
                {isSubmittingForm ? "Saving..." : "Save Clock Design"}
              </button>
            </div>
          </form>
        </article>
      </section>
    </>
  );
}
