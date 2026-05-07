import type { Metadata } from "next";
import { Geist_Mono, Hanken_Grotesk } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { ThemeProvider } from "@/lib/providers/theme-provider";
import { Toaster } from "sonner";

const hankenGrotesk = Hanken_Grotesk({
  subsets: ["latin"],
  variable: "--font-sans",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ShopFlow",
  description: "A billing system built with Next.js, TypeScript, and Tailwind CSS. It features role-based access control for super admins, shop owners, and staff members. The system allows for efficient management of billing processes, including invoice generation, payment tracking, and customer management.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn("h-full", "antialiased", hankenGrotesk.variable, geistMono.variable, "font-sans")}
    >
      <body className="min-h-full flex flex-col">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
            <Toaster
              position="top-center"
              toastOptions={{
                className: "text-black",
                descriptionClassName: "text-zinc-700",
              }}
            />
        </ThemeProvider>

      </body>
    </html>
  );
}
