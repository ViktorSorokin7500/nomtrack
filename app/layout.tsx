import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import { LazyToaster } from "@/components/shared";
import { LAYOUT_TEXTS } from "@/components/shared/(texts)/layout-text";
import Script from "next/script";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  display: "swap",
});

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: {
      template: `%s | ${LAYOUT_TEXTS.NOMTRACK}`,
      default: LAYOUT_TEXTS.NOMTRACK,
    },
    description: LAYOUT_TEXTS.DESCRIPTION,
    keywords: LAYOUT_TEXTS.KEYWORDS,
    openGraph: {
      title: LAYOUT_TEXTS.NOMTRACK,
      description: LAYOUT_TEXTS.DESCRIPTION,
      url: `https://www.nomtrack.site`,
      type: "website",
      locale: "uk_UA",
      siteName: LAYOUT_TEXTS.NOMTRACK,
    },
    twitter: {
      card: "summary_large_image",
      title: LAYOUT_TEXTS.NOMTRACK,
      description: LAYOUT_TEXTS.DESCRIPTION,
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
      <head>
        <Script
          async
          src="https://www.googletagmanager.com/gtag/js?id=G-GN1W404Y8X"
        />
        <Script id="google-ads-tag">
          {`window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());

  gtag('config', 'G-GN1W404Y8X');
  gtag('config', 'AW-11095731932');`}
        </Script>
        <Script id="google-ads-helper">
          {`
    // Helper function to delay opening a URL until a gtag event is sent.
    // Call it in response to an action that should navigate to a URL.
    function gtagSendEvent(url) {
      var callback = function () {
        if (typeof url === 'string') {
          window.location = url;
        }
      };
      gtag('event', 'ads_conversion___1', {
        'event_callback': callback,
        'event_timeout': 2000,
        // <event_parameters>
      });
      return false;
    }
  `}
        </Script>
      </head>
      <body className={`${poppins.variable} font-sans antialiased`}>
        {children}
        <LazyToaster />
      </body>
    </html>
  );
}
