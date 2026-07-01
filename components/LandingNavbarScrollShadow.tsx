"use client";

import { useEffect } from "react";

const NAVBAR_ID = "landing-navbar";
const SHADOW_CLASS = "shadow-[0_12px_28px_-20px_rgba(15,23,42,0.5)]";

export default function LandingNavbarScrollShadow() {
  useEffect(() => {
    const navbar = document.getElementById(NAVBAR_ID);

    if (!navbar) {
      return;
    }

    const activeNavbar = navbar;

    function syncShadow() {
      if (window.scrollY > 0) {
        activeNavbar.classList.add(SHADOW_CLASS);
        return;
      }

      activeNavbar.classList.remove(SHADOW_CLASS);
    }

    syncShadow();
    window.addEventListener("scroll", syncShadow, { passive: true });

    return () => {
      window.removeEventListener("scroll", syncShadow);
      activeNavbar.classList.remove(SHADOW_CLASS);
    };
  }, []);

  return null;
}
