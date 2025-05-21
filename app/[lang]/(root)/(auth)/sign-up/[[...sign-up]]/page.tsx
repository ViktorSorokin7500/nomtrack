import { BgGradient } from "@/components/shared/bg-gradient";
import { SignUp } from "@clerk/nextjs";
import type { Metadata } from "next";

// Статичные метаданные для страницы входа
export const metadata: Metadata = {
  title: "Sign Up",
  description: "Log in to access your social media analysis dashboard",
  keywords: "sign up, registration, social media, analysis",
  openGraph: {
    title: "Sign Up",
    description: "Log in to access your social media analysis dashboard",
    url: "https://www.commentpulse.site/sign-up",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Sign Up",
    description: "Log in to access your social media analysis dashboard",
  },
};

export default function Page() {
  return (
    <section className="flex items-center justify-center lg:min-h-[40vh]">
      <div className="py-12 lg:py-24 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 lg:pt-12">
        <BgGradient className="from-orange-400 via-orange-300 to-orange-200" />
        <SignUp />
      </div>
    </section>
  );
}
