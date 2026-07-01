import { Suspense } from "react";
import SectionHeading from "@/components/SectionHeading";
import ProgramsSkeleton from "@/components/ProgramsSkeleton";
import ProgramsWrapper from "@/components/ProgramsWrapper";

export default function ProgramsSection() {
  return (
    <section id="program" className="bg-white py-8 sm:py-12">
      <div className="global-pad mx-auto max-w-7xl">
        <SectionHeading
          title="OUR PROGRAMS"
          description={
            <p>
              Explore opportunities designed to empower and grow your potential.
            </p>
          }
          className="max-w-5xl"
        />

        <div className="mx-auto mt-8 max-w-6xl">
          <Suspense fallback={<ProgramsSkeleton />}>
            <ProgramsWrapper />
          </Suspense>
        </div>
      </div>
    </section>
  );
}
