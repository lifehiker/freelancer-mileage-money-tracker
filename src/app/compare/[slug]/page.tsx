import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { FocusPage, MarketingFooter } from "@/components/marketing-page";
import { COMPARE_PAGES } from "@/lib/constants";
import { absoluteUrl } from "@/lib/utils";

type CompareSlug = keyof typeof COMPARE_PAGES;

export async function generateStaticParams() {
  return Object.keys(COMPARE_PAGES).map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const page = COMPARE_PAGES[slug as CompareSlug];

  if (!page) {
    return {};
  }

  return {
    title: page.title,
    description: page.hero,
    alternates: {
      canonical: `/compare/${slug}`,
    },
    openGraph: {
      title: page.title,
      description: page.hero,
      url: absoluteUrl(`/compare/${slug}`),
    },
  };
}

export default async function ComparePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const page = COMPARE_PAGES[slug as CompareSlug];

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
