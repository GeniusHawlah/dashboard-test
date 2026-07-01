export default function LoginHero() {
  return (
    <section className="relative hidden overflow-hidden bg-linear-to-br from-[#1177e6] via-[#0864d6] to-[#0b2d9f] px-10 py-10 text-white lg:flex lg:min-h-full lg:flex-col lg:justify-center xl:px-16">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(255,255,255,0.08),transparent_38%),radial-gradient(circle_at_30%_15%,rgba(255,255,255,0.11),transparent_30%)]" />

      <div className="absolute -left-16 bottom-[-7rem] h-[26rem] w-[26rem] rounded-full border border-white/15" />
      <div className="absolute -left-28 bottom-[-9rem] h-[33rem] w-[33rem] rounded-full border border-white/10" />

      <div className="relative z-10 max-w-xl">
        <p className="text-[2.35rem] font-semibold tracking-tight xl:text-[3.1rem]">
          GoFinance Logistics
        </p>
        <p className="mt-3 max-w-md text-lg leading-8 text-white/90 xl:text-xl">
          The most reliable way to monitor operations, keep teams aligned, and
          move work forward with clarity.
        </p>

        <button
          type="button"
          className="mt-7 inline-flex h-11 items-center justify-center rounded-full bg-[#1f8cff] px-6 text-sm font-medium text-white shadow-[0_12px_26px_rgba(0,0,0,0.16)] transition hover:bg-[#1780f2]"
        >
          Read More
        </button>
      </div>
    </section>
  );
}
