import type { Metadata, Viewport } from "next";
import { Inter, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  title: {
    default: "Shuhada-e-Derajat Family Healthcare Initiative",
    template: "%s | DSFHI",
  },
  description: "Shuhada-e-Derajat Family Healthcare Initiative",
  icons: {
    icon: [
      { url: "/images/logo.svg", type: "image/svg+xml" },
    ],
    shortcut: "/images/logo.svg",
    apple: "/images/logo.svg",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en" suppressHydrationWarning={true}
      className={`${inter.variable} ${geistMono.variable} h-full antialiased overflow-x-hidden`}
    >
      <body className="min-h-full flex flex-col w-full max-w-full overflow-x-hidden" suppressHydrationWarning={true}>
        {children}
        <Toaster richColors />
      </body>
    </html>
  );
}
