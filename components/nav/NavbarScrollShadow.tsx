"use client";

import { useEffect } from "react";

const DASHBOARD_SCROLL_CONTAINER_ID = "dashboard-content-scroll-container";
const DASHBOARD_NAVBAR_ID = "dashboard-navbar";
const SHADOW_CLASS = "shadow-[0_12px_28px_-20px_rgba(30,64,175,0.45)]";

function NavbarScrollShadow() {
  useEffect(() => {
    const scrollContainer = document.getElementById(
      DASHBOARD_SCROLL_CONTAINER_ID,
    );
    const navbar = document.getElementById(DASHBOARD_NAVBAR_ID);

    if (!scrollContainer || !navbar) {
      return;
    }

    const activeScrollContainer = scrollContainer;
    const activeNavbar = navbar;

    function syncShadow() {
      if (activeScrollContainer.scrollTop > 0) {
        activeNavbar.classList.add(SHADOW_CLASS);
        return;
      }

      activeNavbar.classList.remove(SHADOW_CLASS);
    }

    syncShadow();
    activeScrollContainer.addEventListener("scroll", syncShadow, {
      passive: true,
    });

    return () => {
      activeScrollContainer.removeEventListener("scroll", syncShadow);
      activeNavbar.classList.remove(SHADOW_CLASS);
    };
  }, []);

  return null;
}

export default NavbarScrollShadow;
