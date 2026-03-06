import {
  addDoc,
  collection,
  doc,
  limit,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
  type Timestamp,
} from "firebase/firestore";
import { db } from "./firebase";
import { looksSpammy, type ClockSize, type NumberStyle, type WoodType } from "./clockDesign";

export type ClockSubmissionInput = {
  userId: string;
  userEmail: string;
  accountName: string;
  contactName: string;
  contactEmail: string;
  contactPhone: string;
  notes: string;
  clockSizeInches: ClockSize;
  woodType: WoodType;
  numberStyle: NumberStyle;
  centerDesignDiameterInches: number;
  centerDesignUploaded: boolean;
  centerDesignFileName: string;
  centerDesignBase64: string;
  previewImageBase64: string;
};

export type ClockSubmissionRecord = {
  id: string;
  userId: string;
  userEmail: string;
  accountName: string;
  contactName: string;
  contactEmail: string;
  contactPhone: string;
  notes: string;
  clockSizeInches: ClockSize;
  woodType: WoodType;
  numberStyle: NumberStyle;
  centerDesignDiameterInches: number;
  centerDesignUploaded: boolean;
  centerDesignFileName: string;
  centerDesignBase64: string;
  previewImageBase64: string;
  moderationStatus: "received" | "pending_review" | "approved" | "rejected";
  moderationFlags: string[];
  createdAt: Date | null;
  reviewedAt: Date | null;
  reviewedBy: string | null;
};

type FirestoreSubmissionDoc = Omit<ClockSubmissionRecord, "id" | "createdAt" | "reviewedAt"> & {
  createdAt: Timestamp | null;
  reviewedAt: Timestamp | null;
};

const clockSubmissionCollection = collection(db, "clockSubmissions");

export async function submitClockSubmission(input: ClockSubmissionInput): Promise<{ moderationStatus: string }> {
  const moderationFlags = looksSpammy(`${input.contactName}\n${input.notes}`);
  if (input.contactEmail.toLowerCase() !== input.userEmail.toLowerCase()) {
    moderationFlags.push("contact_email_mismatch");
  }

  const moderationStatus = moderationFlags.length > 0 ? "pending_review" : "received";

  await addDoc(clockSubmissionCollection, {
    ...input,
    moderationStatus,
    moderationFlags,
    createdAt: serverTimestamp(),
    reviewedAt: null,
    reviewedBy: null,
  });

  return { moderationStatus };
}

function mapSubmissionDoc(id: string, value: FirestoreSubmissionDoc): ClockSubmissionRecord {
  return {
    ...value,
    id,
    createdAt: value.createdAt ? value.createdAt.toDate() : null,
    reviewedAt: value.reviewedAt ? value.reviewedAt.toDate() : null,
  };
}

export function subscribeToClockSubmissions(
  onData: (items: ClockSubmissionRecord[]) => void,
  onError: (error: Error) => void,
): () => void {
  const submissionsQuery = query(clockSubmissionCollection, orderBy("createdAt", "desc"), limit(120));

  return onSnapshot(
    submissionsQuery,
    (snapshot) => {
      const items = snapshot.docs.map((item) =>
        mapSubmissionDoc(item.id, item.data() as FirestoreSubmissionDoc),
      );
      onData(items);
    },
    (error) => {
      onError(error);
    },
  );
}

export async function updateClockSubmissionStatus(
  submissionId: string,
  status: "approved" | "rejected" | "pending_review",
  reviewerId: string,
): Promise<void> {
  const target = doc(db, "clockSubmissions", submissionId);
  await updateDoc(target, {
    moderationStatus: status,
    reviewedBy: reviewerId,
    reviewedAt: serverTimestamp(),
  });
}
