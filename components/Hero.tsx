import Image from "next/image";
import { Suspense } from "react";
import HeroPhoto from "@/public/images/hero_photo.png";
import HeroActions from "./HeroActions";
import HeroActionsSkeleton from "./HeroActionsSkeleton";

export default function Hero() {
  return (
    <section id="home" className="relative isolate overflow-hidden bg-white">
      <div className="absolute inset-0 -z-10 800:hidden">
        <Image
          src={HeroPhoto}
          alt=""
          fill
          sizes="100vw"
          className="object-contain object-center opacity-16"
        />
        <div className="absolute inset-0 bg-white/68" />
      </div>

      <div className="global-pad mx-auto grid max-w-7xl grid-cols-1 items-start gap-8 py-12 420:py-14 sm:py-16 800:min-h-[calc(100dvh-5rem)] 800:grid-cols-[1fr_0.95fr] 800:items-center 800:gap-8 800:py-8 1200:gap-12">
        <div className="mx-auto flex w-full max-w-148 flex-col items-center text-center 800:mx-0 800:items-start 800:text-left">
          <h1 className="font-poppins text-5xl leading-[1.1] font-black tracking-normal text-deep-blue 390:text-5xl 420:text-6xl sm:text-7xl 870:text-6xl 1000:text-7xl 1200:text-8xl">
            Empowering
            <span className="mt-1 block overflow-visible bg-linear-to-r from-pry-blue to-blue-950 bg-clip-text pb-2 pr-2 text-transparent italic whitespace-nowrap">
              Young Minds
            </span>
          </h1>

          <p className="mt-4 max-w-96 text-xs leading-snug font-medium text-slate-950 390:text-sm sm:max-w-md sm:text-base 800:max-w-xl 1200:max-w-3xl 1200:text-lg 1200:leading-relaxed 1200:text-slate-700">
            Building future leaders through mentorship, skill development, and
            transformative programs designed to guide students toward academic,
            personal, and professional success.
          </p>

          <Suspense fallback={<HeroActionsSkeleton />}>
            <HeroActions />
          </Suspense>
        </div>

        <div className="relative hidden min-h-110 w-full 800:block 1200:min-h-130">
          <Image
            src={HeroPhoto}
            alt="Students learning through an online mentorship program"
            fill
            sizes="(max-width: 1024px) 44vw, 560px"
            className="object-contain object-center"
            priority
          />
        </div>
      </div>
    </section>
  );
}
