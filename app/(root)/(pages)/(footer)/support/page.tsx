import React from "react";
import { Card } from "@/components/shared";
import { Rocket, HeartHandshake } from "lucide-react";
import Link from "next/link";
import { FOOTER_TEXTS } from "@/components/shared/(texts)/footer-texts";

export default function SupportPage() {
  return (
    <section className="bg-orange-50 min-h-screen py-16">
      <div className="container mx-auto px-4 max-w-2xl">
        <h1 className="text-4xl font-bold mb-4 text-center">
          {FOOTER_TEXTS.SUPPORT_PAGE.TITLE}
        </h1>
        <p className="text-center text-gray-600 mb-12">
          {FOOTER_TEXTS.SUPPORT_PAGE.DESCRIPTION}
        </p>

        <Card>
          <div className="text-center space-y-4 pb-4">
            <HeartHandshake size={64} className="text-orange-500 mx-auto" />
            <h2 className="text-2xl font-bold text-gray-800">
              {FOOTER_TEXTS.SUPPORT_PAGE.HEART_HANDSHAKE_TITLE}
            </h2>
            <p className="text-gray-600 text-left">
              {FOOTER_TEXTS.SUPPORT_PAGE.HEART_HANDSHAKE_DESCRIPTION1}
            </p>
            <p className="text-gray-600 text-left">
              {FOOTER_TEXTS.SUPPORT_PAGE.HEART_HANDSHAKE_DESCRIPTION2}
            </p>
          </div>

          <div className="text-center space-y-4 pt-8 border-t border-gray-200">
            <Rocket size={64} className="text-orange-500 mx-auto" />
            <h2 className="text-2xl font-bold text-gray-800">
              {FOOTER_TEXTS.SUPPORT_PAGE.ROCKET_TITLE}
            </h2>
            <p className="text-gray-600">
              {FOOTER_TEXTS.SUPPORT_PAGE.ROCKET_DESCRIPTION}
            </p>
            <Link href="/pricing" passHref>
              <button className="cursor-pointer inline-flex items-center gap-2 px-6 py-3 bg-orange-500 text-white font-semibold rounded-full shadow-lg hover:bg-orange-600 transition-colors">
                {FOOTER_TEXTS.SUPPORT_PAGE.PAY_BUTTON}
              </button>
            </Link>
          </div>
        </Card>
      </div>
    </section>
  );
}
