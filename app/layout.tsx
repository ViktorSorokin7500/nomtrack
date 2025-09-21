import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import { Toaster } from "react-hot-toast";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: {
      template: "%s | NomTrack",
      default: "NomTrack",
    },
    description: "description",
    keywords: "keywords",
    openGraph: {
      title: "NomTrack",
      description: "description",
      url: `https://www.commentpulse.site`,
      type: "website",
      locale: "uk_UA",
      siteName: "Social Analyzer",
    },
    twitter: {
      card: "summary_large_image",
      title: "NomTrack",
      description: "description",
    },
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="uk">
      <body className={`${poppins.variable} font-sans antialiased`}>
        {children}
        <Toaster />
      </body>
    </html>
  );
}
