import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { FocusPage, MarketingFooter } from "@/components/marketing-page";
import { PERSONA_PAGES } from "@/lib/constants";
import { absoluteUrl } from "@/lib/utils";

type PersonaSlug = keyof typeof PERSONA_PAGES;

export async function generateStaticParams() {
  return Object.keys(PERSONA_PAGES).map((persona) => ({ persona }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ persona: string }>;
}): Promise<Metadata> {
  const { persona } = await params;
  const page = PERSONA_PAGES[persona as PersonaSlug];

  if (!page) {
    return {};
  }

  return {
    title: page.title,
    description: page.hero,
    alternates: {
      canonical: `/for/${persona}`,
    },
    openGraph: {
      title: page.title,
      description: page.hero,
      url: absoluteUrl(`/for/${persona}`),
    },
  };
}

export default async function PersonaPage({
  params,
}: {
  params: Promise<{ persona: string }>;
}) {
  const { persona } = await params;
  const page = PERSONA_PAGES[persona as PersonaSlug];

  if (!page) {
    notFound();
  }

  return (
    <div className="mx-auto flex min-h-screen w-full max-w-6xl flex-col gap-8 px-4 py-8 sm:px-6">
      <FocusPage title={page.title} hero={page.hero} bullets={page.bullets} />
      <MarketingFooter />
    </div>
  );
}
