import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "@/styles/globals.css";
import "@/styles/theme.css"; // Import the new theme file
import Header from "@/components/layout/Header";
import BottomNavbar from "@/components/layout/BottomNavbar";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Shopper Insights",
  description: "Track your spending and gain valuable insights.",
};

export default function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full bg-background">
      <head>
        <link rel="icon" href="/favicon.ico" />
        <link
          rel="icon"
          type="image/png"
          sizes="96x96"
          href="/favicon-96x96.png"
        />
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/apple-touch-icon.png"
        />
        <link rel="icon" type="image/svg+xml" href="/logo.svg" />
        <link rel="icon" type="image/svg+xml" href="/shopper-insights.svg" />
        <link rel="manifest" href="/site.webmanifest" />
        <link
          rel="icon"
          type="image/png"
          sizes="192x192"
          href="/web-app-manifest-192x192.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="512x512"
          href="/web-app-manifest-512x512.png"
        />
      </head>
      <body
        className={`${inter.className} antialiased h-full text-text-primary`}
      >
        <div className="flex flex-col h-full min-h-screen w-full">
          {/* Top Navigation/Header */}
          <Header />
          {/* Main Content */}
          <main className="flex-1 p-4 sm:p-6 lg:p-8 bg-background pb-24">
            {children}
          </main>
          {/* Mobile Bottom Navigation */}
          <BottomNavbar />
        </div>
      </body>
    </html>
  );
}
