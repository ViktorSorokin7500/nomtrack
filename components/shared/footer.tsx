import React from "react";
import { SHARED_TEXTS } from "./(texts)/shared-text";

const socialIcons = [
  {
    href: "#",
    title: SHARED_TEXTS.FOOTER.TELEGRAM,
    color: "hover:text-blue-500",
    path: (
      <path d="M21.05 2.63 2.19 9.69c-1.58.61-1.56 1.45-.29 1.85l4.63 1.45 1.75 5.54c.2.63.1.87.7.87.45 0 .64-.21.89-.47l2.13-2.08 4.44 3.27c.82.45 1.4.21 1.6-.76l3.08-14.57c.29-1.21-.46-1.76-1.47-1.16z" />
    ),
  },
  {
    href: "#",
    title: SHARED_TEXTS.FOOTER.INSTAGRAM,
    color: "hover:text-blue-300",
    path: (
      <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
    ),
  },
  {
    href: "#",
    title: SHARED_TEXTS.FOOTER.YOUTUBE,
    color: "hover:text-red-500",
    path: (
      <>
        <path d="M23.498 6.186a2.988 2.988 0 00-2.104-2.11C19.694 3.5 12 3.5 12 3.5s-7.694 0-9.394.576a2.988 2.988 0 00-2.104 2.11C0 7.887 0 12 0 12s0 4.113.502 5.814a2.988 2.988 0 002.104 2.11C4.306 20.5 12 20.5 12 20.5s7.694 0 9.394-.576a2.988 2.988 0 002.104-2.11C24 16.113 24 12 24 12s0-4.113-.502-5.814z" />
        <path fill="#fff" d="M9.75 15.5v-7l6 3.5-6 3.5z" />
      </>
    ),
  },
];

interface FooterLink {
  label: string;
  href: string;
}

interface FooterLinkSectionProps {
  title: string;
  links: FooterLink[];
}

function FooterLinkSection({ title, links }: FooterLinkSectionProps) {
  return (
    <div>
      <h3 className="font-semibold mb-4">{title}</h3>
      <ul className="space-y-2">
        {links.map((link, index) => (
          <li key={index}>
            <a
              href={link.href}
              className="text-gray-500 hover:text-orange-400 transition-colors"
            >
              {link.label}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}

interface SocialIconProps {
  href: string;
  path: React.ReactNode;
  title: string;
  color: string;
}

function SocialIcon({ href, path, title, color }: SocialIconProps) {
  return (
    <a
      href={href}
      className={`text-stone-500 transition-colors duration-300 ${color}`}
      title={title}
    >
      <svg
        className="size-6"
        fill="currentColor"
        viewBox="0 0 24 24"
        aria-hidden="true"
      >
        {path}
      </svg>
    </a>
  );
}

export function Footer() {
  const footerLinks = [
    {
      title: SHARED_TEXTS.FOOTER.PRODUCT,
      links: [
        { label: SHARED_TEXTS.FOOTER.UPDATES, href: "/updates" },
        { label: SHARED_TEXTS.FOOTER.PRICING, href: "/pricing" },
      ],
    },
    {
      title: SHARED_TEXTS.FOOTER.RESOURCES,
      links: [
        { label: SHARED_TEXTS.FOOTER.SUPPORT, href: "/support" },
        { label: SHARED_TEXTS.FOOTER.SITEMAP, href: "/sitemap-page" },
      ],
    },
    {
      title: SHARED_TEXTS.FOOTER.LEGAL,
      links: [
        { label: SHARED_TEXTS.FOOTER.PRIVACY, href: "/privacy-security" },
        { label: SHARED_TEXTS.FOOTER.TERMS, href: "/help" },
      ],
    },
  ];

  return (
    <footer className="bg-white py-8">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center mb-8">
          <div className="flex items-center mb-6 md:mb-0">
            <svg
              className="size-8 mr-2"
              viewBox="0 0 40 40"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle cx="20" cy="20" r="18" fill="#FFB982" />
              <path
                d="M14 20C14 17.2386 16.2386 15 19 15H21C23.7614 15 26 17.2386 26 20V25C26 27.7614 23.7614 30 21 30H19C16.2386 30 14 27.7614 14 25V20Z"
                fill="#B4E8C2"
              />
              <circle cx="20" cy="12" r="4" fill="#FFE066" />
            </svg>
            <h2 className="text-xl font-bold">
              {SHARED_TEXTS.FOOTER.NOMTRACK}
            </h2>
          </div>
          <div className="flex space-x-6">
            {socialIcons.map((icon, index) => (
              <SocialIcon
                key={index}
                href={icon.href}
                path={icon.path}
                title={icon.title}
                color={icon.color}
              />
            ))}
          </div>
        </div>
        <div className="border-t border-gray-200 pt-8">
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 max-w-5xl mx-auto">
            {footerLinks.map((section, index) => (
              <FooterLinkSection
                key={index}
                title={section.title}
                links={section.links}
              />
            ))}
          </div>
        </div>
        <div className="border-t border-gray-200 mt-8 pt-8 text-center text-gray-500 text-sm">
          <p>
            © {new Date().getFullYear()} {SHARED_TEXTS.FOOTER.NOMTRACK}.{" "}
            {SHARED_TEXTS.FOOTER.ALL_RIGHTS_RESERVED}.
          </p>
        </div>
      </div>
    </footer>
  );
}
