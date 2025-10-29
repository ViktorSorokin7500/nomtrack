"use client";

import { Card } from "@/components/shared";
import { ERROR_PAGES_TEXTS } from "@/components/shared/(texts)/error_pages-texts";
import { AlertTriangle } from "lucide-react";
import Link from "next/link";
import { useEffect } from "react";

interface GlobalErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function GlobalError({ error, reset }: GlobalErrorProps) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <html lang="uk">
      <body>
        <main className="h-screen flex flex-col justify-center items-center bg-orange-50 px-4">
          <div className="w-full max-w-md">
            <Card className="p-8 shadow-xl text-center">
              <AlertTriangle className="size-16 text-red-600 mx-auto" />
              <h1 className="text-3xl font-bold text-gray-800">
                {ERROR_PAGES_TEXTS.GLOBAL_ERROR.TITLE}
              </h1>
              <p className="text-gray-600 my-4">
                {ERROR_PAGES_TEXTS.GLOBAL_ERROR.DESCIPTION}
              </p>
              <div className="flex flex-col gap-2">
                <button
                  onClick={() => reset()}
                  className="w-full px-4 py-2 bg-green-500 text-white font-semibold rounded-md hover:bg-green-600 transition-colors cursor-pointer"
                >
                  {ERROR_PAGES_TEXTS.GLOBAL_ERROR.BUTTON_RETRY}
                </button>

                <Link href="/" passHref>
                  <button className="w-full px-4 py-2 bg-orange-500 text-white font-semibold rounded-md hover:bg-orange-600 transition-colors cursor-pointer">
                    {ERROR_PAGES_TEXTS.GLOBAL_ERROR.BUTTON_RETURN_HOME}
                  </button>
                </Link>
              </div>
              <div className="pt-4 text-xs text-gray-400">
                <p>{ERROR_PAGES_TEXTS.GLOBAL_ERROR.ERROR_DETAILS}</p>
                <code className="block mt-1 truncate">{error.message}</code>
              </div>
            </Card>
          </div>
        </main>
      </body>
    </html>
  );
}
