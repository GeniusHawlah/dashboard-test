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

const siteName = "ProFak Science Impactful Foundation";
const siteUrl =
  process.env.NEXT_PUBLIC_BASE_URL?.trim() || "http://localhost:3000";
const googleSearchConsole = process.env.GOOGLE_SEARCH_CONSOLE?.trim();

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: siteName,
  description:
    "ProFak Science Impactful Foundation is a mentorship platform where students register for programs, track their progress, apply for special mentorship, and connect with mentors.",
  keywords: [
    "ProFak",
    "mentorship platform",
    "student mentorship",
    "mentor registration",
    "program tracking",
    "special mentorship",
  ],

  openGraph: {
    title: siteName,
    description:
      "Join ProFak Science Impactful Foundation to access mentorship programs, follow student growth, and support meaningful academic and career development.",
    url: siteUrl,
    images: [
      {
        url: `${siteUrl}/images/OG_Image.webp`,
        width: 630,
        height: 630,
        alt: "ProFak Science Impactful Foundation mentorship preview",
      },
    ],
    type: "website",
    siteName,
  },

  twitter: {
    card: "summary_large_image",
    title: siteName,
    description:
      "Discover mentorship programs, student progress tracking, and guided support from the ProFak community.",
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
