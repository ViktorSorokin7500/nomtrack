"use client";

import Link from "next/link";
import { Card } from "../shared";

export function ProfileSidebar({
  username,
  useremail,
}: {
  username: string;
  useremail: string;
}) {
  const navItems = [
    {
      label: "Особисті дані",
      href: "#personal-info",
      icon: "M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z",
    },
    {
      label: "Історія",
      href: `/archive`,
      icon: "M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z",
    },
    {
      label: "Приватність і безпека",
      href: `/privacy-security`,
      icon: "M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z",
    },
    {
      label: "Допомога та підтримка",
      href: `/help`,
      icon: "M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z",
    },
  ];

  return (
    <Card>
      <div className="flex items-center space-x-4 mb-8">
        <div className="size-14 bg-orange-300 rounded-full flex items-center justify-center text-white text-xl font-medium">
          <div />
        </div>
        <div>
          <h2 className="font-semibold text-lg">{username || "Користувач"}</h2>
          <p className="text-gray-500 text-sm">{useremail}</p>
        </div>
      </div>
      <nav>
        <ul className="space-y-2">
          {navItems.map((item, index) => (
            <li key={index}>
              <Link
                href={item.href}
                className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-colors ${
                  item.label === "Особисті дані"
                    ? "bg-orange-50 bg-opacity-10 text-orange-400"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d={item.icon}
                  />
                </svg>
                <span>{item.label}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </Card>
  );
}
