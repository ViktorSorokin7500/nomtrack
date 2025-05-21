import {
  NutritionTargetsForm,
  PersonalInfoForm,
  ProfileSidebar,
  TelegramConnect,
} from "@/components/settings";

export default function Settings() {
  return (
    <section className="bg-orange-50 min-h-screen">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Profile Settings</h1>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1">
            <ProfileSidebar />
          </div>
          <div className="lg:col-span-2 space-y-8">
            <PersonalInfoForm />
            <NutritionTargetsForm />
            <TelegramConnect />
          </div>
        </div>
      </div>
    </section>
  );
}
