import RegisterBrandSection from "@/components/register/RegisterBrandSection";
import RegisterForm from "@/components/register/RegisterForm";

export const metadata = {
  title: "VIGOR | Start Your Journey",
  description:
    "Create your free VIGOR account and unlock access to world-class workouts, nutrition guidance, and a thriving athlete community.",
};

export default function RegisterPage() {
  return (
    <div className="auth-page-bg min-h-screen selection:bg-primary-container selection:text-on-primary-container">
      <main className="pt-32 pb-section-gap px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-0 overflow-hidden rounded-3xl auth-card border shadow-2xl">
          <RegisterBrandSection />
          <RegisterForm />
        </div>
      </main>
    </div>
  );
}
