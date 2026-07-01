import Image from "next/image";
import Link from "next/link";
import LogoForLightBg from "@/public/images/logo_for_light_bg.png";

export default function LandingLogo({ onClick }: { onClick?: () => void }) {
  return (
    <Link
      href="/"
      onClick={onClick}
      className="relative h-16 w-32 shrink-0 800:h-24 800:w-45.75"
      aria-label="ProFak Science Impactful Foundation home"
    >
      <Image
        src={LogoForLightBg}
        alt="ProFak Science Impactful Foundation"
        fill
        sizes="(max-width: 640px) 128px, 183px"
        // className="object-cover "
      />
    </Link>
  );
}
