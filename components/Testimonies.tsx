"use client";

import Image from "next/image";
import SectionHeading from "@/components/SectionHeading";
import { TooltipHintIcon } from "@/components/ui/app-tooltip";
import { useLayoutEffect, useRef, useState } from "react";

const testimonies = [
  {
    name: "John Doe",
    role: "Participant, Science Initiative Program",
    testimony:
      "This program gave me the confidence and skills to pursue my career in tech.",
    image: "https://picsum.photos/seed/testimony-1/240/240",
  },
  {
    name: "Christopher Adebayo Okonkwo",
    role: "Participant, Science Initiative Program",
    testimony:
      "The mentorship was practical, engaging, and gave me a clearer sense of direction for my next steps.",
    image: "https://picsum.photos/seed/testimony-2/240/240",
  },
  {
    name: "Aisha Balogun Ibrahim",
    role: "Participant, Science Initiative Program",
    testimony:
      "I learned how to work with others, ask better questions, and stay consistent with my goals.",
    image: "https://picsum.photos/seed/testimony-3/240/240",
  },
];

function TestimonyQuote({ text }: { text: string }) {
  const quoteRef = useRef<HTMLParagraphElement | null>(null);
  const [showTooltip, setShowTooltip] = useState(false);
  const content = `"${text}"`;

  useLayoutEffect(() => {
    const element = quoteRef.current;

    if (!element) {
      return;
    }

    const updateTooltipVisibility = () => {
      const hasOverflow =
        element.scrollHeight > element.clientHeight + 1 ||
        element.scrollWidth > element.clientWidth + 1;

      setShowTooltip(hasOverflow);
    };

    updateTooltipVisibility();

    const resizeObserver = new ResizeObserver(updateTooltipVisibility);
    resizeObserver.observe(element);

    return () => {
      resizeObserver.disconnect();
    };
  }, [text]);

  return (
    <div className="w-full bg-white px-2.5 py-2.5 text-left text-[0.74rem] leading-5 text-slate-950 shadow-sm sm:px-3 sm:py-3 sm:text-[0.82rem] md:w-[18rem] lg:text-[0.9rem]">
      <div className="flex items-start gap-0.5">
        <p
          ref={quoteRef}
          className="min-w-0 flex-1 line-clamp-3 whitespace-normal wrap-break-word text-sm sm:text-base lg:text-lg"
        >
          <span className="mr-0.5 align-top text-sm font-semibold leading-none text-slate-700">
            "
          </span>
          {text}
          <span className="ml-0.5 align-bottom text-sm font-semibold leading-none text-slate-700">
            "
          </span>
        </p>

        {showTooltip ? (
          <TooltipHintIcon
            content={content}
            className="mt-0.5 inline-flex h-4 w-4 shrink-0 bg-white/95 text-slate-600 shadow-sm"
          />
        ) : null}
      </div>
    </div>
  );
}

export default function Testimonies() {
  return (
    <section id="testimonies" className="bg-white py-8 sm:py-12 ">
      <div className="global-pad mx-auto max-w-7xl">
        <SectionHeading
          title="TESTIMONIES"
          description={
            <p>Real experiences from individuals impacted by our programs.</p>
          }
          className="max-w-5xl"
        />

        <div className="mx-auto mt-5 flex max-w-5xl flex-col gap-4 sm:mt-6 sm:gap-5">
          {testimonies.map((testimony) => (
            <article
              key={`${testimony.name}-${testimony.image}`}
              className="rounded-[1.4rem] bg-linear-to-r from-blue-700 via-blue-800 to-blue-900 px-2 py-2 shadow-[0_18px_40px_-28px_rgba(15,23,42,0.7)] sm:px-3 sm:py-3 md:px-4 md:py-4 lg:px-5 lg:py-5"
            >
              <div className="grid items-center gap-2.5 md:grid-cols-[88px_minmax(0,1fr)_auto] md:gap-3 lg:grid-cols-[118px_minmax(0,1fr)_auto] lg:gap-4">
                <div className="mx-auto flex h-20 w-20 shrink-0 overflow-hidden rounded-2xl border border-white/20 bg-slate-200 sm:h-22 sm:w-22 md:mx-0 lg:h-28 lg:w-28">
                  <Image
                    src={testimony.image}
                    alt={testimony.name}
                    width={240}
                    height={240}
                    className="h-full w-full object-cover"
                  />
                </div>

                <div className="min-w-0 text-center md:text-left">
                  <h3 className="whitespace-normal wrap-break-word font-poppins text-sm font-medium leading-tight text-sky-200 420:text-base sm:text-lg md:text-xl lg:text-2xl xl:text-[1.7rem]">
                    {testimony.name}
                  </h3>
                  <p className="mt-1 text-xs leading-4 text-white/90 sm:text-sm md:text-base lg:text-lg">
                    {testimony.role}
                  </p>
                </div>

                <div className="md:justify-self-end">
                  <TestimonyQuote text={testimony.testimony} />
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
