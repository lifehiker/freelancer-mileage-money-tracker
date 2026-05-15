import { Banner } from "@/components/ui";

export function AppNotice({ notice }: { notice?: string }) {
  if (!notice) {
    return null;
  }

  return <Banner>{notice}</Banner>;
}
