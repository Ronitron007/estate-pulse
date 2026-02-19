import type { Metadata } from "next";
import Script from "next/script";
import { Geist, Geist_Mono } from "next/font/google";
import { AuthProvider } from "@/components/auth/AuthProvider";
import { FavoritesProvider } from "@/components/auth/FavoritesProvider";
import { SettingsProvider } from "@/components/settings/SettingsProvider";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "PerfectGhar.in - Buy Property With Confidence",
  description: "Browse residential and commercial properties from top builders. Search, compare, and find your perfect home.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <Script id="gtm" strategy="afterInteractive">{`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM-M2FKLT3H');`}</Script>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <noscript><iframe src="https://www.googletagmanager.com/ns.html?id=GTM-M2FKLT3H" height="0" width="0" style={{display:"none",visibility:"hidden"}} /></noscript>
        <AuthProvider>
          <FavoritesProvider>
            <SettingsProvider>
              {children}
            </SettingsProvider>
          </FavoritesProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
