import { Inter } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/context/CartContext";
import { AuthProvider } from "@/context/AuthContext";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import CartDrawer from "@/components/cart/CartDrawer";
import { site } from "@/data/site";
import { getContactPublic } from "@/lib/siteSettings";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });

export const metadata = {
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
  openGraph: {
    title: `${site.name} — ${site.tagline}`,
    description: site.description,
    type: "website",
    locale: "en_AE",
  },
};

export default async function RootLayout({ children }) {
  const contact = await getContactPublic();

  return (
    <html lang="en">
      <body className={`${inter.variable} antialiased`}>
        <AuthProvider>
          <CartProvider>
            <Navbar />
            <main>{children}</main>
            <Footer contact={contact} />
            <CartDrawer />
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
