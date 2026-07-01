import { Suspense } from "react";
import LandingLogo from "@/components/LandingLogo";
import LandingNavbarGetStartedWrapper from "./LandingNavbarGetStartedWrapper";
import LandingNavbarUserMenuWrapper from "./LandingNavbarUserMenuWrapper";
import LandingNavbarScrollShadow from "./LandingNavbarScrollShadow";
import LandingNavbarMenuToggle from "./LandingNavbarMenuToggle";
import LandingNavbarMobileNavWrapper from "./LandingNavbarMobileNavWrapper";

const navItems = [
  { href: "/#program", label: "Program" },
  { href: "/#gallery", label: "Gallery" },
  { href: "/#about", label: "About" },
  { href: "/#contact", label: "Contact" },
];

export default function LandingNavbar() {
  return (
    <header
      id="landing-navbar"
      className="fixed top-0 left-0 z-50 w-full border-b border-transparent bg-white/95 backdrop-blur-md transition-[box-shadow,border-color,background-color] duration-200"
    >
      <div className="global-pad mx-auto flex h-18 max-w-7xl items-center gap-4 800:h-20">
        <LandingLogo />

        <div className="flex min-w-0 flex-1 items-center justify-end gap-3">
          <nav className="hidden items-center gap-10 800:flex">
            {navItems.map((item) => (
              <a
                key={item.label}
                href={item.href}
                className="text-base font-medium text-slate-700 transition hover:text-slate-950"
              >
                {item.label}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-2 sm:gap-3">
            <Suspense fallback={null}>
              <LandingNavbarGetStartedWrapper />
            </Suspense>

            <Suspense fallback={null}>
              <LandingNavbarUserMenuWrapper />
            </Suspense>

            <LandingNavbarMenuToggle />
          </div>
        </div>
      </div>

      <Suspense fallback={null}>
        <LandingNavbarMobileNavWrapper />
      </Suspense>

      <LandingNavbarScrollShadow />
    </header>
  );
}
