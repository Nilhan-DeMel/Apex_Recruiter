"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Shield } from "lucide-react";

interface ConsentBannerProps {
    onAccept: () => void;
}

export function ConsentBanner({ onAccept }: ConsentBannerProps) {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
            <Card className="mx-4 max-w-lg p-6 shadow-2xl">
                <div className="flex items-start gap-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary/10">
                        <Shield className="h-6 w-6 text-primary" />
                    </div>
                    <div className="space-y-4">
                        <div>
                            <h2 className="text-lg font-semibold">Privacy & Data Notice</h2>
                            <p className="mt-2 text-sm text-muted-foreground">
                                Apex Recruiter processes vacancy data to generate candidate personas.
                                By continuing, you acknowledge:
                            </p>
                        </div>

                        <ul className="space-y-2 text-sm text-muted-foreground">
                            <li className="flex items-start gap-2">
                                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                                <span>Your OpenAI API key is held in this tab&apos;s session storage and sent directly to OpenAI.</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                                <span>Current files, notes, and chat state remain local to this browser session.</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                                <span>This prototype is not certified for personal candidate data or formal privacy compliance.</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                                <span>You can delete all data at any time using the Reset option.</span>
                            </li>
                        </ul>

                        <div className="flex justify-end gap-3 pt-2">
                            <Button onClick={onAccept} className="w-full sm:w-auto">
                                I Understand, Continue
                            </Button>
                        </div>
                    </div>
                </div>
            </Card>
        </div>
    );
}
