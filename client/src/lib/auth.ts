/** Signal Atlas style note: authentication is functional and unobtrusive; the editor remains visually centered on the owner’s identity. */
import { onAuthStateChanged, signInWithEmailAndPassword, signInWithPopup, signOut, GoogleAuthProvider, type User } from "firebase/auth";
import { useEffect, useState } from "react";
import { firebaseAuth } from "@/lib/firebase";

export function useFirebaseUser() {
  const [user, setUser] = useState<User | null>(null);
  const [checking, setChecking] = useState(Boolean(firebaseAuth));

  useEffect(() => {
    if (!firebaseAuth) {
      setChecking(false);
      return;
    }
    return onAuthStateChanged(firebaseAuth, (nextUser) => {
      setUser(nextUser);
      setChecking(false);
    });
  }, []);

  return { user, checking };
}

export async function loginWithEmail(email: string, password: string) {
  if (!firebaseAuth) throw new Error("Firebase is not configured yet.");
  return signInWithEmailAndPassword(firebaseAuth, email, password);
}

export async function loginWithGoogle() {
  if (!firebaseAuth) throw new Error("Firebase is not configured yet.");
  return signInWithPopup(firebaseAuth, new GoogleAuthProvider());
}

export async function logout() {
  if (!firebaseAuth) return;
  return signOut(firebaseAuth);
}

