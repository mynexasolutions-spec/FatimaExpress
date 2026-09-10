import { Inter } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/context/CartContext";
import { AuthProvider } from "@/context/AuthContext";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import CartDrawer from "@/components/cart/CartDrawer";
import WhatsAppFloatButton from "@/components/layout/WhatsAppFloatButton";
import { site } from "@/data/site";
import { getContactPublic } from "@/lib/siteSettings";
import { getAllCategories } from "@/lib/catalog";
import { SITE_URL } from "@/lib/seo";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });

export const metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${site.name} — Wholesale Foil, Bubble & Party Balloons in UAE`,
    template: `%s | ${site.name}`,
  },
  description: site.description,
  keywords: [
    "foil balloons Dubai",
    "bubble balloons UAE",
    "wholesale party supplies Dubai",
    "balloon pump UAE",
    "party decorations Dubai",
  ],
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: `${site.name} — ${site.tagline}`,
    description: site.description,
    url: SITE_URL,
    siteName: site.name,
    type: "website",
    locale: "en_AE",
  },
  icons: {
    icon: "/favicon.png",
    shortcut: "/favicon.png",
    apple: "/favicon.png",
  },
};

const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: site.name,
  url: SITE_URL,
  logo: `${SITE_URL}/logo.png`,
  description: site.description,
  email: site.email,
  telephone: site.whatsapp,
  address: {
    "@type": "PostalAddress",
    addressLocality: "Dubai",
    addressCountry: "AE",
  },
  sameAs: [site.facebook, site.instagram].filter(Boolean),
};

export default async function RootLayout({ children }) {
  const [contact, categories] = await Promise.all([getContactPublic(), getAllCategories()]);

  return (
    <html lang="en">
      <body className={`${inter.variable} antialiased`}>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />
        <AuthProvider>
          <CartProvider>
            <Navbar categories={categories} />
            <main>{children}</main>
            <Footer contact={contact} />
            <CartDrawer />
            <WhatsAppFloatButton phone={contact.whatsapp} />
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
