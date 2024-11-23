import { AIProviderProvider } from "@/contexts/ai-provider-context";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import PlausibleProvider from "next-plausible";
import { ThemeProvider } from "./providers/theme-provider";

const inter = Inter({ subsets: ["latin"] });
const title = "InfoExtract.AI";
const description = "Take a picture of a menu or item and extract detailed data to streamline your cataloging process.";
const url = "https://infoextract.ai.tonilab.net/";
const ogimage = "https://storage.tonilab.net/api/v1/buckets/assets/objects/download?preview=true&prefix=infoextract.jpg";
const sitename = "infoextract.ai.tonilab.net";

export const metadata: Metadata = {
  metadataBase: new URL(url),
  title,
  description,
  icons: {
    icon: "/icon.png",
    shortcut: "/favicon.ico",
    apple: "/apple-icon.png",
  },
  openGraph: {
    images: [ogimage],
    title,
    description,
    url: url,
    siteName: sitename,
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    images: [ogimage],
    title,
    description,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <PlausibleProvider domain="infoextract.ai.tonilab.net" />
      </head>
      <body className={`${inter.className} flex flex-col min-h-screen`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <AIProviderProvider>
            <Header />
            <main className="flex-grow">{children}</main>
            <Footer />
          </AIProviderProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
