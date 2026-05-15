import type { Metadata } from "next";

import { FAQSection, MarketingFooter } from "@/components/marketing-page";
import { APP_NAME, FAQS } from "@/lib/constants";

export const metadata: Metadata = {
  title: "FAQ",
};

export default function FAQPage() {
  return (
    <div className="mx-auto flex min-h-screen w-full max-w-5xl flex-col gap-8 px-4 py-8 sm:px-6">
      <FAQSection />
      <MarketingFooter />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: FAQS.map((faq) => ({
              "@type": "Question",
              name: faq.question,
              acceptedAnswer: {
                "@type": "Answer",
                text: faq.answer,
              },
            })),
            about: APP_NAME,
          }),
        }}
      />
    </div>
  );
}
