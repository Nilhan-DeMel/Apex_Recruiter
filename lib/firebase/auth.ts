import {
    signInAnonymously,
    onAuthStateChanged,
    User,
    signOut as firebaseSignOut
} from "firebase/auth";
import { getFirebaseAuth } from "./config";

export interface AuthState {
    user: User | null;
    loading: boolean;
    error: Error | null;
}

/**
 * Sign in anonymously to Firebase Auth
 * Creates a new anonymous user if not already signed in
 */
export async function signInAnonymouslyIfNeeded(): Promise<User> {
    const auth = getFirebaseAuth();

    // If already signed in, return current user
    if (auth.currentUser) {
        return auth.currentUser;
    }

    // Sign in anonymously
    const result = await signInAnonymously(auth);
    console.log("[Auth] Signed in anonymously:", result.user.uid);
    return result.user;
}

/**
 * Subscribe to auth state changes
 */
export function subscribeToAuthState(
    callback: (user: User | null) => void
): () => void {
    const auth = getFirebaseAuth();
    return onAuthStateChanged(auth, callback);
}

/**
 * Get current user (sync)
 */
export function getCurrentUser(): User | null {
    const auth = getFirebaseAuth();
    return auth.currentUser;
}

/**
 * Get current user UID (throws if not authenticated)
 */
export function requireUserId(): string {
    const user = getCurrentUser();
    if (!user) {
        throw new Error("User not authenticated");
    }
    return user.uid;
}

/**
 * Sign out
 */
export async function signOut(): Promise<void> {
    const auth = getFirebaseAuth();
    await firebaseSignOut(auth);
    console.log("[Auth] Signed out");
}
