import { Card } from "@/components/shared";
import { ERROR_PAGES_TEXTS } from "@/components/shared/(texts)/error_pages-texts";
import { Frown } from "lucide-react";
import Link from "next/link";

export default function NotFound() {
  return (
    <main className="h-screen flex flex-col justify-center items-center bg-orange-50 px-4">
      <div className="w-full max-w-md">
        <Card className="p-8 shadow-xl text-center space-y-6">
          <Frown className="size-16 text-orange-500 mx-auto" />
          <h1 className="text-3xl font-bold text-gray-800">
            {ERROR_PAGES_TEXTS.NOT_FOUND.TITLE}
          </h1>
          <p className="text-gray-600 my-2">
            {ERROR_PAGES_TEXTS.NOT_FOUND.DESCRIPTION}
          </p>
          <Link href="/" passHref>
            <button className="w-full px-4 py-2 bg-orange-500 text-white font-semibold rounded-md hover:bg-orange-600 transition-colors cursor-pointer">
              {ERROR_PAGES_TEXTS.NOT_FOUND.BUTTON}
            </button>
          </Link>
        </Card>
      </div>
    </main>
  );
}
