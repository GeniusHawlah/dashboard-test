import { Icon } from "@iconify-icon/react";
import SectionHeading from "@/components/SectionHeading";

const partners = [
  {
    name: "Google",
    icon: "logos:google-icon",
  },
  {
    name: "Microsoft",
    icon: "logos:microsoft-icon",
  },
  {
    name: "Meta",
    icon: "logos:meta-icon",
  },
];

export default function Partners() {
  return (
    <section id="partners" className="bg-white py-8 sm:py-12">
      <div className="global-pad mx-auto max-w-7xl">
        <SectionHeading
          title="OUR PARTNERS"
          description={
            <p>
              We are committed to building a future where every young mind has
              the opportunity to grow.
            </p>
          }
          className="max-w-5xl"
        />

        <div className="mx-auto mt-6 max-w-5xl">
          <div className="grid grid-cols-3 items-center justify-items-center gap-4 sm:gap-8">
            {partners.map((partner) => (
              <div
                key={partner.name}
                className="flex h-18 w-full items-center justify-center sm:h-20"
              >
                <Icon
                  icon={partner.icon}
                  role="img"
                  aria-label={partner.name}
                  className="text-5xl text-slate-900 sm:text-6xl"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
