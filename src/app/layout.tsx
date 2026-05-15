import type { Metadata } from "next";

import "./globals.css";

import { APP_NAME, APP_TAGLINE, APP_URL } from "@/lib/constants";

export const metadata: Metadata = {
  metadataBase: new URL(APP_URL),
  title: {
    default: `${APP_NAME} | Mileage, Expenses, Income, and Tax Tracking`,
    template: `%s | ${APP_NAME}`,
  },
  description:
    "Track business mileage, expenses, income, and tax set-asides in one simple app built for freelancers and self-employed professionals.",
  alternates: {
    canonical: "/",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <div className="min-h-screen bg-[var(--color-background)] text-[var(--color-ink)]">
          {children}
        </div>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "SoftwareApplication",
              name: APP_NAME,
              applicationCategory: "BusinessApplication",
              operatingSystem: "Web",
              description: APP_TAGLINE,
              offers: {
                "@type": "Offer",
                price: "0",
                priceCurrency: "USD",
              },
            }),
          }}
        />
      </body>
    </html>
  );
}
