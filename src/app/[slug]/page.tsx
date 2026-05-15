import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { FocusPage, MarketingFooter } from "@/components/marketing-page";
import { ROOT_SEO_PAGES } from "@/lib/constants";
import { absoluteUrl } from "@/lib/utils";

type RootSlug = keyof typeof ROOT_SEO_PAGES;

export async function generateStaticParams() {
  return Object.keys(ROOT_SEO_PAGES).map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const page = ROOT_SEO_PAGES[slug as RootSlug];

  if (!page) {
    return {};
  }

  return {
    title: page.title,
    description: page.hero,
    alternates: {
      canonical: `/${slug}`,
    },
    openGraph: {
      title: page.title,
      description: page.hero,
      url: absoluteUrl(`/${slug}`),
    },
  };
}

export default async function RootSeoPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const page = ROOT_SEO_PAGES[slug as RootSlug];

  if (!page) {
    notFound();
  }

  return (
    <div className="mx-auto flex min-h-screen w-full max-w-6xl flex-col gap-8 px-4 py-8 sm:px-6">
      <FocusPage title={page.title} hero={page.hero} intro={page.intro} bullets={page.bullets} />
      <MarketingFooter />
    </div>
  );
}
