"use client";

import React, { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { User } from "firebase/auth";
import { signInAnonymouslyIfNeeded, subscribeToAuthState, AuthState } from "@/lib/firebase/auth";

interface AuthContextValue extends AuthState {
    uid: string | null;
}

const AuthContext = createContext<AuthContextValue>({
    user: null,
    loading: true,
    error: null,
    uid: null,
});

export function useAuth(): AuthContextValue {
    return useContext(AuthContext);
}

interface AuthProviderProps {
    children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
    const [state, setState] = useState<AuthState>({
        user: null,
        loading: true,
        error: null,
    });

    useEffect(() => {
        // Subscribe to auth state changes
        const unsubscribe = subscribeToAuthState((user) => {
            if (user) {
                setState({ user, loading: false, error: null });
            } else {
                // No user - attempt anonymous sign in
                signInAnonymouslyIfNeeded()
                    .then((user) => {
                        setState({ user, loading: false, error: null });
                    })
                    .catch((error) => {
                        console.error("[AuthProvider] Sign in failed:", error);
                        setState({ user: null, loading: false, error });
                    });
            }
        });

        return () => unsubscribe();
    }, []);

    const value: AuthContextValue = {
        ...state,
        uid: state.user?.uid || null,
    };

    // Show non-blocking banner if auth fails due to config
    if (state.error && !state.loading) {
        const isConfigError = state.error.message.includes("configuration-not-found") || state.error.message.includes("auth/operation-not-allowed");

        return (
            <div className="flex flex-col min-h-screen bg-background">
                {isConfigError && (
                    <div className="bg-destructive/15 text-destructive text-xs py-2 px-4 flex items-center justify-between border-b border-destructive/20 animate-in fade-in slide-in-from-top duration-500">
                        <div className="flex items-center gap-2">
                            <span className="font-bold">⚠️ AUTH CONFIG REQUIRED:</span>
                            <span>Enable &quot;Anonymous&quot; sign-in in Firebase Console for project <b>{process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID}</b>.</span>
                        </div>
                        <button onClick={() => window.location.reload()} className="underline hover:no-underline font-medium">Retry</button>
                    </div>
                )}
                {!isConfigError ? (
                    <div className="flex flex-1 items-center justify-center p-4">
                        <div className="max-w-md text-center">
                            <h1 className="mb-4 text-xl font-bold text-destructive">Authentication Error</h1>
                            <p className="mb-4 text-muted-foreground">Failed to connect to the authentication service.</p>
                            <p className="mb-4 text-sm text-muted-foreground">Error: {state.error.message}</p>
                            <button onClick={() => window.location.reload()} className="rounded-md bg-primary px-4 py-2 text-primary-foreground">Retry</button>
                        </div>
                    </div>
                ) : (
                    <div className="flex-1 overflow-auto">
                        <AuthContext.Provider value={value}>
                            {children}
                        </AuthContext.Provider>
                    </div>
                )}
            </div>
        );
    }

    // Show loading state
    if (state.loading) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-background">
                <div className="text-center">
                    <div className="mb-4 h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto" />
                    <p className="text-muted-foreground">Connecting...</p>
                </div>
            </div>
        );
    }

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}
