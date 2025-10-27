import React from "react";
import { Card, HelpCopy } from "@/components/shared";
import { MessageCircle, Bug, HeartHandshake } from "lucide-react";
import { FOOTER_TEXTS } from "@/components/shared/(texts)/footer-texts";

export default function Help() {
  return (
    <section className="bg-orange-50 py-16">
      <div className="container mx-auto px-4 max-w-2xl">
        <h1 className="text-4xl font-bold mb-4 text-center">
          {FOOTER_TEXTS.HELP_PAGE.TITLE}
        </h1>
        <p className="text-center text-gray-600 mb-12">
          {FOOTER_TEXTS.HELP_PAGE.DESCRIPTION}
        </p>

        <Card className="p-8">
          <div className="space-y-8 text-center">
            <div className="space-y-4">
              <div className="flex justify-center">
                <HeartHandshake size={64} className="text-orange-500" />
              </div>
              <h2 className="text-2xl font-bold text-gray-800">
                {FOOTER_TEXTS.HELP_PAGE.HAVE_IDEA}
              </h2>
              <p className="text-gray-600">
                {FOOTER_TEXTS.HELP_PAGE.CONTACT_US}
              </p>
            </div>

            <HelpCopy />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-gray-700 mt-8 ">
              <div className="flex items-center gap-4">
                <MessageCircle size={48} className="text-green-500" />
                <p className="text-left">{FOOTER_TEXTS.HELP_PAGE.COMMENT}</p>
              </div>
              <div className="flex items-center gap-4">
                <Bug size={48} className="text-red-500" />
                <p className="text-left">{FOOTER_TEXTS.HELP_PAGE.ERROR}</p>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </section>
  );
}
