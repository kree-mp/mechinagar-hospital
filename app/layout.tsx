import type { Metadata } from "next";
import { Libre_Franklin, Noto_Sans_Devanagari } from "next/font/google";
import "./globals.css";

const libreFranklin = Libre_Franklin({
  variable: "--font-libre-franklin",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

const notoSansDevanagari = Noto_Sans_Devanagari({
  variable: "--font-noto-devanagari",
  subsets: ["devanagari"],
  weight: ["400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "मेचीनगर आधारभूत अस्पताल | Mechinagar Aadharvut Hospital",
  description:
    "मेचीनगर आधारभूत अस्पताल, झापा — नेपाल सरकारको स्वामित्वमा रहेको सरकारी अस्पताल। ओपीडी, आकस्मिक, शल्यक्रिया र अन्य स्वास्थ्य सेवाहरू।",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ne"
      className={`${libreFranklin.variable} ${notoSansDevanagari.variable}`}
    >
      <body className="font-en text-[#1B262C] antialiased">{children}</body>
    </html>
  );
}
