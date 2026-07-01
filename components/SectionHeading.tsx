import { ReactNode } from "react";

type SectionHeadingProps = {
  title: string;
  description?: ReactNode;
  className?: string;
};

export default function SectionHeading({
  title,
  description,
  className = "",
}: SectionHeadingProps) {
  return (
    <div className={`mx-auto max-w-4xl text-center whitespace-nowrap ${className}`.trim()}>
      <h2 className="font-poppins text-3xl font-extrabold tracking-tight text-transparent bg-linear-to-r from-blue-700 via-blue-900 to-blue-950 bg-clip-text sm:text-4xl md:text-5xl">
        {title}
      </h2>

      {description ? (
        <div className="mx-auto mt-4 max-w-3xl text-balance text-sm leading-6 text-slate-800 sm:text-base md:text-lg">
          {description}
        </div>
      ) : null}
    </div>
  );
}
