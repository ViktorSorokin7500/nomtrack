import React from "react";
import { Card } from "@/components/shared";
import { FOOTER_TEXTS } from "@/components/shared/(texts)/footer-texts";

interface PrivacyListItemProps {
  strong: string;
  desc: string;
}

const PrivacyListItem: React.FC<PrivacyListItemProps> = ({ strong, desc }) => (
  <li>
    <strong className="text-orange-500">{strong}</strong> {desc}
  </li>
);

export default function PrivacySecurity() {
  return (
    <section className="bg-orange-50 min-h-screen py-16">
      <div className="container mx-auto px-4 max-w-4xl">
        <h1 className="text-4xl font-bold mb-4 text-center">
          {FOOTER_TEXTS.PRIVACY_TEXTS.TITLE}
        </h1>
        <p className="text-center text-gray-600 mb-12">
          {FOOTER_TEXTS.PRIVACY_TEXTS.LAST_UPDATED}
        </p>

        <Card>
          <div className="prose prose-lg mx-auto">
            <h2 className="text-2xl font-bold mt-8 mb-4">
              {FOOTER_TEXTS.PRIVACY_TEXTS.SECTION_1.TITLE}
            </h2>
            <p>{FOOTER_TEXTS.PRIVACY_TEXTS.SECTION_1.CONTENT}</p>
            <h2 className="text-2xl font-bold mt-8 mb-4">
              {FOOTER_TEXTS.PRIVACY_TEXTS.SECTION_2.TITLE}
            </h2>
            <p>{FOOTER_TEXTS.PRIVACY_TEXTS.SECTION_2.PRE_LIST}</p>
            <ul className="list-disc list-inside space-y-2">
              {FOOTER_TEXTS.PRIVACY_TEXTS.SECTION_2.ITEMS.map((item, index) => (
                <PrivacyListItem
                  key={index}
                  strong={item.STRONG}
                  desc={item.DESC}
                />
              ))}
            </ul>
            <p>{FOOTER_TEXTS.PRIVACY_TEXTS.SECTION_2.POST_LIST}</p>
            <h2 className="text-2xl font-bold mt-8 mb-4">
              {FOOTER_TEXTS.PRIVACY_TEXTS.SECTION_3.TITLE}
            </h2>
            <p>{FOOTER_TEXTS.PRIVACY_TEXTS.SECTION_3.CONTENT}</p>
            <h2 className="text-2xl font-bold mt-8 mb-4">
              {FOOTER_TEXTS.PRIVACY_TEXTS.SECTION_4.TITLE}
            </h2>
            <p>{FOOTER_TEXTS.PRIVACY_TEXTS.SECTION_4.CONTENT}</p>
            <h2 className="text-2xl font-bold mt-8 mb-4">
              {FOOTER_TEXTS.PRIVACY_TEXTS.SECTION_5.TITLE}
            </h2>
            <p>{FOOTER_TEXTS.PRIVACY_TEXTS.SECTION_5.PRE_LIST}</p>
            <ul className="list-disc list-inside space-y-2">
              {FOOTER_TEXTS.PRIVACY_TEXTS.SECTION_5.ITEMS.map((item, index) => (
                <li key={index}>{item}</li>
              ))}{" "}
            </ul>

            <h2 className="text-2xl font-bold mt-8 mb-4">
              {FOOTER_TEXTS.PRIVACY_TEXTS.SECTION_6.TITLE}
            </h2>
            <p>{FOOTER_TEXTS.PRIVACY_TEXTS.SECTION_6.CONTENT}</p>
            <h2 className="text-2xl font-bold mt-8 mb-4">
              {FOOTER_TEXTS.PRIVACY_TEXTS.SECTION_7.TITLE}
            </h2>
            <p>{FOOTER_TEXTS.PRIVACY_TEXTS.SECTION_7.CONTENT}</p>
          </div>
        </Card>
      </div>
    </section>
  );
}
