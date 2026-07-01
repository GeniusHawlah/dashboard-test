import { Icon } from "@iconify-icon/react";
import Image from "next/image";
import Link from "next/link";
import LogoForLightBg from "@/public/images/logo_for_light_bg.png";

const footerLinks = [
  { href: "/", label: "Home" },
  { href: "/#program", label: "Program" },
  { href: "/#about", label: "About" },
  { href: "/#contact", label: "Contact" },
];

const socialLinks = [
  {
    href: "#",
    label: "WhatsApp",
    icon: "ri:whatsapp-line",
  },
  {
    href: "#",
    label: "Instagram",
    icon: "ri:instagram-line",
  },
  {
    href: "#",
    label: "Facebook",
    icon: "ri:facebook-fill",
  },
];

export default function Footer() {
  return (
    <footer id="site-footer" className="bg-white">
      <div className="global-pad mx-auto max-w-7xl px-0">
        <div className="flex flex-col items-center px-6 py-8 text-center sm:px-8 sm:py-10">
          <Link
            href="/"
            aria-label="ProFak Science Impactful Foundation home"
            className="relative h-20 w-48 sm:h-24 sm:w-60"
          >
            <Image
              src={LogoForLightBg}
              alt="ProFak Science Impactful Foundation"
              fill
              sizes="(max-width: 640px) 192px, 240px"
              className="object-contain"
            />
          </Link>

          <p className="mt-4 max-w-4xl text-base leading-relaxed text-slate-950 sm:text-lg lg:text-xl">
            Empowering young minds through education, innovation, and
            opportunity.
          </p>

          <div className="mt-5 flex items-center gap-4 sm:gap-5">
            {socialLinks.map((social) => (
              <Link
                key={social.label}
                href={social.href}
                aria-label={social.label}
                className="inline-flex size-10 items-center justify-center text-slate-950 transition hover:text-blue-700 sm:size-11"
              >
                <Icon
                  icon={social.icon}
                  className="text-4xl sm:text-[2.8rem]"
                />
              </Link>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-linear-to-r from-blue-700 via-blue-800 to-blue-950">
        <div className="global-pad mx-auto max-w-7xl px-0">
          <div className="flex flex-col items-center px-6 py-6 text-center sm:px-8 sm:py-7">
            <nav className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-lg text-white sm:text-[1.35rem]">
              {footerLinks.map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  className="transition hover:text-sky-200"
                >
                  {item.label}
                </Link>
              ))}
              <span className="transition hover:text-sky-200">Privacy</span>
              <span className="transition hover:text-sky-200">Terms</span>
            </nav>

            <p className="mt-5 text-sm font-medium text-sky-200/90 sm:text-base">
              Copyright 2026 Fakanle Foundation. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
