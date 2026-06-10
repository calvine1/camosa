import type { Metadata } from "next";
import "./globals.css";
import QueryProvider from "@/components/providers/QueryProvider";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import AuthSyncProvider from "@/components/providers/AuthSyncProvider";

import { BRAND } from "@/lib/brand";

export const metadata: Metadata = {
  title: `${BRAND.fullName} - Clinical Learning Platform`,
  description: BRAND.description,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{
          __html: `(function() {
            try {
              var theme = localStorage.getItem('theme');
              if (theme === 'dark' || (!theme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
                document.documentElement.classList.add('dark');
              } else {
                document.documentElement.classList.remove('dark');
              }
            } catch (e) {}
          })()`
        }} />
      </head>
      <body
        className="font-sans antialiased bg-background text-foreground transition-colors duration-200"
      >
        <ThemeProvider>
          <QueryProvider>
            <AuthSyncProvider>{children}</AuthSyncProvider>
          </QueryProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
