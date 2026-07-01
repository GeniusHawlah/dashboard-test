import Image from "next/image";
import SectionHeading from "@/components/SectionHeading";

const galleryImages = [
  {
    src: "https://picsum.photos/seed/profak-gallery-1/900/700",
    alt: "Mentorship program group photo",
  },
  {
    src: "https://picsum.photos/seed/profak-gallery-2/900/700",
    alt: "Students and facilitators during a session",
  },
  {
    src: "https://picsum.photos/seed/profak-gallery-3/900/700",
    alt: "A mentorship presentation moment",
  },
  {
    src: "https://picsum.photos/seed/profak-gallery-4/900/700",
    alt: "Students receiving learning materials",
  },
  {
    src: "https://picsum.photos/seed/profak-gallery-5/900/700",
    alt: "Participants gathered for a program activity",
  },
  {
    src: "https://picsum.photos/seed/profak-gallery-6/900/700",
    alt: "A group photo from a foundation event",
  },
];

export default function Gallery() {
  return (
    <section id="gallery" className="bg-white py-8 sm:py-12 ">
      <div className="global-pad mx-auto max-w-7xl">
        <SectionHeading
          title="GALLERY"
          description={<p>Moments from our programs and events</p>}
          className="max-w-5xl"
        />

        <div className="mx-auto mt-6 max-w-5xl sm:mt-8">
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {galleryImages.map((image, index) => (
              <div
                key={image.src}
                className="group overflow-hidden rounded-[1.35rem] border border-slate-200 bg-slate-100 shadow-[0_14px_32px_-26px_rgba(15,23,42,0.55)]"
              >
                <div className="relative aspect-[4/3] w-full">
                  <Image
                    src={image.src}
                    alt={image.alt}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover transition duration-500 group-hover:scale-[1.03]"
                    priority={index < 3}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="mt-5 flex justify-end sm:mt-6">
            <button
              type="button"
              className="inline-flex h-11 min-w-36 items-center justify-center rounded-[0.7rem] bg-linear-to-b from-blue-700 to-blue-900 px-7 text-sm font-semibold text-white shadow-[0_14px_28px_-18px_rgba(15,23,42,0.7)] transition hover:-translate-y-0.5 hover:from-blue-600 hover:to-blue-800 cursor-pointer"
            >
              View All
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
