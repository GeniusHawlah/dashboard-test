"use client";

import Image, { type ImageProps } from "next/image";
import { useState } from "react";
import DefaultPassport from "@/public/images/default_dp.webp";

interface ValidImageProps extends Omit<ImageProps, "src"> {
  src: string | undefined | null;
  fallbackSrc: string | typeof DefaultPassport;
}

export default function ValidImage({
  src,
  fallbackSrc,
  ...rest
}: ValidImageProps) {
  const [imgSrc, setImgSrc] = useState(src || fallbackSrc);
  const isProtectedMedia =
    typeof imgSrc === "string" && imgSrc.startsWith("/api/protected-media/");

  return (
    <Image
      {...rest}
      src={imgSrc}
      unoptimized={isProtectedMedia || rest.unoptimized}
      onError={() => {
        if (imgSrc !== fallbackSrc) setImgSrc(fallbackSrc);
      }}
    />
  );
}
