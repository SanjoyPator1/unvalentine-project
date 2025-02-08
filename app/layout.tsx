import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/navbar";
import { ThemeProvider } from "@/components/theme-provider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Unvalentine | Share Your Valentine's Day Thoughts Anonymously",
  description:
    "Express yourself freely on Valentine's Day through anonymous digital sticky notes. Join our community of singles sharing their authentic thoughts and feelings.",
  keywords: [
    "Valentine's Day",
    "anonymous messages",
    "singles community",
    "digital notes",
    "social platform",
  ],
  authors: [{ name: "Unvalentine" }],
  openGraph: {
    title: "Unvalentine | Anonymous Valentine's Day Expression",
    description:
      "Share your Valentine's Day thoughts anonymously through digital sticky notes.",
    type: "website",
    locale: "en_US",
    url: "https://unvalentine.com",
  },
  twitter: {
    card: "summary_large_image",
    title: "Unvalentine | Anonymous Valentine's Day Expression",
    description:
      "Share your Valentine's Day thoughts anonymously through digital sticky notes.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem={false}
          disableTransitionOnChange
        >
          <div className="min-h-screen bg-background">
            <Navbar />
            <main className="container mx-auto px-4 py-6">{children}</main>
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
