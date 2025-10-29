import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import {
  NutritionTargetsForm,
  PersonalInfoForm,
  ProfileSidebar,
  SettingsSkeleton,
} from "@/components/settings";
import { Suspense } from "react";
import { SETTINGS_TEXTS } from "@/components/settings/settings-text";
import { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: SETTINGS_TEXTS.TITLE,
    description: SETTINGS_TEXTS.DESCRIPTION,
  };
}

export default async function Settings() {
  const supabase = createClient();

  const {
    data: { user },
  } = await (await supabase).auth.getUser();

  if (!user) {
    redirect("/sign-in");
  }

  const { data: profile, error } = await (await supabase)
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .maybeSingle();

  if (error) {
    console.error("Could not load profile:", error);
  }

  return (
    <section className="bg-orange-50 min-h-screen">
      <Suspense fallback={<SettingsSkeleton />}>
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold mb-8">{SETTINGS_TEXTS.TITLE}</h1>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1">
              <ProfileSidebar
                userName={profile.full_name}
                userEmail={profile.email}
              />
            </div>
            <div className="lg:col-span-2 space-y-8">
              <PersonalInfoForm initialData={profile} />
              <NutritionTargetsForm initialData={profile} />
            </div>
          </div>
        </div>
      </Suspense>
    </section>
  );
}
