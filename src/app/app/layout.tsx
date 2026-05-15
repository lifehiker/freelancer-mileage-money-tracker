import { redirect } from "next/navigation";

import { getCurrentUser } from "@/lib/auth";

export default async function AuthenticatedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/sign-in");
  }

  if (!user.onboardingCompleted) {
    redirect("/onboarding");
  }

  return children;
}
