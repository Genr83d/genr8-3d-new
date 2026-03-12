import type { User } from "firebase/auth";
import { doc, getDoc, onSnapshot } from "firebase/firestore";
import { db } from "./firebase";

type FirestoreUserRecord = {
  isAdmin?: boolean;
  role?: string;
};

function userRecordRef(userId: string) {
  return doc(db, "users", userId);
}

function hasAdminAccess(record: FirestoreUserRecord | undefined): boolean {
  return record?.isAdmin === true || record?.role === "admin";
}

export async function getUserAdminAccess(user: User | null): Promise<boolean> {
  if (!user) {
    return false;
  }

  const snapshot = await getDoc(userRecordRef(user.uid));
  if (!snapshot.exists()) {
    return false;
  }

  return hasAdminAccess(snapshot.data() as FirestoreUserRecord);
}

export function subscribeToUserAdminAccess(
  user: User | null,
  onData: (isAdmin: boolean) => void,
  onError: (error: Error) => void,
): () => void {
  if (!user) {
    onData(false);
    return () => {};
  }

  return onSnapshot(
    userRecordRef(user.uid),
    (snapshot) => {
      if (!snapshot.exists()) {
        onData(false);
        return;
      }

      onData(hasAdminAccess(snapshot.data() as FirestoreUserRecord));
    },
    (error) => {
      onError(error);
    },
  );
}
