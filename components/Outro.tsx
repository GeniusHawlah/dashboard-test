import Link from "next/link";
import { RelativeRoutes } from "@/utils/enum";

export default function Outro() {
  return (
    <section className="bg-[#0f172a] py-10 sm:py-12 lg:py-14">
      <div className="global-pad mx-auto max-w-7xl">
        <div className="mx-auto flex max-w-4xl flex-col items-center text-center">
          <h2 className="font-poppins text-3xl font-extrabold tracking-tight text-[#5ca0ff] sm:text-4xl lg:text-5xl">
            Start Your Journey Today!
          </h2>

          <p className="mt-3 max-w-3xl text-lg leading-tight text-white sm:text-xl lg:text-[1.65rem]">
            Join a community of learners and gain access to opportunities that
            shape your future.
          </p>

          <div className="mt-6 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              href={RelativeRoutes.LOGIN_PAGE}
              className="inline-flex h-12 min-w-48 items-center justify-center rounded-2xl bg-[#2455dd] px-7 text-lg font-medium text-white shadow-[0_12px_28px_-18px_rgba(37,99,235,0.75)] transition hover:bg-[#1f49bf]"
            >
              Apply Now
            </Link>

            <Link
              href="/#program"
              className="inline-flex h-12 min-w-48 items-center justify-center rounded-2xl bg-[#6aa9ff] px-7 text-lg font-medium text-slate-950 transition hover:bg-[#5f9bf0]"
            >
              Explore Programs
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
