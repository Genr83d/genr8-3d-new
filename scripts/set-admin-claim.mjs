import path from "node:path";
import process from "node:process";
import { readFile } from "node:fs/promises";
import { cert, getApps, initializeApp } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";

const usage = `Usage:
  npm run admin:set-claim -- admin@example.com
  npm run admin:set-claim -- admin@example.com --remove
  npm run admin:set-claim -- uid123 --uid

Credential sources:
  FIREBASE_SERVICE_ACCOUNT_PATH=./secrets/firebase-service-account.json
  GOOGLE_APPLICATION_CREDENTIALS=/absolute/path/to/service-account.json
  FIREBASE_SERVICE_ACCOUNT_JSON='{"project_id":"...","client_email":"...","private_key":"..."}'
  FIREBASE_ADMIN_PROJECT_ID / FIREBASE_ADMIN_CLIENT_EMAIL / FIREBASE_ADMIN_PRIVATE_KEY`;

function exitWithError(message) {
  console.error(message);
  process.exit(1);
}

function normalizePrivateKey(value) {
  return value.replace(/\\n/g, "\n");
}

async function loadServiceAccount() {
  if (process.env.FIREBASE_SERVICE_ACCOUNT_JSON) {
    const parsed = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_JSON);
    if (parsed.private_key) {
      parsed.private_key = normalizePrivateKey(parsed.private_key);
    }
    return parsed;
  }

  const serviceAccountPath =
    process.env.FIREBASE_SERVICE_ACCOUNT_PATH ?? process.env.GOOGLE_APPLICATION_CREDENTIALS;
  if (serviceAccountPath) {
    const resolvedPath = path.isAbsolute(serviceAccountPath)
      ? serviceAccountPath
      : path.resolve(process.cwd(), serviceAccountPath);
    const fileContents = await readFile(resolvedPath, "utf8");
    const parsed = JSON.parse(fileContents);
    if (parsed.private_key) {
      parsed.private_key = normalizePrivateKey(parsed.private_key);
    }
    return parsed;
  }

  const projectId = process.env.FIREBASE_ADMIN_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_ADMIN_CLIENT_EMAIL;
  const privateKey = process.env.FIREBASE_ADMIN_PRIVATE_KEY;
  if (projectId && clientEmail && privateKey) {
    return {
      project_id: projectId,
      client_email: clientEmail,
      private_key: normalizePrivateKey(privateKey),
    };
  }

  exitWithError(
    "Missing Firebase Admin credentials. Set FIREBASE_SERVICE_ACCOUNT_PATH, GOOGLE_APPLICATION_CREDENTIALS, FIREBASE_SERVICE_ACCOUNT_JSON, or FIREBASE_ADMIN_* variables.",
  );
}

function parseArgs(argv) {
  const supportedFlags = new Set(["--help", "-h", "--remove", "--uid"]);
  const flags = argv.filter((arg) => arg.startsWith("-"));
  const unsupportedFlags = flags.filter((flag) => !supportedFlags.has(flag));
  if (unsupportedFlags.length > 0) {
    exitWithError(`Unsupported option: ${unsupportedFlags.join(", ")}\n\n${usage}`);
  }

  if (flags.includes("--help") || flags.includes("-h")) {
    console.log(usage);
    process.exit(0);
  }

  const identifier = argv.find((arg) => !arg.startsWith("-"));
  if (!identifier) {
    exitWithError(`Missing target user identifier.\n\n${usage}`);
  }

  return {
    identifier,
    remove: flags.includes("--remove"),
    treatAsUid: flags.includes("--uid"),
  };
}

async function resolveUser(adminAuth, identifier, treatAsUid) {
  if (treatAsUid) {
    return adminAuth.getUser(identifier);
  }

  if (identifier.includes("@")) {
    return adminAuth.getUserByEmail(identifier);
  }

  return adminAuth.getUser(identifier);
}

async function main() {
  const { identifier, remove, treatAsUid } = parseArgs(process.argv.slice(2));
  const serviceAccount = await loadServiceAccount();
  const app =
    getApps().length > 0
      ? getApps()[0]
      : initializeApp({
          credential: cert(serviceAccount),
          projectId: serviceAccount.project_id,
        });

  const adminAuth = getAuth(app);
  const userRecord = await resolveUser(adminAuth, identifier, treatAsUid);
  const nextClaims = { ...(userRecord.customClaims ?? {}) };

  if (remove) {
    delete nextClaims.admin;
  } else {
    nextClaims.admin = true;
  }

  await adminAuth.setCustomUserClaims(
    userRecord.uid,
    Object.keys(nextClaims).length > 0 ? nextClaims : null,
  );

  console.log(
    `${remove ? "Removed" : "Granted"} admin claim for ${userRecord.email ?? userRecord.uid} (uid: ${userRecord.uid}).`,
  );
  console.log("If the user is already signed in, they must refresh their ID token or sign in again.");
}

main().catch((error) => {
  exitWithError(error instanceof Error ? error.message : "Failed to update custom claims.");
});
