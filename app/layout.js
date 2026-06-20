import { Anybody, Hanken_Grotesk } from "next/font/google";
import { Geist } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ToastProvider from "@/components/ToastProvider";

const anybody = Anybody({
  variable: "--font-anybody-family",
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

const hankenGrotesk = Hanken_Grotesk({
  variable: "--font-hanken-family",
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata = {
  title: "VIGOR | High-Octane Performance",
  description:
    "Elite-level biomechanics tracking meets world-class coaching. Unlock the potential of your physiological data in real-time.",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`dark ${anybody.variable} ${hankenGrotesk.variable} ${geistSans.variable}`}
      suppressHydrationWarning
    >
      <body className="selection:bg-primary-container selection:text-on-primary-container">
        <Navbar />
        {children}
        <Footer />
        <ToastProvider />
      </body>
    </html>
  );
}
