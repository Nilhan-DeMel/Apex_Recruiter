import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/components/auth/auth-provider";

export const metadata: Metadata = {
  title: "Apex Recruiter | Vacancy Intelligence Chat",
  description: "AI-powered vacancy analysis and candidate persona generation",
  keywords: ["recruitment", "AI", "vacancy", "candidate", "persona", "Sri Lanka"],
  authors: [{ name: "Apex Recruiter" }],
  openGraph: {
    title: "Apex Recruiter | Vacancy Intelligence Chat",
    description: "AI-powered vacancy analysis and candidate persona generation",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
        <meta name="theme-color" content="#7c3aed" />
      </head>
      <body className="min-h-screen antialiased">
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}

