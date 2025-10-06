import type { Metadata } from "next";
import "./globals.css";
import ConditionalNavbar, { ConditionalFooter } from "@/components/ConditionalNavbar";

export const metadata: Metadata = {
  title: "Tasami - AI, Automation, Design & Marketing Solutions",
  description: "Leading tech company specializing in AI, automation, design, UX/UI, and marketing solutions. Transform your business with cutting-edge technology.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className="antialiased"
      >
        <ConditionalNavbar />
        {children}
        <ConditionalFooter />
      </body>
    </html>
  );
}
