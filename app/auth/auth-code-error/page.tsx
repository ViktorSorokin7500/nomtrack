import { Card } from "@/components/shared";
import { ERROR_PAGES_TEXTS } from "@/components/shared/(texts)/error_pages-texts";
import { XCircle } from "lucide-react";
import Link from "next/link";

export default function AuthCodeErrorPage() {
  return (
    <div className="w-full">
      <Card className="p-8 shadow-xl text-center space-y-6">
        <XCircle className="size-16 text-red-500 mx-auto" />
        <h1 className="text-2xl font-bold text-gray-800">
          {ERROR_PAGES_TEXTS.AUTH.TITLE}
        </h1>
        <p className="text-gray-600">{ERROR_PAGES_TEXTS.AUTH.DESCRITPTION}</p>
        <Link href="/sign-in" passHref>
          <button className="w-full px-4 py-2 bg-orange-500 text-white font-semibold rounded-md hover:bg-orange-600 transition-colors">
            {ERROR_PAGES_TEXTS.AUTH.BUTTON}
          </button>
        </Link>
      </Card>
    </div>
  );
}
