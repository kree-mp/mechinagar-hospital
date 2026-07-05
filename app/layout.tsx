import type { Metadata } from "next";
import { cookies } from "next/headers";
import { Libre_Franklin, Noto_Sans_Devanagari } from "next/font/google";
import QueryProvider from "@/providers/QueryProvider";
import LanguageProvider, { type Language } from "@/providers/LanguageProvider";
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

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieLanguage = (await cookies()).get("language")?.value;
  const initialLanguage: Language = cookieLanguage === "en" ? "en" : "np";

  return (
    <html
      lang={initialLanguage === "np" ? "ne" : "en"}
      className={`${libreFranklin.variable} ${notoSansDevanagari.variable}`}
    >
      <body className="font-en text-[#1B262C] antialiased">
        <LanguageProvider initialLanguage={initialLanguage}>
          <QueryProvider>{children}</QueryProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
