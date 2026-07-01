import SignUpForm from "./SignUpForm";
import SignUpHero from "./SignUpHero";

export default function SignUpPage() {
  return (
    <main className="min-h-dvh bg-[#263645] p-4 text-slate-900 sm:p-5 lg:p-6">
      <section className="mx-auto grid min-h-[calc(100dvh-2rem)] max-w-[1440px] overflow-hidden rounded-[28px] bg-white shadow-[0_24px_80px_rgba(2,8,23,0.22)] lg:grid-cols-[1.18fr_0.82fr]">
        <SignUpHero />
        <SignUpForm />
      </section>
    </main>
  );
}
