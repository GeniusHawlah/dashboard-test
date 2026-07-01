import ToastProvider from "@/wrappers/ToastProvider";
import { Theme } from "@radix-ui/themes";
import "@radix-ui/themes/styles.css";
import type { Metadata } from "next";
import { Inter, Poppins } from "next/font/google";
import { Suspense } from "react";
import "./globals.css";

import { GeneralLoadingModal } from "@/components/GeneralLoadingModal";
import { GeneralModal } from "@/components/GeneralModal";
import ProgressBarProvider from "@/wrappers/ProgressBarProvider";
import { NuqsAdapter } from "nuqs/adapters/next/app";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: "400",
});

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: "400",
});

const siteName = "Logistics Dashboard Test";
const siteDescription =
  "A lightweight logistics dashboard test app for reviewing operations, validating flows, and tracking dashboard interactions.";
const siteUrl =
  process.env.NEXT_PUBLIC_BASE_URL?.trim() || "http://localhost:3000";
const googleSearchConsole = process.env.GOOGLE_SEARCH_CONSOLE?.trim();

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: siteName,
    template: `%s | ${siteName}`,
  },
  description: siteDescription,
  keywords: [
    "logistics dashboard",
    "dashboard test",
    "operations tracking",
    "workflow review",
    "admin dashboard",
  ],
  applicationName: siteName,

  openGraph: {
    title: siteName,
    description: siteDescription,
    url: siteUrl,
    images: [
      {
        url: `${siteUrl}/images/OG_Image.webp`,
        width: 630,
        height: 630,
        alt: "Logistics Dashboard Test preview",
      },
    ],
    type: "website",
    siteName,
  },

  twitter: {
    card: "summary_large_image",
    title: siteName,
    description: siteDescription,
    images: [`${siteUrl}/images/XOG_Image.webp`],
    creator: siteName,
  },

  creator: siteName,

  ...(googleSearchConsole
    ? {
        verification: {
          google: googleSearchConsole,
        },
      }
    : {}),
};

// const sp_pro = localFont({
//   src: "../public/fonts/SFProDisplay-Regular.ttf",
//   display: "swap",
// });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      suppressHydrationWarning={true}
      lang="en"
      data-scroll-behavior="smooth"
      className="select-auto   w-full"
    >
      <body
        className={`${inter.variable} ${poppins.variable} bg-offwhite text-base antialiased text-light_pry_text`}
      >
        <NuqsAdapter>
          <Suspense fallback={null}>
            <ProgressBarProvider>
              <Theme>
                <GeneralLoadingModal />
                <GeneralModal />
                <section className="font-inter w-full">{children}</section>
              </Theme>
            </ProgressBarProvider>
          </Suspense>
        </NuqsAdapter>
        <ToastProvider />
      </body>
    </html>
  );
}
