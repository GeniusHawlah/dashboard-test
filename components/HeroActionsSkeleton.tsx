export default function HeroActionsSkeleton() {
  return (
    <div className="mt-4 flex flex-wrap items-center justify-center gap-2.5 800:justify-start">
      <div className="h-8 w-32 rounded-md bg-slate-200/80 sm:h-10 sm:w-40" />
      <div className="h-8 w-28 rounded-md bg-slate-200/80 sm:h-10 sm:w-36" />
      <div className="basis-full 390:basis-auto h-8 w-full rounded-md bg-slate-200/80 sm:h-10 sm:w-52" />
    </div>
  );
}
