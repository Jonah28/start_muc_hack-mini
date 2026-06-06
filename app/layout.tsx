import type { Metadata } from "next";
import { Bricolage_Grotesque, DM_Sans } from "next/font/google";
import "./globals.css";

const bricolage = Bricolage_Grotesque({
  subsets: ["latin"],
  variable: "--font-bricolage",
  display: "swap",
  weight: ["400", "500", "600", "700", "800"],
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: "WebStart – Neue Website in Minuten",
  description:
    "Aus deiner alten Website wird in Minuten eine neue. Einfach URL eingeben.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="de"
      className={`${bricolage.variable} ${dmSans.variable} h-full`}
    >
      <body className="min-h-dvh flex flex-col">{children}</body>
    </html>
  );
}
