import Logo from "@/components/Logo";

export default function DashboardNavRail() {
  return (
    <div className="flex h-full w-full items-center justify-center overflow-hidden rounded-tr-3xl border-b border-white/10 bg-pry-blue px-5 shadow-[0_10px_30px_-24px_rgba(30,64,175,0.45)] lg:px-6">
      <Logo className="scale-110 lg:scale-[1.18]" />
    </div>
  );
}
