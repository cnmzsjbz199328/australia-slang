import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import AuthProvider from "@/components/providers/AuthProvider";
import AppLayout from "@/components/layout/AppLayout";
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
  title: "Australia Slang",
  description: "Learn Australian slang – dictionary and quiz",
  icons: {
    icon: [
      { url: '/icon.svg', type: 'image/svg+xml' },
    ],
    apple: '/icon.svg',
  },
  manifest: '/manifest.json',
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
  },
  // Open Graph metadata for social media sharing
  openGraph: {
    type: 'website',
    locale: 'en_AU',
    url: 'https://australiaslang.futurebutnow.xyz', // 替换为你的实际域名
    siteName: 'Australia Slang',
    title: 'Australia Slang',
    description: 'Learn Australian slang – dictionary and quiz',
    images: [
      {
        url: '/icon.svg', // 使用你的图标作为 OG 图片
        width: 1200,
        height: 630,
        alt: 'Australia Slang Logo',
      },
    ],
  },
  // Twitter Card metadata
  twitter: {
    card: 'summary',
    title: 'Australia Slang',
    description: 'Learn Australian slang – dictionary and quiz',
    images: ['/icon.svg'],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <AuthProvider>
          <AppLayout>{children}</AppLayout>
        </AuthProvider>
      </body>
    </html>
  );
}
