import logo from "@/public/images/logo_for_dark_bg.png";
import { RelativeRoutes } from "@/utils/enum";
import Image from "next/image";
import Link from "next/link";

function Logo({
  className,
  compactOnMobile = false,
  onClick,
}: {
  className?: string;
  compactOnMobile?: boolean;
  onClick?: () => void;
}) {
  return (
    <Link
      href={RelativeRoutes.HOMEPAGE}
      prefetch
      onClick={onClick}
      className={`inline-flex w-fit shrink-0 flex-col items-center justify-center overflow-hidden ${className ?? ""}`}
    >
      <div
        className={`relative min-h-14 min-w-14 sm:min-h-16 sm:min-w-16 ${
          compactOnMobile
            ? "min-h-10 min-w-10 sm:min-h-11 sm:min-w-11 lg:min-h-12 lg:min-w-12"
            : ""
        }`}
      >
        <Image src={logo} alt="Logo" fill sizes="72px" />
      </div>
    </Link>
  );
}

export default Logo;
