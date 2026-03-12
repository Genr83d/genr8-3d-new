import type { User } from "firebase/auth";
import { doc, getDoc, serverTimestamp, setDoc } from "firebase/firestore";
import { db } from "./firebase";

function userRecordRef(userId: string) {
  return doc(db, "users", userId);
}

export async function ensureCustomerUserRecord(user: User | null): Promise<void> {
  if (!user) {
    return;
  }

  const recordRef = userRecordRef(user.uid);
  const snapshot = await getDoc(recordRef);
  if (snapshot.exists()) {
    return;
  }

  await setDoc(recordRef, {
    email: user.email ?? "",
    displayName: user.displayName ?? "",
    role: "customer",
    createdAt: serverTimestamp(),
  });
}
