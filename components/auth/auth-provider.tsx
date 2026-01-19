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

    // Show blocking error if auth permanently fails
    if (state.error && !state.loading) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-background p-4">
                <div className="max-w-md text-center">
                    <h1 className="mb-4 text-xl font-bold text-destructive">
                        Authentication Error
                    </h1>
                    <p className="mb-4 text-muted-foreground">
                        Failed to connect to the authentication service. Please try again.
                    </p>
                    <p className="mb-4 text-sm text-muted-foreground">
                        Error: {state.error.message}
                    </p>
                    <button
                        onClick={() => window.location.reload()}
                        className="rounded-md bg-primary px-4 py-2 text-primary-foreground hover:bg-primary/90"
                    >
                        Retry
                    </button>
                </div>
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
