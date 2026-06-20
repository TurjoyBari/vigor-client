import LoginBackground from "@/components/login/LoginBackground";
import LoginBrandSection from "@/components/login/LoginBrandSection";
import LoginForm from "@/components/login/LoginForm";

export const metadata = {
  title: "Login | VIGOR PERFORMANCE",
  description:
    "Sign in to VIGOR PERFORMANCE — train smarter, track harder, and push further every single day.",
};

export default function LoginPage() {
  return (
    <div className="auth-page-bg text-on-surface antialiased overflow-x-hidden min-h-screen flex flex-col selection:bg-primary-container selection:text-on-primary-container">
      <LoginBackground />

      <main className="flex-grow flex items-center justify-center p-4 md:p-8">
        <div className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-2 bg-surface-container-lowest rounded-3xl overflow-hidden auth-card border min-h-[700px]">
          <LoginBrandSection />
          <LoginForm />
        </div>
      </main>
    </div>
  );
}
