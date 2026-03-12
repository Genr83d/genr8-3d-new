import { useEffect, useMemo, useState, type FormEvent, type JSX } from "react";
import {
  onIdTokenChanged,
  signInWithEmailAndPassword,
  signOut,
  type User,
} from "firebase/auth";
import { ClockPreviewSvg } from "../components/clocks/ClockPreviewSvg";
import { PageHero } from "../components/sections/PageHero";
import {
  getUserAdminAccess,
  subscribeToUserAdminAccess,
} from "../lib/admin";
import {
  subscribeToClockSubmissions,
  updateClockSubmissionStatus,
  type ClockSubmissionRecord,
} from "../lib/clockSubmissions";
import { auth } from "../lib/firebase";
import { ensureCustomerUserRecord } from "../lib/users";

type StatusFilter = "all" | "received" | "pending_review" | "approved" | "rejected";

const statusOptions: StatusFilter[] = ["all", "pending_review", "received", "approved", "rejected"];

function formatDate(value: Date | null): string {
  if (!value) {
    return "Unknown";
  }
  return value.toLocaleString();
}

export function AdminClockSubmissionsPage(): JSX.Element {
  const [authLoading, setAuthLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const [hasAdminRecord, setHasAdminRecord] = useState(false);
  const [authError, setAuthError] = useState("");
  const [authInfo, setAuthInfo] = useState("");
  const [authValues, setAuthValues] = useState({ email: "", password: "" });
  const [isAuthBusy, setIsAuthBusy] = useState(false);
  const [isRefreshingAccess, setIsRefreshingAccess] = useState(false);

  const [submissions, setSubmissions] = useState<ClockSubmissionRecord[]>([]);
  const [loadingSubmissions, setLoadingSubmissions] = useState(false);
  const [submissionError, setSubmissionError] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");

  const isEmailVerified = user?.emailVerified ?? false;
  const isAdmin = isEmailVerified && hasAdminRecord;

  useEffect(() => {
    const unsubscribe = onIdTokenChanged(auth, (nextUser) => {
      setUser(nextUser);
      setAuthError("");
      if (!nextUser) {
        setHasAdminRecord(false);
        setAuthLoading(false);
        return;
      }

      setAuthLoading(true);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (!user) {
      setHasAdminRecord(false);
      setAuthLoading(false);
      return;
    }

    setAuthLoading(true);
    setAuthError("");

    const unsubscribe = subscribeToUserAdminAccess(
      user,
      (nextHasAdminRecord) => {
        setHasAdminRecord(nextHasAdminRecord);
        setAuthLoading(false);
      },
      (error) => {
        setHasAdminRecord(false);
        setAuthError(
          error instanceof Error ? error.message : "Could not verify admin access from the users collection.",
        );
        setAuthLoading(false);
      },
    );

    return () => {
      unsubscribe();
    };
  }, [user]);

  useEffect(() => {
    if (!isAdmin) {
      setSubmissions([]);
      setSubmissionError("");
      return;
    }

    setLoadingSubmissions(true);
    setSubmissionError("");

    const unsubscribe = subscribeToClockSubmissions(
      (items) => {
        setSubmissions(items);
        setLoadingSubmissions(false);
      },
      (error) => {
        setSubmissionError(error.message);
        setLoadingSubmissions(false);
      },
    );

    return () => {
      unsubscribe();
    };
  }, [isAdmin]);

  const filteredSubmissions = useMemo(() => {
    if (statusFilter === "all") {
      return submissions;
    }
    return submissions.filter((item) => item.moderationStatus === statusFilter);
  }, [submissions, statusFilter]);

  const onLogin = async (event: FormEvent<HTMLFormElement>): Promise<void> => {
    event.preventDefault();

    setIsAuthBusy(true);
    setAuthError("");
    setAuthInfo("");

    try {
      const credential = await signInWithEmailAndPassword(auth, authValues.email.trim(), authValues.password);
      await credential.user.reload();

      if (!credential.user.emailVerified) {
        await signOut(auth);
        setUser(null);
        setHasAdminRecord(false);
        throw new Error("Admin account email must be verified before login.");
      }

      await ensureCustomerUserRecord(credential.user);
      const nextHasAdminRecord = await getUserAdminAccess(credential.user);
      setUser(credential.user);
      setHasAdminRecord(nextHasAdminRecord);
      setAuthInfo(
        nextHasAdminRecord
          ? "Signed in."
          : "Signed in. This account is not marked as admin in the users collection.",
      );
    } catch (error) {
      setAuthError(error instanceof Error ? error.message : "Login failed.");
    } finally {
      setIsAuthBusy(false);
    }
  };

  const onLogout = async (): Promise<void> => {
    await signOut(auth);
    setUser(null);
    setHasAdminRecord(false);
    setAuthInfo("Logged out.");
  };

  const onRefreshAccess = async (): Promise<void> => {
    setIsRefreshingAccess(true);
    setAuthError("");
    setAuthInfo("");

    try {
      const nextUser = auth.currentUser;
      setUser(nextUser);

      if (!nextUser) {
        setHasAdminRecord(false);
        setAuthInfo("No active session to refresh.");
        return;
      }

      await nextUser.reload();
      const refreshedUser = auth.currentUser ?? nextUser;
      const nextHasAdminRecord = await getUserAdminAccess(refreshedUser);
      setUser(refreshedUser);
      setHasAdminRecord(nextHasAdminRecord);
      setAuthInfo(
        nextHasAdminRecord
          ? "Admin access refreshed."
          : "Session refreshed. This account is not marked as admin in the users collection.",
      );
    } catch (error) {
      setAuthError(
        error instanceof Error ? error.message : "Could not refresh admin access from the users collection.",
      );
    } finally {
      setIsRefreshingAccess(false);
    }
  };

  const onSetStatus = async (
    submissionId: string,
    nextStatus: "approved" | "rejected" | "pending_review",
  ): Promise<void> => {
    if (!user) {
      return;
    }

    try {
      await updateClockSubmissionStatus(submissionId, nextStatus, user.uid);
    } catch (error) {
      setSubmissionError(error instanceof Error ? error.message : "Could not update submission status.");
    }
  };

  return (
    <>
      <PageHero
        eyebrow="Admin"
        title="Clock Design Submissions"
        description="Review submissions, inspect reconstructed previews, and update moderation status."
      />

      <section className="section-shell space-y-6">
        <article className="surface-card space-y-4">
          <p className="chip">Admin Access</p>

          {authInfo ? (
            <p className="rounded-lg border border-support/50 bg-support/20 px-3 py-2 text-xs text-white">{authInfo}</p>
          ) : null}

          {authError ? (
            <p className="rounded-lg border border-red-500/50 bg-red-500/20 px-3 py-2 text-xs text-red-300">{authError}</p>
          ) : null}

          {authLoading ? <p className="text-sm text-slate-200">Checking session...</p> : null}

          {!authLoading && !user ? (
            <form className="grid max-w-md gap-3" onSubmit={(event) => void onLogin(event)}>
              <label className="block text-sm font-semibold text-slate-200" htmlFor="admin-email">
                Email
                <input
                  id="admin-email"
                  type="email"
                  className="field"
                  value={authValues.email}
                  onChange={(event) =>
                    setAuthValues((previous) => ({ ...previous, email: event.target.value }))
                  }
                />
              </label>

              <label className="block text-sm font-semibold text-slate-200" htmlFor="admin-password">
                Password
                <input
                  id="admin-password"
                  type="password"
                  className="field"
                  value={authValues.password}
                  onChange={(event) =>
                    setAuthValues((previous) => ({ ...previous, password: event.target.value }))
                  }
                />
              </label>

              <button type="submit" className="primary-button" disabled={isAuthBusy}>
                {isAuthBusy ? "Signing in..." : "Sign In"}
              </button>
            </form>
          ) : null}

          {!authLoading && user ? (
            <div className="rounded-lg border border-accentSoft/35 bg-black/35 p-3">
              <p className="text-sm text-white">
                Signed in as <span className="font-semibold">{user.email}</span>
              </p>
              <p className="mt-1 text-xs text-slate-300">
                Email verified: {isEmailVerified ? "Yes" : "No"}
              </p>
              <p className="mt-1 text-xs text-slate-300">
                Admin access: {isAdmin ? "Allowed" : "Denied"}
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                <button
                  type="button"
                  className="secondary-button"
                  onClick={() => void onRefreshAccess()}
                  disabled={isRefreshingAccess}
                >
                  {isRefreshingAccess ? "Refreshing..." : "Refresh Access"}
                </button>
                <button type="button" className="secondary-button" onClick={() => void onLogout()}>
                  Log Out
                </button>
              </div>
            </div>
          ) : null}

          {user && !isAdmin ? (
            <div className="rounded-lg border border-yellow-500/50 bg-yellow-500/10 px-3 py-2 text-xs text-yellow-100">
              <p>
                Access denied. This page requires an authenticated account with a verified email address and an admin
                user record in <code>users/{user.uid}</code>.
              </p>
              <p className="mt-2">
                Changes to the Firestore user record should sync automatically. <span className="font-semibold">Refresh Access</span> also reloads the current session.
              </p>
            </div>
          ) : null}
        </article>

        {isAdmin ? (
          <article className="surface-card space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h2 className="text-xl font-semibold text-white">Submissions</h2>
              <div className="flex flex-wrap gap-2">
                {statusOptions.map((option) => {
                  const isActive = statusFilter === option;
                  return (
                    <button
                      key={option}
                      type="button"
                      onClick={() => setStatusFilter(option)}
                      className={`rounded-lg border px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.08em] ${
                        isActive
                          ? "border-accentSoft bg-accent/30 text-white"
                          : "border-accentSoft/30 bg-black/20 text-slate-300 hover:border-accentSoft/80"
                      }`}
                    >
                      {option.replace("_", " ")}
                    </button>
                  );
                })}
              </div>
            </div>

            {loadingSubmissions ? <p className="text-sm text-slate-200">Loading submissions...</p> : null}

            {submissionError ? (
              <p className="rounded-lg border border-red-500/50 bg-red-500/20 px-3 py-2 text-xs text-red-300">{submissionError}</p>
            ) : null}

            {filteredSubmissions.length === 0 && !loadingSubmissions ? (
              <p className="text-sm text-slate-300">No submissions for this filter.</p>
            ) : null}

            <div className="grid gap-4">
              {filteredSubmissions.map((submission) => (
                <article key={submission.id} className="rounded-xl border border-accentSoft/30 bg-black/30 p-4">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <p className="text-sm font-semibold text-white">{submission.contactName}</p>
                    <p className="text-xs text-slate-300">{formatDate(submission.createdAt)}</p>
                  </div>

                  <p className="mt-1 text-xs text-slate-300">Contact: {submission.contactEmail} | {submission.contactPhone}</p>
                  <p className="mt-1 text-xs text-slate-300">Account: {submission.userEmail}</p>
                  <p className="mt-1 text-xs text-slate-300">Status: {submission.moderationStatus}</p>

                  {submission.moderationFlags.length > 0 ? (
                    <p className="mt-1 text-xs text-yellow-200">
                      Flags: {submission.moderationFlags.join(", ")}
                    </p>
                  ) : null}

                  <div className="mt-4 grid gap-4 lg:grid-cols-2">
                    <div className="rounded-lg border border-accentSoft/25 bg-black/30 p-3">
                      <p className="text-xs font-semibold uppercase tracking-[0.08em] text-accentSoft">Saved Base64 Preview</p>
                      {submission.previewImageBase64 ? (
                        <img
                          src={submission.previewImageBase64}
                          alt="Saved clock preview"
                          className="mt-2 w-full rounded-md border border-accentSoft/30"
                        />
                      ) : (
                        <p className="mt-2 text-xs text-slate-300">No image found.</p>
                      )}
                    </div>

                    <div className="rounded-lg border border-accentSoft/25 bg-black/30 p-3">
                      <p className="text-xs font-semibold uppercase tracking-[0.08em] text-accentSoft">Reconstructed Preview</p>
                      <ClockPreviewSvg
                        size={submission.clockSizeInches}
                        wood={submission.woodType}
                        numberStyle={submission.numberStyle}
                        centerDesignSrc={submission.centerDesignBase64 || null}
                        showReferenceRing={false}
                        className="mt-2 mx-auto w-full max-w-[260px]"
                      />
                    </div>
                  </div>

                  <p className="mt-3 text-xs text-slate-200">Notes: {submission.notes}</p>

                  <div className="mt-3 flex flex-wrap gap-2">
                    <button
                      type="button"
                      className="secondary-button"
                      onClick={() => void onSetStatus(submission.id, "pending_review")}
                    >
                      Mark Pending
                    </button>
                    <button
                      type="button"
                      className="secondary-button"
                      onClick={() => void onSetStatus(submission.id, "approved")}
                    >
                      Approve
                    </button>
                    <button
                      type="button"
                      className="secondary-button"
                      onClick={() => void onSetStatus(submission.id, "rejected")}
                    >
                      Reject
                    </button>
                  </div>
                </article>
              ))}
            </div>
          </article>
        ) : null}
      </section>
    </>
  );
}
