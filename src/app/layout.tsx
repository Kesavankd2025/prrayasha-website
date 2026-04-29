import type { Metadata } from "next";
import { Inter, Outfit, Playfair_Display, Great_Vibes, Aclonica } from "next/font/google";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import "./globals.css";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["700"],
});

const greatVibes = Great_Vibes({
  variable: "--font-cursive",
  subsets: ["latin"],
  weight: ["400"],
});

const aclonica = Aclonica({
  variable: "--font-aclonica",
  subsets: ["latin"],
  weight: ["400"],
});

export const metadata: Metadata = {
  title: "Prrayasha Collections | Premium Ethnic Boutique",
  description: "Browse the exclusive high-end ethnic collections at Prrayasha Collections. Discover Kurtis, Chiffon variants, Maxi dresses, Raw silk suits, and timeless elegance.",
};

import { AuthProvider } from "@/context/AuthContext";
import { ToastProvider } from "@/context/ToastContext";
import { WishlistProvider } from "@/context/WishlistContext";
import { CartProvider } from "@/context/CartContext";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body 
        className={`${outfit.variable} ${inter.variable} ${playfair.variable} ${greatVibes.variable} ${aclonica.variable} antialiased font-sans`}
        suppressHydrationWarning
      >
        <AuthProvider>
          <ToastProvider>
            <WishlistProvider>
              <CartProvider>
                <Navbar />
                {children}
                <Footer />
              </CartProvider>
            </WishlistProvider>
          </ToastProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
